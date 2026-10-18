import type { LevelId, Pool, Question, Translation } from './types'
import technician from '../data/pools/technician.json'
import general from '../data/pools/general.json'
import extra from '../data/pools/extra.json'
import esTechnician from '../data/i18n/es/technician.json'
import esGeneral from '../data/i18n/es/general.json'
import esExtra from '../data/i18n/es/extra.json'

const pools: Record<LevelId, Pool> = {
  technician: technician as Pool,
  general: general as Pool,
  extra: extra as Pool,
}

const translations: Record<LevelId, Record<string, Translation>> = {
  technician: esTechnician,
  general: esGeneral,
  extra: esExtra,
}

// Spanish banks from GLAARG PR, generated locally by `npm run import-glaarg` (optional, not committed).
const glaargLoaders = import.meta.env.MODE === 'public' ? {} : import.meta.glob<Record<string, Translation>>('../data/i18n/es-glaarg/*.json', {
  import: 'default',
  eager: true,
})

function loadGlaarg(level: LevelId): Record<string, Translation> {
  return glaargLoaders[`../data/i18n/es-glaarg/${level}.json`] ?? {}
}

const valid = (t: Translation | undefined, q: Question) => !!t && t.answers?.length === q.answers.length

/** GLAARG PR translations take precedence; the app's own translations fill the gaps. */
export function mergeTranslations(
  pool: Pool,
  es: Record<string, Translation>,
  glaarg: Record<string, Translation> = {},
): Pool {
  return {
    ...pool,
    questions: pool.questions.map((q): Question => {
      if (valid(glaarg[q.id], q)) return { ...q, es: glaarg[q.id], esSource: 'glaarg' }
      if (valid(es[q.id], q)) return { ...q, es: es[q.id], esSource: 'app' }
      return q
    }),
  }
}

const cache = new Map<LevelId, Pool>()

export async function loadPool(level: LevelId): Promise<Pool> {
  let p = cache.get(level)
  if (!p) {
    p = mergeTranslations(pools[level], translations[level], loadGlaarg(level))
    cache.set(level, p)
  }
  return p
}

/** "T1A01" -> "T1" */
export const subelementOf = (id: string) => id.slice(0, 2)
/** "T1A01" -> "T1A" */
export const groupOf = (id: string) => id.slice(0, 3)

export function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>()
  for (const item of items) {
    const k = key(item)
    const list = map.get(k)
    if (list) list.push(item)
    else map.set(k, [item])
  }
  return map
}
