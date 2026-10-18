import { describe, expect, it } from 'vitest'
import { seededRng } from './exam'
import { generateSpainExam, mergeSpainQuestions, parseSpainQuestions, scoreSpainExam, shuffleSpainAnswers, SPAIN_RULES, type SpainQuestion } from './spain'

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
  it('admite explicaciones ES y ES/EN sin inventar traducciones ausentes', () => {
    const q = { ...question(0), explanation: { es: 'Explicación propia.', en: 'Original explanation.' } }
    expect(parseSpainQuestions([q]).questions[0].explanation).toEqual(q.explanation)
    expect(parseSpainQuestions([{ ...q, explanation: { es: 'Solo español' } }]).questions[0].explanation).toEqual({ es: 'Solo español' })
    expect(() => parseSpainQuestions([{ ...q, explanation: { es: '', en: 'English' } }])).toThrow('explanation.es')
    expect(() => parseSpainQuestions([{ ...q, explanation: { es: 'Texto', en: '' } }])).toThrow('explanation.en')
    expect(() => parseSpainQuestions([{ ...q, explanation: 'Texto' }])).toThrow()
  })
  it('conserva avisos y notas y valida sus tipos', () => {
    const q = { ...question(0), reviewReason: 'Verificar normativa', note: 'Corrección del banco' }
    expect(parseSpainQuestions([q]).questions).toEqual([q])
    expect(() => parseSpainQuestions([{ ...q, reviewReason: false }])).toThrow('reviewReason')
    expect(() => parseSpainQuestions([{ ...q, note: '' }])).toThrow('note')
    expect(() => parseSpainQuestions([{ ...q, answersFixed: 'sí' }])).toThrow('answersFixed')
    expect(parseSpainQuestions([question(0), q]).questions[0].reviewReason).toBe(q.reviewReason)
  })
  it('compara el contexto de las figuras y las alternativas al detectar duplicadas y conflictos', () => {
    const a = { ...question(0), figure: 'figures/spain/a.svg', figureAlt: 'Primer esquema' }
    const b = { ...a, id: 'b', figure: 'figures/spain/b.svg' }
    expect(parseSpainQuestions([a, b]).questions).toHaveLength(2)
    const variant = { ...question(0), id: 'variant', answers: ['Cinco', 'Seis', 'Siete', 'Ocho'] }
    expect(parseSpainQuestions([question(0), variant]).questions).toHaveLength(2)
  })
  it('valida y conserva las cuatro ilustraciones de alternativas', () => {
    const answerFigures = Array.from({ length: 4 }, (_, i) => ({
      figure: `figures/spain/choice-${i}.svg`, figureAlt: `Esquema ${i + 1}`,
    }))
    const q = { ...question(0), answerFigures, answersFixed: true }
    expect(parseSpainQuestions([q]).questions).toEqual([q])
    expect(() => parseSpainQuestions([{ ...q, answerFigures: [] }])).toThrow()
    expect(() => parseSpainQuestions([{ ...q, answerFigures: [null, null, null, 'image'] }])).toThrow()
    expect(() => parseSpainQuestions([{ ...q, answerFigures: [
      { figure: 'https://external/a.svg', figureAlt: 'A' }, null, null, null,
    ] }])).toThrow('local')
    expect(() => parseSpainQuestions([{ ...q, answerFigures: [
      { figure: 'figures/spain/a.svg' }, null, null, null,
    ] }])).toThrow('figureAlt')
    const reordered = { ...q, id: 'another', answers: ['Dos', 'Uno', 'Tres', 'Cuatro'], correct: 1,
      answerFigures: [answerFigures[1], answerFigures[0], answerFigures[2], answerFigures[3]] }
    expect(parseSpainQuestions([q, reordered]).duplicates).toBe(1)
  })
  it('combina el banco incluido con importaciones previas sin ocultarlo con una lista vacía', () => {
    expect(mergeSpainQuestions([question(0)], [])).toEqual([question(0)])
    expect(mergeSpainQuestions([question(0)], [question(1)])).toHaveLength(2)
    expect(mergeSpainQuestions([question(0)], [question(0)])).toEqual([question(0)])
    expect(() => mergeSpainQuestions([question(0)], {})).toThrow()
  })
  it('mezcla las opciones de texto sin alterar la clave ni el banco original', () => {
    const q = question(0)
    const mixed = shuffleSpainAnswers(q, () => 0)
    expect(mixed.answers).toEqual(['Dos', 'Tres', 'Cuatro', 'Uno'])
    expect(mixed.correct).toBe(3)
    expect(mixed.answers[mixed.correct]).toBe(q.answers[q.correct])
    expect(q.answers).toEqual(['Uno', 'Dos', 'Tres', 'Cuatro'])
    expect(shuffleSpainAnswers({ ...q, answersFixed: true }, () => 0).answers).toEqual(q.answers)
    const graphical = { ...q, answerFigures: [{ figure: 'figures/spain/a.svg', figureAlt: 'A' }, null, null, null] }
    expect(shuffleSpainAnswers(graphical, () => 0)).toBe(graphical)
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
  it('excluye todas las preguntas pendientes de revisión de los simulacros', () => {
    const mixed = pool.map((q, i) => i < 10 ? { ...q, reviewReason: 'Comprobar vigencia' } : q)
    const exam = generateSpainExam(mixed, 'technical', seededRng(9))
    expect(exam).toHaveLength(30)
    expect(exam.every((q) => !q.reviewReason)).toBe(true)
    expect(() => generateSpainExam(mixed.slice(0, 39), 'technical')).toThrow('sin revisión pendiente')
    for (const q of exam) {
      expect(q.answers[q.correct]).toBe(pool.find((original) => original.id === q.id)?.answers[0])
    }
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
