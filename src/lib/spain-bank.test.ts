/// <reference types="node" />
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import data from '../data/spain.json'
import report from '../data/spain-import-report.json'
import { seededRng } from './exam'
import { generateSpainExam, parseSpainQuestions, SPAIN_PARTS } from './spain'

const parsed = parseSpainQuestions(data)

describe('Banco FEDI-EA aportado', () => {
  it('contabiliza los 1078 registros sin pérdidas silenciosas', () => {
    expect(report.inputCount).toBe(1078)
    expect(report.importedCount).toBe(1048)
    expect(report.duplicateCount).toBe(27)
    expect(report.excludedCount).toBe(3)
    expect(report.parts).toEqual({ technical: 613, regulations: 435 })
    expect(report.importedCount).toBe(parsed.questions.length)
    expect(report.inputCount).toBe(report.importedCount + report.duplicateCount + report.excludedCount)
    expect(report.duplicates).toHaveLength(report.duplicateCount)
    expect(report.excluded).toHaveLength(report.excludedCount)
    expect(parsed.duplicates).toBe(0)
    const allIds = [...data.map((q) => q.id), ...report.duplicates.map((d) => d.id), ...report.excluded.map((e) => e.id)]
    expect(new Set(allIds).size).toBe(report.inputCount)
    const retained = new Set(data.map((q) => q.id))
    expect(report.duplicates.every((d) => retained.has(d.retainedId))).toBe(true)
  })
  it('carga las dos partes y permite generar simulaciones completas', () => {
    for (const part of SPAIN_PARTS) {
      expect(parsed.questions.filter((q) => q.part === part)).toHaveLength(report.parts[part])
      const exam = generateSpainExam(parsed.questions, part, seededRng(77))
      expect(exam).toHaveLength(30)
      expect(new Set(exam.map((q) => q.id)).size).toBe(30)
      expect(exam.every((q) => q.part === part)).toBe(true)
    }
  })
  it('marca la antigüedad y conserva las fuentes, sin presentar una revisión normativa inexistente', () => {
    expect(parsed.questions).toHaveLength(1048)
    for (const q of parsed.questions) {
      expect(q.historical).toBe(true)
      expect(q.source).toContain('https://www.fediea.org/examen/ejercicios/test.php?')
      expect(q.answers).toHaveLength(4)
      expect(q.answers[q.correct].trim()).not.toBe('')
    }
    expect(parsed.questions.find((q) => q.id === 'fedi-ah-031')?.correct).toBe(0)
    expect(parsed.questions.find((q) => q.id === 'fedi-aa-027')?.correct).toBe(1)
  })
  it('clasifica las preguntas de bloques mixtos individualmente, no por letra', () => {
    for (const id of ['fedi-a-002', 'fedi-b-165', 'fedi-c-348', 'fedi-d-402']) {
      expect(parsed.questions.find((q) => q.id === id)?.part).toBe('technical')
    }
    for (const id of ['fedi-a-023', 'fedi-b-194', 'fedi-c-333', 'fedi-d-433']) {
      expect(parsed.questions.find((q) => q.id === id)?.part).toBe('regulations')
    }
  })
  it('incluye cada ilustración referenciada como SVG propio y no como un JPG copiado', () => {
    const files = new Set<string>()
    for (const q of parsed.questions) {
      if (q.figure) files.add(q.figure)
      for (const answer of q.answerFigures ?? []) if (answer) files.add(answer.figure)
    }
    expect(files.size).toBe(report.originalFigures)
    expect(files.size).toBe(59)
    for (const file of files) {
      expect(file).toMatch(/^figures\/spain\/[\w-]+\.svg$/)
      const path = resolve('public', ...file.split('/'))
      expect(existsSync(path)).toBe(true)
      const svg = readFileSync(path, 'utf8')
      expect(svg).toContain('<svg')
      expect(svg).not.toMatch(/<image\b|data:image|<script\b|onload=/i)
    }
  })
  it('representa las 69 imágenes aportadas sin perder las opciones gráficas ni las fórmulas', () => {
    expect(report.figureSources).toHaveLength(69)
    expect(new Set(report.figureSources.map((s) => s.sourceImage)).size).toBe(69)
    const imageQuestions = parsed.questions.filter((q) => q.answerFigures?.some(Boolean))
    expect(imageQuestions.map((q) => q.id).sort()).toEqual([
      'fedi-aa-025', 'fedi-i-007', 'fedi-i-014', 'fedi-o-009', 'fedi-s-017', 'fedi-w-030',
    ])
    for (const q of imageQuestions) {
      expect(q.answerFigures).toHaveLength(4)
      expect(q.answerFigures?.every(Boolean)).toBe(true)
    }
    for (const q of parsed.questions) {
      q.answers.forEach((answer, i) => {
        if (/\[imagen [ABCD]\]/i.test(answer)) expect(q.answerFigures?.[i]).toBeTruthy()
      })
    }
    expect(report.formulaTranscriptions.map((q) => q.id).sort()).toEqual(['fedi-ag-004', 'fedi-m-007', 'fedi-s-005'])
    expect(parsed.questions.find((q) => q.id === 'fedi-ag-004')?.answers[0]).toBe('Vsec. / Vprim. = Nsec. / Nprim.')
    expect(parsed.questions.find((q) => q.id === 'fedi-s-005')?.answers[2]).toBe('C = C1 + C2 + C3')
  })
  it('documenta las entradas incompletas en lugar de rellenar opciones inventadas', () => {
    for (const id of ['fedi-d-404', 'fedi-d-450', 'fedi-c-374']) {
      expect(report.excluded.some((q) => q.id === id)).toBe(true)
      expect(parsed.questions.some((q) => q.id === id)).toBe(false)
    }
    expect(report.excluded.every((q) => q.reason.trim() && q.original.id === q.id)).toBe(true)
  })
})
