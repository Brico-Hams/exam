// Imports the Spanish question pools published by GLAARG PR VE Team
// (https://www.glaargpr.com/?page_id=229) and writes them as a Spanish overlay to
// src/data/i18n/es-glaarg/<level>.json. Translations are © GLAARG PR; they are downloaded
// locally for personal study and are not committed to the repository (see .gitignore).
//
// - General 2023-2027 and Extra 2024-2028 match the current official pools.
// - The GLAARG Technician translation is for the 2022-2026 pool; it is only applied to
//   2026-2030 questions whose English text is identical to a 2022-2026 question.
// - Every entry is validated against the official pool (same correct letter, 4 answers).
//
// Usage: npm run import-glaarg
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const RUSSOLSEN = 'https://raw.githubusercontent.com/russolsen/ham_radio_question_pool/master'

const SOURCES = [
  {
    level: 'technician',
    pdf: 'https://www.glaargpr.com/wp-content/uploads/2024/09/Elemento-2-2022-2026.pdf',
    // English pool that the GLAARG translation corresponds to
    englishOf: `${RUSSOLSEN}/outdated/technician-2022-2026/technician.json`,
  },
  { level: 'general', pdf: 'https://www.glaargpr.com/wp-content/uploads/2024/09/Elemento-3_es_FUNDACION.pdf' },
  { level: 'extra', pdf: 'https://www.glaargpr.com/wp-content/uploads/2024/09/EXTRA-2024-2028-ES.pdf' },
]

// pdf.js loses the "ti"/"fi"/"ft" ligatures in some PDFs (rendered as U+FFFD). Almost all are "ti".
const LIGATURE_WORDS = {
  '\uFFFDsica': 'física', '\uFFFDsicas': 'físicas', '\uFFFDsico': 'físico', '\uFFFDsicos': 'físicos',
  'dí\uFFFDcil': 'difícil', 'desa\uFFFDo': 'desafío', 'telegra\uFFFDa': 'telegrafía', 'so\uFFFDware': 'software',
}
function fixLigatures(text) {
  return text
    .replace(/[\p{L}\uFFFD]*\uFFFD[\p{L}\uFFFD]*/gu, (w) => {
      const lower = w.charAt(0).toLowerCase() + w.slice(1)
      const fixed = LIGATURE_WORDS[w] ?? LIGATURE_WORDS[lower]
      if (fixed) return w === lower ? fixed : fixed.charAt(0).toUpperCase() + fixed.slice(1)
      return w.replace(/\uFFFD/g, 'ti')
    })
}

async function fetchOk(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`)
  return res
}

async function pdfToText(buf) {
  const pdf = await getDocument({ data: new Uint8Array(buf), verbosity: 0 }).promise
  let out = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const content = await (await pdf.getPage(i)).getTextContent()
    let lastY = null
    for (const item of content.items) {
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 2) out += '\n'
      out += item.str
      lastY = item.transform[5]
      if (item.hasEOL) {
        out += '\n'
        lastY = null
      }
    }
    out += '\n\n'
  }
  return out
}

const clean = (s) => s.replace(/\s+/g, ' ').trim()

/** Parses "T1A01 (C) [97.1]\n question \n A. ...\n B. ...\n C. ...\n D. ..." blocks separated by "~~". */
function parseBlocks(text) {
  const result = {}
  for (const block of text.split(/~~+/)) {
    const head = block.match(/([TGE]\d[A-Z]\d{2})\s*\(([A-D])\)[^\n]*\n/)
    if (!head) continue
    const body = block.slice(head.index + head[0].length)
    const marks = [...body.matchAll(/^\s*([A-D])\s*[.:)]\s/gm)]
    const order = marks.map((m) => m[1]).join('')
    const start = order.indexOf('ABCD')
    if (start < 0) continue
    const [a, b, c, d] = marks.slice(start, start + 4)
    const answers = [
      body.slice(a.index + a[0].length, b.index),
      body.slice(b.index + b[0].length, c.index),
      body.slice(c.index + c[0].length, d.index),
      // last answer ends at the first blank line (avoids trailing section headers / page footers)
      body.slice(d.index + d[0].length).split(/\n\s*\n/)[0],
    ].map(clean)
    const question = clean(body.slice(0, a.index))
    if (!question || answers.some((x) => !x)) continue
    result[head[1]] = { correct: head[2].charCodeAt(0) - 65, question, answers }
  }
  return result
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const key = (q) => norm([q.question, ...q.answers].join(' | '))

const outDir = join(ROOT, 'src', 'data', 'i18n', 'es-glaarg')
await mkdir(outDir, { recursive: true })

for (const src of SOURCES) {
  const pool = JSON.parse(await readFile(join(ROOT, 'src', 'data', 'pools', `${src.level}.json`), 'utf8'))
  const text = fixLigatures(await pdfToText(await (await fetchOk(src.pdf)).arrayBuffer()))
  const parsed = parseBlocks(text)

  // Map current-pool ids to the ids used in the GLAARG document
  let idMap = (id) => id
  if (src.englishOf) {
    const old = await (await fetchOk(src.englishOf)).json()
    const byKey = new Map(old.map((q) => [key(q), q]))
    idMap = (id, q) => {
      const match = byKey.get(key(q))
      return match && match.correct === q.correct ? match.id : null
    }
  }

  const overlay = {}
  let mismatched = 0
  for (const q of pool.questions) {
    const srcId = idMap(q.id, q)
    const t = srcId && parsed[srcId]
    if (!t) continue
    if (t.correct !== q.correct) {
      mismatched++
      continue
    }
    overlay[q.id] = { question: t.question, answers: t.answers }
  }
  await writeFile(join(outDir, `${src.level}.json`), JSON.stringify(overlay, null, 1) + '\n')
  console.log(
    `${src.level}: parsed ${Object.keys(parsed).length}, applied ${Object.keys(overlay).length}/${pool.questions.length}` +
      (mismatched ? `, skipped ${mismatched} (answer key mismatch)` : ''),
  )
}
