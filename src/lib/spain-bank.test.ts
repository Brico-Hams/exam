/// <reference types="node" />
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import bank from '../data/spain.json'
import info from '../data/spain-import-report.json'
import { seededRng } from './exam'
import { generateSpainExam, parseSpainQuestions, SPAIN_PARTS } from './spain'

const parsed = parseSpainQuestions(bank)

describe('Banco BricoHams suministrado', () => {
  it('contabiliza todas las preguntas y la duplicada eliminada', () => {
    expect(info.inputCount).toBe(1095)
    expect(parsed.questions).toHaveLength(1094)
    expect(parsed.duplicates).toBe(0)
    expect(info.importedCount + info.duplicateCount).toBe(info.inputCount)
    expect(info.duplicates).toHaveLength(1)
    expect(info.duplicates[0]).toMatchObject({ id: 'bh-r421', retainedId: 'bh-r188' })
    expect(parsed.questions.some((q) => q.id === 'bh-r421')).toBe(false)
    expect(new Set(bank.map((q) => q.id)).size).toBe(bank.length)
    expect(bank.every((q) => q.id.startsWith('bh-'))).toBe(true)
  })
  it('mantiene las explicaciones en español, notas, licencia y revisión normativa', () => {
    expect(info.license).toBe('CC BY-SA 4.0 · BricoHams')
    expect(parsed.questions.every((q) => q.explanation?.es.trim())).toBe(true)
    expect(parsed.questions.every((q) => q.source.includes('BricoHams · CC BY-SA 4.0'))).toBe(true)
    expect(parsed.questions.filter((q) => q.reviewReason)).toHaveLength(206)
    expect(parsed.questions.filter((q) => q.note)).toHaveLength(16)
    expect(parsed.questions.find((q) => q.id === 'bh-e011')?.note).toContain('orden técnicamente correcto')
    expect(parsed.questions.find((q) => q.id === 'bh-e001')?.explanation?.es).toContain('R = V / I')
  })
  it('tiene las dos partes y excluye revisiones al simular sin aplicar los filtros de estudio', () => {
    expect(info.parts).toEqual({
      technical: { total: 578, examEligible: 575 },
      regulations: { total: 516, examEligible: 313 },
    })
    for (const part of SPAIN_PARTS) {
      expect(parsed.questions.filter((q) => q.part === part)).toHaveLength(info.parts[part].total)
      for (let seed = 0; seed < 20; seed++) {
        const exam = generateSpainExam(parsed.questions, part, seededRng(seed))
        expect(exam).toHaveLength(30)
        expect(new Set(exam.map((q) => q.id)).size).toBe(30)
        expect(exam.every((q) => q.part === part && !q.reviewReason)).toBe(true)
        for (const q of exam) {
          const original = parsed.questions.find((source) => source.id === q.id)!
          expect(q.answers[q.correct]).toBe(original.answers[original.correct])
        }
      }
    }
  })
  it('conserva los 73 SVG suministrados como archivos locales estáticos sin referencias perdidas', () => {
    const references = new Set(parsed.questions.flatMap((q) => [
      ...(q.figure ? [q.figure] : []),
      ...(q.answerFigures ?? []).flatMap((figure) => figure ? [figure.figure] : []),
    ]))
    expect(references.size).toBe(73)
    expect(info.figures).toHaveLength(73)
    expect(new Set(info.figures.map((f) => f.figure))).toEqual(references)
    expect(readdirSync(resolve('public', 'figures', 'spain')).filter((f) => f.endsWith('.svg'))).toHaveLength(73)
    for (const file of references) {
      expect(file).toMatch(/^figures\/spain\/[\w-]+\.svg$/)
      const svg = readFileSync(resolve('public', ...file.split('/')), 'utf8')
      expect(svg).toContain('<svg')
      expect(svg).not.toMatch(/<script\b|<foreignObject\b|<image\b|<!ENTITY\b|\bon\w+\s*=/i)
    }
  })
  it('preserva el orden fijo de las siete preguntas gráficas en todas las simulaciones', () => {
    const images = parsed.questions.filter((q) => q.answerFigures?.some(Boolean))
    expect(images.map((q) => q.id)).toEqual(['bh-e004', 'bh-e055', 'bh-e089', 'bh-e105', 'bh-e126', 'bh-e213', 'bh-e220'])
    expect(images.every((q) => q.answersFixed)).toBe(true)
    expect(images[0].answerFigures?.filter(Boolean)).toHaveLength(3)
    expect(images.slice(1).every((q) => q.answerFigures?.filter(Boolean).length === 4)).toBe(true)
    for (const q of parsed.questions) {
      q.answers.forEach((answer, i) => {
        if (/\[imagen [ABCD]\]/i.test(answer)) expect(q.answerFigures?.[i]).toBeTruthy()
      })
    }
  })
})
