// Downloads the official NCVEC question pools (public domain) in structured form
// from https://github.com/russolsen/ham_radio_question_pool (Apache-2.0) and writes
// them to src/data/pools/<level>.json plus figures to public/figures/.
//
// Usage: npm run import-pools
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://raw.githubusercontent.com/russolsen/ham_radio_question_pool/master'

const POOLS = [
  { level: 'technician', dir: 'technician-2026-2030', element: 2, validFrom: '2026-07-01', validTo: '2030-06-30' },
  { level: 'general', dir: 'general-2023-2027', element: 3, validFrom: '2023-07-01', validTo: '2027-06-30' },
  { level: 'extra', dir: 'extra-2024-2028', element: 4, validFrom: '2024-07-01', validTo: '2028-06-30' },
]

async function fetchOk(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`)
  return res
}

const outDir = join(ROOT, 'src', 'data', 'pools')
const figDir = join(ROOT, 'public', 'figures')
await mkdir(outDir, { recursive: true })
await mkdir(figDir, { recursive: true })

for (const pool of POOLS) {
  const raw = await (await fetchOk(`${BASE}/${pool.dir}/${pool.dir}.json`)).json()
  const questions = raw.map((q) => {
    if (!Array.isArray(q.answers) || q.answers.length !== 4) throw new Error(`Bad answers in ${q.id}`)
    if (q.correct < 0 || q.correct > 3) throw new Error(`Bad correct index in ${q.id}`)
    return {
      id: q.id,
      question: q.question,
      answers: q.answers,
      correct: q.correct,
      refs: q.refs || '',
      figure: q.figure || '',
    }
  })

  const figures = [...new Set(questions.map((q) => q.figure).filter(Boolean))]
  for (const fig of figures) {
    const buf = Buffer.from(await (await fetchOk(`${BASE}/${pool.dir}/${fig}`)).arrayBuffer())
    await writeFile(join(figDir, fig), buf)
  }

  const data = {
    level: pool.level,
    element: pool.element,
    name: pool.dir,
    validFrom: pool.validFrom,
    validTo: pool.validTo,
    source: `${BASE}/${pool.dir}/${pool.dir}.json`,
    questions,
  }
  await writeFile(join(outDir, `${pool.level}.json`), JSON.stringify(data, null, 1) + '\n')
  console.log(`${pool.level}: ${questions.length} questions, ${figures.length} figures`)
}
