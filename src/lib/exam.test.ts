import { describe, expect, it } from 'vitest'
import extra from '../data/pools/extra.json'
import general from '../data/pools/general.json'
import technician from '../data/pools/technician.json'
import esTech from '../data/i18n/es/technician.json'
import esGeneral from '../data/i18n/es/general.json'
import esExtra from '../data/i18n/es/extra.json'
import { compareIds, generateExam, scoreExam, seededRng, shuffle } from './exam'
import { LEVELS } from './levels'
import { groupOf, mergeTranslations } from './pools'
import { isMastered, recordAnswer } from './progress'
import type { AppState } from './progress'
import type { Pool, Translation } from './types'

const pools: Record<string, Pool> = {
  technician: technician as Pool,
  general: general as Pool,
  extra: extra as Pool,
}
const translations: Record<string, Record<string, Translation>> = {
  technician: esTech,
  general: esGeneral,
  extra: esExtra,
}

describe.each(LEVELS)('$id pool', (level) => {
  const pool = pools[level.id]

  it('has well-formed questions with unique ids', () => {
    const ids = new Set<string>()
    for (const q of pool.questions) {
      expect(q.id.startsWith(level.prefix)).toBe(true)
      expect(q.answers).toHaveLength(4)
      expect(q.correct).toBeGreaterThanOrEqual(0)
      expect(q.correct).toBeLessThan(4)
      expect(ids.has(q.id)).toBe(false)
      ids.add(q.id)
    }
  })

  it('has exactly one group per exam question', () => {
    const groups = new Set(pool.questions.map((q) => groupOf(q.id)))
    expect(groups.size).toBe(level.examQuestions)
  })

  it('generates an exam with one question per group', () => {
    const exam = generateExam(pool.questions, seededRng(42))
    expect(exam).toHaveLength(level.examQuestions)
    expect(new Set(exam.map((q) => groupOf(q.id))).size).toBe(level.examQuestions)
  })

  it('Spanish translations reference existing ids and match answer count', () => {
    const byId = new Map(pool.questions.map((q) => [q.id, q]))
    for (const [id, tr] of Object.entries(translations[level.id])) {
      expect(byId.has(id), id).toBe(true)
      expect(tr.answers).toHaveLength(byId.get(id)!.answers.length)
      expect(tr.question.length).toBeGreaterThan(0)
    }
  })
})

describe('exam helpers', () => {
  const qs = pools.technician.questions

  it('scores and applies passing threshold', () => {
    const exam = generateExam(qs, seededRng(1))
    const all = Object.fromEntries(exam.map((q) => [q.id, q.correct]))
    expect(scoreExam(exam, all, 26)).toMatchObject({ correct: 35, passed: true, wrong: [] })

    const nine = exam.slice(0, 9).map((q) => q.id)
    const some = { ...all }
    for (const id of nine) some[id] = (some[id] + 1) % 4
    const r = scoreExam(exam, some, 26)
    expect(r.correct).toBe(26)
    expect(r.passed).toBe(true)
    some[exam[9].id] = (some[exam[9].id] + 1) % 4
    expect(scoreExam(exam, some, 26).passed).toBe(false)
  })

  it('treats unanswered questions as wrong', () => {
    const exam = generateExam(qs, seededRng(3))
    expect(scoreExam(exam, {}, 26).correct).toBe(0)
  })

  it('is reproducible with a seed and shuffle keeps all items', () => {
    expect(generateExam(qs, seededRng(7)).map((q) => q.id)).toEqual(
      generateExam(qs, seededRng(7)).map((q) => q.id),
    )
    const s = shuffle(qs, seededRng(5))
    expect(s).toHaveLength(qs.length)
    expect(new Set(s.map((q) => q.id)).size).toBe(qs.length)
  })

  it('orders sub-element 0 (safety) last', () => {
    expect(['T0A', 'T9B', 'T1A'].sort(compareIds)).toEqual(['T1A', 'T9B', 'T0A'])
  })

  it('merges translations only when answers line up', () => {
    const merged = mergeTranslations(pools.technician, {
      T1A01: { question: 'x', answers: ['a', 'b', 'c', 'd'] },
      T1A02: { question: 'bad', answers: ['a'] },
    })
    expect(merged.questions.find((q) => q.id === 'T1A01')?.es?.question).toBe('x')
    expect(merged.questions.find((q) => q.id === 'T1A02')?.es).toBeUndefined()
  })
})

describe('progress', () => {
  it('tracks mastery', () => {
    let s: AppState = { lang: 'es', content: 'both', stats: {}, exams: [] }
    s = recordAnswer(s, 'T1A01', false)
    expect(isMastered(s.stats.T1A01)).toBe(false)
    s = recordAnswer(s, 'T1A01', true)
    expect(isMastered(s.stats.T1A01)).toBe(false) // 50%
    s = recordAnswer(s, 'T1A01', true)
    s = recordAnswer(s, 'T1A01', true)
    expect(isMastered(s.stats.T1A01)).toBe(true) // 75%, last correct
  })
})
