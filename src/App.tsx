import { useEffect, useMemo, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { AppContext, makeT, type AppContextValue } from './lib/app'
import { loadState, saveState, type AppState } from './lib/progress'
import { ExamPage } from './pages/ExamPage'
import { HomePage } from './pages/HomePage'
import { LevelPage } from './pages/LevelPage'
import { NotFound } from './pages/NotFound'
import { PracticePage } from './pages/PracticePage'
import { ReferencesPage } from './pages/ReferencesPage'
import { StudyPage } from './pages/StudyPage'
import { SpainPage } from './pages/SpainPage'

export default function App() {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    saveState(state)
    document.documentElement.lang = state.lang
  }, [state])

  const ctx = useMemo<AppContextValue>(
    () => ({ state, update: (fn) => setState(fn), t: makeT(state) }),
    [state],
  )

  return (
    <AppContext.Provider value={ctx}>
      {/* HashRouter works both on static web hosting and inside the Capacitor WebView. */}
      <HashRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/references" element={<ReferencesPage />} />
          <Route path="/spain" element={<SpainPage />} />
          <Route path="/level/:levelId" element={<LevelPage />} />
          <Route path="/level/:levelId/study" element={<StudyPage />} />
          <Route path="/level/:levelId/practice" element={<PracticePage />} />
          <Route path="/level/:levelId/exam" element={<ExamPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </HashRouter>
    </AppContext.Provider>
  )
}
