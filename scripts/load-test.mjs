import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { performance } from 'node:perf_hooks'
import { cpus, platform, totalmem } from 'node:os'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const options = new Map()
for (let i = 0; i < args.length; i++) {
  const key = args[i]
  if (!['--base-url', '--concurrency', '--sessions', '--timeout-ms', '--max-p95-ms', '--output', '--allow-remote'].includes(key) ||
      options.has(key)) throw new Error(`Unknown or repeated option: ${key}`)
  if (key === '--allow-remote') options.set(key, true)
  else {
    if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Missing value: ${key}`)
    options.set(key, args[++i])
  }
}
const integer = (value, name, max) => {
  const n = Number(value)
  if (!Number.isSafeInteger(n) || n < 1 || n > max) throw new Error(`Invalid ${name}: ${value}`)
  return n
}
const base = new URL(options.get('--base-url') ?? 'http://127.0.0.1:4183/')
if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash ||
    !base.pathname.endsWith('/')) throw new Error('Base URL must be HTTP(S), end in / and have no credentials, query or hash.')
if (!['localhost', '127.0.0.1', '[::1]'].includes(base.hostname) && !options.has('--allow-remote')) {
  throw new Error('Remote load tests require --allow-remote and prior authorization from the target owner.')
}
const concurrency = (options.get('--concurrency') ?? '1,5,20').split(',').map((n) => integer(n, 'concurrency', 100))
const sessions = integer(options.get('--sessions') ?? 30, 'sessions per stage', 10000)
const timeoutMs = integer(options.get('--timeout-ms') ?? 10000, 'timeout-ms', 120000)
const maxP95Ms = integer(options.get('--max-p95-ms') ?? 2000, 'max-p95-ms', 120000)
const output = resolve(root, options.get('--output') ?? 'artifacts/load/results.json')
const dist = join(root, 'dist')
const assets = (await readdir(join(dist, 'assets'))).filter((f) => /\.(js|css)$/.test(f)).sort().map((f) => `assets/${f}`)
if (!assets.some((f) => f.endsWith('.js')) || !assets.some((f) => f.endsWith('.css'))) {
  throw new Error('Build the web app before running the load simulation.')
}
const bank = JSON.parse(await readFile(join(root, 'src', 'data', 'spain.json'), 'utf8'))
const figures = [...new Set(bank.flatMap((q) => q.figure ? [q.figure] : []))].slice(0, 2)
if (figures.length !== 2) throw new Error('Two representative Spain figures are required.')
const paths = ['index.html', ...assets, ...figures]
const expected = new Map(await Promise.all(paths.map(async (path) => {
  const bytes = await readFile(join(dist, ...path.split('/')))
  return [path, { bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') }]
})))
const percentile = (values, p) => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted.length ? Number(sorted[Math.ceil(sorted.length * p) - 1].toFixed(3)) : null
}
const stages = []
for (const profile of ['cold-visit', 'figure-navigation']) {
  const workload = profile === 'cold-visit' ? paths : figures
  for (const workers of concurrency) {
    const started = performance.now()
    const requests = [], visits = [], failures = []
    let next = 0, bytes = 0
    await Promise.all(Array.from({ length: Math.min(workers, sessions) }, async () => {
      while (next < sessions) {
        const session = next++
        const visitStarted = performance.now()
        for (const path of workload) {
          const requestStarted = performance.now()
          try {
            const response = await fetch(new URL(path, base), {
              redirect: 'error', signal: AbortSignal.timeout(timeoutMs), headers: { 'Cache-Control': 'no-cache' },
            })
            if (response.status !== 200) {
              await response.body?.cancel()
              throw new Error(`HTTP ${response.status}`)
            }
            const data = new Uint8Array(await response.arrayBuffer())
            const hash = createHash('sha256').update(data).digest('hex')
            if (hash !== expected.get(path).sha256) throw new Error('Response differs from the local build (or HTML fallback)')
            bytes += data.length
          } catch (error) {
            failures.push({ session, path, error: error instanceof Error ? error.message : String(error) })
          } finally { requests.push(performance.now() - requestStarted) }
        }
        visits.push(performance.now() - visitStarted)
      }
    }))
    const seconds = (performance.now() - started) / 1000
    const p95 = percentile(requests, 0.95)
    stages.push({
      profile, concurrency: workers, sessions, requests: requests.length, failures: failures.length,
      failureDetails: failures, seconds: Number(seconds.toFixed(3)),
      requestsPerSecond: Number((requests.length / seconds).toFixed(2)), uncompressedBytes: bytes,
      requestMs: { p50: percentile(requests, 0.5), p95, p99: percentile(requests, 0.99), max: Number(Math.max(...requests).toFixed(3)) },
      sessionMs: { p50: percentile(visits, 0.5), p95: percentile(visits, 0.95) },
      passed: failures.length === 0 && p95 <= maxP95Ms,
    })
    console.log(`${profile}: concurrency=${workers}, requests=${requests.length}, failures=${failures.length}, p95=${p95} ms`)
  }
}
const result = {
  generatedAt: new Date().toISOString(),
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  workingTreeDirty: Boolean(execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim()),
  generatorSha256: createHash('sha256').update(await readFile(fileURLToPath(import.meta.url))).digest('hex'),
  baseUrl: base.href,
  environment: { node: process.version, os: platform(), logicalCpus: cpus().length, memoryGiB: Number((totalmem() / 1024 ** 3).toFixed(2)) },
  scope: 'Closed-loop HTTP simulation against an existing static build; no browser rendering, JS execution, localStorage, user think time, TLS/WAN or production capacity certification.',
  thresholds: { maxErrors: 0, maxRequestP95Ms: maxP95Ms, timeoutMs },
  assets: Object.fromEntries(expected),
  stages,
  passed: stages.every((stage) => stage.passed),
}
await mkdir(dirname(output), { recursive: true })
await writeFile(output, `${JSON.stringify(result, null, 2)}\n`)
console.log(`Report: ${output}`)
if (!result.passed) process.exitCode = 1
