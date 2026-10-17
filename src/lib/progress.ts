import type { ContentMode, Lang, LevelId } from './types'

const KEY = 'hamprep.v1'

export interface QuestionStat {
  seen: number
  correct: number
  /** Whether the most recent attempt was correct. */
  last: boolean
}

export interface ExamRecord {
  level: LevelId
  date: string
  correct: number
  total: number
  passed: boolean
}

export interface AppState {
  lang: Lang
  content: ContentMode
  stats: Record<string, QuestionStat>
  exams: ExamRecord[]
}

const DEFAULT_STATE: AppState = { lang: 'es', content: 'both', stats: {}, exams: [] }

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT_STATE }
    return { ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<AppState>) }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage full or unavailable: progress simply isn't persisted */
  }
}

export function recordAnswer(state: AppState, id: string, isCorrect: boolean): AppState {
  const prev = state.stats[id] ?? { seen: 0, correct: 0, last: false }
  return {
    ...state,
    stats: {
      ...state.stats,
      [id]: { seen: prev.seen + 1, correct: prev.correct + (isCorrect ? 1 : 0), last: isCorrect },
    },
  }
}

/** A question is "mastered" when its last answer was correct and accuracy ≥ 75%. */
export function isMastered(stat: QuestionStat | undefined): boolean {
  return !!stat && stat.last && stat.correct / stat.seen >= 0.75
}

export function isWeak(stat: QuestionStat | undefined): boolean {
  return !!stat && !isMastered(stat)
}
