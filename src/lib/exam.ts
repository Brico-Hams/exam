import { groupBy, groupOf } from './pools'
import type { Question } from './types'

export type Rng = () => number

/** Deterministic PRNG (mulberry32) so tests/exams can be reproduced from a seed. */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(items: T[], rng: Rng = Math.random): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Builds a practice exam the same way VEs do: one question drawn from each
 * question group (e.g. T1A, T1B …), in pool order.
 */
export function generateExam(questions: Question[], rng: Rng = Math.random): Question[] {
  const groups = groupBy(questions, (q) => groupOf(q.id))
  return [...groups.keys()].sort(compareIds).map((g) => {
    const list = groups.get(g)!
    return list[Math.floor(rng() * list.length)]
  })
}

/** Sorts ids so sub-element 0 (safety) comes last, as in the official pools. */
export function compareIds(a: string, b: string): number {
  const key = (s: string) => s.slice(0, 1) + (s[1] === '0' ? 'Z' : s[1]) + s.slice(2)
  return key(a).localeCompare(key(b))
}

export interface ExamResult {
  total: number
  correct: number
  passed: boolean
  wrong: Question[]
}

export function scoreExam(
  questions: Question[],
  answers: Record<string, number | undefined>,
  passing: number,
): ExamResult {
  const wrong = questions.filter((q) => answers[q.id] !== q.correct)
  const correct = questions.length - wrong.length
  return { total: questions.length, correct, passed: correct >= passing, wrong }
}

export const LETTERS = ['A', 'B', 'C', 'D']
