import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
const line = (x1, y1, x2, y2, extra = '') => `<path d="M${x1} ${y1}L${x2} ${y2}" ${extra}/>`
const text = (x, y, value, size = 17) => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" fill="#142b45" stroke="none">${esc(value)}</text>`
const box = (x, y, w, label) => `<rect x="${x}" y="${y}" width="${w}" height="52" rx="8" fill="#edf5ff"/>${text(x + w / 2, y + 31, label)}`
const arrow = (x1, y1, x2, y2) => line(x1, y1, x2, y2, 'marker-end="url(#arrow)"')
const frame = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 340" role="img">
<title>Esquema educativo original EA5KAO</title>
<rect width="1000" height="340" fill="white"/>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#24639c"/></marker></defs>
<g fill="none" stroke="#24639c" stroke-width="2.5" font-family="sans-serif">${body}</g>
${text(870, 325, 'EA5KAO · esquema propio', 13)}</svg>\n`

function chain(labels) {
  const step = 920 / labels.length, w = step - 20
  return labels.map((label, i) => {
    const x = 30 + i * step
    return box(x, 125, w, label) + (i < labels.length - 1 ? arrow(x + w, 151, x + step - 5, 151) : '')
  }).join('')
}

function pattern(labels = false, beam = false) {
  const cx = 440, cy = 160
  const points = []
  for (let i = 0; i <= 360; i++) {
    const a = i * Math.PI / 180
    const r = 150 * (0.08 + Math.pow((1 + Math.cos(a)) / 2, 4)) + 18 * Math.pow((1 - Math.cos(a)) / 2, 8)
    points.push(`${cx + 2 * r * Math.cos(a)},${cy - r * Math.sin(a)}`)
  }
  return line(90, cy, 890, cy) + line(cx, 25, cx, 295) +
    `<polyline points="${points.join(' ')}" fill="#e1efff" fill-opacity=".5" stroke-width="4"/>` +
    (labels ? text(805, 145, '1') + text(355, 145, '2') : '') +
    (beam ? line(cx, cy, 850, 60, 'stroke-width="5"') + line(cx, cy, 850, 260, 'stroke-width="5"') : '')
}

function sine(rms) {
  let body = ''
  for (let x = 85; x <= 925; x += 70) body += line(x, 40, x, 285, 'stroke="#e1e8ef"')
  for (let y = 45; y <= 285; y += 40) body += line(85, y, 925, y, 'stroke="#e1e8ef"')
  body += line(65, 165, 930, 165) + line(85, 35, 85, 290)
  const pts = Array.from({ length: 841 }, (_, i) => `${85 + i},${165 - 100 * Math.sin(i * 2 * Math.PI / 280)}`)
  body += `<polyline points="${pts.join(' ')}" stroke-width="4"/>`
  return body + (rms
    ? text(40, 70, '+10 V') + text(40, 270, '−10 V') + text(900, 200, 'tiempo')
    : line(950, 65, 950, 265) + line(940, 65, 960, 65) + line(940, 265, 960, 265) + text(978, 170, 'A') +
      line(155, 295, 435, 295) + line(155, 285, 155, 305) + line(435, 285, 435, 305) + text(295, 315, 'B'))
}

function dipole(balun = false) {
  return line(460, 85, 130, 260) + line(540, 85, 870, 260) + box(460, 55, 80, balun ? '?' : 'RF') +
    line(500, 107, 500, 280) + (balun ? text(620, 240, 'Coaxial') + '<rect x="430" y="25" width="140" height="110" stroke-dasharray="7 5"/>' : '')
}

export async function generateSpainFigures(directory) {
  await mkdir(directory, { recursive: true })
  const figures = new Map()
  async function add(names, name, body, alt) {
    const path = `figures/spain/${name}.svg`
    await writeFile(join(directory, `${name}.svg`), frame(body), 'utf8')
    for (const source of names) figures.set(`img/${source}.jpg`, { path, alt })
  }
  const a = (id, body, alt) => add([id], id, body, alt)
  await a('fedi-aa-024', line(120, 130, 390, 130) + line(610, 130, 880, 130) +
    '<path d="M30 130q15 -60 30 0t30 0t30 0M880 130q15 -60 30 0t30 0t30 0"/>' +
    line(390, 130, 490, 130) + line(510, 130, 610, 130) + line(490, 130, 490, 280) + line(510, 130, 510, 280) +
    text(90, 80, 'L') + text(920, 80, 'L'), 'Dipolo con una bobina conectada en cada extremo y alimentación central.')
  await a('fedi-aa-027', sine(true), 'Sinusoide centrada en cero con máximos de más 10 V y mínimos de menos 10 V.')
  await a('fedi-ag-005', chain(['Entrada', 'Circuito', 'Salida']) +
    '<path d="M860 125V50H150V125" marker-end="url(#arrow)"/>', 'Parte de la salida retorna a la entrada del circuito.')
  await a('fedi-ag-011', chain(['Alterna', 'A', 'B', 'C', 'D', 'Continua']), 'Cuatro bloques consecutivos A, B, C y D entre entrada de alterna y salida de continua.')
  await a('fedi-ag-020', line(500, 30, 500, 150) + line(500, 150, 300, 250) +
    line(500, 150, 700, 250) + line(500, 150, 430, 300) + text(580, 60, 'Antena') + text(250, 245, 'Radiales'),
  'Elemento vertical y radiales inclinados hacia abajo desde su punto de alimentación.')
  await a('fedi-ag-024', dipole(), 'Dipolo con dos brazos descendentes desde el punto de alimentación elevado.')
  await a('fedi-ag-028', '<path d="M80 260H920M260 260L430 65L570 260"/><path d="M70 100Q390 -10 650 100T940 180" marker-end="url(#arrow)"/>' +
    text(500, 310, 'Obstáculo en el trayecto'), 'Onda que se curva alrededor de un obstáculo elevado.')
  await a('fedi-k-009', line(80, 270, 920, 270) + line(80, 270, 80, 25) +
    '<path d="M170 270L260 170L320 220L380 110L450 270M550 270L620 110L680 220L740 170L830 270M500 270V35"/>' +
    text(500, 25, 'Portadora') + text(300, 90, 'Banda lateral') + text(710, 90, 'Banda lateral') + text(830, 305, 'Frecuencia'),
  'Espectro con portadora central y dos bandas laterales simétricas.')
  await a('fedi-k-014', line(90, 270, 920, 270) + line(90, 270, 90, 25) +
    '<path d="M220 270Q500 -180 780 270" stroke-dasharray="10 6"/><path d="M400 270Q500 -180 600 270" stroke-width="4"/>' +
    text(580, 145, 'A') + text(750, 180, 'B') + text(500, 300, '455 kHz') + text(860, 305, 'Frecuencia'),
  'Dos respuestas centradas en 455 kHz: A estrecha y B ancha, con igual nivel máximo.')
  await add(['fedi-k-020', 'fedi-w-023'], 'pattern-directional', pattern(), 'Diagrama con un lóbulo principal grande y un lóbulo posterior menor.')
  await a('fedi-k-028', sine(false), 'Sinusoide con distancia vertical A entre extremos y distancia horizontal B entre puntos equivalentes de un ciclo.')
  await a('fedi-o-020', chain(['Antena', 'RF', 'Mezclador', 'Filtro', 'FI', 'Limitador', 'Demod. FM', 'BF', 'Altavoz']),
    'Cadena de recepción FM con mezclador sin segunda entrada conectada y salida de audio.')
  await a('fedi-s-002', arrow(80, 120, 380, 120) + text(200, 80, 'Campo externo') +
    box(420, 100, 250, 'Circuito electrónico') + '<rect x="380" y="55" width="330" height="210" stroke-dasharray="8 6"/>' +
    text(550, 295, 'Envolvente de protección'), 'Campo electromagnético externo dirigido hacia un circuito dentro de una envolvente discontinua.')
  await a('fedi-s-018', pattern(false, true), 'Diagrama de radiación con dos líneas gruesas que delimitan angularmente el lóbulo principal.')
  await a('fedi-s-020', dipole(true), 'Cable coaxial conectado a los brazos simétricos de un dipolo mediante un bloque interrogante.')
  await a('fedi-s-022', chain(['Transmisor', 'Vatímetro', 'Antena']) + text(500, 225, 'Directa > 0 · Reflejada > 0'),
    'Vatímetro en línea con lecturas positivas tanto de potencia directa como reflejada.')
  await a('fedi-s-030', chain(['Antena', 'Mezclador', 'Filtro audio', 'BF', 'Altavoz']) +
    box(220, 235, 200, 'Oscilador batido') + arrow(320, 235, 320, 180),
  'Receptor de conversión directa con oscilador de batido y filtro de audio, sin etapa intermedia.')
  await a('fedi-w-024', chain(['Transmisor Z0', 'Línea Z0', 'Vatímetro', 'Antena Z0']),
    'Transmisor, línea y antena de igual impedancia a la frecuencia de trabajo, con vatímetro intercalado.')
  await a('fedi-w-027', pattern(true), 'Diagrama con punto 1 en el máximo delantero y punto 2 en la dirección opuesta.')
  return figures
}
