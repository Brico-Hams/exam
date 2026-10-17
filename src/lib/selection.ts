import { subelementTitle } from './levels'
import { groupOf } from './pools'
import type { Lang, Question } from './types'

/** Official pass mark ratio: 26/35 (Elements 2 and 3) and 37/50 (Element 4) ≈ 74 %. */
export function passingFor(total: number): number {
  return Math.ceil(total * 0.74)
}

/** Reads `?groups=T1A,T1B` (or the legacy `?sub=T1`). Returns null for "whole pool". */
export function parseGroups(params: URLSearchParams): string[] | null {
  const groups = params.get('groups')
  if (groups) return groups.split(',').filter(Boolean)
  const sub = params.get('sub')
  if (sub && sub !== 'weak') return [sub]
  return null
}

/** Each selector may be a sub-element ("T1") or a group ("T1A"). */
export function filterByGroups(questions: Question[], groups: string[] | null): Question[] {
  if (!groups) return questions
  const set = new Set(groups)
  return questions.filter((q) => set.has(groupOf(q.id)) || set.has(q.id.slice(0, 2)))
}

export function groupsQuery(selected: string[], allGroups: string[]): string {
  return selected.length === allGroups.length ? '' : `groups=${selected.join(',')}`
}

export type ExamMode = 'official' | 'groups' | 'all'

/** Human-readable label for a selection: "T1 — FCC Rules" or "T1A, T1B, T2C". */
export function selectionTitle(groups: string[] | null, lang: Lang, all: string): string {
  if (!groups) return all
  if (groups.length === 1 && groups[0].length === 2) return `${groups[0]} — ${subelementTitle(groups[0], lang)}`
  return groups.length > 8 ? `${groups.slice(0, 8).join(', ')} … (+${groups.length - 8})` : groups.join(', ')
}
