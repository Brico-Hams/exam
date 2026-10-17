import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ContentToggle } from '../components/ContentToggle'
import { QuestionView } from '../components/QuestionView'
import { useApp, usePool } from '../lib/app'
import { shuffle } from '../lib/exam'
import { getLevel } from '../lib/levels'
import { recordAnswer } from '../lib/progress'
import { filterByGroups, parseGroups, selectionTitle } from '../lib/selection'
import { NotFound } from './NotFound'

export function StudyPage() {
  const { levelId } = useParams()
  const [params] = useSearchParams()
  const level = getLevel(levelId)
  const pool = usePool(level?.id)
  const { state, update, t } = useApp()
  const groups = parseGroups(params)
  const groupsKey = groups?.join(',') ?? ''
  const listView = params.get('view') === 'list'
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [shuffleSeed, setShuffleSeed] = useState(0)

  const questions = useMemo(() => {
    const list = pool ? filterByGroups(pool.questions, groups) : []
    return shuffleSeed ? shuffle(list) : list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, groupsKey, shuffleSeed])

  if (!level) return <NotFound />
  if (!pool) return <main className="page">{t('loading')}</main>
  if (!questions.length) return <NotFound />

  const title = selectionTitle(groups, state.lang, t('allSubelements'))
  const back = <Link to={`/level/${level.id}`} className="back">← {level.name[state.lang]}</Link>

  if (listView) {
    return (
      <main className="page">
        {back}
        <h1>{t('onlyCorrect')}</h1>
        <p className="muted">{title} · {t('questionsN', { n: questions.length })}</p>
        <ContentToggle />
        {questions.map((q) => (
          <div className="card" key={q.id}>
            <QuestionView q={q} onlyCorrect />
          </div>
        ))}
      </main>
    )
  }

  const q = questions[Math.min(index, questions.length - 1)]
  const go = (delta: number) => {
    setRevealed(false)
    setIndex((i) => (i + delta + questions.length) % questions.length)
  }
  const mark = (knew: boolean) => {
    update((s) => recordAnswer(s, q.id, knew))
    go(1)
  }

  return (
    <main className="page">
      {back}
      <h1>{t('flashcards')}</h1>
      <p className="muted">
        {title} · {t('questionN', { i: index + 1, n: questions.length })}
      </p>
      <div className="toolbar">
        <ContentToggle />
        <button
          type="button"
          className="btn small"
          onClick={() => {
            setShuffleSeed((s) => (s ? 0 : Date.now()))
            setIndex(0)
            setRevealed(false)
          }}
        >
          {shuffleSeed ? `🔢 ${t('inOrder')}` : `🔀 ${t('shuffle')}`}
        </button>
      </div>
      <div className="card flashcard">
        <QuestionView q={q} reveal={revealed} />
      </div>
      <div className="actions">
        <button type="button" className="btn" onClick={() => go(-1)}>← {t('previous')}</button>
        {!revealed ? (
          <button type="button" className="btn primary" onClick={() => setRevealed(true)}>
            {t('showAnswer')}
          </button>
        ) : (
          <>
            <button type="button" className="btn ok" onClick={() => mark(true)}>✔ {t('knewIt')}</button>
            <button type="button" className="btn bad" onClick={() => mark(false)}>✘ {t('didntKnow')}</button>
          </>
        )}
        <button type="button" className="btn" onClick={() => go(1)}>{t('next')} →</button>
      </div>
    </main>
  )
}
