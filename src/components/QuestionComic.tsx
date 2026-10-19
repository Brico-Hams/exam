import { useState } from 'react'
import type { ComicEpisode } from '../lib/comics'
import { spainComic, usaComic } from '../lib/comics'
import type { ContentMode, Lang, Question } from '../lib/types'
import type { SpainQuestion } from '../lib/spain'
import { COMIC_TITLES, comicScene, FRANCHISE } from '../lib/comic-stories'

const INK = '#27364b'
type Scene = ReturnType<typeof comicScene>['id']

// Shared beaver (400×520 design grid, see the DamWatts character sheets). Accessories rely on these
// anchors: head (200,175) r95, eyes y≈157, muzzle (200,217), neck y≈262–326, cheeks (125|275, 218).
function BeaverBody({ arms = true }: { arms?: boolean }) {
  return <>
    <g transform="rotate(-30 300 410)">
      <ellipse cx="300" cy="410" rx="60" ry="100" fill="#5a3520" />
      <path d="M252 350H348M243 380H357M244 410H356M243 440H357M252 470H348M270 330V490M300 316V504M330 330V490" stroke="#3f2416" strokeWidth="4" />
    </g>
    <ellipse cx="200" cy="360" rx="110" ry="125" fill="#a5652e" />
    <path d="M248 262Q312 300 306 380Q298 440 236 474Q284 420 284 368Q282 300 248 262Z" fill="#8a5224" stroke="none" />
    <ellipse cx="200" cy="385" rx="70" ry="88" fill="#f4c98f" />
    <ellipse cx="178" cy="350" rx="26" ry="40" fill="white" fillOpacity=".25" stroke="none" />
    <path d="M168 330Q200 318 232 330M160 370Q200 356 240 370M164 410Q200 398 236 410" fill="none" stroke="#d9a669" strokeWidth="4" />
    {arms && <BeaverArms />}
    <Sneaker x={0} /><Sneaker x={100} />
    <circle cx="125" cy="100" r="24" fill="#7d4a1f" /><circle cx="275" cy="100" r="24" fill="#7d4a1f" />
    <circle cx="121" cy="95" r="10" fill="#f6a7a0" stroke="none" /><circle cx="279" cy="95" r="10" fill="#f6a7a0" stroke="none" />
    <path d="M112 196L96 206L110 212L94 222L112 226M288 196L304 206L290 212L306 222L288 226" fill="#a5652e" />
    <circle cx="200" cy="175" r="95" fill="#a5652e" />
    <path d="M150 98Q200 78 250 98Q212 92 200 108Q188 92 150 98Z" fill="#bf7a3c" stroke="none" />
    <ellipse cx="160" cy="118" rx="30" ry="15" transform="rotate(-25 160 118)" fill="white" fillOpacity=".22" stroke="none" />
    <ellipse cx="200" cy="217" rx="55" ry="40" fill="#f4c98f" />
    <ellipse cx="152" cy="214" rx="15" ry="9" fill="#ff8a8a" fillOpacity=".55" stroke="none" />
    <ellipse cx="248" cy="214" rx="15" ry="9" fill="#ff8a8a" fillOpacity=".55" stroke="none" />
    <path d="M168 214H140M170 224L142 232M232 214H260M230 224L258 232" strokeWidth="3" />
    <ellipse cx="200" cy="195" rx="18" ry="12" fill={INK} />
    <ellipse cx="194" cy="191" rx="6" ry="3" fill="white" stroke="none" />
    <path d="M200 207V218M180 220Q190 228 200 218Q210 228 220 220" fill="none" strokeWidth="5" />
    <path d="M186 226H214V252Q214 258 208 258H192Q186 258 186 252Z" fill="#fffaf0" />
    <path d="M200 226V258" strokeWidth="4" />
  </>
}

// Orange high-tops with a white sole and laces (left shoe; x shifts it to the right foot).
function Sneaker({ x }: { x: number }) {
  return <g transform={`translate(${x} 0)`}>
    <path d="M108 488Q104 448 138 446H160Q196 450 198 488Z" fill="#f26b1d" />
    <path d="M170 488Q172 466 196 470Q200 480 198 488Z" fill="white" />
    <path d="M128 478Q150 466 174 474" fill="none" stroke="white" strokeWidth="6" />
    <path d="M136 456H156M138 464H154" strokeWidth="3" />
    <rect x="100" y="484" width="102" height="16" rx="8" fill="white" />
  </g>
}

// Front paws with claws; TRANSI draws its own folded arms instead.
function BeaverArms() {
  return <>
    <ellipse cx="112" cy="345" rx="26" ry="50" transform="rotate(18 112 345)" fill="#8a5224" />
    <ellipse cx="288" cy="345" rx="26" ry="50" transform="rotate(-18 288 345)" fill="#8a5224" />
    {[[86, 390], [96, 396], [106, 390], [294, 390], [304, 396], [314, 390]].map(([x, y]) =>
      <circle key={x} cx={x} cy={y} r="7" fill="#8a5224" strokeWidth="4" />)}
  </>
}

// Big glossy cartoon eyes: dark iris, a large and a small catchlight.
function Eyes({ y = 157 }: { y?: number }) {
  return <>
    <ellipse cx="165" cy={y} rx="20" ry="24" fill="white" /><ellipse cx="235" cy={y} rx="20" ry="24" fill="white" />
    <circle cx="168" cy={y + 3} r="15" fill="#2a1a10" stroke="none" /><circle cx="232" cy={y + 3} r="15" fill="#2a1a10" stroke="none" />
    <circle cx="173" cy={y - 3} r="6" fill="white" stroke="none" /><circle cx="237" cy={y - 3} r="6" fill="white" stroke="none" />
    <circle cx="163" cy={y + 10} r="3" fill="white" stroke="none" /><circle cx="227" cy={y + 10} r="3" fill="white" stroke="none" />
  </>
}

// Captain: orange scarf and lightning badge.
function Chomp() {
  return <>
    <BeaverBody /><Eyes />
    <path d="M143 128L185 136M257 128L215 136" />
    <path d="M118 262Q200 304 282 262L270 294Q200 326 130 294Z" fill="#f26b1d" />
    <circle cx="200" cy="308" r="22" fill="#fbf6ee" />
    <path d="M205 294L192 311H202L196 324L210 304H200Z" fill="#f26b1d" stroke="none" />
  </>
}

// Integrated circuit with a pin-1 dot; pins double as limbs.
function Chip() {
  return <>
    <path d="M130 120V70M175 120V60M225 120V60M270 120V70M150 380V470H120M250 380V470H280M100 190H50V250M300 190H350V140" fill="none" />
    <rect x="100" y="110" width="200" height="280" rx="28" fill="#64d8ca" />
    <circle cx="132" cy="140" r="10" fill={INK} stroke="none" />
    <circle cx="160" cy="210" r="16" fill="white" /><circle cx="240" cy="210" r="16" fill="white" />
    <circle cx="163" cy="213" r="7" fill={INK} stroke="none" /><circle cx="243" cy="213" r="7" fill={INK} stroke="none" />
    <path d="M160 262Q200 296 240 262" fill="none" />
    <rect x="320" y="110" width="58" height="76" rx="6" fill="#fbf6ee" transform="rotate(12 349 148)" />
  </>
}

// Resistor: hard hat, round glasses, sweat drop and a log with 1 kΩ colour bands.
function Resi() {
  return <>
    <BeaverBody /><Eyes y={162} />
    <circle cx="165" cy="160" r="26" fill="white" fillOpacity=".5" /><circle cx="235" cy="160" r="26" fill="white" fillOpacity=".5" />
    <path d="M191 160H209M140 124L185 136M260 124L215 136" />
    <path d="M110 120A90 82 0 0 1 290 120Z" fill="#f26b1d" /><rect x="92" y="114" width="216" height="18" rx="9" fill="#f26b1d" />
    <path d="M318 150C330 168 330 182 318 186C306 182 306 168 318 150Z" fill="#9ed3f5" />
    <rect x="70" y="318" width="260" height="52" rx="26" fill="#b07a42" />
    <rect x="128" y="318" width="20" height="52" fill="#6b3a1f" /><rect x="168" y="318" width="20" height="52" fill={INK} />
    <rect x="208" y="318" width="20" height="52" fill="#c0392b" /><rect x="268" y="318" width="20" height="52" fill="#d4a017" />
  </>
}

// Capacitor: puffed cheeks and an overfull electrolytic-can backpack.
function Condi() {
  return <>
    <rect x="236" y="196" width="140" height="230" rx="34" fill="#4c7cc4" />
    <rect x="336" y="196" width="40" height="230" fill="#9dbdea" />
    <path d="M350 240H364M350 290H364M350 340H364" />
    <rect x="244" y="140" width="24" height="24" fill="#ffe27a" transform="rotate(-18 256 152)" />
    <BeaverBody />
    <circle cx="125" cy="218" r="32" fill="#f7a35c" /><circle cx="275" cy="218" r="32" fill="#f7a35c" />
    <circle cx="165" cy="157" r="20" fill="white" /><circle cx="235" cy="157" r="20" fill="white" />
    <circle cx="165" cy="157" r="6" fill={INK} stroke="none" /><circle cx="235" cy="157" r="6" fill={INK} stroke="none" />
  </>
}

// Transistor: sunglasses, C-B-E badge and a tail raised like a gate barrier.
function Transi() {
  return <>
    <path d="M300 420L338 160" stroke="#5a3520" strokeWidth="40" />
    <BeaverBody arms={false} />
    <rect x="160" y="380" width="80" height="44" rx="8" fill="#fbf6ee" />
    <text x="200" y="411" textAnchor="middle" fontSize="24" fontWeight="700" fill={INK} stroke="none">C B E</text>
    <rect x="80" y="300" width="240" height="56" rx="28" fill="#a5652e" />
    <rect x="122" y="132" width="66" height="40" rx="14" fill={INK} /><rect x="212" y="132" width="66" height="40" rx="14" fill={INK} />
    <path d="M188 146H212" />
  </>
}

// Short-Circuit Crew: three electrons on tiny scooters.
const CREW = [[120, 320, 78], [290, 210, 54], [340, 400, 42]]
function Crew() {
  return <>{CREW.map(([x, y, r]) => <g key={x}>
    <path d={`M${x - 10} ${y - r - 50}L${x + 10} ${y - r - 10}L${x - 4} ${y - r - 14}L${x + 6} ${y - r + 8}`} fill="#f26b1d" />
    <circle cx={x} cy={y} r={r} fill={INK} />
    <path d={`M${x - r / 3} ${y + r / 6}H${x + r / 3}`} stroke="white" strokeWidth="9" />
    <rect x={x - r * 0.8} y={y + r + 6} width={r * 1.6} height="13" rx="6" fill="#f26b1d" />
  </g>)}</>
}

const GUESTS: Partial<Record<Scene, () => React.JSX.Element>> = {
  resistance: Resi, capacitor: Condi, transistor: Transi, short: Crew,
}

export function ComicArt({ chip, regulations, scene }: { chip: boolean; regulations: boolean; scene: Scene }) {
  const Guest = GUESTS[scene]
  return <svg className="comic-art" viewBox="0 0 320 150" aria-hidden="true">
    <path d="M0 125H320M20 110V35H85V65H145M225 20V48H300V110" fill="none" stroke="#8bb4b9" strokeWidth="4" />
    <circle cx="85" cy="65" r="6" fill="#ffb84d" />
    {Guest && <g transform="translate(2 22) scale(.24)" stroke={INK} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round"><Guest /></g>}
    <g transform="translate(108 12) scale(.25)" stroke={INK} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
      {chip ? <Chip /> : <Chomp />}
    </g>
    {regulations ? <g fill="#fff8dd" stroke={INK} strokeWidth="3">
      <path d="M240 70V118H290V70ZM250 80H280M250 90H280M250 100H272" />
    </g> : <g fill="none" stroke={INK} strokeWidth="3">
      <path d="M250 120V65M235 120H265M240 65H260M228 49Q250 25 272 49M237 57Q250 43 263 57" />
    </g>}
    <text x="312" y="143" textAnchor="end" fill="#344b60" fontSize="10">{FRANCHISE.credit}</text>
  </svg>
}

export function QuestionComic({ episodes, uiLang }: { episodes: ComicEpisode[]; uiLang: Lang }) {
  const [open, setOpen] = useState(false)
  return <details className="question-comic" onToggle={(event) => setOpen(event.currentTarget.open)}>
    <summary>{uiLang === 'es' ? 'Leer cómic' : 'Read comic'} · {FRANCHISE.name}</summary>
    {open && episodes.map((episode) => <ComicStory key={episode.lang} episode={episode} />)}
  </details>
}

function ComicStory({ episode: e }: { episode: ComicEpisode }) {
  const es = e.lang === 'es'
  const scene = comicScene(e.question, e.regulations, e.lang)
  const panels = [
    { speaker: 'Chomp', title: es ? '1. La misión' : '1. The mission',
      text: scene.opening,
      quote: e.question, figure: e.figure },
    { speaker: 'Chip', title: es ? '2. La pista' : '2. The clue',
      text: scene.clue,
      quote: e.evidence },
    { speaker: 'Chomp', title: es ? '3. La solución del banco' : '3. The pool solution',
      text: scene.solution,
      quote: e.answer, figure: e.answerFigure },
    { speaker: 'Chip', title: es ? '4. Antes de la próxima aventura' : '4. Before the next adventure',
      text: scene.ending,
      quote: e.warning ? (es ? `Pendiente de revisión: ${e.warning}` : e.warning)
        : (es ? 'La aventura es ficticia. Estudia las referencias: el cómic no sustituye las normas ni acredita una respuesta oficial.'
          : 'The adventure is fictional. Study the references: the comic does not replace rules or certify an official answer.') },
  ]
  return <article className="comic-story" lang={e.lang} aria-label={`${FRANCHISE.name} · ${e.id} · ${e.lang}`}>
    <header className="comic-brand">
      <strong>{FRANCHISE.name}</strong>
      <span>{COMIC_TITLES[e.lang]}</span>
      <span>{FRANCHISE.team[e.lang]}</span>
      <small>{es ? 'Episodio' : 'Episode'} {e.id} · {e.lang.toUpperCase()}</small>
      <small>{es ? 'Escenario' : 'Setting'}: {scene.guest}</small>
    </header>
    <p className="comic-disclaimer">{es
      ? 'Aventura educativa generada con una plantilla y el contenido de esta pregunta. Los dibujos son originales; los textos e ilustraciones del banco conservan su atribución.'
      : 'Educational adventure generated from a template and this question’s content. Character artwork is original; pool text and diagrams retain their attribution.'}</p>
    {e.warning && <p className="spain-warning"><strong>Pendiente de revisión.</strong> {e.warning}</p>}
    <ol className="comic-panels">
      {panels.map((panel, i) => <li className="comic-panel" key={i}>
        <h3>{panel.title}</h3>
        <ComicArt chip={panel.speaker === 'Chip'} regulations={e.regulations} scene={scene.id} />
        <p className="comic-dialogue"><strong>{panel.speaker}:</strong> {panel.text}</p>
        <blockquote>{panel.quote}</blockquote>
        {i === 1 && e.sharedEvidence && <p className="comic-disclaimer">{es
          ? 'Fundamento compartido o explicación pendiente; no es una resolución individual.'
          : 'Shared foundation or pending explanation; not an individual worked solution.'}</p>}
        {panel.figure && <figure>
          <img src={`${import.meta.env.BASE_URL}${panel.figure.src}`} alt={panel.figure.alt} loading="lazy" />
          <figcaption>{es ? 'Ilustración del banco · no es un dibujo de Los DamWatts' : 'Pool diagram · not DamWatts artwork'}</figcaption>
        </figure>}
        <span className="comic-watermark">{FRANCHISE.credit}</span>
      </li>)}
    </ol>
    <p className="comic-disclaimer"><strong>{es ? 'Ficción y ciencia:' : 'Fiction and science:'}</strong> {scene.metaphor}</p>
    <p className="comic-disclaimer">{es
      ? 'Seguridad: nunca muerdas cables ni manipules circuitos energizados. Los gags no son experimentos para imitar.'
      : 'Safety: never bite cables or work on energized circuits. Cartoon gags are not experiments to imitate.'}</p>
    {e.note && <p><strong>Nota del banco:</strong> {e.note}</p>}
    <p className="comic-disclaimer">{es ? 'Fuente' : 'Source'}: {e.source}</p>
    {e.license && <p className="comic-disclaimer">
      <a href={e.license.url} target="_blank" rel="noreferrer">{e.license.label}</a>
      {' · '}Adaptación educativa en viñetas bajo la misma licencia. La marca de agua identifica la aplicación, no sustituye la atribución del banco.
    </p>}
    {e.sources.length > 0 && <ul className="comic-disclaimer">{e.sources.map((source) => <li key={source.url}>
      <a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
    </li>)}</ul>}
    <footer className="comic-credit">{FRANCHISE.credit}</footer>
  </article>
}

export function UsaQuestionComic({ q, content, uiLang }: { q: Question; content: ContentMode; uiLang: Lang }) {
  const langs: Lang[] = content === 'both' && q.es ? ['en', 'es'] : [content === 'es' && q.es ? 'es' : 'en']
  return <QuestionComic key={`${q.id}-${content}`} episodes={langs.map((lang) => usaComic(q, lang))} uiLang={uiLang} />
}

export function SpainQuestionComic({ q }: { q: SpainQuestion }) {
  return <QuestionComic key={q.id} episodes={[spainComic(q)]} uiLang="es" />
}
