import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { applySpainReview, pendingReason, reviewDate, reviewedIds, reviewedSourceSha256 } from './spain-review.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const directory = process.argv[2]
if (!directory) throw new Error('Uso: npm run import-bricohams -- "C:\\ruta\\BricoHams_banco_preguntas"')
const base = resolve(directory)
const sourceBytes = await readFile(join(base, 'preguntas_bricohams.json'))
const sourceSha256 = createHash('sha256').update(sourceBytes).digest('hex')
if (sourceSha256 !== reviewedSourceSha256) {
  throw new Error('El banco no coincide con el archivo contrastado. Revisar las decisiones y su huella antes de aplicar correcciones a otra versión.')
}
const bank = JSON.parse(sourceBytes.toString('utf8'))
if (!bank.meta || !Array.isArray(bank.preguntas) || !Array.isArray(bank.bloques)) {
  throw new Error('Formato BricoHams incorrecto.')
}
if (bank.meta.licencia !== 'CC BY-SA 4.0 · BricoHams') throw new Error('Revisar la licencia del nuevo banco antes de distribuirlo.')
const parts = { electricidad: 'technical', reglamentacion: 'regulations' }
const normalize = (s) => s.normalize('NFC').toLocaleLowerCase('es').trim().replace(/\s+/g, ' ')
const required = (s, field) => {
  if (typeof s !== 'string' || !s.trim()) throw new Error(`Falta ${field}.`)
  return s
}
const figures = new Map()
async function figureFor(source, alt) {
  if (typeof source !== 'string' || !/^ilustraciones\/(?:[a-z0-9-]+\/)?[a-zA-Z0-9_-]+\.svg$/.test(source)) {
    throw new Error(`Ruta de ilustración no permitida: ${source}`)
  }
  const filename = `bh-${source.slice('ilustraciones/'.length).replaceAll('/', '-')}`
  const destination = `figures/spain/${filename}`
  const svg = await readFile(join(base, ...source.split('/')), 'utf8')
  if (!/<svg\b/.test(svg) || /<script\b|<foreignObject\b|<image\b|<!ENTITY\b|\bon\w+\s*=|(?:href|src)\s*=\s*["'](?!#)|url\(\s*["']?(?!#)/i.test(svg)) {
    throw new Error(`El SVG debe ser estático, sin recursos externos: ${source}`)
  }
  const existing = figures.get(destination)
  if (existing && existing.source !== source) throw new Error(`Colisión de nombres: ${source}`)
  figures.set(destination, { source, svg, filename })
  return { figure: destination, figureAlt: alt }
}
const questions = []
const seen = new Map(), variants = new Map(), ids = new Set()
const duplicates = []
const validations = []
const pending = []
for (const row of bank.preguntas) {
  required(row.id, 'id')
  if (ids.has(row.id)) throw new Error(`Identificador repetido: ${row.id}`)
  ids.add(row.id)
  const part = parts[row.bloque]
  if (!part) throw new Error(`Bloque incorrecto: ${row.id}`)
  if (!Array.isArray(row.opciones) || row.opciones.length !== 4 ||
    row.opciones.some((s) => typeof s !== 'string' || !s.trim()) ||
    new Set(row.opciones.map(normalize)).size !== 4 ||
    row.opciones.filter((s) => s === row.respuesta).length !== 1) {
    throw new Error(`Opciones o clave incorrectas: ${row.id}`)
  }
  if (row.opciones_fijas !== undefined && row.opciones_fijas !== true) throw new Error(`Orden de opciones desconocido: ${row.id}`)
  let answerFigures
  if (row.imagenes_opciones !== undefined) {
    if (!Array.isArray(row.imagenes_opciones) || row.imagenes_opciones.length !== 4) throw new Error(`Figuras incorrectas: ${row.id}`)
    answerFigures = await Promise.all(row.imagenes_opciones.map((image, i) => image === null ? null :
      figureFor(image, `Esquema de la opción ${'ABCD'[i]} de ${row.id}.`)))
  }
  row.opciones.forEach((answer, i) => {
    if (/\[imagen [ABCD]\]/i.test(answer) && !answerFigures?.[i]) throw new Error(`Falta ilustración de alternativa: ${row.id}`)
  })
  const q = {
    id: row.id, part, topic: required(row.tema, 'tema'),
    question: required(row.enunciado, 'enunciado'),
    answers: row.opciones, correct: row.opciones.indexOf(row.respuesta),
    source: `BricoHams · CC BY-SA 4.0 · banco ${required(bank.meta.version, 'versión')}`,
    explanation: { es: required(row.explicacion, 'explicación') },
    ...(row.imagen ? await figureFor(row.imagen, `Ilustración del enunciado de ${row.id}: ${row.enunciado}`) : {}),
    ...(answerFigures ? { answerFigures } : {}),
    ...(row.opciones_fijas ? { answersFixed: true } : {}),
    ...(row.revisar !== undefined ? { reviewReason: required(row.revisar, 'revisar') } : {}),
    ...(row.nota !== undefined ? { note: required(row.nota, 'nota') } : {}),
  }
  const validation = applySpainReview(q)
  if (validation) validations.push(validation)
  else if (q.reviewReason) {
    q.reviewReason = pendingReason(q)
    pending.push({ id: q.id, reason: q.reviewReason })
  }
  const stem = JSON.stringify([part, normalize(q.question), q.figure ?? ''])
  const identity = (i) => JSON.stringify([normalize(q.answers[i]), q.answerFigures?.[i]?.figure ?? ''])
  const variant = JSON.stringify([stem, q.answers.map((_, i) => identity(i)).sort()])
  if (variants.has(variant) && variants.get(variant) !== identity(q.correct)) throw new Error(`Claves contradictorias: ${q.id}`)
  variants.set(variant, identity(q.correct))
  const key = JSON.stringify([stem, identity(q.correct)])
  const retained = seen.get(key)
  if (retained) {
    if (q.reviewReason && !retained.reviewReason) {
      retained.reviewReason = q.reviewReason
      delete retained.validation
    }
    duplicates.push({ id: q.id, retainedId: retained.id, original: row })
  } else {
    seen.set(key, q)
    questions.push(q)
  }
}
if (reviewedIds.some((id) => !validations.some((item) => item.id === id))) {
  throw new Error('Hay decisiones de revisión sin pregunta de origen.')
}
const report = {
  title: bank.meta.titulo, source: bank.meta.fuente, version: bank.meta.version,
  license: bank.meta.licencia, licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  changes: 'Conversión, deduplicación y correcciones documentadas de enunciados, alternativas, claves y explicaciones. Revisión selectiva con referencias, conservando originales en el informe. SVG y notas suministrados sin alteraciones.',
  inputCount: bank.preguntas.length, importedCount: questions.length,
  duplicateCount: duplicates.length, figureCount: figures.size,
  reviewCount: questions.filter((q) => q.reviewReason).length,
  validation: {
    date: reviewDate, sourceSha256,
    originallyFlagged: validations.filter((item) => item.previouslyFlagged).length + pending.length,
    cleared: validations.filter((item) => item.previouslyFlagged).length,
    validated: validations.length,
    corrected: validations.filter((item) => item.corrected).length,
    answerCorrections: validations.filter((item) => item.answerChanged).length,
    decisions: validations,
    pending,
  },
  parts: Object.fromEntries(Object.values(parts).map((part) => [part, {
    total: questions.filter((q) => q.part === part).length,
    examEligible: questions.filter((q) => q.part === part && !q.reviewReason).length,
  }])),
  duplicates,
  figures: [...figures].map(([figure, { source }]) => ({ source, figure }))
    .sort((a, b) => a.figure < b.figure ? -1 : a.figure > b.figure ? 1 : 0),
}
await mkdir(join(root, 'public', 'figures', 'spain'), { recursive: true })
for (const { svg, filename } of figures.values()) {
  await writeFile(join(root, 'public', 'figures', 'spain', filename), svg, 'utf8')
}
await writeFile(join(root, 'src', 'data', 'spain.json'), `${JSON.stringify(questions, null, 2)}\n`, 'utf8')
await writeFile(join(root, 'src', 'data', 'spain-import-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(JSON.stringify({ ...report, validation: { ...report.validation, decisions: undefined, pending: undefined }, figures: undefined, duplicates }, null, 2))
