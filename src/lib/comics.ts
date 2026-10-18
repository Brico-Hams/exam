import { explanationFor } from './explanations'
import type { SpainQuestion } from './spain'
import type { Lang, Question } from './types'

export interface ComicEpisode {
  id: string
  lang: Lang
  question: string
  answer: string
  evidence: string
  sharedEvidence: boolean
  regulations: boolean
  source: string
  sources: { label: string; url: string }[]
  license?: { label: string; url: string }
  warning?: string
  note?: string
  figure?: { src: string; alt: string }
  answerFigure?: { src: string; alt: string }
}

export function usaComic(q: Question, lang: Lang): ComicEpisode {
  const info = explanationFor(q)
  const translated = lang === 'es' ? q.es : undefined
  return {
    id: q.id, lang,
    question: translated?.question ?? q.question,
    answer: translated?.answers[q.correct] ?? q.answers[q.correct],
    evidence: info.specific?.[lang] ?? info.principle?.text[lang] ?? (lang === 'es'
      ? 'Consulta la respuesta del banco y sus referencias; no hay una explicación individual disponible.'
      : 'Check the pool answer and its references; no individual explanation is available.'),
    sharedEvidence: !info.specific,
    regulations: info.regulations.length > 0,
    source: `NCVEC · ${q.id}${q.refs ? ` · ${q.refs}` : ''}`,
    sources: info.regulations.map(({ section, url }) => ({ label: `47 CFR §${section}`, url })),
    figure: q.figure ? { src: `figures/${q.figure}`, alt: q.figure } : undefined,
  }
}

export function spainComic(q: SpainQuestion): ComicEpisode {
  const answerFigure = q.answerFigures?.[q.correct]
  return {
    id: q.id, lang: 'es', question: q.question, answer: q.answers[q.correct],
    evidence: q.explanation?.es ?? 'Explicación pendiente en el banco; consulta la respuesta y la fuente indicadas.',
    sharedEvidence: !q.explanation,
    regulations: q.part === 'regulations',
    source: q.source,
    sources: q.validation?.sources ?? [],
    license: q.source.includes('BricoHams · CC BY-SA 4.0') ? {
      label: 'BricoHams · CC BY-SA 4.0',
      url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    } : undefined,
    warning: q.reviewReason,
    note: q.note,
    figure: q.figure ? { src: q.figure, alt: q.figureAlt ?? q.id } : undefined,
    answerFigure: answerFigure ? { src: answerFigure.figure, alt: answerFigure.figureAlt } : undefined,
  }
}
