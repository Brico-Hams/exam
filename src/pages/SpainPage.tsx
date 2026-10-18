import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import bundledQuestions from '../data/spain.json'
import importReport from '../data/spain-import-report.json'
import { useApp } from '../lib/app'
import { LETTERS } from '../lib/exam'
import {
  generateSpainExam, mergeSpainQuestions, parseSpainQuestions, scoreSpainExam, SPAIN_PARTS,
  SPAIN_RULES, SPAIN_STORAGE_KEY,
  type SpainMode, type SpainPart, type SpainQuestion,
} from '../lib/spain'

const PART_NAMES = {
  technical: 'Electricidad y radioelectricidad',
  regulations: 'Reglamentación',
}

interface Session {
  mode: SpainMode
  parts: SpainPart[]
  questions: SpainQuestion[][]
}

function SpainFigure({ figure, alt }: { figure: string; alt: string }) {
  return <a href={`./${figure}`} target="_blank" rel="noreferrer" title="Abrir ilustración a tamaño completo">
    <img className="spain-figure" src={`./${figure}`} alt={alt} />
  </a>
}

function SpainAnswer({ q, index, zoom = false }: { q: SpainQuestion; index: number; zoom?: boolean }) {
  const image = q.answerFigures?.[index]
  return <>{LETTERS[index]}. {q.answers[index]}
    {image && (zoom ? <SpainFigure figure={image.figure} alt={image.figureAlt} />
      : <img className="spain-figure" src={`./${image.figure}`} alt={image.figureAlt} />)}
  </>
}

function SpainExplanation({ q }: { q: SpainQuestion }) {
  return <details className="explanation" key={q.id}>
    <summary>Explicación / Explanation · ES / EN</summary>
    {q.explanation ? <>
      <p lang="es">{q.explanation.es}</p>
      <p lang="en">{q.explanation.en}</p>
    </> : <>
      <p lang="es">Este archivo contiene la clave de respuesta, pero no una explicación individual. Pendiente de elaboración y revisión.</p>
      <p lang="en">This file provides the answer key, not an individual explanation. Authoring and review are pending.</p>
    </>}
    <p>Fuente / Source: {q.source}</p>
  </details>
}

function SpainSession({ session, onExit }: { session: Session; onExit: () => void }) {
  const [partIndex, setPartIndex] = useState(0)
  const [scores, setScores] = useState<{ correct: number; passed: boolean }[]>([])
  const [complete, setComplete] = useState(false)
  const next = (result: { correct: number; passed: boolean }) => {
    setScores((s) => [...s, result])
    if (partIndex + 1 < session.parts.length) setPartIndex((i) => i + 1)
    else setComplete(true)
  }
  if (complete) return (
    <section className="card" aria-live="polite">
      <h2>{scores.every((s) => s.passed) ? 'Apto' : 'No apto'}</h2>
      {scores.map((score, i) => <p key={session.parts[i]}>
        {PART_NAMES[session.parts[i]]}: {score.correct}/30 — {score.passed ? 'Apto' : 'No apto'}
      </p>)}
      <p>Es necesario superar cada parte por separado; las notas no se compensan.</p>
      <button className="btn" onClick={onExit}>Volver a España</button>
    </section>
  )
  return <SpainRound key={partIndex} mode={session.mode}
    part={session.parts[partIndex]} questions={session.questions[partIndex]}
    onFinish={next} onExit={onExit} />
}

function SpainRound({ mode, part, questions, onFinish, onExit }: {
  mode: SpainMode
  part: SpainPart
  questions: SpainQuestion[]
  onFinish: (result: { correct: number; passed: boolean }) => void
  onExit: () => void
}) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [revealed, setRevealed] = useState(false)
  const [deadline] = useState(() => Date.now() + SPAIN_RULES.seconds * 1000)
  const [seconds, setSeconds] = useState(SPAIN_RULES.seconds)
  const [submitted, setSubmitted] = useState(false)
  const finished = mode === 'exam' && (submitted || seconds === 0)
  useEffect(() => {
    if (mode !== 'exam' || finished) return
    const id = window.setInterval(() => {
      setSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)))
    }, 250)
    return () => window.clearInterval(id)
  }, [deadline, mode, finished])

  const q = questions[index]
  const selected = answers[q.id]
  const showAnswer = mode !== 'exam' && (revealed || selected !== undefined)
  const navigate = (value: number) => { setIndex(value); setRevealed(false) }

  if (finished) {
    const result = scoreSpainExam(questions, answers)
    return <section className="card">
      <h2>{PART_NAMES[part]} — {result.passed ? 'Apto' : 'No apto'}</h2>
      <p>{seconds === 0 ? 'Tiempo agotado. ' : ''}{result.correct}/30 aciertos. Las preguntas en blanco cuentan como no acertadas.</p>
      <details><summary>Revisar respuestas</summary>
        {questions.map((item) => <div key={item.id}>
          <p><strong>{item.question}</strong></p>
          {item.figure && <SpainFigure figure={item.figure} alt={item.figureAlt ?? ''} />}
          <p>Tu respuesta: {answers[item.id] === undefined ? 'Sin responder' : LETTERS[answers[item.id]]}</p>
          <p>Correcta: {LETTERS[item.correct]}</p>
          {item.answers.map((_, i) => <div className={i === item.correct ? 'ok' : ''} key={i}>
            <SpainAnswer q={item} index={i} zoom />
          </div>)}
          <SpainExplanation q={item} />
        </div>)}
      </details>
      <button className="btn primary" onClick={() => onFinish(result)}>Continuar</button>
    </section>
  }
  return <section className="card">
    <h2>{PART_NAMES[part]}</h2>
    <p>{mode === 'exam' ? 'Simulación' : mode === 'practice' ? 'Práctica' : 'Flashcards'} · {index + 1}/{questions.length}</p>
    {mode === 'exam' && <p role="timer">Tiempo: {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')} · Respondidas: {Object.keys(answers).length}/30</p>}
    <p className="muted">{q.topic} · {q.id}</p>
    <h3>{q.question}</h3>
    {q.historical && <p className="historical-notice">Pregunta histórica: la clave original puede no reflejar la normativa o los criterios actuales.</p>}
    {q.figure && <SpainFigure figure={q.figure} alt={q.figureAlt ?? ''} />}
    {mode === 'flashcards' ? <>
      <button className="btn" onClick={() => setRevealed((v) => !v)}>{revealed ? 'Ocultar respuesta' : 'Mostrar respuesta'}</button>
      {revealed && <div className="ok"><SpainAnswer q={q} index={q.correct} zoom /></div>}
    </> : <div className="spain-answers">
      {q.answers.map((_, i) => <div key={i}><button className={`btn ${selected === i ? 'primary' : ''}`}
        aria-pressed={selected === i} disabled={mode === 'practice' && selected !== undefined}
        onClick={() => {
          if (mode === 'exam' && Date.now() >= deadline) { setSeconds(0); return }
          setAnswers((s) => ({ ...s, [q.id]: i }))
        }}><SpainAnswer q={q} index={i} /></button>
        {q.answerFigures?.[i] && <a className="small" href={`./${q.answerFigures[i].figure}`}
          target="_blank" rel="noreferrer">Ampliar figura {LETTERS[i]}</a>}
      </div>)}
    </div>}
    {showAnswer && mode === 'practice' && <p role="status" className={selected === q.correct ? 'ok' : 'bad'}>
      {selected === q.correct ? 'Correcto.' : 'Incorrecto.'} Respuesta: {LETTERS[q.correct]}. {q.answers[q.correct]}
    </p>}
    {showAnswer && <SpainExplanation q={q} />}
    <p className="muted">Fuente: {q.source}</p>
    <div className="toolbar">
      <button className="btn" disabled={index === 0} onClick={() => navigate(index - 1)}>Anterior</button>
      <button className="btn" disabled={index + 1 === questions.length} onClick={() => navigate(index + 1)}>Siguiente</button>
      {mode === 'exam' && <button className="btn primary" onClick={() => {
        if (confirm('¿Entregar esta parte? Las preguntas sin responder cuentan como no acertadas.')) setSubmitted(true)
      }}>Entregar parte</button>}
      <button className="btn" onClick={() => {
        if (mode !== 'exam' || confirm('¿Abandonar la simulación sin guardar el resultado?')) onExit()
      }}>Salir</button>
    </div>
  </section>
}

export function SpainPage() {
  const { state } = useApp()
  const [initial] = useState(() => {
    try {
      const saved = localStorage.getItem(SPAIN_STORAGE_KEY)
      return { questions: mergeSpainQuestions(bundledQuestions, saved === null ? [] : JSON.parse(saved)), error: '' }
    } catch (error) {
      return { questions: [], error: `No se pudo cargar el banco: ${error instanceof Error ? error.message : String(error)}` }
    }
  })
  const [questions, setQuestions] = useState<SpainQuestion[]>(initial.questions)
  const [error, setError] = useState(initial.error)
  const [notice, setNotice] = useState('')
  const [session, setSession] = useState<Session | null>(null)
  const [topics, setTopics] = useState<string[]>([])
  const [confirmedRights, setConfirmedRights] = useState(false)
  const [importing, setImporting] = useState(false)
  const [historicalAcknowledged, setHistoricalAcknowledged] = useState(false)
  const hasHistorical = questions.some((q) => q.historical)
  const allTopics = [...new Set(questions.map((q) => q.topic))].sort()
  const scope = questions.filter((q) => topics.length === 0 || topics.includes(q.topic))
  const start = (mode: SpainMode, parts: SpainPart[]) => {
    setError('')
    try {
      if (mode === 'exam' && hasHistorical && !historicalAcknowledged) {
        throw new Error('Confirma primero que entiendes las limitaciones del banco histórico.')
      }
      const lists = parts.map((part) => mode === 'exam'
        ? generateSpainExam(questions, part)
        : scope.filter((q) => q.part === part))
      if (lists.some((list) => list.length === 0)) throw new Error('No hay preguntas en esta selección.')
      setSession({ mode, parts, questions: lists })
    } catch (err) { setError(err instanceof Error ? err.message : String(err)) }
  }

  return <main className="page">
    <Link className="back" to="/">← {state.lang === 'es' ? 'Inicio' : 'Home'}</Link>
    <h1>{state.lang === 'es' ? 'España — Radioaficionado / HAREC' : 'Spain — Amateur radio / HAREC'}</h1>
    <p>Dos partes independientes · 30 preguntas y 45 minutos por parte · Apto con 15 aciertos en cada parte · Los errores no restan.</p>
    <p className="muted">Material de preparación, no banco oficial. Preguntas en español. Las simulaciones usan todo el banco de cada parte, sin filtros temáticos.</p>
    <p><a href="https://www.boe.es/diario_boe/txt.php?id=BOE-A-2014-6461" target="_blank" rel="noreferrer">Procedimiento y criterios oficiales (BOE)</a></p>
    {hasHistorical && <aside className="historical-notice">
      <strong>Banco histórico FEDI-EA, no oficial vigente.</strong>
      <p>Convocatorias de 2007–2011 y bloques antiguos sin fecha. Se conservan las claves del archivo aportado, no se certifica su corrección actual. Reglamentación, potencias, tasas y procedimientos pueden haber cambiado. No uses este material como única preparación ni como instrucciones de seguridad.</p>
      {!session && <label><input type="checkbox" checked={historicalAcknowledged}
        onChange={(e) => setHistoricalAcknowledged(e.target.checked)} /> Entiendo que las simulaciones usan material histórico no validado como vigente.</label>}
    </aside>}
    {error && <p role="alert" className="bad">{error}</p>}
    {session ? <SpainSession session={session} onExit={() => setSession(null)} /> : <>
      {questions.length === 0 && <section className="card">
        <h2>Banco pendiente de incorporación</h2>
        <p>El módulo está preparado. Importa tus preguntas autorizadas para activar práctica y flashcards. Cada parte necesita al menos 30 preguntas distintas para simular el examen.</p>
      </section>}
      <section className="card">
        <h2>Banco incorporado</h2>
        <p>{importReport.inputCount} registros aportados · {importReport.importedCount} preguntas incorporadas · {importReport.duplicateCount} duplicadas omitidas · {importReport.excludedCount} pendientes de revisión.</p>
        <p>{importReport.originalFigures} ilustraciones SVG propias. No se incluyen los JPG de terceros.</p>
        <details><summary>Entradas pendientes y motivos ({importReport.excludedCount})</summary>
          <ul>{importReport.excluded.map((entry) => <li key={entry.id}><strong>{entry.id}</strong>: {entry.reason}</li>)}</ul>
        </details>
      </section>
      <section className="card">
        <h2>Temas de estudio</h2>
        <p>Sin temas marcados se estudia todo el banco. Este filtro solo afecta a práctica y flashcards.</p>
        {allTopics.map((topic) => <label className="spain-topic" key={topic}>
          <input type="checkbox" checked={topics.includes(topic)} onChange={(e) => setTopics((s) =>
            e.target.checked ? [...s, topic] : s.filter((t) => t !== topic))} /> {topic}
        </label>)}
        {topics.length > 0 && <button className="btn" onClick={() => setTopics([])}>Todo el banco</button>}
      </section>
      <div className="grid">
        {SPAIN_PARTS.map((part) => {
          const count = questions.filter((q) => q.part === part).length
          const studyCount = scope.filter((q) => q.part === part).length
          return <section className="card" key={part}>
            <h2>{PART_NAMES[part]}</h2>
            <p>{count} preguntas · {studyCount} seleccionadas para estudio</p>
            <div className="toolbar">
              <button className="btn" disabled={!studyCount} onClick={() => start('practice', [part])}>Práctica</button>
              <button className="btn" disabled={!studyCount} onClick={() => start('flashcards', [part])}>Flashcards</button>
              <button className="btn primary" disabled={count < 30 || (hasHistorical && !historicalAcknowledged)} onClick={() => start('exam', [part])}>Simular parte</button>
            </div>
          </section>
        })}
      </div>
      <button className="btn primary" disabled={(hasHistorical && !historicalAcknowledged) || SPAIN_PARTS.some((part) => questions.filter((q) => q.part === part).length < 30)}
        onClick={() => start('exam', [...SPAIN_PARTS])}>Simular examen completo (dos partes)</button>
      <section className="card">
        <h2>Importar preguntas (JSON)</h2>
        <p>La importación añade preguntas al banco local de este dispositivo. Elimina duplicadas por parte, enunciado y respuesta correcta, aunque cambie el orden de las opciones. Rechaza respuestas contradictorias e identificadores repetidos.</p>
        <label><input type="checkbox" checked={confirmedRights} onChange={(e) => setConfirmedRights(e.target.checked)} /> Confirmo que tengo permiso para utilizar estas preguntas e ilustraciones.</label>
        <p><input aria-label="Archivo de preguntas de España" type="file" accept=".json,application/json" disabled={!confirmedRights || importing}
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            e.target.value = ''
            setImporting(true)
            setError(''); setNotice('')
            try {
              const incoming = JSON.parse(await file.text())
              if (!Array.isArray(incoming)) throw new Error('El archivo debe contener una lista JSON.')
              const result = parseSpainQuestions([...questions, ...incoming])
              localStorage.setItem(SPAIN_STORAGE_KEY, JSON.stringify(result.questions))
              setQuestions(result.questions)
              setNotice(`Banco guardado: ${result.questions.length} preguntas. Duplicadas omitidas: ${result.duplicates}.`)
            } catch (err) { setError(`No se importó el archivo: ${err instanceof Error ? err.message : String(err)}`) }
            finally { setImporting(false) }
          }} /></p>
        {importing && <p role="status">Importando preguntas…</p>}
        {notice && <p role="status">{notice}</p>}
        <p>Formato e instrucciones de ilustraciones en el README del proyecto. La importación de archivos es local: no descarga contenido de otros sitios.</p>
      </section>
    </>}
  </main>
}
