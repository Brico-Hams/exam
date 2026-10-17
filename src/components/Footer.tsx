import { useApp } from '../lib/app'

export const AUTHOR = 'Anatol EA5KAO'
export const REPO_URL = 'https://github.com/anatolbricoham/exam'
const YEAR = new Date().getFullYear()

export function Footer() {
  const { t } = useApp()
  return (
    <footer className="footer">
      <span>
        © {YEAR} <strong>{AUTHOR}</strong> · {t('madeBy')}
      </span>
      <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a>
    </footer>
  )
}
