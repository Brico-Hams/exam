import { describe, expect, it } from 'vitest'
import { explanationFor, regulationLinks } from './explanations'
import { loadPool } from './pools'

describe('Bilingual explanation guides', () => {
  it.each(['technician', 'general', 'extra'] as const)('%s has usable explanation metadata for every question', async (level) => {
    const pool = await loadPool(level)
    for (const q of pool.questions) {
      const info = explanationFor(q)
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
})
