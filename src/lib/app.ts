import { createContext, useContext, useEffect, useState } from 'react'
import { translate, type MessageKey } from './i18n'
import { loadPool } from './pools'
import type { AppState } from './progress'
import type { LevelId, Pool } from './types'

export interface AppContextValue {
  state: AppState
  update: (fn: (s: AppState) => AppState) => void
  t: (key: MessageKey, vars?: Record<string, string | number>) => string
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppContext')
  return ctx
}

export function makeT(state: AppState): AppContextValue['t'] {
  return (key, vars) => translate(state.lang, key, vars)
}

export function usePool(level: LevelId | undefined): Pool | undefined {
  const [pool, setPool] = useState<Pool>()
  useEffect(() => {
    if (!level) return
    let alive = true
    loadPool(level).then((p) => alive && setPool(p))
    return () => {
      alive = false
    }
  }, [level])
  return pool?.level === level ? pool : undefined
}
