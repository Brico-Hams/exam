import { describe, expect, it } from 'vitest'
import extra from '../data/i18n/es/extra.json'
import general from '../data/i18n/es/general.json'
import technician from '../data/i18n/es/technician.json'
import extraPool from '../data/pools/extra.json'
import generalPool from '../data/pools/general.json'
import technicianPool from '../data/pools/technician.json'

type Tr = Record<string, { question: string; answers: string[] }>
type Pool = { questions: { id: string }[] }

const sets: [string, Tr, Pool][] = [
  ['technician', technician as Tr, technicianPool as unknown as Pool],
  ['general', general as Tr, generalPool as unknown as Pool],
  ['extra', extra as Tr, extraPool as unknown as Pool],
]

describe('Spanish translations', () => {
  it.each(sets)('%s covers the whole pool with 4 answers each', (_, tr, pool) => {
    for (const q of pool.questions) {
      expect(tr[q.id], q.id).toBeDefined()
      expect(tr[q.id].answers, q.id).toHaveLength(4)
    }
  })

  it.each(sets)('%s has no encoding corruption', (_, tr) => {
    for (const [id, { question, answers }] of Object.entries(tr)) {
      for (const text of [question, ...answers]) {
        expect(text, id).not.toMatch(/\p{L}\?\p{L}|^\?\p{L}|\uFFFD/u)
      }
    }
  })
})
