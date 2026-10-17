import { Link } from 'react-router-dom'
import { useApp, usePool } from '../lib/app'
import { LEVELS, type LevelInfo } from '../lib/levels'
import { isMastered } from '../lib/progress'

function LevelCard({ level }: { level: LevelInfo }) {
  const { state, t } = useApp()
  const pool = usePool(level.id)
  const total = pool?.questions.length ?? 0
  const mastered = pool ? pool.questions.filter((q) => isMastered(state.stats[q.id])).length : 0
  const translated = pool ? pool.questions.filter((q) => q.es).length : 0
  const pct = total ? Math.round((mastered / total) * 100) : 0
  return (
    <Link to={`/level/${level.id}`} className={`card level-card level-${level.id}`}>
      <h2>{level.name[state.lang]}</h2>
      <p className="muted">
        {t('element')} {level.element} · {t('validity')}: {level.validFrom} → {level.validTo}
      </p>
      <p>{t('examStructure', { n: level.examQuestions, p: level.passing })}</p>
      {pool && (
        <>
          <p className="muted">
            {t('questionsInPool', { n: total })} · {t('translated', { n: translated })}
          </p>
          <div className="progress" aria-label={t('mastered')}>
            <div style={{ width: `${pct}%` }} />
          </div>
          <p className="muted">
            {t('mastered')}: {mastered}/{total} ({pct}%)
          </p>
        </>
      )}
    </Link>
  )
}

export function HomePage() {
  const { state, update, t } = useApp()
  const recent = state.exams.slice(-5).reverse()
  return (
    <main className="page">
      <p className="subtitle">{t('subtitle')}</p>
      <div className="grid">
        {LEVELS.map((l) => (
          <LevelCard key={l.id} level={l} />
        ))}
      </div>
      {recent.length > 0 && (
        <section className="card">
          <h3>{t('lastExams')}</h3>
          <ul className="plain">
            {recent.map((e, i) => (
              <li key={i}>
                <span className={e.passed ? 'ok' : 'bad'}>{e.passed ? '✔' : '✘'}</span>{' '}
                {LEVELS.find((l) => l.id === e.level)?.name[state.lang]} — {e.correct}/{e.total} ·{' '}
                {new Date(e.date).toLocaleString(state.lang)}
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="disclaimer">{t('disclaimer')}</p>
      <button
        type="button"
        className="btn link"
        onClick={() => {
          if (confirm(t('resetConfirm'))) update((s) => ({ ...s, stats: {}, exams: [] }))
        }}
      >
        {t('resetProgress')}
      </button>
    </main>
  )
}
