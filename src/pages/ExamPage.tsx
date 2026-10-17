import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ContentToggle } from '../components/ContentToggle'
import { QuestionView } from '../components/QuestionView'
import { useApp, usePool } from '../lib/app'
import { generateExam, scoreExam, shuffle, type ExamResult } from '../lib/exam'
import { getLevel } from '../lib/levels'
import { recordAnswer } from '../lib/progress'
import { filterByGroups, parseGroups, passingFor, selectionTitle, type ExamMode } from '../lib/selection'
import { NotFound } from './NotFound'

export function ExamPage() {
  const { levelId } = useParams()
  const [params] = useSearchParams()
  const level = getLevel(levelId)
  const pool = usePool(level?.id)
  const { state, update, t } = useApp()
  const [attempt, setAttempt] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [index, setIndex] = useState(0)
  const [result, setResult] = useState<ExamResult>()
  const rawMode = params.get('mode')
  const mode: ExamMode = rawMode === 'groups' || rawMode === 'all' ? rawMode : 'official'
  const groups = mode === 'official' ? null : parseGroups(params)
  const groupsKey = groups?.join(',') ?? ''

  const exam = useMemo(() => {
    if (!pool) return []
    const scope = filterByGroups(pool.questions, groups)
    return mode === 'all' ? shuffle(scope) : generateExam(scope)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, mode, groupsKey, attempt])

  if (!level) return <NotFound />
  if (!pool) return <main className="page">{t('loading')}</main>
  if (!exam.length) return <NotFound />

  const passing = mode === 'official' ? level.passing : passingFor(exam.length)
  const modeTitle = t(mode === 'official' ? 'examOfficial' : mode === 'groups' ? 'examGroups' : 'examAll')
  const back = <Link to={`/level/${level.id}`} className="back">← {level.name[state.lang]}</Link>

  const restart = () => {
    setAttempt((a) => a + 1)
    setAnswers({})
    setIndex(0)
    setResult(undefined)
  }

  const finish = () => {
    const missing = exam.filter((q) => answers[q.id] === undefined).length
    if (missing && !confirm(t('unanswered', { n: missing }))) return
    const r = scoreExam(exam, answers, passing)
    setResult(r)
    update((s) => {
      let next = s
      for (const q of exam) next = recordAnswer(next, q.id, answers[q.id] === q.correct)
      return {
        ...next,
        exams: [
          ...next.exams,
          { level: level.id, date: new Date().toISOString(), correct: r.correct, total: r.total, passed: r.passed },
        ].slice(-50),
      }
    })
    window.scrollTo(0, 0)
  }

  if (result) {
    return (
      <main className="page">
        {back}
        <h1 className={result.passed ? 'ok' : 'bad'}>{result.passed ? t('passed') : t('failed')}</h1>
        <p className="big">{t('score', { c: result.correct, t: result.total, p: passing })}</p>
        <p className="muted">{modeTitle}</p>
        <ContentToggle />
        <button type="button" className="btn primary" onClick={restart}>{t('newExam')}</button>
        {result.wrong.length > 0 && (
          <>
            <h2>{t('reviewWrong')} ({result.wrong.length})</h2>
            {result.wrong.map((q) => (
              <div className="card" key={q.id}>
                <QuestionView q={q} selected={answers[q.id]} reveal />
              </div>
            ))}
          </>
        )}
      </main>
    )
  }

  const q = exam[index]
  const answeredCount = Object.keys(answers).length

  return (
    <main className="page">
      {back}
      <h1>{modeTitle} — {level.name[state.lang]}</h1>
      <p className="muted">
        {mode !== 'official' && <>{selectionTitle(groups, state.lang, t('allSubelements'))} · </>}
        {t('questionN', { i: index + 1, n: exam.length })} · {answeredCount}/{exam.length} ·{' '}
        {t('examStructure', { n: exam.length, p: passing })}
      </p>
      <ContentToggle />
      <div className="exam-grid">
        {exam.map((eq, i) => (
          <button
            type="button"
            key={eq.id}
            className={[
              'cell',
              i === index ? 'current' : '',
              answers[eq.id] !== undefined ? 'answered' : '',
            ].join(' ')}
            onClick={() => setIndex(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="card">
        <QuestionView q={q} selected={answers[q.id]} onSelect={(i) => setAnswers((a) => ({ ...a, [q.id]: i }))} />
      </div>
      <div className="actions">
        <button type="button" className="btn" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
          ← {t('previous')}
        </button>
        {index < exam.length - 1 && (
          <button type="button" className="btn" onClick={() => setIndex((i) => i + 1)}>
            {t('next')} →
          </button>
        )}
        <button type="button" className="btn primary" onClick={finish}>{t('finish')}</button>
      </div>
    </main>
  )
}
