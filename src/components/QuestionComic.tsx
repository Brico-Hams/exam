import { useState } from 'react'
import type { ComicEpisode } from '../lib/comics'
import { spainComic, usaComic } from '../lib/comics'
import type { ContentMode, Lang, Question } from '../lib/types'
import type { SpainQuestion } from '../lib/spain'

function ComicArt({ chip, regulations }: { chip: boolean; regulations: boolean }) {
  return <svg className="comic-art" viewBox="0 0 320 150" aria-hidden="true">
    <path d="M0 125H320M20 110V35H85V65H145M225 20V48H300V110" fill="none" stroke="#8bb4b9" strokeWidth="4" />
    <circle cx="85" cy="65" r="6" fill="#ffb84d" />
    {regulations ? <g fill="#fff8dd" stroke="#27364b" strokeWidth="3">
      <path d="M240 70V118H290V70ZM250 80H280M250 90H280M250 100H272" />
    </g> : <g fill="none" stroke="#27364b" strokeWidth="3">
      <path d="M250 120V65M235 120H265M240 65H260M228 49Q250 25 272 49M237 57Q250 43 263 57" />
    </g>}
    {chip ? <g stroke="#27364b" strokeWidth="4" strokeLinejoin="round">
      <path d="M115 40V20M140 40V20M165 40V20M115 110V130M140 110V130M165 110V130M100 55H80M100 80H80M180 55H200M180 80H200" />
      <rect x="100" y="35" width="80" height="80" rx="14" fill="#64d8ca" />
      <circle cx="122" cy="65" r="4" fill="#27364b" />
      <circle cx="158" cy="65" r="4" fill="#27364b" />
      <path d="M120 85Q140 104 160 85" fill="none" />
    </g> : <g stroke="#27364b" strokeWidth="3" strokeLinejoin="round">
      <ellipse cx="89" cy="112" rx="22" ry="29" transform="rotate(-35 89 112)" fill="#91633d" />
      <path d="M75 101L101 122M75 114L91 130" />
      <ellipse cx="145" cy="109" rx="42" ry="29" fill="#b77946" />
      <circle cx="114" cy="41" r="14" fill="#b77946" />
      <circle cx="174" cy="41" r="14" fill="#b77946" />
      <ellipse cx="144" cy="69" rx="45" ry="36" fill="#c98c54" />
      <ellipse cx="144" cy="81" rx="25" ry="16" fill="#ffe0b0" />
      <circle cx="127" cy="61" r="4" fill="#27364b" />
      <circle cx="162" cy="61" r="4" fill="#27364b" />
      <path d="M137 77L144 83L151 77Z" fill="#27364b" />
      <path d="M135 89H153V104H135ZM144 89V104" fill="white" />
      <path d="M117 116H171" stroke="#1f5fbf" strokeWidth="9" />
    </g>}
    <text x="312" y="143" textAnchor="end" fill="#344b60" fontSize="10">Chomp &amp; Chip · EA5KAO</text>
  </svg>
}

export function QuestionComic({ episodes, uiLang }: { episodes: ComicEpisode[]; uiLang: Lang }) {
  const [open, setOpen] = useState(false)
  return <details className="question-comic" onToggle={(event) => setOpen(event.currentTarget.open)}>
    <summary>{uiLang === 'es' ? 'Leer cómic · Chomp & Chip' : 'Read comic · Chomp & Chip'}</summary>
    {open && episodes.map((episode) => <ComicStory key={episode.lang} episode={episode} />)}
  </details>
}

function ComicStory({ episode: e }: { episode: ComicEpisode }) {
  const es = e.lang === 'es'
  const panels = [
    { speaker: 'Chomp', title: es ? '1. La misión' : '1. The mission',
      text: es ? (e.regulations ? '¡Una señal llega al archivo de permisos! Antes de actuar, resolvamos este reto.'
        : '¡El taller del silicio necesita nuestra ayuda! Investiguemos antes de tocar el circuito.')
        : (e.regulations ? 'A signal reaches the permit archive! Before acting, let’s solve this challenge.'
          : 'The silicon workshop needs our help! Let’s investigate before touching the circuit.'),
      quote: e.question, figure: e.figure },
    { speaker: 'Chip', title: es ? '2. La pista' : '2. The clue',
      text: es ? 'Abro nuestro cuaderno de estudio. Esta es la pista que debemos analizar:'
        : 'I open our study notebook. Here is the clue we need to examine:',
      quote: e.evidence },
    { speaker: 'Chomp', title: es ? '3. La solución del banco' : '3. The pool solution',
      text: es ? '¡Ya tenemos la respuesta que señala el banco para esta misión!'
        : 'We have the answer identified by the pool for this mission!',
      quote: e.answer, figure: e.answerFigure },
    { speaker: 'Chip', title: es ? '4. Antes de la próxima aventura' : '4. Before the next adventure',
      text: es ? 'Ahora explica con tus palabras cómo se relaciona la pista con la respuesta. ¡Después nos espera otra misión!'
        : 'Now explain in your own words how the clue connects to the answer. Another mission awaits!',
      quote: e.warning ? (es ? `Pendiente de revisión: ${e.warning}` : e.warning)
        : (es ? 'La aventura es ficticia. Estudia las referencias: el cómic no sustituye las normas ni acredita una respuesta oficial.'
          : 'The adventure is fictional. Study the references: the comic does not replace rules or certify an official answer.') },
  ]
  return <article className="comic-story" lang={e.lang} aria-label={`Chomp & Chip · ${e.id} · ${e.lang}`}>
    <header className="comic-brand">
      <strong>Chomp &amp; Chip</strong>
      <span>Los Protectores del Silicio</span>
      <span>Chomp y Chip: Caos en el Circuito</span>
      <small>{es ? 'Episodio' : 'Episode'} {e.id} · {e.lang.toUpperCase()}</small>
    </header>
    <p className="comic-disclaimer">{es
      ? 'Aventura educativa generada con una plantilla y el contenido de esta pregunta. Los dibujos son originales; los textos e ilustraciones del banco conservan su atribución.'
      : 'Educational adventure generated from a template and this question’s content. Character artwork is original; pool text and diagrams retain their attribution.'}</p>
    {e.warning && <p className="spain-warning"><strong>Pendiente de revisión.</strong> {e.warning}</p>}
    <ol className="comic-panels">
      {panels.map((panel, i) => <li className="comic-panel" key={i}>
        <h3>{panel.title}</h3>
        <ComicArt chip={panel.speaker === 'Chip'} regulations={e.regulations} />
        <p className="comic-dialogue"><strong>{panel.speaker}:</strong> {panel.text}</p>
        <blockquote>{panel.quote}</blockquote>
        {i === 1 && e.sharedEvidence && <p className="comic-disclaimer">{es
          ? 'Fundamento compartido o explicación pendiente; no es una resolución individual.'
          : 'Shared foundation or pending explanation; not an individual worked solution.'}</p>}
        {panel.figure && <figure>
          <img src={`${import.meta.env.BASE_URL}${panel.figure.src}`} alt={panel.figure.alt} loading="lazy" />
          <figcaption>{es ? 'Ilustración del banco · no es un dibujo de Chomp & Chip' : 'Pool diagram · not Chomp & Chip artwork'}</figcaption>
        </figure>}
        <span className="comic-watermark">Chomp &amp; Chip · Anatol EA5KAO</span>
      </li>)}
    </ol>
    {e.note && <p><strong>Nota del banco:</strong> {e.note}</p>}
    <p className="comic-disclaimer">{es ? 'Fuente' : 'Source'}: {e.source}</p>
    {e.license && <p className="comic-disclaimer">
      <a href={e.license.url} target="_blank" rel="noreferrer">{e.license.label}</a>
      {' · '}Adaptación educativa en viñetas bajo la misma licencia. La marca de agua identifica la aplicación, no sustituye la atribución del banco.
    </p>}
    {e.sources.length > 0 && <ul className="comic-disclaimer">{e.sources.map((source) => <li key={source.url}>
      <a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
    </li>)}</ul>}
    <footer className="comic-credit">Chomp &amp; Chip · Anatol EA5KAO</footer>
  </article>
}

export function UsaQuestionComic({ q, content, uiLang }: { q: Question; content: ContentMode; uiLang: Lang }) {
  const langs: Lang[] = content === 'both' && q.es ? ['en', 'es'] : [content === 'es' && q.es ? 'es' : 'en']
  return <QuestionComic key={`${q.id}-${content}`} episodes={langs.map((lang) => usaComic(q, lang))} uiLang={uiLang} />
}

export function SpainQuestionComic({ q }: { q: SpainQuestion }) {
  return <QuestionComic key={q.id} episodes={[spainComic(q)]} uiLang="es" />
}
