import { useApp } from '../lib/app'
import { LETTERS } from '../lib/exam'
import type { Question } from '../lib/types'
import { Explanation } from './Explanation'

interface Props {
  q: Question
  selected?: number
  /** Reveal the correct answer (and mark a wrong selection). */
  reveal?: boolean
  onSelect?: (index: number) => void
  onlyCorrect?: boolean
}

function figureUrl(name: string) {
  return `${import.meta.env.BASE_URL}figures/${name}`
}

export function QuestionView({ q, selected, reveal, onSelect, onlyCorrect }: Props) {
  const { state, t } = useApp()
  const mode = state.content
  const es = q.es
  const primaryIsEs = mode === 'es' && !!es
  const showSecondary = mode === 'both' && !!es

  const answerIdx = onlyCorrect ? [q.correct] : q.answers.map((_, i) => i)

  return (
    <div className="question">
      <div className="question-meta">
        <span className="qid">{q.id}</span>
        {q.refs && <span className="refs">{q.refs}</span>}
        {mode !== 'en' && q.esSource && (
          <span className={`source ${q.esSource}`}>{t(q.esSource === 'glaarg' ? 'sourceGlaarg' : 'sourceApp')}</span>
        )}
      </div>
      <p className="question-text">{primaryIsEs ? es.question : q.question}</p>
      {showSecondary && <p className="question-alt">{es.question}</p>}
      {mode !== 'en' && !es && <p className="hint">{t('noTranslation')}</p>}
      {q.figure && (
        <figure className="figure">
          <img src={figureUrl(q.figure)} alt={`${t('figure')} ${q.figure}`} loading="lazy" />
        </figure>
      )}
      <ol className="answers">
        {answerIdx.map((i) => {
          const classes = ['answer']
          if (reveal && i === q.correct) classes.push('is-correct')
          if (reveal && selected === i && i !== q.correct) classes.push('is-wrong')
          if (!reveal && selected === i) classes.push('is-selected')
          if (onlyCorrect) classes.push('is-correct')
          const content = (
            <>
              <span className="letter">{LETTERS[i]}</span>
              <span className="answer-body">
                <span>{primaryIsEs ? es.answers[i] : q.answers[i]}</span>
                {showSecondary && <span className="answer-alt">{es.answers[i]}</span>}
              </span>
            </>
          )
          return (
            <li key={i}>
              {onSelect ? (
                <button type="button" className={classes.join(' ')} onClick={() => onSelect(i)} disabled={reveal}>
                  {content}
                </button>
              ) : (
                <div className={classes.join(' ')}>{content}</div>
              )}
            </li>
          )
        })}
      </ol>
      {(reveal || onlyCorrect) && <Explanation q={q} />}
    </div>
  )
}
