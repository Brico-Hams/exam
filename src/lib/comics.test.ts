import { describe, expect, it } from 'vitest'
import bundledSpain from '../data/spain.json'
import { spainComic, usaComic } from './comics'
import { loadPool } from './pools'
import { parseSpainQuestions, shuffleSpainAnswers } from './spain'
import { seededRng } from './exam'

describe('Chomp & Chip episode coverage', () => {
  it.each(['technician', 'general', 'extra'] as const)('adapts every %s question in ES and EN without changing its answer', async (level) => {
    const pool = await loadPool(level)
    for (const q of pool.questions) {
      for (const lang of ['es', 'en'] as const) {
        const episode = usaComic(q, lang)
        expect(episode.id).toBe(q.id)
        expect(episode.question).toBe(lang === 'es' ? q.es?.question ?? q.question : q.question)
        expect(episode.answer).toBe(lang === 'es' ? q.es?.answers[q.correct] ?? q.answers[q.correct] : q.answers[q.correct])
        expect(episode.evidence.length).toBeGreaterThan(0)
        expect(episode.source).toContain(q.id)
        expect(episode.figure?.src).toBe(q.figure ? `figures/${q.figure}` : undefined)
      }
    }
  })

  it('adapts all 1094 Spain questions and preserves warnings, notes and diagrams after shuffling', () => {
    const questions = parseSpainQuestions(bundledSpain).questions
    expect(questions).toHaveLength(1094)
    for (const original of questions) {
      const q = shuffleSpainAnswers(original, seededRng(42))
      const episode = spainComic(q)
      expect(episode.answer).toBe(original.answers[original.correct])
      expect(episode.evidence).toBe(q.explanation?.es)
      expect(episode.warning).toBe(q.reviewReason)
      expect(episode.note).toBe(q.note)
      expect(episode.sources).toEqual(q.validation?.sources ?? [])
      expect(episode.license?.label).toBe('BricoHams · CC BY-SA 4.0')
      expect(episode.figure?.src).toBe(q.figure)
      expect(episode.answerFigure?.src).toBe(original.answerFigures?.[original.correct]?.figure)
    }
  })

  it('labels absent explanations rather than inventing a resolution', () => {
    const q = parseSpainQuestions(bundledSpain).questions[0]
    const episode = spainComic({ ...q, explanation: undefined })
    expect(episode.sharedEvidence).toBe(true)
    expect(episode.evidence).toContain('pendiente')
  })
})
