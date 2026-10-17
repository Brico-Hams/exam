import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../lib/app'
import type { ContentMode, Lang } from '../lib/types'

export function Header() {
  const { state, update, t } = useApp()
  return (
    <header className="header">
      <Link to="/" className="brand">
        <span className="logo" aria-hidden>📻</span>
        <span className="brand-text">
          <span>{t('appTitle')}</span>
          <small className="callsign">by EA5KAO</small>
        </span>
      </Link>
      <nav className="nav">
        <NavLink to="/" end>{t('home')}</NavLink>
        <NavLink to="/references">{t('references')}</NavLink>
      </nav>
      <div className="toggles">
        <label>
          UI
          <select
            value={state.lang}
            onChange={(e) => update((s) => ({ ...s, lang: e.target.value as Lang }))}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </label>
        <label>
          {t('contentLang')}
          <select
            value={state.content}
            onChange={(e) => update((s) => ({ ...s, content: e.target.value as ContentMode }))}
          >
            <option value="both">{t('bilingual')}</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </label>
      </div>
    </header>
  )
}
