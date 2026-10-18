import { describe, expect, it } from 'vitest'
import { seededRng } from './exam'
import { generateSpainExam, mergeSpainQuestions, parseSpainQuestions, scoreSpainExam, SPAIN_RULES, type SpainQuestion } from './spain'

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
  it('admite variantes con alternativas distintas sin confundirlas con claves contradictorias', () => {
    const variant = { ...question(0), id: 'variante', answers: ['Cinco', 'Seis', 'Siete', 'Ocho'] }
    expect(parseSpainQuestions([question(0), variant]).questions).toHaveLength(2)
  })
  it('no fusiona enunciados que hacen referencia a figuras diferentes', () => {
    const first = { ...question(0), figure: 'figures/spain/one.svg', figureAlt: 'Primer circuito' }
    const second = { ...first, id: 'second', figure: 'figures/spain/two.svg' }
    expect(parseSpainQuestions([first, second]).questions).toHaveLength(2)
  })
  it('valida y conserva las figuras de respuesta, incluso si las etiquetas de texto coinciden', () => {
    const answerFigures = Array.from({ length: 4 }, (_, i) => ({
      figure: `figures/spain/option-${i}.svg`, figureAlt: `Esquema de la opción ${i + 1}`,
    }))
    const q = { ...question(0), answers: ['Esquema', 'Esquema', 'Esquema', 'Esquema'], answerFigures }
    expect(parseSpainQuestions([q]).questions).toEqual([q])
    expect(() => parseSpainQuestions([{ ...q, answerFigures: [] }])).toThrow('cuatro')
    expect(() => parseSpainQuestions([{ ...q, answerFigures: [null, null, null, 'imagen'] }])).toThrow()
    expect(() => parseSpainQuestions([{ ...q, answerFigures: [{ figure: 'https://external/img.svg', figureAlt: 'A' }, null, null, null] }])).toThrow()
    expect(() => parseSpainQuestions([{ ...q, answerFigures: [{ figure: 'figures/spain/a.svg' }, null, null, null] }])).toThrow('figureAlt')
  })
  it('deduplica alternativas gráficas reordenadas conservando la identidad de la respuesta correcta', () => {
    const first = { ...question(0), answerFigures: [
      { figure: 'figures/spain/one.svg', figureAlt: 'Circuito' }, null, null, null,
    ] }
    const second = { ...first, id: 'second', answers: ['Dos', 'Uno', 'Tres', 'Cuatro'], correct: 1,
      answerFigures: [null, first.answerFigures[0], null, null] }
    expect(parseSpainQuestions([first, second]).duplicates).toBe(1)
    expect(() => parseSpainQuestions([first, { ...first, id: 'wrong', correct: 1 }])).toThrow('contradictoria')
  })
  it('mantiene el aviso histórico y combina el banco nuevo con datos locales anteriores', () => {
    const bundled = [{ ...question(0), historical: true }]
    expect(mergeSpainQuestions(bundled, [])).toEqual(bundled)
    expect(mergeSpainQuestions(bundled, [question(1)])).toHaveLength(2)
    expect(mergeSpainQuestions(bundled, bundled)).toEqual(bundled)
    expect(() => mergeSpainQuestions(bundled, {})).toThrow()
    expect(() => parseSpainQuestions([{ ...question(0), historical: 'yes' }])).toThrow()
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
  it('conserva explicaciones bilingües y rechaza explicaciones incompletas', () => {
    const q = { ...question(0), explanation: { es: 'Explicación propia.', en: 'Original explanation.' } }
    expect(parseSpainQuestions([q]).questions[0].explanation).toEqual(q.explanation)
    expect(() => parseSpainQuestions([{ ...q, explanation: { es: 'Solo español' } }])).toThrow('explanation.en')
    expect(() => parseSpainQuestions([{ ...q, explanation: 'Texto' }])).toThrow()
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
