import { describe, expect, it } from 'vitest'
import { explanationFor, regulationLinks } from './explanations'
import { loadPool } from './pools'
import { topicForGroup, topicGuides } from './explanation-topics'
import { calculations, calculationExplanation } from './calculation-explanations'

describe('Bilingual explanation guides', () => {
  it.each(['technician', 'general', 'extra'] as const)('%s has usable explanation metadata for every question', async (level) => {
    const pool = await loadPool(level)
    for (const q of pool.questions) {
      const info = explanationFor(q)
      expect(info.principle, q.id).toBeDefined()
      expect(topicForGroup(q.id.slice(0, 3)), q.id).toBeDefined()
      if (info.specific) {
        expect(info.specific.es.trim().length, q.id).toBeGreaterThan(10)
        expect(info.specific.en.trim().length, q.id).toBeGreaterThan(10)
      }
      if (info.principle) {
        expect(info.principle.text.es.length).toBeGreaterThan(50)
        expect(info.principle.text.en.length).toBeGreaterThan(50)
      }
      for (const ref of info.regulations) {
        expect(new URL(ref.url).hostname).toBe('www.ecfr.gov')
      }
    }
  })
  it('maps every group to exactly one bilingual foundation', () => {
    const groups = topicGuides.flatMap((guide) => guide.groups)
    expect(new Set(groups).size).toBe(groups.length)
    for (const guide of topicGuides) {
      expect(guide.text.es.length).toBeGreaterThan(100)
      expect(guide.text.en.length).toBeGreaterThan(100)
      expect(guide.text.es).not.toMatch(/\p{L}\?\p{L}|\uFFFD/u)
      expect(guide.text.en).not.toMatch(/\uFFFD/u)
    }
  })
  it('links the exact cited sections and retains no duplicate links', () => {
    expect(regulationLinks('[97.305, 97.307(b), 97.305(a)]').map((r) => r.section))
      .toEqual(['97.305', '97.307'])
    expect(regulationLinks('[1.1307(b)]')[0].url)
      .toBe('https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-1/section-1.1307')
    expect(regulationLinks('')).toEqual([])
  })
  it('includes worked physics and federal examples rather than just repeating an answer', async () => {
    const tech = await loadPool('technician')
    expect(explanationFor(tech.questions.find((q) => q.id === 'T5C09')!).specific?.en).toContain('138 W')
    expect(explanationFor(tech.questions.find((q) => q.id === 'T1A02')!).specific?.en).toContain('not the regulator')
    const extra = await loadPool('extra')
    expect(explanationFor(extra.questions.find((q) => q.id === 'E1A01')!).specific?.en).toContain('14.351')
  })
  it.each(calculations)('$id recomputes the result within the pool rounding tolerance', (entry) => {
    const value = entry.calculate()
    expect(Number.isFinite(value)).toBe(true)
    expect(Math.abs(value - entry.expected)).toBeLessThanOrEqual(entry.tolerance)
    const explanation = calculationExplanation(entry.id)
    expect(explanation?.es).toContain(entry.formula)
    expect(explanation?.en).toContain(entry.formula)
  })
  it.each(calculations)('$id agrees with the actual correct option in the current bank', async (entry) => {
    const level = entry.id.startsWith('T') ? 'technician' : entry.id.startsWith('G') ? 'general' : 'extra'
    const pool = await loadPool(level)
    const q = pool.questions.find((item) => item.id === entry.id)
    expect(q, entry.id).toBeDefined()
    const answer = q!.answers[q!.correct]
    const number = answer.match(/-?\d+(?:,\d{3})*(?:\.\d+)?/)?.[0]
    if (number) {
      const value = Number(number.replaceAll(',', ''))
      // The phase questions express sign in words ("lagging"), not a minus sign.
      expect(Math.abs(value), answer).toBe(Math.abs(entry.expected))
    } else {
      expect(['T5B03', 'T5B04']).toContain(entry.id)
      expect(answer).toMatch(/thousand|millionth/)
    }
  })
  it('provides full foundational coverage without claiming every guide is a worked solution', async () => {
    let total = 0
    let worked = 0
    const groups = new Set<string>()
    for (const level of ['technician', 'general', 'extra'] as const) {
      const pool = await loadPool(level)
      for (const q of pool.questions) {
        total++
        groups.add(q.id.slice(0, 3))
        expect(explanationFor(q).principle, q.id).toBeDefined()
        if (explanationFor(q).specific) worked++
      }
    }
    expect(total).toBe(1431)
    expect(groups.size).toBe(120)
    expect(worked).toBe(98)
    expect(worked).toBeLessThan(total)
  })
})
