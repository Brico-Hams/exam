import type { Lang, Question } from './types'

type Bilingual = Record<Lang, string>
interface Principle {
  id: string
  match: RegExp
  title: Bilingual
  text: Bilingual
}

// Match the English master text, independently of the selected translation.
const principles: Principle[] = [
  {
    id: 'ohm', match: /ohm.s law|voltage.*(?:resistance|current)|current.*resistance|resistance.*current/i,
    title: { es: 'Ley de Ohm', en: "Ohm's law" },
    text: {
      es: 'En un elemento óhmico, V = I·R. Despeja I = V/R o R = V/I según la incógnita. Usa voltios, amperios y ohmios; convierte antes mA a A y kΩ a Ω. No confundas una resistencia de corriente continua con la impedancia compleja de un circuito de corriente alterna.',
      en: 'For an ohmic element, V = I·R. Rearrange as I = V/R or R = V/I for the unknown. Use volts, amperes and ohms; first convert mA to A and kΩ to Ω. DC resistance is not the same as the complex impedance of an AC circuit.',
    },
  },
  {
    id: 'power', match: /(?:electrical|dc|input|output) power|power.*(?:voltage|current)|(?:voltage|current).*power|efficiency/i,
    title: { es: 'Potencia y rendimiento', en: 'Power and efficiency' },
    text: {
      es: 'En continua, P = V·I. En una resistencia también P = I²·R = V²/R. El rendimiento es η = P útil/P de entrada × 100 %. En alterna, la potencia media depende del desfase: para señales sinusoidales P = V rms·I rms·cos φ. La potencia de entrada no se convierte íntegramente en RF: también hay pérdidas.',
      en: 'For DC, P = V·I. In a resistor, P = I²·R = V²/R also applies. Efficiency is η = useful output/input × 100%. For sinusoidal AC, average power is V rms·I rms·cos φ. Input power does not all become RF output; some is lost.',
    },
  },
  {
    id: 'decibels', match: /decibel|\bdB[imc]?\b/i,
    title: { es: 'Decibelios', en: 'Decibels' },
    text: {
      es: 'Para potencias, G dB = 10·log10(P salida/P entrada). Para tensiones con la misma impedancia, G dB = 20·log10(V salida/V entrada). +3 dB equivale aproximadamente a duplicar potencia y +10 dB a multiplicarla por diez. dBi y dBd usan referencias de antena distintas; dBm referencia 1 mW.',
      en: 'For power, G dB = 10·log10(output/input). For voltages at equal impedance, use 20·log10(output/input). +3 dB approximately doubles power; +10 dB multiplies it by ten. dBi and dBd use different antenna references; dBm is referenced to 1 mW.',
    },
  },
  {
    id: 'wavelength', match: /wavelength|wave length|half.wave|quarter.wave/i,
    title: { es: 'Frecuencia y longitud de onda', en: 'Frequency and wavelength' },
    text: {
      es: 'La relación es v = f·λ. En el espacio libre λ en metros ≈ 300/f en MHz. Media onda es λ/2 y un cuarto de onda λ/4. Una antena real puede ser más corta por efectos de extremos; en una línea, la velocidad de propagación se reduce por su factor de velocidad. No apliques automáticamente 300/f a la longitud física de un cable.',
      en: 'The relationship is v = f·λ. In free space, wavelength in meters is approximately 300/f in MHz. Half-wave is λ/2 and quarter-wave λ/4. Real antennas may be shorter because of end effects; a transmission line has a reduced propagation speed set by its velocity factor. Do not automatically use 300/f as a cable’s physical length.',
    },
  },
  {
    id: 'reactance', match: /reactance|resonan|impedance|capacitan|inductan|\bLC\b/i,
    title: { es: 'Reactancia, impedancia y resonancia', en: 'Reactance, impedance and resonance' },
    text: {
      es: 'La reactancia inductiva es XL = 2πfL y la capacitiva XC = 1/(2πfC). Al aumentar f, XL aumenta y XC disminuye. En un LC ideal, la resonancia ocurre cuando XL = XC: f0 = 1/(2π√LC). La impedancia incluye resistencia y reactancia; en resonancia serie la impedancia es mínima, mientras que un circuito paralelo ideal presenta impedancia máxima.',
      en: 'Inductive reactance is XL = 2πfL; capacitive reactance is XC = 1/(2πfC). Increasing frequency increases XL and decreases XC. An ideal LC resonates when XL = XC: f0 = 1/(2π√LC). Impedance includes resistance and reactance. Series resonance gives minimum impedance; ideal parallel resonance gives maximum impedance.',
    },
  },
  {
    id: 'swr', match: /\bSWR\b|standing.wave|reflected power|reflection coefficient/i,
    title: { es: 'ROE y adaptación', en: 'SWR and matching' },
    text: {
      es: 'La ROE describe la onda estacionaria debida a reflexiones por desadaptación. ROE = (1 + |Γ|)/(1 − |Γ|), con |Γ| = √(P reflejada/P directa) en el mismo punto de medida. Una ROE 1:1 indica adaptación en ese punto, no garantiza que la antena radie eficientemente. Un acoplador adapta la impedancia que ve el transmisor, pero no elimina por sí mismo las pérdidas en la línea.',
      en: 'SWR describes standing waves caused by mismatch reflections. SWR = (1 + |Γ|)/(1 − |Γ|), where |Γ| = √(reflected/forward power) at the same measurement point. A 1:1 SWR indicates a match there, not necessarily an efficient radiator. A tuner matches the load seen by the transmitter but does not itself eliminate feed-line losses.',
    },
  },
  {
    id: 'modulation', match: /\b(?:SSB|USB|LSB|AM|FM|modulation|sideband)\b/i,
    title: { es: 'Modulación y espectro ocupado', en: 'Modulation and occupied spectrum' },
    text: {
      es: 'La modulación transporta información variando una característica de la portadora. AM varía amplitud y FM frecuencia. SSB transmite una sola banda lateral: USB queda por encima de la frecuencia de portadora y LSB por debajo. Al comprobar un límite de banda debes considerar todo el espectro emitido, no solo la frecuencia indicada en la pantalla.',
      en: 'Modulation carries information by varying a carrier property. AM varies amplitude; FM varies frequency. SSB transmits one sideband: USB lies above the carrier frequency and LSB below it. Band-edge compliance concerns the entire transmitted spectrum, not just the displayed frequency.',
    },
  },
  {
    id: 'propagation', match: /ionosph|propagation|skip|sunspot|solar|F2 layer|sporadic.E|tropospher|MUF|LUF/i,
    title: { es: 'Propagación', en: 'Propagation' },
    text: {
      es: 'La propagación depende de frecuencia, trayecto, hora y actividad solar. La ionosfera puede devolver señales HF a Tierra; la capa D suele absorber HF y las regiones E/F permiten trayectos por onda ionosférica. MUF es la máxima frecuencia utilizable para un trayecto y condiciones dados, no una constante universal. En VHF/UHF también intervienen visión directa, troposfera y fenómenos especiales.',
      en: 'Propagation depends on frequency, path, time and solar activity. The ionosphere can return HF signals to Earth; the D region often absorbs HF, while E/F regions support skywave paths. MUF is the maximum usable frequency for a particular path and conditions, not a universal constant. VHF/UHF also involve line of sight, the troposphere and special mechanisms.',
    },
  },
  {
    id: 'antenna', match: /antenna|dipole|Yagi|polarization|radiation pattern|feed.line|coax|balun/i,
    title: { es: 'Antenas y líneas de transmisión', en: 'Antennas and transmission lines' },
    text: {
      es: 'Una antena transforma energía guiada en ondas electromagnéticas y viceversa. Su diagrama describe cómo distribuye la radiación; la ganancia concentra energía en determinadas direcciones, no crea potencia. La polarización la determina el campo eléctrico. La línea transporta RF y añade pérdidas; un balun puede resolver la transición balanceado/no balanceado, según su diseño.',
      en: 'An antenna converts guided energy into electromagnetic waves and vice versa. Its pattern describes radiation distribution; gain concentrates energy in certain directions rather than creating power. Polarization follows the electric field. Feed lines carry RF and introduce losses; a balun can provide a balanced/unbalanced transition, depending on its design.',
    },
  },
  {
    id: 'semiconductors', match: /diode|transistor|semiconductor|rectif|MOSFET|JFET|\bFET\b/i,
    title: { es: 'Semiconductores', en: 'Semiconductors' },
    text: {
      es: 'Un diodo conduce principalmente en un sentido y puede rectificar o detectar señales. Un transistor controla una corriente mediante otra señal y puede amplificar o conmutar. Importan la polarización, la potencia disipada y los valores máximos admisibles. Un FET se controla mediante tensión de puerta; no debe confundirse su funcionamiento con la corriente de base de un transistor bipolar.',
      en: 'A diode primarily conducts in one direction and can rectify or detect signals. A transistor controls current with another signal and can amplify or switch. Bias, dissipation and maximum ratings matter. A FET is controlled by gate voltage; its operation should not be confused with bipolar-transistor base current.',
    },
  },
  {
    id: 'safety', match: /safety|electric shock|electrocution|grounding|lightning|exposure|fuse|circuit breaker/i,
    title: { es: 'Seguridad eléctrica y de RF', en: 'Electrical and RF safety' },
    text: {
      es: 'Los riesgos eléctricos y de RF no son intercambiables. Fusibles e interruptores protegen principalmente frente a sobrecorrientes; un diferencial/GFCI detecta desequilibrio de corriente. Desconecta y verifica ausencia de tensión antes de intervenir, teniendo en cuenta energía almacenada. La evaluación de exposición RF depende de frecuencia, potencia, antena, distancia y ciclo de trabajo; una fórmula aislada no sustituye la evaluación reglamentaria.',
      en: 'Electrical and RF hazards are different. Fuses and circuit breakers primarily protect against overcurrent; a GFCI detects current imbalance. Disconnect and verify absence of voltage before servicing, including stored energy. RF exposure evaluation depends on frequency, power, antenna, distance and duty cycle; an isolated formula does not replace the regulatory evaluation.',
    },
  },
  {
    id: 'receiver', match: /receiver|superheterodyne|mixer|intermediate frequency|selectivity|sensitivity/i,
    title: { es: 'Recepción y conversión de frecuencia', en: 'Reception and frequency conversion' },
    text: {
      es: 'La sensibilidad describe la capacidad para recibir señales débiles y la selectividad para separar señales próximas. Un mezclador produce componentes suma y diferencia de sus entradas; filtros seleccionan la conversión útil. La frecuencia imagen puede producir una respuesta no deseada. No confundas ganancia con sensibilidad ni una señal fuerte con una señal libre de interferencias.',
      en: 'Sensitivity describes reception of weak signals; selectivity separates nearby signals. A mixer produces sum and difference components, and filters select the useful conversion. An image frequency can create an unwanted response. Gain is not the same as sensitivity, and a strong signal is not necessarily free of interference.',
    },
  },
  {
    id: 'digital', match: /digital|binary|packet|FT8|RTTY|PSK|sampling|Nyquist|baud|bit rate/i,
    title: { es: 'Señales digitales', en: 'Digital signals' },
    text: {
      es: 'Los bits representan información y los símbolos son estados transmitidos: baudios y bits/s solo coinciden cuando cada símbolo representa un bit. En muestreo de una señal limitada en banda se necesita una frecuencia superior al doble de su frecuencia máxima y filtrado antialias. Los protocolos digitales pueden añadir sincronización, detección/corrección de errores y retransmisiones.',
      en: 'Bits represent information; symbols are transmitted states. Baud and bits/s coincide only when each symbol carries one bit. Sampling a band-limited signal requires a rate above twice its highest frequency and anti-alias filtering. Digital protocols may add synchronization, error detection/correction and retransmission.',
    },
  },
]

const specific: Record<string, Bilingual> = {
  T5C08: {
    es: 'En continua, la potencia es el producto de tensión y corriente: P = E·I. E y V representan aquí la misma magnitud, tensión en voltios; I se expresa en amperios y P en vatios.',
    en: 'DC power is voltage times current: P = E·I. E and V both denote voltage in volts here; I is in amperes and P in watts.',
  },
  T5C09: {
    es: 'Aplica P = V·I: 13,8 V × 10 A = 138 W. Se multiplican ambas magnitudes, no se suman; voltio por amperio equivale a vatio en continua.',
    en: 'Use P = V·I: 13.8 V × 10 A = 138 W. Multiply, do not add; volt-amperes equal watts for this DC calculation.',
  },
  T5C10: {
    es: 'En continua, P = V·I = 12 × 2,5 = 30 W. Dividir 12 entre 2,5 no calcula potencia.',
    en: 'For DC, P = V·I = 12 × 2.5 = 30 W. Dividing 12 by 2.5 does not calculate power.',
  },
  T5C11: {
    es: 'Despeja la corriente de P = V·I: I = P/V = 120 W / 12 V = 10 A.',
    en: 'Rearrange P = V·I for current: I = P/V = 120 W / 12 V = 10 A.',
  },
  T5D01: {
    es: 'La ley de Ohm es E = I·R. Para encontrar corriente divide tensión entre resistencia: I = E/R. Voltios divididos entre ohmios dan amperios.',
    en: "Ohm's law is E = I·R. Solve for current by dividing voltage by resistance: I = E/R. Volts divided by ohms gives amperes.",
  },
  T5D02: {
    es: 'La ley de Ohm expresa la tensión como corriente por resistencia: E = I·R. Amperios por ohmios dan voltios.',
    en: "Ohm's law gives voltage as current times resistance: E = I·R. Amperes times ohms gives volts.",
  },
  T5D03: {
    es: 'De E = I·R se obtiene R = E/I. Se divide la tensión entre la corriente, no al revés.',
    en: 'From E = I·R, R = E/I. Divide voltage by current, not the reverse.',
  },
  T5D04: { es: 'R = V/I = 90 V / 3 A = 30 Ω.', en: 'R = V/I = 90 V / 3 A = 30 Ω.' },
  T5D05: { es: 'R = V/I = 12 V / 1,5 A = 8 Ω.', en: 'R = V/I = 12 V / 1.5 A = 8 Ω.' },
  T5D06: { es: 'R = V/I = 12 V / 4 A = 3 Ω.', en: 'R = V/I = 12 V / 4 A = 3 Ω.' },
  T5D07: { es: 'I = V/R = 120 V / 80 Ω = 1,5 A.', en: 'I = V/R = 120 V / 80 Ω = 1.5 A.' },
  T5D08: { es: 'I = V/R = 200 V / 100 Ω = 2 A.', en: 'I = V/R = 200 V / 100 Ω = 2 A.' },
  T5D09: { es: 'I = V/R = 240 V / 24 Ω = 10 A.', en: 'I = V/R = 240 V / 24 Ω = 10 A.' },
  T5D10: { es: 'V = I·R = 0,5 A × 2 Ω = 1 V.', en: 'V = I·R = 0.5 A × 2 Ω = 1 V.' },
  T5D11: { es: 'V = I·R = 1 A × 10 Ω = 10 V.', en: 'V = I·R = 1 A × 10 Ω = 10 V.' },
  T5D12: { es: 'V = I·R = 2 A × 10 Ω = 20 V.', en: 'V = I·R = 2 A × 10 Ω = 20 V.' },
  T5D13: {
    es: 'En serie hay un único camino para la corriente, de modo que atraviesa todos los componentes con el mismo valor. La tensión se reparte entre ellos.',
    en: 'A series circuit has a single current path, so the same current passes through every component. Voltage is shared among them.',
  },
  T5D14: {
    es: 'Las ramas en paralelo están conectadas a los mismos dos nodos; por eso tienen la misma diferencia de potencial. Sus corrientes pueden ser distintas.',
    en: 'Parallel branches connect to the same two nodes, so they have the same potential difference. Their currents may differ.',
  },
  G5B01: {
    es: '10·log10(2) ≈ 3,01 dB. Duplicar potencia es aproximadamente +3 dB; reducirla a la mitad es −3 dB. El factor 20 corresponde a razones de tensión con igual impedancia.',
    en: '10·log10(2) ≈ 3.01 dB. Doubling power is approximately +3 dB; halving it is −3 dB. The factor 20 applies to voltage ratios at equal impedance.',
  },
  G5B02: {
    es: 'La ley de corrientes de Kirchhoff exige que la corriente que entra en un nodo sea igual a la que sale. Por tanto la corriente total es la suma de las corrientes de las ramas en paralelo.',
    en: "Kirchhoff's current law requires current entering a node to equal current leaving it. Total current therefore equals the sum of the parallel branch currents.",
  },
  G5B03: {
    es: 'Para una carga resistiva P = V²/R = 400²/800 = 200 W. Alternativamente I = 400/800 = 0,5 A y P = 400 × 0,5.',
    en: 'For a resistive load, P = V²/R = 400²/800 = 200 W. Alternatively I = 400/800 = 0.5 A and P = 400 × 0.5.',
  },
  G5B04: { es: 'P = V·I = 12 × 0,2 = 2,4 W.', en: 'P = V·I = 12 × 0.2 = 2.4 W.' },
  G5B05: {
    es: 'Convierte primero 7 mA = 0,007 A. P = I²·R = 0,007² × 1250 = 0,06125 W = 61,25 mW, aproximadamente 61 mW.',
    en: 'First convert 7 mA = 0.007 A. P = I²·R = 0.007² × 1250 = 0.06125 W = 61.25 mW, approximately 61 mW.',
  },
  G5B06: {
    es: 'Para la señal sinusoidal considerada, V pico = V pico a pico/2 = 100 V. V rms = 100/√2 y PEP = V pico²/(2R) = 100²/(2 × 50) = 100 W. PEP no es la potencia instantánea máxima.',
    en: 'For the sinusoidal signal assumed here, V peak = V peak-to-peak/2 = 100 V. V rms = 100/√2 and PEP = V peak²/(2R) = 100²/(2 × 50) = 100 W. PEP is not the maximum instantaneous power.',
  },
  G5B07: {
    es: 'El valor eficaz (RMS) de una tensión alterna se define por producir en una resistencia el mismo calentamiento medio que una tensión continua de ese valor. No es necesariamente el valor medio de la señal.',
    en: 'The RMS value of an AC voltage is defined by producing the same average heating in a resistor as a DC voltage of that value. It is not necessarily the signal’s mean value.',
  },
  G5B08: {
    es: 'Para una sinusoide V pico = √2·V rms y V pico a pico = 2√2·V rms. Con 120 V rms: 2 × √2 × 120 ≈ 339,4 V.',
    en: 'For a sine wave, V peak = √2·V rms and V peak-to-peak = 2√2·V rms. At 120 V rms: 2 × √2 × 120 ≈ 339.4 V.',
  },
  G5B09: { es: 'Para una sinusoide V rms = V pico/√2 = 17/√2 ≈ 12,0 V.', en: 'For a sine wave, V rms = V peak/√2 = 17/√2 ≈ 12.0 V.' },
  G5B10: {
    es: 'Una pérdida de 1 dB deja una fracción de potencia 10^(−1/10) ≈ 0,7943. La fracción perdida es 1 − 0,7943 = 0,2057, es decir, aproximadamente 20,6 %.',
    en: 'A 1 dB loss leaves a power fraction of 10^(−1/10) ≈ 0.7943. The lost fraction is 1 − 0.7943 = 0.2057, or approximately 20.6%.',
  },
  G5B11: {
    es: 'Una portadora sin modular tiene envolvente constante. Por eso su potencia media y su potencia de envolvente de cresta (PEP) coinciden: PEP/P media = 1.',
    en: 'An unmodulated carrier has a constant envelope, so average power and peak envelope power (PEP) are equal: PEP/average power = 1.',
  },
  G5B12: {
    es: 'En una resistencia P = V rms²/R. Despejando, V rms = √(P·R) = √(1200 × 50) ≈ 244,95 V, que se redondea a 245 V.',
    en: 'For a resistor, P = V rms²/R. Thus V rms = √(P·R) = √(1200 × 50) ≈ 244.95 V, rounded to 245 V.',
  },
  G5B13: {
    es: 'Sin modulación, la envolvente es constante y PEP = potencia media. Por tanto PEP = 1060 W, no el doble de ese valor.',
    en: 'Without modulation the envelope is constant and PEP equals average power. PEP is therefore 1060 W, not twice that value.',
  },
  G5B14: {
    es: 'V pico = 500/2 = 250 V. Para la señal sinusoidal, PEP = V pico²/(2R) = 250²/(2 × 50) = 625 W.',
    en: 'V peak = 500/2 = 250 V. For the sinusoidal signal, PEP = V peak²/(2R) = 250²/(2 × 50) = 625 W.',
  },
  E9F06: {
    es: 'La línea está aislada por aire, por lo que se aproxima su factor de velocidad a 1. λ = 300/14,10 ≈ 21,28 m; media onda mide 21,28/2 ≈ 10,64 m, redondeado a 10,6 m.',
    en: 'For an air-insulated line, approximate the velocity factor as 1. λ = 300/14.10 ≈ 21.28 m; half a wavelength is 21.28/2 ≈ 10.64 m, rounded to 10.6 m.',
  },
  T1A01: {
    es: 'El §97.1(b) incluye expresamente la continuación y ampliación de la capacidad demostrada del radioaficionado para contribuir al avance del arte de la radio. Por eso la opción sobre desarrollar habilidades técnicas y de comunicación es la que corresponde a la finalidad del servicio; las demás opciones no son todas finalidades enumeradas.',
    en: 'Section 97.1(b) expressly includes continuing and extending amateurs’ proven ability to contribute to advancement of the radio art. Developing technical and communication skills fits that purpose; the other listed choices are not all enumerated purposes.',
  },
  T1A02: {
    es: 'La FCC es la autoridad federal que regula el servicio de radioaficionados estadounidense mediante el título 47 del CFR, parte 97. ARRL es una asociación, no el regulador. No debe confundirse una entidad de apoyo o coordinación de exámenes con la autoridad que dicta y aplica las normas.',
    en: 'The FCC is the federal authority regulating the US amateur service under Title 47 CFR Part 97. ARRL is an association, not the regulator. An organization supporting amateurs or coordinating exams is not the authority that issues and enforces the rules.',
  },
  E1A01: {
    es: 'En USB, la banda lateral ocupa frecuencias por encima de la portadora. 14,348 MHz + 0,003 MHz = 14,351 MHz. El borde superior de la banda de 20 metros es 14,350 MHz; por tanto, el último 1 kHz quedaría fuera. No basta con que la portadora indicada esté dentro de banda.',
    en: 'USB occupies frequencies above the carrier. 14.348 MHz + 0.003 MHz = 14.351 MHz. The upper edge of the 20-meter band is 14.350 MHz, so the upper 1 kHz would be outside the band. A displayed carrier inside the band is not sufficient.',
  },
  E1A02: {
    es: 'En LSB, el espectro de voz se extiende por debajo de la portadora indicada. Para una señal de 3 kHz, situar la portadora 3 kHz por encima del borde inferior mantiene la banda lateral dentro del segmento. La regla práctica exige tener en cuenta el ancho de emisión completo y los límites aplicables.',
    en: 'In LSB, the voice spectrum extends below the displayed carrier. For a 3 kHz signal, placing the carrier 3 kHz above the lower edge keeps the sideband inside the segment. Account for the full emission bandwidth and applicable limits.',
  },
}

export function regulationLinks(refs: string): { section: string; url: string }[] {
  const sections = [...new Set(refs.match(/\b(?:97|1)\.\d+/g) ?? [])]
  return sections.map((section) => ({
    section,
    url: `https://www.ecfr.gov/current/title-47/chapter-I/subchapter-${section.startsWith('97.') ? 'D' : 'A'}/part-${section.split('.')[0]}/section-${section}`,
  }))
}

export function explanationFor(q: Question) {
  const principle = principles.find((item) => item.match.test(`${q.question} ${q.answers[q.correct]}`))
  return { specific: specific[q.id], principle, regulations: regulationLinks(q.refs) }
}
