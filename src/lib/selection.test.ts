import { describe, expect, it } from 'vitest'
import general from '../data/pools/general.json'
import technician from '../data/pools/technician.json'
import { generateExam } from './exam'
import { mergeTranslations } from './pools'
import { filterByGroups, groupsQuery, parseGroups, passingFor } from './selection'
import type { Pool } from './types'

const tech = technician as Pool

describe('passingFor', () => {
  it('matches the official pass marks', () => {
    expect(passingFor(35)).toBe(26)
    expect(passingFor(50)).toBe(37)
  })
})

describe('group selection', () => {
  it('parses groups and legacy sub-element params', () => {
    expect(parseGroups(new URLSearchParams('groups=T1A,T2B'))).toEqual(['T1A', 'T2B'])
    expect(parseGroups(new URLSearchParams('sub=T1'))).toEqual(['T1'])
    expect(parseGroups(new URLSearchParams('sub=weak'))).toBeNull()
    expect(parseGroups(new URLSearchParams(''))).toBeNull()
  })

  it('filters by group and by sub-element', () => {
    const t1a = filterByGroups(tech.questions, ['T1A'])
    expect(t1a.length).toBeGreaterThan(0)
    expect(t1a.every((q) => q.id.startsWith('T1A'))).toBe(true)
    const t1 = filterByGroups(tech.questions, ['T1'])
    expect(t1.every((q) => q.id.startsWith('T1'))).toBe(true)
    expect(t1.length).toBeGreaterThan(t1a.length)
    expect(filterByGroups(tech.questions, null)).toHaveLength(tech.questions.length)
  })

  it('builds one question per selected group', () => {
    const exam = generateExam(filterByGroups(tech.questions, ['T1A', 'T5C', 'T0A']))
    expect(exam.map((q) => q.id.slice(0, 3))).toEqual(['T1A', 'T5C', 'T0A'])
  })

  it('omits the query when the whole pool is selected', () => {
    expect(groupsQuery(['A', 'B'], ['A', 'B'])).toBe('')
    expect(groupsQuery(['A'], ['A', 'B'])).toBe('groups=A')
  })
})

describe('mergeTranslations', () => {
  it('prefers GLAARG translations and falls back to the app ones', () => {
    const pool = general as Pool
    const [a, b] = pool.questions
    const app = {
      [a.id]: { question: 'app A', answers: ['1', '2', '3', '4'] },
      [b.id]: { question: 'app B', answers: ['1', '2', '3', '4'] },
    }
    const glaarg = { [a.id]: { question: 'glaarg A', answers: ['1', '2', '3', '4'] } }
    const merged = mergeTranslations(pool, app, glaarg)
    expect(merged.questions[0]).toMatchObject({ es: { question: 'glaarg A' }, esSource: 'glaarg' })
    expect(merged.questions[1]).toMatchObject({ es: { question: 'app B' }, esSource: 'app' })
    expect(merged.questions[2].es).toBeUndefined()
  })
})
