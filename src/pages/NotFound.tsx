import { Link } from 'react-router-dom'
import { useApp } from '../lib/app'

export function NotFound() {
  const { t } = useApp()
  return (
    <main className="page">
      <p>404</p>
      <Link to="/">{t('home')}</Link>
    </main>
  )
}
