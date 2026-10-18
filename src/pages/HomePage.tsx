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
  const { state } = useApp()
  const es = state.lang === 'es'
  return (
    <main className="page">
      <h1>{es ? 'Elige dónde quieres examinarte' : 'Choose your exam country'}</h1>
      <p className="subtitle">{es
        ? 'Selecciona el país para acceder a sus exámenes, práctica y flashcards.'
        : 'Select a country to access its exams, practice and flashcards.'}</p>
      <div className="grid country-grid">
        <Link to="/usa" className="card level-card country-card">
          <span className="country-code" aria-hidden="true">US</span>
          <h2>{es ? 'Estados Unidos' : 'United States'}</h2>
          <p className="muted">FCC · NCVEC</p>
          <p>Technician · General · Amateur Extra</p>
          <p>{es ? 'Bancos completos en español e inglés.' : 'Complete question pools in Spanish and English.'}</p>
          <span className="country-action">{es ? 'Entrar a Estados Unidos' : 'Open United States'} →</span>
        </Link>
        <Link to="/spain" className="card level-card country-card country-spain">
          <span className="country-code" aria-hidden="true">ES</span>
          <h2>{es ? 'España' : 'Spain'}</h2>
          <p className="muted">{es ? 'Radioaficionado · HAREC' : 'Amateur radio · HAREC'}</p>
          <p>{es ? 'Electricidad y radioelectricidad · Reglamentación' : 'Electricity and radio engineering · Regulations'}</p>
          <p>{es ? 'Banco BricoHams en español con explicaciones e ilustraciones.' : 'BricoHams question bank in Spanish with explanations and illustrations.'}</p>
          <span className="country-action">{es ? 'Entrar a España' : 'Open Spain'} →</span>
        </Link>
      </div>
    </main>
  )
}

export function UsaPage() {
  const { state, update, t } = useApp()
  const recent = state.exams.slice(-5).reverse()
  return (
    <main className="page">
      <Link to="/" className="back">← {state.lang === 'es' ? 'Elegir país' : 'Choose country'}</Link>
      <h1>{state.lang === 'es' ? 'Estados Unidos — FCC' : 'United States — FCC'}</h1>
      <p className="subtitle">{state.lang === 'es' ? 'Technician · General · Amateur Extra — bancos oficiales NCVEC' : 'Technician · General · Amateur Extra — official NCVEC pools'}</p>
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
