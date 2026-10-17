import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import bundledQuestions from '../data/spain.json'
import { useApp } from '../lib/app'
import { LETTERS } from '../lib/exam'
import {
  generateSpainExam, parseSpainQuestions, scoreSpainExam, SPAIN_PARTS,
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
          <p>Tu respuesta: {item.answers[answers[item.id]] ?? 'Sin responder'}</p>
          <p>Correcta: {item.answers[item.correct]}</p>
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
    {q.figure && <img className="spain-figure" src={`./${q.figure}`} alt={q.figureAlt} />}
    {mode === 'flashcards' ? <>
      <button className="btn" onClick={() => setRevealed((v) => !v)}>{revealed ? 'Ocultar respuesta' : 'Mostrar respuesta'}</button>
      {revealed && <p className="ok">{LETTERS[q.correct]}. {q.answers[q.correct]}</p>}
    </> : <div className="spain-answers">
      {q.answers.map((answer, i) => <button key={i} className={`btn ${selected === i ? 'primary' : ''}`}
        aria-pressed={selected === i} disabled={mode === 'practice' && selected !== undefined}
        onClick={() => {
          if (mode === 'exam' && Date.now() >= deadline) { setSeconds(0); return }
          setAnswers((s) => ({ ...s, [q.id]: i }))
        }}>{LETTERS[i]}. {answer}</button>)}
    </div>}
    {showAnswer && mode === 'practice' && <p role="status" className={selected === q.correct ? 'ok' : 'bad'}>
      {selected === q.correct ? 'Correcto.' : 'Incorrecto.'} Respuesta: {q.answers[q.correct]}
    </p>}
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
      return { questions: parseSpainQuestions(saved === null ? bundledQuestions : JSON.parse(saved)).questions, error: '' }
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
  const allTopics = [...new Set(questions.map((q) => q.topic))].sort()
  const scope = questions.filter((q) => topics.length === 0 || topics.includes(q.topic))
  const start = (mode: SpainMode, parts: SpainPart[]) => {
    setError('')
    try {
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
    {error && <p role="alert" className="bad">{error}</p>}
    {session ? <SpainSession session={session} onExit={() => setSession(null)} /> : <>
      {questions.length === 0 && <section className="card">
        <h2>Banco pendiente de incorporación</h2>
        <p>El módulo está preparado. Importa tus preguntas autorizadas para activar práctica y flashcards. Cada parte necesita al menos 30 preguntas distintas para simular el examen.</p>
      </section>}
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
              <button className="btn primary" disabled={count < 30} onClick={() => start('exam', [part])}>Simular parte</button>
            </div>
          </section>
        })}
      </div>
      <button className="btn primary" disabled={SPAIN_PARTS.some((part) => questions.filter((q) => q.part === part).length < 30)}
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
        <p>Formato e instrucciones de ilustraciones en el README del proyecto. No se descarga ni se copia contenido de terceros.</p>
      </section>
    </>}
  </main>
}
