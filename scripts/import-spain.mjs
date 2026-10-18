import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateSpainFigures } from './spain-figures.mjs'
import { generateRemainingSpainFigures } from './spain-remaining-figures.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const input = process.argv[2]
if (!input) throw new Error('Uso: npm run import-spain -- "C:\\ruta\\preguntas.json"')
const rows = JSON.parse(await readFile(resolve(input), 'utf8'))
if (!Array.isArray(rows)) throw new Error('Se esperaba una lista FEDI-EA.')
const figures = await generateSpainFigures(resolve(root, 'public', 'figures', 'spain'))
const remaining = await generateRemainingSpainFigures(resolve(root, 'public', 'figures', 'spain'))
for (const [key, value] of remaining.figures) {
  if (figures.has(key)) throw new Error(`Ilustración definida dos veces: ${key}`)
  figures.set(key, value)
}
const normalize = (s) => s.normalize('NFC').toLocaleLowerCase('es').trim().replace(/\s+/g, ' ')
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i)

// Los cuatro bloques antiguos mezclan materias: no se clasifican por la letra del bloque.
const regulations = {
  a: new Set([...range(17, 28), 32, 34, ...range(65, 69), 71, 74, 75, 76, 84, ...range(109, 121)]),
  b: new Set([...range(177, 182), 186, 190, 191, 192, 194, 228, ...range(230, 235),
    238, 239, 242, 243, 245, 247, 280, 281, 282, 285, 286, ...range(288, 292)]),
  c: new Set([331, 332, 333, ...range(368, 385), 387]),
  d: new Set([...range(420, 433), 437, 439, ...range(471, 481), ...range(516, 531), ...range(563, 578)]),
}
function partFor(row) {
  if (row.tema.startsWith('Prueba 1ª:')) return 'technical'
  if (row.tema.startsWith('Prueba 2ª:')) return 'regulations'
  const match = /^fedi-([abcd])-(\d{3})$/.exec(row.id)
  if (!match || !row.tema.startsWith(`Bloque ${match[1].toUpperCase()},`)) {
    throw new Error(`Clasificación desconocida: ${row.id} / ${row.tema}`)
  }
  return regulations[match[1]].has(Number(match[2])) ? 'regulations' : 'technical'
}

const ids = new Set()
const candidates = []
const excluded = []
const formulaTranscriptions = []
for (const row of rows) {
  if (!row || typeof row !== 'object' || typeof row.id !== 'string' || ids.has(row.id)) {
    throw new Error('Registro o identificador FEDI-EA inválido/repetido.')
  }
  ids.add(row.id)
  if (typeof row.tema !== 'string' || typeof row.enunciado !== 'string' ||
    !row.enunciado.trim() || !Array.isArray(row.opciones) || row.opciones.length !== 4 ||
    !/^[ABCD]$/.test(row.correcta) || typeof row.url_origen !== 'string' ||
    !row.url_origen.startsWith('https://www.fediea.org/examen/ejercicios/test.php?')) {
    throw new Error(`Formato FEDI-EA desconocido: ${row.id}`)
  }
  const part = partFor(row)
  const transcribed = remaining.answerText.get(row.id)
  if (transcribed && (transcribed.length !== 4 || transcribed.some((s) => typeof s !== 'string' || !s.trim()))) {
    throw new Error(`Transcripción de fórmulas inválida: ${row.id}`)
  }
  const answers = transcribed ?? row.opciones
  let reason
  if (answers.some((s) => typeof s !== 'string' || !s.trim())) {
    reason = 'Opción de respuesta vacía en el archivo suministrado.'
  } else if (new Set(answers.map(normalize)).size !== 4) {
    reason = 'Opciones de respuesta repetidas en el archivo suministrado.'
  } else if (!transcribed && row.imagenes_opciones?.some((image) => image && !figures.has(image))) {
    reason = 'Opciones gráficas pendientes de transcripción y redibujo verificados; no se adivinan las alternativas.'
  } else if (row.imagen && !figures.has(row.imagen)) {
    reason = 'Figura pendiente de revisión y redibujo verificados; no se inventa su topología ni sus valores.'
  }
  if (reason) {
    excluded.push({ id: row.id, reason, original: row })
    continue
  }
  const figure = row.imagen ? figures.get(row.imagen) : undefined
  const answerFigures = !transcribed && row.imagenes_opciones?.some(Boolean)
    ? row.imagenes_opciones.map((image) => {
      if (!image) return null
      const asset = figures.get(image)
      if (!asset) throw new Error(`No se generó la alternativa ${image}`)
      return { figure: asset.path, figureAlt: asset.alt }
    }) : undefined
  if (transcribed) formulaTranscriptions.push({ id: row.id, sourceImages: row.imagenes_opciones, answers })
  candidates.push({
    id: row.id, part, topic: row.tema, question: row.enunciado,
    answers, correct: row.correcta.charCodeAt(0) - 65,
    source: `FEDI-EA · ${row.tema} · ${row.url_origen}`, historical: true,
    ...(figure ? { figure: figure.path, figureAlt: figure.alt } : {}),
    ...(answerFigures ? { answerFigures } : {}),
  })
}

const context = (q) => JSON.stringify([q.part, normalize(q.question), q.figure ?? ''])
const answerIdentity = (q, i) => JSON.stringify([normalize(q.answers[i]), q.answerFigures?.[i]?.figure ?? ''])
const variant = (q) => JSON.stringify([context(q), q.answers.map((_, i) => answerIdentity(q, i)).sort()])
const answerKeys = new Map()
for (const q of candidates) {
  const key = variant(q)
  const answers = answerKeys.get(key) ?? new Set()
  answers.add(answerIdentity(q, q.correct))
  answerKeys.set(key, answers)
}
const questions = []
const seen = new Map()
const duplicates = []
for (const q of candidates) {
  if (answerKeys.get(variant(q)).size > 1) {
    excluded.push({ id: q.id, reason: 'Mismo enunciado y mismas alternativas con claves correctas diferentes.',
      original: rows.find((row) => row.id === q.id) })
    continue
  }
  const key = JSON.stringify([context(q), answerIdentity(q, q.correct)])
  const retained = seen.get(key)
  if (retained) {
    duplicates.push({ id: q.id, retainedId: retained.id, source: q.source })
    continue
  }
  seen.set(key, q)
  questions.push(q)
}

const sourceImages = new Set(rows.flatMap((row) => [
  ...(row.imagen ? [row.imagen] : []), ...(row.imagenes_opciones ?? []).filter(Boolean),
]))
const report = {
  source: 'Archivo FEDI-EA aportado por el usuario; convocatorias 2007–2011 y bloques históricos sin fecha.',
  warning: 'Claves históricas sin certificación de vigencia. No es un banco oficial actual ni asesoramiento normativo.',
  inputCount: rows.length,
  importedCount: questions.length,
  duplicateCount: duplicates.length,
  excludedCount: excluded.length,
  parts: Object.fromEntries(['technical', 'regulations'].map((p) => [p, questions.filter((q) => q.part === p).length])),
  originalFigures: new Set(questions.flatMap((q) => [
    ...(q.figure ? [q.figure] : []),
    ...(q.answerFigures ?? []).flatMap((image) => image ? [image.figure] : []),
  ])).size,
  figureSources: [
    ...[...figures].map(([sourceImage, asset]) => ({ sourceImage, figure: asset.path })),
    ...formulaTranscriptions.flatMap((item) => item.sourceImages.filter(Boolean).map((sourceImage) =>
      ({ sourceImage, transcriptionId: item.id }))),
  ].filter((item) => sourceImages.has(item.sourceImage)).sort((a, b) => a.sourceImage.localeCompare(b.sourceImage)),
  formulaTranscriptions,
  duplicates,
  excluded,
}
if (report.inputCount !== report.importedCount + report.duplicateCount + report.excludedCount) {
  throw new Error('El recuento de importación no cuadra.')
}
await writeFile(resolve(root, 'src', 'data', 'spain.json'), `${JSON.stringify(questions, null, 2)}\n`, 'utf8')
await writeFile(resolve(root, 'src', 'data', 'spain-import-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(JSON.stringify({ ...report, figureSources: undefined, duplicates: undefined,
  excluded: excluded.map(({ id, reason }) => ({ id, reason })) }, null, 2))
