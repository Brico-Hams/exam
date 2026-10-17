import { describe, expect, it } from 'vitest'
import { seededRng } from './exam'
import { generateSpainExam, parseSpainQuestions, scoreSpainExam, SPAIN_RULES, type SpainQuestion } from './spain'

const question = (i: number, part: SpainQuestion['part'] = 'technical'): SpainQuestion => ({
  id: `ES-${part}-${i}`, part, topic: 'Prueba de software',
  question: `Pregunta sintética ${i}`, answers: ['Uno', 'Dos', 'Tres', 'Cuatro'],
  correct: 0, source: 'Fixture de pruebas; no material de estudio',
})
const pool = Array.from({ length: 40 }, (_, i) => question(i))

describe('Banco de España', () => {
  it('permite un banco pendiente, sin preguntas inventadas', () => {
    expect(parseSpainQuestions([]).questions).toEqual([])
  })
  it('deduplica por pregunta y respuesta, sin depender del orden de opciones', () => {
    const first = question(0)
    const duplicate = { ...first, id: 'otro', question: '  PREGUNTA   SINTÉTICA 0 ',
      answers: ['Dos', 'Uno', 'Tres', 'Cuatro'], correct: 1 }
    expect(parseSpainQuestions([first, duplicate])).toEqual({ questions: [first], duplicates: 1 })
  })
  it('no fusiona preguntas pertenecientes a partes distintas', () => {
    expect(parseSpainQuestions([question(0), question(0, 'regulations')]).questions).toHaveLength(2)
  })
  it('rechaza respuestas correctas contradictorias', () => {
    expect(() => parseSpainQuestions([question(0), { ...question(0), correct: 1 }])).toThrow('contradictoria')
  })
  it('rechaza identificadores repetidos para preguntas distintas', () => {
    expect(() => parseSpainQuestions([question(0), { ...question(1), id: question(0).id }])).toThrow('identificador')
  })
  it.each([
    null, {}, [{ ...question(0), answers: ['Una'] }], [{ ...question(0), correct: 4 }],
    [{ ...question(0), correct: 0.5 }], [{ ...question(0), source: '' }],
    [{ ...question(0), part: 'extra' }], [{ ...question(0), answers: ['A', 'A', 'B', 'C'] }],
    [{ ...question(0), figure: 'https://example.org/image.svg', figureAlt: 'Imagen' }],
    [{ ...question(0), figure: 'figures/spain/../image.svg', figureAlt: 'Imagen' }],
    [{ ...question(0), figure: 'figures/spain/circuit.svg' }],
  ])('rechaza datos inválidos %#', (input) => {
    expect(() => parseSpainQuestions(input)).toThrow()
  })
  it('acepta ilustraciones locales con descripción accesible', () => {
    const q = { ...question(0), figure: 'figures/spain/circuit.svg', figureAlt: 'Circuito propio' }
    expect(parseSpainQuestions([q]).questions).toEqual([q])
  })
})

describe('Simulaciones de España', () => {
  it('selecciona 30 preguntas distintas solo de la parte solicitada', () => {
    const exam = generateSpainExam([...pool, question(0, 'regulations')], 'technical', seededRng(17))
    expect(exam).toHaveLength(30)
    expect(new Set(exam.map((q) => q.id)).size).toBe(30)
    expect(exam.every((q) => q.part === 'technical')).toBe(true)
    expect(exam).toEqual(generateSpainExam(pool, 'technical', seededRng(17)))
  })
  it('no permite simular con menos de 30 preguntas por parte', () => {
    expect(() => generateSpainExam(pool.slice(0, 29), 'technical')).toThrow()
    expect(() => generateSpainExam(pool, 'regulations')).toThrow()
  })
  it('aprueba con exactamente 15, suspende con 14, sin penalizaciones', () => {
    const exam = pool.slice(0, 30)
    const answers = Object.fromEntries(exam.map((q, i) => [q.id, i < 15 ? 0 : 1]))
    expect(scoreSpainExam(exam, answers)).toEqual({ correct: 15, passed: true })
    delete answers[exam[14].id]
    expect(scoreSpainExam(exam, answers)).toEqual({ correct: 14, passed: false })
    expect(scoreSpainExam(exam, {})).toEqual({ correct: 0, passed: false })
    expect(() => scoreSpainExam(pool, {})).toThrow()
  })
  it('cada parte tiene un tiempo de 45 minutos', () => {
    expect(SPAIN_RULES.seconds).toBe(2700)
  })
})
