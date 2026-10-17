import { Link } from 'react-router-dom'
import { useApp } from '../lib/app'
import { DATA_SOURCE, OFFICIAL_REFS, PLATFORMS, SPANISH_REFS, type RefLink } from '../lib/references'
import { LEVELS } from '../lib/levels'

function RefList({ title, items }: { title: string; items: RefLink[] }) {
  const { state } = useApp()
  return (
    <section className="card">
      <h2>{title}</h2>
      <ul className="refs-list">
        {items.map((r) => (
          <li key={r.url}>
            <a href={r.url} target="_blank" rel="noopener noreferrer">{r.label}</a>
            <span className="muted"> — {r.note[state.lang]}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ReferencesPage() {
  const { state, t } = useApp()
  return (
    <main className="page">
      <Link to="/" className="back">← {t('home')}</Link>
      <h1>{t('references')}</h1>
      <section className="card">
        <table className="subs">
          <tbody>
            {LEVELS.map((l) => (
              <tr key={l.id}>
                <td><strong>{l.name[state.lang]}</strong> ({t('element')} {l.element})</td>
                <td>{l.validFrom} → {l.validTo}</td>
                <td>{t('examStructure', { n: l.examQuestions, p: l.passing })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <RefList title={t('officialPools')} items={OFFICIAL_REFS} />
      <RefList title={t('spanishRefs')} items={SPANISH_REFS} />
      <RefList title={t('platforms')} items={PLATFORMS} />
      <RefList title={t('dataSource')} items={[DATA_SOURCE]} />
      <p className="disclaimer">{t('disclaimer')}</p>
    </main>
  )
}
