import { useApp } from '../lib/app'
import { explanationFor } from '../lib/explanations'
import type { Question } from '../lib/types'

export function Explanation({ q }: { q: Question }) {
  const { state } = useApp()
  const info = explanationFor(q)
  const es = state.lang === 'es'
  return <details className="explanation" key={q.id}>
    <summary>{es ? 'Explicación y fundamentos · ES / EN' : 'Explanation and principles · ES / EN'}</summary>
    <section lang="es">
      <h3>Español</h3>
      <p><strong>Respuesta correcta:</strong> {q.es?.answers[q.correct] ?? q.answers[q.correct]}</p>
      {info.specific && <p>{info.specific.es}</p>}
      {info.principle && <>
        <h4>{info.principle.title.es} — guía del tema</h4>
        <p>{info.principle.text.es}</p>
      </>}
      {!info.specific && <p className="hint">La explicación individual de esta pregunta está pendiente de revisión. La respuesta y las referencias proceden del banco; la guía del tema no es una resolución paso a paso.</p>}
    </section>
    <section lang="en">
      <h3>English</h3>
      <p><strong>Correct answer:</strong> {q.answers[q.correct]}</p>
      {info.specific && <p>{info.specific.en}</p>}
      {info.principle && <>
        <h4>{info.principle.title.en} — topic guide</h4>
        <p>{info.principle.text.en}</p>
      </>}
      {!info.specific && <p className="hint">The individual explanation for this question is pending review. The answer and references come from the pool; the topic guide is not a step-by-step solution.</p>}
    </section>
    {info.regulations.length > 0 && <div>
      <h3>{es ? 'Normativa federal citada por el banco' : 'Federal rules cited by the pool'}</h3>
      <p>{q.refs}</p>
      <ul>{info.regulations.map(({ section, url }) => <li key={section}>
        <a href={url} target="_blank" rel="noreferrer">47 CFR §{section} — eCFR (English)</a>
      </li>)}</ul>
      <p className="hint">{es
        ? 'Consulta el apartado concreto indicado arriba. El eCFR muestra la norma actual, que puede diferir de la edición del banco. La guía en español no es una traducción legal oficial.'
        : 'Check the specific subsection cited above. The eCFR shows the current rule, which may differ from the pool edition. The Spanish guide is not an official legal translation.'}</p>
    </div>}
  </details>
}
