import { describe, expect, it } from 'vitest'
import { loadPool, groupOf } from './pools'
import { generateExam } from './exam'

describe('Loading the actual bundled question banks', () => {
  it.each([
    ['technician', 409, 35],
    ['general', 423, 35],
    ['extra', 599, 50],
  ] as const)('%s loads the complete bilingual bank and generates an exam', async (level, count, groups) => {
    const pool = await loadPool(level)
    expect(pool.level).toBe(level)
    expect(pool.questions).toHaveLength(count)
    expect(pool.questions.every((q) => q.es?.answers.length === 4)).toBe(true)
    expect(new Set(pool.questions.map((q) => groupOf(q.id))).size).toBe(groups)
    expect(generateExam(pool.questions)).toHaveLength(groups)
    expect(await loadPool(level)).toBe(pool)
  })
})
