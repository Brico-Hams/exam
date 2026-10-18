import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { AppContext, makeT, type AppContextValue } from '../lib/app'
import { QuestionView } from './QuestionView'
import type { Question } from '../lib/types'
import { UsaQuestionComic } from './QuestionComic'

const q: Question = {
  id: 'T1A01', question: 'Mission?', answers: ['A', 'B', 'C', 'D'], correct: 2,
  refs: '97.1', figure: '', es: { question: '¿Misión?', answers: ['A', 'B', 'C', 'D'] },
}
const state: AppContextValue['state'] = { lang: 'es', content: 'both', stats: {}, exams: [] }
const ctx: AppContextValue = { state, update: () => {}, t: makeT(state) }

describe('Comic answer visibility', () => {
  it('never mounts the comic before an answer is revealed, even when selected in an exam', () => {
    const html = renderToStaticMarkup(<AppContext.Provider value={ctx}>
      <QuestionView q={q} selected={0} />
    </AppContext.Provider>)
    expect(html).not.toContain('question-comic')
    expect(html).not.toContain('Chomp')
  })
  it.each([{ reveal: true }, { onlyCorrect: true }])('makes the comic available after disclosure: %j', (props) => {
    const html = renderToStaticMarkup(<AppContext.Provider value={ctx}>
      <QuestionView q={q} {...props} />
    </AppContext.Provider>)
    expect(html).toContain('Leer cómic')
  })
  it('defers artwork and story markup until the reader opens the episode', () => {
    const html = renderToStaticMarkup(<UsaQuestionComic q={q} content="both" uiLang="en" />)
    expect(html).toContain('Read comic')
    expect(html).not.toContain('<svg')
    expect(html).not.toContain('Mission?')
  })
})
