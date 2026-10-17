import { shuffle, type Rng } from './exam'

export type SpainPart = 'technical' | 'regulations'
export type SpainMode = 'practice' | 'flashcards' | 'exam'

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
}

export const SPAIN_RULES = { questions: 30, passing: 15, seconds: 45 * 60 }
export const SPAIN_STORAGE_KEY = 'hamprep.spain.questions.v1'
export const SPAIN_PARTS: SpainPart[] = ['technical', 'regulations']

const normalized = (text: string) => text.normalize('NFC').toLocaleLowerCase('es')
  .trim().replace(/\s+/g, ' ')

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
    if (part !== 'technical' && part !== 'regulations') throw new Error(`Pregunta ${index + 1}: parte incorrecta.`)
    if (!Array.isArray(row.answers) || row.answers.length !== 4) {
      throw new Error(`Pregunta ${index + 1}: se necesitan cuatro respuestas.`)
    }
    const answers = row.answers.map((answer: unknown) => text(answer, 'respuesta'))
    if (typeof correct !== 'number' || !Number.isInteger(correct) ||
      correct < 0 || correct > 3) throw new Error(`Pregunta ${index + 1}: correct debe ser un índice de 0 a 3.`)
    if (new Set(answers.map(normalized)).size !== 4) error('las cuatro opciones deben ser distintas.')
    if (row.figure !== undefined && (typeof row.figure !== 'string' ||
      !/^figures\/spain\/[a-zA-Z0-9_-]+\.(svg|png|webp)$/.test(row.figure))) {
      error('figure debe apuntar a una ilustración local en figures/spain/.')
    }
    if (row.figure !== undefined && (typeof row.figureAlt !== 'string' || !row.figureAlt.trim())) {
      error('la ilustración necesita figureAlt.')
    }
    const q: SpainQuestion = {
      id: text(row.id, 'id'), part, topic: text(row.topic, 'topic'),
      question: text(row.question, 'question'), answers, correct,
      source: text(row.source, 'source'),
      ...(row.figure !== undefined ? {
        figure: text(row.figure, 'figure'), figureAlt: text(row.figureAlt, 'figureAlt'),
      } : {}),
    }
    const stem = JSON.stringify([q.part, normalized(q.question)])
    const answer = normalized(q.answers[q.correct])
    const previous = correctByQuestion.get(stem)
    if (previous !== undefined && previous !== answer) error('respuesta correcta contradictoria para el mismo enunciado.')
    correctByQuestion.set(stem, answer)
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
