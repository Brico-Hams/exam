import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

// These layouts were constructed after visually reviewing every corresponding
// supplied JPG. Source mistakes and distractor labels are deliberately retained.
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const path = (d, extra = '') => `<path d="${d}" ${extra}/>`
const line = (x, y, xx, yy, extra = '') => path(`M${x} ${y}L${xx} ${yy}`, extra)
const text = (x, y, s, size = 20) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="#17324d" stroke="none">${esc(s)}</text>`
const label = (x, y, s) => s.split('|').map((part, i) => text(x, y + i * 24, part)).join('')
const arrow = (x, y, xx, yy) => line(x, y, xx, yy, 'marker-end="url(#arrow)"')
const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="4" fill="#24639c"/>`
const block = (x, y, w, s) => `<rect x="${x}" y="${y}" width="${w}" height="68" rx="9" fill="#eff6fc"/>${label(x + w / 2, y + (s.includes('|') ? 28 : 41), s)}`
const ground = (x, y) => path(`M${x} ${y}v18m-24 0h48m-17 9h-14m4 9h6`)
const capV = (x, y, name = '') => path(`M${x} ${y}v30m-23 0h46m-46 14h46m-23 0v30`) + text(x + 52, y + 45, name)
const capH = (x, y, name = '') => path(`M${x} ${y}h30m0 -23v46m14 -46v46m0 -23h30`) + text(x + 37, y - 35, name)
const coilH = (x, y, name = '') => path(`M${x} ${y}h10${'q10 -38 20 0'.repeat(5)}h10`) + text(x + 60, y - 36, name)
const diode = (x, y) => line(x, y, x + 70, y) + path(`M${x + 20} ${y - 19}l30 19l-30 19Z`, 'fill="#24639c"') + line(x + 50, y - 22, x + 50, y + 22)
const antenna = (x, y) => path(`M${x} ${y}v-65m-28 -50l28 50l28 -50m-28 50v-50`) + text(x, y - 130, 'Antena')
const frame = (body, alt) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 480" role="img">
<title>${esc(alt)}</title><rect width="1200" height="480" fill="white"/>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#24639c"/></marker></defs>
<g fill="none" stroke="#24639c" stroke-width="2.5" stroke-linejoin="round" font-family="sans-serif">${body}</g>
${text(1020, 460, 'EA5KAO · ilustración propia', 14)}</svg>\n`

function chain(items, { y = 190, start = 35, end = 1165, arrows = true } = {}) {
  const step = (end - start) / items.length
  return items.map((s, i) => block(start + i * step, y, step - 25, s) +
    (i < items.length - 1
      ? (arrows ? arrow : line)(start + (i + 1) * step - 25, y + 34, start + (i + 1) * step, y + 34)
      : '')).join('')
}

function receiver({ first = 'Etapa RF', middle = 'Etapa FI', osc = 'Oscilador|variable',
  secondOsc = 'Oscilador|de batido', detector = 'Detector de|producto', feedback = false } = {}) {
  let body = chain(['Antena', first, 'Mezclador', middle, detector, 'Amplificador|BF', 'Altavoz'])
  body += block(340, 355, 150, osc) + arrow(415, 355, 415, 258)
  if (secondOsc) body += block(665, 355, 150, secondOsc) + arrow(740, 355, 740, 258)
  if (feedback) body += block(650, 60, 130, '¿?') +
    path('M665 224V94H650', 'marker-end="url(#arrow)"') +
    path('M715 60V28H280V190', 'marker-end="url(#arrow)"') +
    path('M553 28V190', 'marker-end="url(#arrow)"') + dot(553, 28)
  return body
}

function transmitter({ stage = 'Etapa BF', mod = 'Modulador|balanceado', filter = 'Filtro',
  amp = 'Amplificador|RF', feedback = false, terminal = 'Antena' } = {}) {
  let body = chain(['Micrófono', stage, mod, filter, 'Mezclador', amp, terminal])
  body += block(340, 355, 150, 'Oscilador') + arrow(415, 355, 415, 258) +
    block(665, 355, 150, 'Oscilador|variable') + arrow(740, 355, 740, 258)
  if (feedback) body += block(550, 60, 120, '¿?') +
    path('M925 190V94H670', 'marker-end="url(#arrow)"') +
    path('M550 94H280V190', 'marker-end="url(#arrow)"')
  return body
}

function equipment(items, choice, display = '14.235') {
  return text(50, 50, choice, 28) + chain(['Transceptor', ...items, 'Antena'], { arrows: false }) +
    text(110, 295, display, 19)
}

function chassis(choice, mode) {
  let body = text(50, 50, choice, 28) +
    chain(['Transceptor', 'Medidor R.O.E.', 'Acoplador de|antena', 'Antena'], { arrows: false }) +
    text(150, 288, '7.115', 18) + line(170, 335, 1070, 335)
  for (const x of [170, 450, 735]) body += line(x, 258, x, 335) + dot(x, 335)
  if (mode === 'earth') body += line(990, 335, 990, 355) + ground(990, 355)
  else if (mode === 'dc') body += line(90, 335, 170, 335) + label(95, 375, '+12 V|CC')
  else {
    body += line(90, 335, 170, 335) + line(90, 405, 145, 405) + dot(145, 405) +
      label(80, 280, '220 V|~') + text(210, 412, mode === 'phase-free' ? 'Fase' : 'Neutro')
  }
  return body
}

// Independent parametric wireframes preserve the visible lobe topology, without
// tracing mesh lines, copying pixels, or assigning unprovided gain values.
function radiation(kind, choice) {
  const project = (a, b) => {
    const cb = Math.cos(b), sb = Math.sin(b)
    let r
    if (kind === 'flat') r = Math.abs(cb)
    else if (kind === 'round') r = Math.pow(Math.abs(cb), 0.45)
    else if (kind === 'multi') r = Math.abs(Math.cos(3 * b)) * Math.abs(cb)
    else {
      const ca = Math.cos(a)
      r = 1.65 * Math.pow(Math.max(0, ca * cb), 5) +
        0.6 * Math.pow(Math.max(0, -ca * cb), 4) +
        0.3 * Math.abs(Math.sin(3 * a)) * Math.abs(cb)
    }
    const zScale = kind === 'flat' ? 0.63 : 1
    const x = r * cb * Math.cos(a), y = r * cb * Math.sin(a), z = r * sb * zScale
    return `${600 + 230 * x + 92 * y},${245 + 50 * x - 66 * y - 190 * z}`
  }
  let body = text(50, 50, choice, 28) +
    line(600, 245, 1050, 340, 'stroke="#bdcbd8"') +
    line(600, 245, 285, 365, 'stroke="#bdcbd8"') +
    line(600, 245, 600, 35, 'stroke="#bdcbd8"') +
    text(1060, 365, 'X') + text(270, 390, 'Y') + text(600, 25, 'Z')
  const poly = (pts) => `<polyline points="${pts.join(' ')}" stroke="#377caf" stroke-width="1.2"/>`
  for (let i = 0; i < 24; i++) {
    body += poly(Array.from({ length: 81 }, (_, j) => project(i * Math.PI / 12, -Math.PI / 2 + j * Math.PI / 80)))
  }
  for (let i = 1; i < 20; i++) {
    body += poly(Array.from({ length: 121 }, (_, j) => project(j * Math.PI / 60, -Math.PI / 2 + i * Math.PI / 20)))
  }
  return body
}

export async function generateRemainingSpainFigures(directory) {
  await mkdir(directory, { recursive: true })
  const figures = new Map()
  const answerText = new Map([
    ['fedi-ag-004', [
      'Vsec. / Vprim. = Nsec. / Nprim.',
      'Vprim. / Vsec. = Nsec. / Nprim.',
      'Isec. / Iprim. = Nsec. / Nprim.',
      'Ninguna de las anteriores es correcta.',
    ]],
    ...['fedi-s-005', 'fedi-m-007'].map((id) => [id, [
      'C = 2 / (1 / C1) + 2 / (1 / C2) + 2 / (1 / C3)',
      'C = 1 / C1 + 1 / C2 + 1 / C3',
      'C = C1 + C2 + C3',
      'Ninguna de las anteriores.',
    ]]),
  ])
  async function add(ids, name, body, alt) {
    await writeFile(join(directory, `${name}.svg`), frame(body, alt), 'utf8')
    for (const id of ids) figures.set(`img/${id}.jpg`, { path: `figures/spain/${name}.svg`, alt })
  }
  const one = (id, body, alt) => add([id], id, body, alt)

  // A deliberately schematic geographic layout, not a traced map. The five
  // adjoining provinces and the separate northwestern enclave retain the
  // relationships visible in the source, without naming the tested district.
  await one('fedi-ab-037',
    text(600, 40, 'Esquema geográfico · norte arriba', 21) +
    path('M850 70L940 105L915 170L855 205L790 180L800 120Z', 'fill="#eff6fc"') +
    path('M790 180L855 205L815 290L735 280L680 225L715 175Z', 'fill="#eff6fc"') +
    path('M735 280L815 290L830 335L765 405L710 360Z', 'fill="#eff6fc"') +
    path('M465 230L555 205L680 225L735 280L710 360L615 365L535 320L455 310Z', 'fill="#eff6fc"') +
    path('M535 320L615 365L710 360L765 405L665 435L580 405Z', 'fill="#eff6fc"') +
    path('M665 145L690 150L695 175L670 180L655 165Z', 'fill="#eff6fc"') +
    dot(575, 282) + dot(645, 391) +
    path('M85 120L165 80L290 95L350 155L325 280L250 345L140 320L95 220Z', 'stroke="#8dabbf"') +
    '<ellipse cx="300" cy="230" rx="43" ry="65" stroke-dasharray="6 6"/>' +
    arrow(345, 240, 430, 260) + text(200, 390, 'Localización peninsular', 17),
  'Esquema sin nombres del territorio del sureste peninsular destacado en el original: cinco divisiones provinciales contiguas, tres de ellas a lo largo de la costa oriental, y un pequeño enclave separado al noroeste de la división costera central. Dos puntos interiores en las divisiones occidental y meridional.')

  const wave = (x, y, am) => {
    const pts = Array.from({ length: 241 }, (_, i) => {
      const envelope = am ? 0.56 + 0.4 * Math.cos(i * Math.PI / 60) : 1
      return `${x + i},${y - 34 * envelope * Math.sin(i * Math.PI / (am ? 6 : 60))}`
    })
    return `<polyline points="${pts.join(' ')}"/>`
  }
  await one('fedi-ag-009', wave(45, 200, true) + arrow(310, 200, 420, 200) +
    block(430, 165, 220, 'Circuito') + arrow(660, 200, 790, 200) + wave(815, 200, false) +
    label(170, 300, 'Señal de|radiofrecuencia') + label(935, 300, 'Señal de|audiofrecuencia'),
  'Señal de radiofrecuencia de amplitud variable hacia Circuito; salida de audiofrecuencia sinusoidal.')

  await one('fedi-ag-013', path('M150 400Q610 220 1110 395', 'stroke="#8dabbf" stroke-width="8"') +
    path('M110 280Q435 15 1060 60', 'stroke="#8dabbf" stroke-width="5"') +
    text(750, 45, 'Ionosfera') + text(850, 420, 'Tierra') +
    path('M260 330V275m-18 40l18 15l18 -15') + text(230, 365, 'Antena') +
    arrow(260, 275, 225, 45) + text(195, 45, '1', 28) +
    path('M260 275L310 160L1000 160', 'marker-end="url(#arrow)"') + text(1035, 165, '2', 28) +
    path('M260 275Q500 165 1000 195', 'marker-end="url(#arrow)"') + text(1040, 215, '3', 28),
  'Tres trayectorias desde una antena: 1 asciende atravesando la ionosfera; 2 asciende y continúa casi horizontal; 3 se curva hacia la Tierra debajo de la ionosfera.')

  await one('fedi-ag-014', path('M210 190V85H430m150 0H970V350H210V230') +
    line(175, 190, 245, 190) + line(190, 230, 230, 230) + text(115, 215, 'E = 12 V') +
    '<rect x="430" y="68" width="150" height="34"/>' + text(505, 50, 'R = 3 Ω') +
    path('M970 85v70m0 120v75') + '<rect x="953" y="155" width="34" height="120"/>' +
    text(1060, 220, 'R = 9 Ω') + line(750, 85, 750, 165) +
    capV(750, 165, 'C') + line(750, 239, 750, 350) + dot(750, 85) + dot(750, 350),
  'Fuente E = 12 V y resistencia R = 3 Ω en serie con el paralelo de C y R = 9 Ω.')

  await one('fedi-ag-016', chain(['Antena', 'Mezclador', 'Filtro|audio', 'Amplificador|audio', 'Altavoz']) +
    block(285, 350, 170, '¿?') + arrow(370, 350, 370, 258),
  'Antena a mezclador, filtro audio, amplificador audio y altavoz; el bloque ¿? alimenta la segunda entrada del mezclador.')

  await one('fedi-aa-014', receiver({ feedback: true, detector: '×' }),
    'Antena, etapa RF, mezclador con oscilador variable, etapa FI, segundo mezclador con oscilador de batido, amplificador BF y altavoz. Una derivación después de FI entra en ¿?, cuya salida retorna a RF y FI.')
  // Both originals have the same signal/control topology. The extra "Altavoz"
  // printed below the antenna in w-018 is a source typo, not another component.
  await add(['fedi-aa-018', 'fedi-w-018'], 'fedi-aa-018', transmitter({ feedback: true }),
    'Micrófono, etapa BF, modulador balanceado con oscilador, filtro, mezclador con oscilador variable, amplificador RF y antena; rama desde amplificador RF por ¿? hacia etapa BF.')
  // Unlike w-014, s-011 has just one mixer and an audio filter: these two
  // interrogant-input figures are not functionally equivalent and stay separate.
  await one('fedi-w-014', receiver({ first: '¿?', detector: '×' }),
    'Antena, ¿?, mezclador con oscilador variable, etapa FI, segundo mezclador con oscilador de batido, amplificador BF y altavoz.')
  await one('fedi-s-011', chain(['Antena', '¿?|Etapa RF', 'Mezclador', 'Filtro', 'Amplificador|BF', 'Altavoz']) +
    block(435, 350, 170, 'Oscilador|de batido') + arrow(520, 350, 520, 258),
  'Antena a ¿? en etapa RF, mezclador con oscilador de batido, filtro, amplificador BF y altavoz.')

  for (const [i, kind, alt] of [
    ['A', 'flat', 'Superficie de radiación toroidal achatada, simétrica alrededor de Z.'],
    ['B', 'multi', 'Superficie de radiación con varios lóbulos en elevación alrededor de Z.'],
    ['C', 'round', 'Superficie de radiación toroidal redondeada, con nulos sobre el eje Z.'],
    ['D', 'directional', 'Superficie de radiación con gran lóbulo delantero, lóbulo posterior menor y lóbulos laterales pequeños.'],
  ]) await one(`fedi-aa-025_${i}`, radiation(kind, i), `Opción ${i}. ${alt}`)

  // Transformer secondary feeds the two AC vertices of a four-diode bridge;
  // the capacitor spans its positive and negative DC vertices.
  const bridge = path('M80 110H175V155M80 350H175V305M255 155V110H565V135M255 305V350H410Q430 325 450 350H565V325') +
    path('M175 155q-45 15 0 30q-45 15 0 30q-45 15 0 30q-45 15 0 30q-45 15 0 30') +
    path('M255 155q45 15 0 30q45 15 0 30q45 15 0 30q45 15 0 30q45 15 0 30') +
    line(207, 150, 207, 310) + line(223, 150, 223, 310) +
    line(565, 135, 430, 230) + line(430, 230, 565, 325) +
    line(565, 135, 700, 230) + line(565, 325, 700, 230)
  const bridgeDiode = (x, y, angle) => `<g transform="translate(${x} ${y}) rotate(${angle})">${diode(-35, 0)}</g>`
  const bridgeSymbols =
    bridgeDiode(497.5, 182.5, -35.13) + bridgeDiode(632.5, 182.5, 35.13) +
    bridgeDiode(497.5, 277.5, 35.13) + bridgeDiode(632.5, 277.5, -35.13) +
    path('M430 230V410H1090M700 230H1090') +
    line(940, 230, 940, 275) + capV(940, 275) + line(940, 349, 940, 410)
  await one('fedi-w-012', bridge + bridgeSymbols,
    'Transformador con secundario conectado a los vértices superior e inferior de un puente de cuatro diodos; salida por los vértices derecho e izquierdo y condensador en paralelo con la salida.')

  await one('fedi-w-028', line(150, 150, 460, 150) + coilH(460, 150, 'L') + line(580, 150, 1030, 150) +
    line(340, 150, 340, 210) + capV(340, 210, 'C') + ground(340, 284) +
    line(820, 150, 820, 210) + capV(820, 210, 'C') + ground(820, 284) + dot(340, 150) + dot(820, 150),
  'Bobina L en serie entre entrada y salida; un condensador C a masa a cada lado de L.')

  for (const [i, mode] of [['A', 'earth'], ['B', 'phase-free'], ['C', 'neutral-free'], ['D', 'dc']]) {
    await one(`fedi-w-030_${i}`, chassis(i, mode),
      `Opción ${i}. Transceptor, medidor R.O.E., acoplador de antena y antena. Los tres chasis se unen a una barra común; ${
        mode === 'earth' ? 'barra conectada al símbolo de tierra.' :
        mode === 'dc' ? 'barra conectada a +12 V CC.' :
        `barra conectada al borne superior de 220 V alterna; el borne inferior queda libre y está rotulado ${mode === 'phase-free' ? 'Fase' : 'Neutro'}.`}`)
  }

  const parallelCaps = text(140, 130, 'C', 30) + path('M130 245H350V100H450M350 245H450M350 245V370H450M524 100H850V370H524M524 245H1080') +
    capH(450, 100, 'C1') + capH(450, 245, 'C2') + capH(450, 370, 'C3') +
    dot(350, 245) + dot(850, 245)
  await add(['fedi-s-005', 'fedi-m-007'], 'parallel-three-capacitors', parallelCaps,
    'Capacidad C entre dos terminales, con C1, C2 y C3 conectados en paralelo entre los mismos dos nodos.')

  const transmitOptions = [
    ['A', { mod: 'Modulador|de fase' }],
    ['B', {}],
    ['C', { filter: 'Modulador|de fase' }],
    ['D', { stage: 'Etapa RF', amp: 'Amplificador|BF' }],
  ]
  for (const [i, settings] of transmitOptions) {
    await one(`fedi-s-017_${i}`, text(50, 45, i, 28) + transmitter(settings),
      `Opción ${i}. Micrófono, ${settings.stage ?? 'Etapa BF'}, ${settings.mod?.replaceAll('|', ' ') ?? 'modulador balanceado'} con oscilador, ${settings.filter?.replaceAll('|', ' ') ?? 'filtro'}, mezclador con oscilador variable, ${settings.amp?.replaceAll('|', ' ') ?? 'amplificador RF'} y antena.`)
  }

  await one('fedi-o-006', antenna(260, 210) + line(260, 210, 300, 210) +
    line(300, 210, 650, 210) +
    path('M340 210V240M340 360V395M500 210V270M500 344V395') +
    `<g transform="translate(340 240) rotate(90)">${coilH(0, 0)}</g>` +
    text(300, 315, 'L') + capV(500, 270, 'C') +
    diode(650, 210) + path('M720 210H940V265M940 333V395H260') +
    block(840, 265, 200, 'Auriculares') + line(260, 395, 260, 405) + ground(260, 405) + text(175, 440, 'Tierra') +
    text(690, 165, 'Diodo') + dot(260, 210) + dot(260, 395),
  'Antena al nodo superior del paralelo LC y al ánodo del diodo; cátodo a auriculares; retorno de auriculares al nodo inferior de LC y tierra.')

  await one('fedi-o-008', chain(['Antena', 'Etapa RF', '×', 'Amplificador|FI', 'Diodo', 'Amplificador|BF', 'Altavoz']) +
    block(340, 355, 150, 'Oscilador|variable') + arrow(415, 355, 415, 258),
  'Antena, etapa RF, mezclador alimentado por oscilador variable, amplificador FI, diodo, amplificador BF y altavoz.')

  const orderO = [
    ['Acoplador de|antena', 'Medidor R.O.E.', 'Amplificador|lineal'],
    ['Medidor R.O.E.', 'Acoplador de|antena', 'Amplificador|lineal'],
    ['Amplificador|lineal', 'Medidor R.O.E.', 'Acoplador de|antena'],
    ['Amplificador|lineal', 'Acoplador de|antena', 'Medidor R.O.E.'],
  ]
  const orderI = [
    ['Acoplador de|antena', 'Amplificador|lineal'],
    ['Acoplador de|antena', 'Medidor R.O.E.'],
    ['Medidor R.O.E.', 'Acoplador de|antena'],
    ['Medidor de|Campo', 'Amplificador|lineal'],
  ]
  for (const [id, orders] of [['fedi-o-009', orderO], ['fedi-i-014', orderI]]) {
    for (const [n, items] of orders.entries()) {
      const i = 'ABCD'[n]
      await one(`${id}_${i}`, equipment(items, i),
        `Opción ${i}. Transceptor con indicación 14.235, ${items.map((s) => s.replaceAll('|', ' ')).join(', ')}, antena; conectados en ese orden.`)
    }
  }

  await one('fedi-o-025', block(35, 180, 230, 'Transmisor|14.200') +
    line(265, 214, 410, 214) + path('M410 214V135H460M580 135H670V214M410 214V320H480M554 320H670V214H800') +
    coilH(460, 135, 'L') + capH(480, 320, 'C') +
    block(800, 180, 190, 'Vatímetro RF') + line(990, 214, 1090, 214) + antenna(1090, 214) +
    dot(410, 214) + dot(670, 214) +
    '<ellipse cx="335" cy="214" rx="12" ry="27"/>' + ground(335, 241) +
    '<ellipse cx="735" cy="214" rx="12" ry="27"/>' + ground(735, 241),
  'Transmisor 14.200, línea coaxial, paralelo L-C intercalado en serie en el conductor de señal, línea coaxial, vatímetro RF y antena.')

  const receiveOptions = [
    ['A', {}],
    ['B', { first: 'Etapa FI', middle: 'Etapa RF' }],
    ['C', { middle: 'Demodulador', osc: 'Oscilador|fijo', secondOsc: 'Oscilador|variable' }],
    ['D', { detector: 'Diodo|detector', secondOsc: null }],
  ]
  for (const [i, settings] of receiveOptions) {
    await one(`fedi-i-007_${i}`, text(50, 45, i, 28) + receiver(settings),
      `Opción ${i}. Antena, ${settings.first ?? 'Etapa RF'}, mezclador con ${settings.osc?.replaceAll('|', ' ') ?? 'oscilador variable'}, ${settings.middle ?? 'Etapa FI'}, ${
        settings.secondOsc === null ? 'diodo detector' : `detector de producto con ${settings.secondOsc?.replaceAll('|', ' ') ?? 'oscilador de batido'}`}, amplificador BF y altavoz.`)
  }
  await one('fedi-i-024', chain(['Antena|F ?', 'Etapa RF', '×', 'Etapa FI', 'FI = 10.7 MHz']) +
    block(520, 355, 205, 'Oscilador|variable') + arrow(622.5, 355, 622.5, 258) +
    text(850, 390, 'FOL = 3.5 MHz'),
  'Señal F desconocida en antena a etapa RF y mezclador; oscilador variable FOL = 3.5 MHz a segunda entrada; etapa FI con FI = 10.7 MHz.')

  return { figures, answerText }
}
