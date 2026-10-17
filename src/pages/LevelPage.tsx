import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ContentToggle } from '../components/ContentToggle'
import { useApp, usePool } from '../lib/app'
import { compareIds } from '../lib/exam'
import { getLevel, subelementTitle } from '../lib/levels'
import { groupBy, groupOf, subelementOf } from '../lib/pools'
import { isMastered, isWeak } from '../lib/progress'
import { filterByGroups, groupsQuery, passingFor } from '../lib/selection'
import type { LevelId } from '../lib/types'
import { NotFound } from './NotFound'

const selKey = (level: LevelId) => `hamprep.selection.${level}`

function loadSelection(level: LevelId): string[] | null {
  try {
    const raw = localStorage.getItem(selKey(level))
    return raw ? (JSON.parse(raw) as string[]) : null
  } catch {
    return null
  }
}

export function LevelPage() {
  const { levelId } = useParams()
  const level = getLevel(levelId)
  if (!level) return <NotFound />
  return <LevelContent key={level.id} levelId={level.id} />
}

function LevelContent({ levelId }: { levelId: LevelId }) {
  const level = getLevel(levelId)!
  const pool = usePool(levelId)
  const { state, t } = useApp()
  const [saved, setSaved] = useState<string[] | null>(() => loadSelection(levelId))

  const structure = useMemo(() => {
    if (!pool) return null
    const subs = groupBy(pool.questions, (q) => subelementOf(q.id))
    const groups = groupBy(pool.questions, (q) => groupOf(q.id))
    const allGroups = [...groups.keys()].sort(compareIds)
    return { subs, groups, allGroups }
  }, [pool])

  if (!pool || !structure) return <main className="page">{t('loading')}</main>

  const { subs, groups, allGroups } = structure
  const selected = (saved ?? allGroups).filter((g) => groups.has(g))
  const selectedSet = new Set(selected)
  const setSelection = (next: string[]) => {
    const sorted = [...new Set(next)].sort(compareIds)
    setSaved(sorted)
    localStorage.setItem(selKey(levelId), JSON.stringify(sorted))
  }
  const toggle = (ids: string[], on: boolean) =>
    setSelection(on ? [...selected, ...ids] : selected.filter((g) => !ids.includes(g)))

  const selectedQuestions = filterByGroups(pool.questions, selected)
  const weakCount = selectedQuestions.filter((q) => isWeak(state.stats[q.id])).length
  const esCounts = {
    g: pool.questions.filter((q) => q.esSource === 'glaarg').length,
    a: pool.questions.filter((q) => q.esSource === 'app').length,
  }
  const base = `/level/${level.id}`
  const qs = groupsQuery(selected, allGroups)
  const withQs = (path: string, extra = '') => {
    const parts = [qs, extra].filter(Boolean).join('&')
    return parts ? `${path}?${parts}` : path
  }
  const none = selected.length === 0
  const dis = none ? 'disabled' : ''

  return (
    <main className="page">
      <Link to="/" className="back">← {t('back')}</Link>
      <h1>{level.name[state.lang]}</h1>
      <p className="muted">
        {t('element')} {level.element} · {t('validity')}: {level.validFrom} → {level.validTo} ·{' '}
        {t('questionsInPool', { n: pool.questions.length })} · {t('examStructure', { n: level.examQuestions, p: level.passing })}
      </p>
      <p className="muted small">{t('esSources', esCounts)}</p>
      <ContentToggle />

      <section className="panel">
        <h2>{t('examSection')}</h2>
        <div className="exam-options">
          <Link className="exam-option primary" to={`${base}/exam?mode=official`}>
            <strong>📝 {t('examOfficial')}</strong>
            <span>{t('examOfficialDesc', { n: allGroups.length, p: level.passing })}</span>
          </Link>
          <Link className={`exam-option ${dis}`} to={withQs(`${base}/exam`, 'mode=groups')}>
            <strong>🧩 {t('examGroups')}</strong>
            <span>{t('examGroupsDesc', { n: selected.length, p: passingFor(selected.length) })}</span>
          </Link>
          <Link className={`exam-option ${dis}`} to={withQs(`${base}/exam`, 'mode=all')}>
            <strong>📚 {t('examAll')}</strong>
            <span>{t('examAllDesc', { n: selectedQuestions.length, p: passingFor(selectedQuestions.length) })}</span>
          </Link>
        </div>
      </section>

      <section className="panel">
        <h2>{t('studySection')}</h2>
        <div className="actions">
          <Link className={`btn primary ${dis}`} to={withQs(`${base}/practice`)}>🎯 {t('practice')}</Link>
          <Link className={`btn ${dis}`} to={withQs(`${base}/study`)}>🃏 {t('flashcards')}</Link>
          <Link className={`btn ${dis}`} to={withQs(`${base}/study`, 'view=list')}>📖 {t('onlyCorrect')}</Link>
          <Link className={`btn ${weakCount ? '' : 'disabled'}`} to={withQs(`${base}/practice`, 'weak=1')}>
            🔁 {t('weak')} ({weakCount})
          </Link>
        </div>
      </section>

      <section className="panel">
        <h2>{t('selectGroups')}</h2>
        <div className="selection-bar">
          <span className="muted">
            {t('selectionInfo', { g: selected.length, tg: allGroups.length, n: selectedQuestions.length })}
          </span>
          <button type="button" className="btn small" onClick={() => setSelection(allGroups)}>
            ✅ {t('selectAll')}
          </button>
          <button type="button" className="btn small" onClick={() => setSelection([])}>
            ⬜ {t('selectNone')}
          </button>
        </div>
        {none && <p className="hint">{t('nothingSelected')}</p>}

        <div className="sub-list">
          {[...subs.keys()].sort(compareIds).map((sub) => {
            const subQs = subs.get(sub)!
            const subGroups = allGroups.filter((g) => g.startsWith(sub))
            const onCount = subGroups.filter((g) => selectedSet.has(g)).length
            const m = subQs.filter((q) => isMastered(state.stats[q.id])).length
            const pct = Math.round((m / subQs.length) * 100)
            return (
              <details className="sub" key={sub}>
                <summary>
                  <input
                    type="checkbox"
                    aria-label={sub}
                    checked={onCount === subGroups.length}
                    ref={(el) => {
                      if (el) el.indeterminate = onCount > 0 && onCount < subGroups.length
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => toggle(subGroups, e.target.checked)}
                  />
                  <span className="sub-title">
                    <strong>{sub}</strong> {subelementTitle(sub, state.lang)}
                    <span className="muted small">
                      {' '}· {onCount}/{subGroups.length} · {t('mastered')} {m}/{subQs.length}
                    </span>
                    <span className="progress small"><span style={{ width: `${pct}%` }} /></span>
                  </span>
                </summary>
                <div className="group-grid">
                  {subGroups.map((g) => (
                    <label key={g} className="group-item">
                      <input
                        type="checkbox"
                        checked={selectedSet.has(g)}
                        onChange={(e) => toggle([g], e.target.checked)}
                      />
                      <strong>{g}</strong>
                      <span className="muted small">{t('questionsN', { n: groups.get(g)!.length })}</span>
                      <Link to={`${base}/study?groups=${g}`} className="small">🃏</Link>
                      <Link to={`${base}/practice?groups=${g}`} className="small">🎯</Link>
                    </label>
                  ))}
                </div>
              </details>
            )
          })}
        </div>
      </section>
    </main>
  )
}
