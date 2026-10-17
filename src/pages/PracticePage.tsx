import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ContentToggle } from '../components/ContentToggle'
import { QuestionView } from '../components/QuestionView'
import { useApp, usePool } from '../lib/app'
import { LETTERS, shuffle } from '../lib/exam'
import { getLevel } from '../lib/levels'
import { isWeak, recordAnswer } from '../lib/progress'
import { filterByGroups, parseGroups, selectionTitle } from '../lib/selection'
import { NotFound } from './NotFound'

export function PracticePage() {
  const { levelId } = useParams()
  const [params] = useSearchParams()
  const level = getLevel(levelId)
  const pool = usePool(level?.id)
  const { state, update, t } = useApp()
  const [round, setRound] = useState(0)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number>()
  const [score, setScore] = useState(0)

  // The weak list is captured when the session starts so it doesn't shrink mid-session.
  const groups = parseGroups(params)
  const weakOnly = params.get('weak') === '1' || params.get('sub') === 'weak'
  const groupsKey = groups?.join(',') ?? ''
  const questions = useMemo(() => {
    if (!pool) return []
    const filtered = filterByGroups(pool.questions, groups).filter((q) => !weakOnly || isWeak(state.stats[q.id]))
    return shuffle(filtered)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, groupsKey, weakOnly, round])

  if (!level) return <NotFound />
  if (!pool) return <main className="page">{t('loading')}</main>

  const back = <Link to={`/level/${level.id}`} className="back">← {level.name[state.lang]}</Link>
  const title = [weakOnly ? t('weak') : '', selectionTitle(groups, state.lang, t('allSubelements'))]
    .filter(Boolean)
    .join(' · ')

  if (!questions.length) {
    return (
      <main className="page">
        {back}
        <p>{t('noWeak')}</p>
      </main>
    )
  }

  if (index >= questions.length) {
    return (
      <main className="page">
        {back}
        <h1>{t('done')}</h1>
        <p className="big">{t('sessionScore', { c: score, t: questions.length })}</p>
        <button
          type="button"
          className="btn primary"
          onClick={() => {
            setRound((r) => r + 1)
            setIndex(0)
            setScore(0)
            setSelected(undefined)
          }}
        >
          {t('restart')}
        </button>
      </main>
    )
  }

  const q = questions[index]
  const answered = selected !== undefined

  return (
    <main className="page">
      {back}
      <h1>{t('practice')}</h1>
      <p className="muted">
        {title} · {t('questionN', { i: index + 1, n: questions.length })} · ✔ {score}
      </p>
      <ContentToggle />
      <div className="card">
        <QuestionView
          q={q}
          selected={selected}
          reveal={answered}
          onSelect={(i) => {
            if (answered) return
            setSelected(i)
            const ok = i === q.correct
            if (ok) setScore((s) => s + 1)
            update((s) => recordAnswer(s, q.id, ok))
          }}
        />
        {answered && (
          <p className={selected === q.correct ? 'feedback ok' : 'feedback bad'}>
            {selected === q.correct ? t('correct') : t('incorrect', { a: LETTERS[q.correct] })}
          </p>
        )}
      </div>
      {answered && (
        <div className="actions">
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setSelected(undefined)
              setIndex((i) => i + 1)
            }}
          >
            {t('next')} →
          </button>
        </div>
      )}
    </main>
  )
}
