import { useApp } from '../lib/app'
import type { ContentMode } from '../lib/types'

const OPTIONS: { value: ContentMode; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'both', label: 'EN + ES' },
]

/** Quick switch for the language in which questions are shown. */
export function ContentToggle() {
  const { state, update, t } = useApp()
  return (
    <div className="segmented" role="group" aria-label={t('contentLang')}>
      {OPTIONS.map((o) => (
        <button
          type="button"
          key={o.value}
          className={state.content === o.value ? 'active' : ''}
          aria-pressed={state.content === o.value}
          onClick={() => update((s) => ({ ...s, content: o.value }))}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
