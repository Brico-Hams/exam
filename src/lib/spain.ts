import { shuffle, type Rng } from './exam'

export type SpainPart = 'technical' | 'regulations'
export type SpainMode = 'practice' | 'flashcards' | 'exam'
export interface SpainFigure { figure: string; figureAlt: string }
export interface SpainValidation {
  date: string
  sources: { label: string; url: string }[]
  rationale: string
  corrected: boolean
}

export interface SpainQuestion {
  id: string
  part: SpainPart
  topic: string
  question: string
  answers: string[]
  correct: number
  source: string
  figure?: string
  figureAlt?: string
  answerFigures?: (SpainFigure | null)[]
  answersFixed?: boolean
  explanation?: { es: string; en?: string }
  reviewReason?: string
  note?: string
  validation?: SpainValidation
}

export const SPAIN_RULES = { questions: 30, passing: 15, seconds: 45 * 60 }
export const SPAIN_STORAGE_KEY = 'hamprep.spain.questions.v1'
export const SPAIN_PARTS: SpainPart[] = ['technical', 'regulations']

const normalized = (text: string) => text.normalize('NFC').toLocaleLowerCase('es')
  .trim().replace(/\s+/g, ' ')

const answerIdentity = (q: SpainQuestion, i: number) =>
  JSON.stringify([normalized(q.answers[i]), q.answerFigures?.[i]?.figure ?? ''])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseSpainQuestions(input: unknown): { questions: SpainQuestion[]; duplicates: number } {
  if (!Array.isArray(input)) throw new Error('El banco debe ser una lista JSON de preguntas.')
  const questions: SpainQuestion[] = []
  const seen = new Map<string, SpainQuestion>()
  const ids = new Set<string>()
  const correctByQuestion = new Map<string, string>()
  let duplicates = 0
  for (const [index, row] of input.entries()) {
    const error = (message: string): never => { throw new Error(`Pregunta ${index + 1}: ${message}`) }
    if (!isRecord(row)) throw new Error(`Pregunta ${index + 1}: formato incorrecto.`)
    const text = (value: unknown, field: string): string => {
      if (typeof value !== 'string' || !value.trim()) return error(`falta ${field}.`)
      return value
    }
    const { part, correct } = row
    if (row.answersFixed !== undefined && typeof row.answersFixed !== 'boolean') error('answersFixed debe ser booleano.')
    if (part !== 'technical' && part !== 'regulations') throw new Error(`Pregunta ${index + 1}: parte incorrecta.`)
    if (!Array.isArray(row.answers) || row.answers.length !== 4) {
      throw new Error(`Pregunta ${index + 1}: se necesitan cuatro respuestas.`)
    }
    const answers = row.answers.map((answer: unknown) => text(answer, 'respuesta'))
    if (typeof correct !== 'number' || !Number.isInteger(correct) ||
      correct < 0 || correct > 3) throw new Error(`Pregunta ${index + 1}: correct debe ser un índice de 0 a 3.`)
    const parseFigure = (value: Record<string, unknown>): SpainFigure => {
      if (typeof value.figure !== 'string' ||
        !/^figures\/spain\/[a-zA-Z0-9_-]+\.(svg|png|webp)$/.test(value.figure)) {
        error('figure debe apuntar a una ilustración local en figures/spain/.')
      }
      return { figure: text(value.figure, 'figure'), figureAlt: text(value.figureAlt, 'figureAlt') }
    }
    let answerFigures: SpainQuestion['answerFigures']
    if (row.answerFigures !== undefined) {
      const values = row.answerFigures
      if (!Array.isArray(values) || values.length !== 4) return error('answerFigures necesita cuatro posiciones.')
      answerFigures = values.map((value: unknown) => {
        if (value === null) return null
        if (!isRecord(value)) return error('ilustración de respuesta incorrecta.')
        return parseFigure(value)
      })
    }
    let explanation: SpainQuestion['explanation']
    if (row.explanation !== undefined) {
      if (!isRecord(row.explanation)) throw new Error(`Pregunta ${index + 1}: explanation debe contener es y en.`)
      explanation = {
        es: text(row.explanation.es, 'explanation.es'),
        ...(row.explanation.en !== undefined ? { en: text(row.explanation.en, 'explanation.en') } : {}),
      }
    }
    let validation: SpainValidation | undefined
    if (row.validation !== undefined) {
      const value = row.validation
      if (!isRecord(value)) return error('validation debe ser un objeto.')
      const date = text(value.date, 'validation.date')
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) ||
        new Date(date).toISOString().slice(0, 10) !== date) return error('fecha de validación incorrecta.')
      if (typeof value.corrected !== 'boolean') return error('validation.corrected debe ser booleano.')
      if (!Array.isArray(value.sources) || value.sources.length === 0) return error('faltan referencias de validación.')
      const sources = value.sources.map((source: unknown) => {
        if (!isRecord(source)) return error('referencia de validación incorrecta.')
        const url = text(source.url, 'validation.sources.url')
        if (!URL.canParse(url) || new URL(url).protocol !== 'https:') return error('la referencia debe ser una URL HTTPS.')
        return { label: text(source.label, 'validation.sources.label'), url }
      })
      if (row.reviewReason !== undefined) return error('una pregunta pendiente no puede declararse validada.')
      validation = { date, sources, rationale: text(value.rationale, 'validation.rationale'), corrected: value.corrected }
    }
    const q: SpainQuestion = {
      id: text(row.id, 'id'), part, topic: text(row.topic, 'topic'),
      question: text(row.question, 'question'), answers, correct,
      source: text(row.source, 'source'),
      ...(explanation ? { explanation } : {}),
      ...(answerFigures ? { answerFigures } : {}),
      ...(typeof row.answersFixed === 'boolean' ? { answersFixed: row.answersFixed } : {}),
      ...(row.figure !== undefined ? parseFigure(row) : {}),
      ...(row.reviewReason !== undefined ? { reviewReason: text(row.reviewReason, 'reviewReason') } : {}),
      ...(row.note !== undefined ? { note: text(row.note, 'note') } : {}),
      ...(validation ? { validation } : {}),
    }
    if (new Set(q.answers.map((_, i) => answerIdentity(q, i))).size !== 4) error('las cuatro opciones deben ser distintas.')
    const stem = JSON.stringify([q.part, normalized(q.question), q.figure ?? ''])
    const answer = answerIdentity(q, q.correct)
    const variant = JSON.stringify([stem, q.answers.map((_, i) => answerIdentity(q, i)).sort()])
    const previous = correctByQuestion.get(variant)
    if (previous !== undefined && previous !== answer) error('respuesta correcta contradictoria para el mismo enunciado.')
    correctByQuestion.set(variant, answer)
    const key = JSON.stringify([stem, answer])
    const retained = seen.get(key)
    if (retained) {
      // Una duplicada nunca debe borrar una advertencia de revisión.
      if (q.reviewReason && !retained.reviewReason) {
        retained.reviewReason = q.reviewReason
        delete retained.validation
      }
      duplicates++
      continue
    }
    if (ids.has(q.id)) error(`identificador repetido: ${q.id}.`)
    ids.add(q.id)
    seen.set(key, q)
    questions.push(q)
  }
  return { questions, duplicates }
}

export function mergeSpainQuestions(bundled: unknown, saved: unknown): SpainQuestion[] {
  const current = parseSpainQuestions(bundled).questions
  const ids = new Set(current.map((q) => q.id))
  if (!Array.isArray(saved)) throw new Error('El banco guardado debe ser una lista JSON de preguntas.')
  // El ID del paquete identifica su revisión vigente, no una copia local antigua.
  const additions = saved.filter((row: unknown) => !isRecord(row) || typeof row.id !== 'string' || !ids.has(row.id))
  return parseSpainQuestions([
    ...current,
    ...parseSpainQuestions(additions).questions,
  ]).questions
}

export function shuffleSpainAnswers(q: SpainQuestion, rng?: Rng): SpainQuestion {
  if (q.answersFixed || q.answerFigures?.some(Boolean)) return q
  const order = shuffle([0, 1, 2, 3], rng)
  return {
    ...q, answers: order.map((i) => q.answers[i]), correct: order.indexOf(q.correct),
    ...(q.answerFigures ? { answerFigures: order.map((i) => q.answerFigures?.[i] ?? null) } : {}),
  }
}

export function generateSpainExam(questions: SpainQuestion[], part: SpainPart, rng?: Rng): SpainQuestion[] {
  const pool = questions.filter((q) => q.part === part && !q.reviewReason)
  if (pool.length < SPAIN_RULES.questions) {
    throw new Error('Se necesitan al menos 30 preguntas distintas sin revisión pendiente en esta parte.')
  }
  return shuffle(pool, rng).slice(0, SPAIN_RULES.questions).map((q) => shuffleSpainAnswers(q, rng))
}

export function scoreSpainExam(questions: SpainQuestion[], answers: Record<string, number>) {
  if (questions.length !== SPAIN_RULES.questions) throw new Error('La prueba requiere 30 preguntas.')
  const correct = questions.filter((q) => answers[q.id] === q.correct).length
  return { correct, passed: correct >= SPAIN_RULES.passing }
}
