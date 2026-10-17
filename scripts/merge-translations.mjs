// Merges per-sub-element Spanish translation files (e.g. T1.json, G2.json) into
// src/data/i18n/es/<level>.json, validating them against the official pools.
//
// Usage: node scripts/merge-translations.mjs <folder-with-T1.json-etc>
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = process.argv[2]
if (!dir) throw new Error('Usage: node scripts/merge-translations.mjs <folder>')

const LEVELS = { T: 'technician', G: 'general', E: 'extra' }
const incoming = {}
for (const f of (await readdir(dir)).filter((f) => f.endsWith('.json'))) {
  Object.assign(incoming, JSON.parse((await readFile(join(dir, f), 'utf8')).replace(/^\uFEFF/, '')))
}

for (const [prefix, level] of Object.entries(LEVELS)) {
  const pool = JSON.parse(await readFile(join(ROOT, 'src/data/pools', `${level}.json`), 'utf8'))
  const target = join(ROOT, 'src/data/i18n/es', `${level}.json`)
  const current = JSON.parse(await readFile(target, 'utf8'))
  const out = {}
  const missing = []
  for (const q of pool.questions) {
    const t = incoming[q.id] ?? current[q.id]
    const ok =
      t && typeof t.question === 'string' && t.question.trim() &&
      Array.isArray(t.answers) && t.answers.length === q.answers.length && t.answers.every((a) => String(a).trim())
    if (ok) out[q.id] = { question: t.question.trim(), answers: t.answers.map((a) => String(a).trim()) }
    else missing.push(q.id)
  }
  await writeFile(target, JSON.stringify(out, null, 1) + '\n')
  const extra = Object.keys(incoming).filter((id) => id.startsWith(prefix) && !pool.questions.some((q) => q.id === id))
  console.log(`${level}: ${Object.keys(out).length}/${pool.questions.length}` +
    (missing.length ? ` missing: ${missing.join(',')}` : '') + (extra.length ? ` unknown ids: ${extra.join(',')}` : ''))
}
