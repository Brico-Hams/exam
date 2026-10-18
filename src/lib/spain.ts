import { shuffle, type Rng } from './exam'

export type SpainPart = 'technical' | 'regulations'
export type SpainMode = 'practice' | 'flashcards' | 'exam'
export interface SpainFigure { figure: string; figureAlt: string }

export interface SpainQuestion {
  id: string
  part: SpainPart
  topic: string
  question: string
  answers: string[]
  correct: number
  source: string
  historical?: boolean
  figure?: string
  figureAlt?: string
  answerFigures?: (SpainFigure | null)[]
  explanation?: { es: string; en: string }
}

export const SPAIN_RULES = { questions: 30, passing: 15, seconds: 45 * 60 }
export const SPAIN_STORAGE_KEY = 'hamprep.spain.questions.v1'
export const SPAIN_PARTS: SpainPart[] = ['technical', 'regulations']

const normalized = (text: string) => text.normalize('NFC').toLocaleLowerCase('es')
  .trim().replace(/\s+/g, ' ')

export const spainAnswerIdentity = (q: SpainQuestion, index: number) =>
  JSON.stringify([normalized(q.answers[index]), q.answerFigures?.[index]?.figure ?? ''])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseSpainQuestions(input: unknown): { questions: SpainQuestion[]; duplicates: number } {
  if (!Array.isArray(input)) throw new Error('El banco debe ser una lista JSON de preguntas.')
  const questions: SpainQuestion[] = []
  const seen = new Set<string>()
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
    if (row.historical !== undefined && typeof row.historical !== 'boolean') {
      error('historical debe ser un booleano.')
    }
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
      if (!Array.isArray(values) || values.length !== 4) {
        return error('answerFigures debe tener cuatro posiciones: ilustración o null.')
      }
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
        en: text(row.explanation.en, 'explanation.en'),
      }
    }
    const q: SpainQuestion = {
      id: text(row.id, 'id'), part, topic: text(row.topic, 'topic'),
      question: text(row.question, 'question'), answers, correct,
      source: text(row.source, 'source'),
      ...(typeof row.historical === 'boolean' ? { historical: row.historical } : {}),
      ...(answerFigures ? { answerFigures } : {}),
      ...(explanation ? { explanation } : {}),
      ...(row.figure !== undefined ? parseFigure(row) : {}),
    }
    if (new Set(q.answers.map((_, i) => spainAnswerIdentity(q, i))).size !== 4) {
      error('las cuatro opciones deben ser distintas.')
    }
    const stem = JSON.stringify([q.part, normalized(q.question), q.figure ?? ''])
    const answer = spainAnswerIdentity(q, q.correct)
    const variant = JSON.stringify([stem, q.answers.map((_, i) => spainAnswerIdentity(q, i)).sort()])
    const previous = correctByQuestion.get(variant)
    if (previous !== undefined && previous !== answer) error('respuesta correcta contradictoria para el mismo enunciado.')
    correctByQuestion.set(variant, answer)
    const key = JSON.stringify([stem, answer])
    if (seen.has(key)) {
      duplicates++
      continue
    }
    if (ids.has(q.id)) error(`identificador repetido: ${q.id}.`)
    ids.add(q.id)
    seen.add(key)
    questions.push(q)
  }
  return { questions, duplicates }
}

export function mergeSpainQuestions(bundled: unknown, saved: unknown): SpainQuestion[] {
  const base = parseSpainQuestions(bundled).questions
  const local = parseSpainQuestions(saved).questions
  return parseSpainQuestions([...base, ...local]).questions
}

export function generateSpainExam(questions: SpainQuestion[], part: SpainPart, rng?: Rng): SpainQuestion[] {
  const pool = questions.filter((q) => q.part === part)
  if (pool.length < SPAIN_RULES.questions) {
    throw new Error('Se necesitan al menos 30 preguntas distintas en esta parte.')
  }
  return shuffle(pool, rng).slice(0, SPAIN_RULES.questions)
}

export function scoreSpainExam(questions: SpainQuestion[], answers: Record<string, number>) {
  if (questions.length !== SPAIN_RULES.questions) throw new Error('La prueba requiere 30 preguntas.')
  const correct = questions.filter((q) => answers[q.id] === q.correct).length
  return { correct, passed: correct >= SPAIN_RULES.passing }
}
