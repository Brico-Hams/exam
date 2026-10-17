export type LevelId = 'technician' | 'general' | 'extra'
export type Lang = 'es' | 'en'
export type ContentMode = 'en' | 'es' | 'both'

export interface Question {
  id: string
  question: string
  answers: string[]
  correct: number
  refs: string
  figure: string
  /** Optional Spanish translation overlay. */
  es?: { question: string; answers: string[] }
  /** Where the Spanish text comes from: GLAARG PR banks or this app's own translation. */
  esSource?: EsSource
}

export type EsSource = 'glaarg' | 'app'

export interface Pool {
  level: LevelId
  element: number
  name: string
  validFrom: string
  validTo: string
  source: string
  questions: Question[]
}

export interface Translation {
  question: string
  answers: string[]
}
