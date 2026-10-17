import type { LevelId, Pool, Question, Translation } from './types'

type JsonModule<T> = { default: T }

const poolLoaders: Record<LevelId, () => Promise<JsonModule<Pool>>> = {
  technician: () => import('../data/pools/technician.json') as Promise<JsonModule<Pool>>,
  general: () => import('../data/pools/general.json') as Promise<JsonModule<Pool>>,
  extra: () => import('../data/pools/extra.json') as Promise<JsonModule<Pool>>,
}

const esLoaders: Record<LevelId, () => Promise<JsonModule<Record<string, Translation>>>> = {
  technician: () => import('../data/i18n/es/technician.json'),
  general: () => import('../data/i18n/es/general.json'),
  extra: () => import('../data/i18n/es/extra.json'),
}

// Spanish banks from GLAARG PR, generated locally by `npm run import-glaarg` (optional, not committed).
const glaargLoaders = import.meta.glob<Record<string, Translation>>('../data/i18n/es-glaarg/*.json', {
  import: 'default',
})

async function loadGlaarg(level: LevelId): Promise<Record<string, Translation>> {
  const loader = glaargLoaders[`../data/i18n/es-glaarg/${level}.json`]
  return loader ? loader() : {}
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

const cache = new Map<LevelId, Promise<Pool>>()

export function loadPool(level: LevelId): Promise<Pool> {
  let p = cache.get(level)
  if (!p) {
    p = Promise.all([poolLoaders[level](), esLoaders[level](), loadGlaarg(level)]).then(([pool, es, glaarg]) =>
      mergeTranslations(pool.default, es.default, glaarg),
    )
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
