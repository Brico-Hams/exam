import type { Lang } from './types'

type Explanation = Record<Lang, string>

interface Calculation {
  id: string
  formula: string
  calculate: () => number
  expected: number
  tolerance: number
  unit: string
  es: string
  en: string
}

// Values are taken from each identified question, not inferred from answer choices.
export const calculations: Calculation[] = [
  { id: 'T5B01', formula: '1.5 × 1000', calculate: () => 1.5 * 1000, expected: 1500, tolerance: 0, unit: 'mA',
    es: 'Un amperio son 1000 miliamperios; pasar a una unidad menor multiplica el valor.',
    en: 'One ampere equals 1000 milliamperes; converting to the smaller unit multiplies the value.' },
  { id: 'T5B02', formula: '1500000 / 1000', calculate: () => 1500000 / 1000, expected: 1500, tolerance: 0, unit: 'kHz',
    es: 'Cada kHz contiene 1000 Hz; divide entre 1000 para pasar de Hz a kHz.',
    en: 'Each kHz contains 1000 Hz; divide by 1000 to convert Hz to kHz.' },
  { id: 'T5B03', formula: '1 × 1000', calculate: () => 1000, expected: 1000, tolerance: 0, unit: 'V',
    es: 'El prefijo kilo significa mil, independientemente de que se aplique a voltios o a otra unidad.',
    en: 'The prefix kilo means one thousand, whether applied to volts or another unit.' },
  { id: 'T5B04', formula: '1 × 10^(-6)', calculate: () => 1e-6, expected: 1e-6, tolerance: 0, unit: 'V',
    es: 'Micro significa una millonésima; no debe confundirse con mili, que es una milésima.',
    en: 'Micro means one millionth; it is not milli, which means one thousandth.' },
  { id: 'T5B05', formula: '500 / 1000', calculate: () => 500 / 1000, expected: 0.5, tolerance: 0, unit: 'W',
    es: 'Un milivatio es 0,001 W; divide los milivatios entre 1000.',
    en: 'One milliwatt is 0.001 W; divide milliwatts by 1000.' },
  { id: 'T5B06', formula: '3000 / 1000', calculate: () => 3000 / 1000, expected: 3, tolerance: 0, unit: 'A',
    es: 'Un amperio equivale a 1000 mA; para pasar a amperios divide entre 1000.',
    en: 'One ampere equals 1000 mA; divide by 1000 to obtain amperes.' },
  { id: 'T5B07', formula: '3.525 × 1000', calculate: () => 3.525 * 1000, expected: 3525, tolerance: 0, unit: 'kHz',
    es: 'Mega es 10⁶ y kilo es 10³: un MHz contiene 1000 kHz.',
    en: 'Mega is 10⁶ and kilo is 10³: one MHz contains 1000 kHz.' },
  { id: 'T5B08', formula: '1000000 × 10^(-12) / 10^(-6)', calculate: () => 1e6 * 1e-12 / 1e-6, expected: 1, tolerance: 1e-12, unit: 'µF',
    es: 'Pico es 10⁻¹² y micro 10⁻⁶; se necesita un millón de picofaradios para un microfaradio.',
    en: 'Pico is 10⁻¹² and micro is 10⁻⁶; one million picofarads equals one microfarad.' },
  { id: 'T5B09', formula: '10·log10(10 / 5)', calculate: () => 10 * Math.log10(10 / 5), expected: 3, tolerance: 0.02, unit: 'dB',
    es: 'Se comparan potencias, por eso se usa el factor 10. Duplicar potencia produce aproximadamente +3 dB.',
    en: 'These are powers, so the factor is 10. Doubling power gives approximately +3 dB.' },
  { id: 'T5B10', formula: '10·log10(3 / 12)', calculate: () => 10 * Math.log10(3 / 12), expected: -6, tolerance: 0.03, unit: 'dB',
    es: 'La potencia final es un cuarto de la inicial; la disminución tiene signo negativo.',
    en: 'Final power is one quarter of initial power; the decrease has a negative sign.' },
  { id: 'T5B11', formula: '10·log10(200 / 20)', calculate: () => 10 * Math.log10(200 / 20), expected: 10, tolerance: 0, unit: 'dB',
    es: 'Multiplicar potencia por diez corresponde exactamente a +10 dB.',
    en: 'Multiplying power by ten corresponds to exactly +10 dB.' },
  { id: 'T5B12', formula: '28400 / 1000', calculate: () => 28400 / 1000, expected: 28.4, tolerance: 0, unit: 'MHz',
    es: 'Se divide entre 1000 al pasar de kHz a MHz. Los ceros decimales de 28,400 no cambian su valor.',
    en: 'Divide by 1000 to convert kHz to MHz. The trailing decimal zeros in 28.400 do not change its value.' },
  { id: 'T5B13', formula: '2425 / 1000', calculate: () => 2425 / 1000, expected: 2.425, tolerance: 0, unit: 'GHz',
    es: 'Un GHz contiene 1000 MHz; divide entre 1000.',
    en: 'One GHz contains 1000 MHz; divide by 1000.' },
  { id: 'G5C03', formula: '1 / (1/10 + 1/20 + 1/50)', calculate: () => 1 / (1 / 10 + 1 / 20 + 1 / 50), expected: 5.9, tolerance: 0.05, unit: 'Ω',
    es: 'En paralelo se suman conductancias; la resistencia equivalente debe ser menor que la menor resistencia de la red.',
    en: 'Parallel conductances add; equivalent resistance must be below the smallest individual resistance.' },
  { id: 'G5C04', formula: '(100 × 200) / (100 + 200)', calculate: () => 100 * 200 / (100 + 200), expected: 67, tolerance: 0.5, unit: 'Ω',
    es: 'Para dos resistencias en paralelo usa producto dividido entre suma; el resultado es menor que 100 Ω.',
    en: 'For two parallel resistors use product over sum; the result is below 100 Ω.' },
  { id: 'G5C06', formula: '120 × (1500 / 500)', calculate: () => 120 * 1500 / 500, expected: 360, tolerance: 0, unit: 'V',
    es: 'En el transformador ideal Vsec/Vpri = Nsec/Npri. Tres veces más espiras producen tres veces más tensión.',
    en: 'For an ideal transformer Vsec/Vpri = Nsec/Npri. Three times the turns produces three times the voltage.' },
  { id: 'G5C07', formula: '√(600 / 50)', calculate: () => Math.sqrt(600 / 50), expected: 3.5, tolerance: 0.05, unit: ':1',
    es: 'La razón de impedancias es el cuadrado de la razón de espiras. Toma la raíz cuadrada de 12, no 12:1.',
    en: 'Impedance ratio is the square of turns ratio. Take the square root of 12, not a 12:1 turns ratio.' },
  { id: 'G5C08', formula: '5 + 5 + 750/1000', calculate: () => 5 + 5 + 750 / 1000, expected: 10.75, tolerance: 0, unit: 'nF',
    es: 'Los condensadores en paralelo se suman. Convierte primero 750 pF a 0,750 nF.',
    en: 'Parallel capacitances add. First convert 750 pF to 0.750 nF.' },
  { id: 'G5C09', formula: '100 / 3', calculate: () => 100 / 3, expected: 33.3, tolerance: 0.05, unit: 'µF',
    es: 'Tres capacidades iguales en serie dan C/3; no se suman como en paralelo.',
    en: 'Three equal capacitors in series give C/3; they do not add as they do in parallel.' },
  { id: 'G5C10', formula: '10 / 3', calculate: () => 10 / 3, expected: 3.3, tolerance: 0.05, unit: 'mH',
    es: 'Para inductores ideales sin acoplamiento mutuo, tres valores iguales en paralelo dan L/3.',
    en: 'For ideal inductors with no mutual coupling, three equal inductances in parallel give L/3.' },
  { id: 'G5C11', formula: '20 + 50', calculate: () => 20 + 50, expected: 70, tolerance: 0, unit: 'mH',
    es: 'Las inductancias en serie se suman bajo el supuesto del banco de acoplamiento mutuo despreciable.',
    en: 'Series inductances add under the pool assumption of negligible mutual coupling.' },
  { id: 'G5C12', formula: '(20 × 50) / (20 + 50)', calculate: () => 20 * 50 / (20 + 50), expected: 14.3, tolerance: 0.05, unit: 'µF',
    es: 'Dos condensadores en serie se combinan por producto dividido entre suma; el resultado es menor que 20 µF.',
    en: 'Two series capacitors combine as product over sum; the result is below 20 µF.' },
  { id: 'E5A02', formula: '1 / (2π√(50×10^(-6) × 40×10^(-12))) / 10^6', calculate: () => 1 / (2 * Math.PI * Math.sqrt(50e-6 * 40e-12)) / 1e6, expected: 3.56, tolerance: 0.01, unit: 'MHz',
    es: 'Usa f0 = 1/(2π√LC), con henrios y faradios. R afecta pérdidas y Q, pero no entra en la fórmula ideal de resonancia usada en esta pregunta.',
    en: 'Use f0 = 1/(2π√LC), with henries and farads. R affects losses and Q but does not enter the ideal resonance formula used here.' },
  { id: 'E5A10', formula: '1 / (2π√(50×10^(-6) × 10×10^(-12))) / 10^6', calculate: () => 1 / (2 * Math.PI * Math.sqrt(50e-6 * 10e-12)) / 1e6, expected: 7.12, tolerance: 0.01, unit: 'MHz',
    es: 'Convierte 50 µH a 50×10⁻⁶ H y 10 pF a 10×10⁻¹² F. Sustituye en f0 = 1/(2π√LC) y pasa Hz a MHz.',
    en: 'Convert 50 µH to 50×10⁻⁶ H and 10 pF to 10×10⁻¹² F. Substitute into f0 = 1/(2π√LC) and convert Hz to MHz.' },
  { id: 'E5A11', formula: '7100 / 150', calculate: () => 7100 / 150, expected: 47.3, tolerance: 0.05, unit: 'kHz',
    es: 'La relación de banda de media potencia es Q = f0/B. Por tanto B = f0/Q; expresa 7,1 MHz como 7100 kHz.',
    en: 'The half-power bandwidth relationship is Q = f0/B. Thus B = f0/Q; express 7.1 MHz as 7100 kHz.' },
  { id: 'E5A12', formula: '3700 / 118', calculate: () => 3700 / 118, expected: 31.4, tolerance: 0.05, unit: 'kHz',
    es: 'B = f0/Q. Convierte a kHz antes de dividir: 3,7 MHz son 3700 kHz.',
    en: 'B = f0/Q. Convert to kHz before dividing: 3.7 MHz is 3700 kHz.' },
  { id: 'E5B04', formula: '(1000000/2) × (2 × 220×10^(-6))', calculate: () => 1e6 / 2 * (2 * 220e-6), expected: 220, tolerance: 1e-10, unit: 's',
    es: 'Las resistencias iguales en paralelo dan 0,5 MΩ y los condensadores en paralelo suman 440 µF. τ = Req·Ceq; los prefijos mega y micro se compensan.',
    en: 'Equal parallel resistors give 0.5 MΩ and parallel capacitors add to 440 µF. τ = Req·Ceq; the mega and micro scale factors cancel.' },
  { id: 'E5B07', formula: 'atan((250 − 500) / 1000) × 180/π', calculate: () => Math.atan((250 - 500) / 1000) * 180 / Math.PI, expected: -14, tolerance: 0.05, unit: '°',
    es: 'X = XL − XC = −250 Ω. φ = atan(X/R). El signo negativo indica comportamiento capacitivo: la tensión retrasa a la corriente.',
    en: 'X = XL − XC = −250 Ω. φ = atan(X/R). The negative sign indicates capacitive behavior: voltage lags current.' },
  { id: 'E5B08', formula: 'atan((100 − 300) / 100) × 180/π', calculate: () => Math.atan((100 - 300) / 100) * 180 / Math.PI, expected: -63, tolerance: 0.5, unit: '°',
    es: 'La reactancia neta es −200 Ω y la resistencia 100 Ω. El ángulo es negativo, de modo que la tensión retrasa a la corriente.',
    en: 'Net reactance is −200 Ω and resistance is 100 Ω. The angle is negative, so voltage lags current.' },
  { id: 'E5B11', formula: 'atan((75 − 25) / 100) × 180/π', calculate: () => Math.atan((75 - 25) / 100) * 180 / Math.PI, expected: 27, tolerance: 0.5, unit: '°',
    es: 'La reactancia neta es +50 Ω. El signo positivo da comportamiento inductivo: la tensión adelanta a la corriente.',
    en: 'Net reactance is +50 Ω. The positive sign means inductive behavior: voltage leads current.' },
]

const conceptual: Record<string, Explanation> = {
  G5C01: {
    es: 'La corriente alterna del primario crea flujo magnético variable que enlaza el secundario. Por la ley de Faraday se induce tensión allí: este acoplamiento se denomina inductancia mutua. Una corriente continua estacionaria no produce la misma transformación sostenida.',
    en: 'Primary AC creates changing magnetic flux linking the secondary. Faraday’s law induces voltage there; this coupling is mutual inductance. Steady DC does not produce the same sustained transformation.',
  },
  G5C02: {
    es: 'El transformador 4:1 reduce tensión cuando se alimenta por el devanado de más espiras. Al intercambiar entrada y salida se invierte la razón de tensiones: la salida ideal es cuatro veces la entrada, dentro de los límites del transformador.',
    en: 'The 4:1 transformer steps voltage down when driven through the higher-turn winding. Reversing input and output reverses the voltage ratio: ideal output is four times input, within transformer ratings.',
  },
  G5C05: {
    es: 'En un transformador elevador ideal la potencia se conserva: Vp·Ip ≈ Vs·Is. Si la tensión secundaria es mayor, la corriente primaria es mayor que la secundaria para esa transferencia. El conductor primario más grueso reduce calentamiento y caída de tensión.',
    en: 'An ideal step-up transformer conserves power: Vp·Ip ≈ Vs·Is. With higher secondary voltage, primary current is higher than secondary current for that transfer. Thicker primary wire reduces heating and voltage drop.',
  },
  G5C13: {
    es: 'En paralelo ambos condensadores comparten tensión y sus cargas se suman: Qtotal = (C1 + C2)·V. Por ello aumenta la capacitancia equivalente. En serie, por el contrario, se obtiene una capacitancia menor que cualquiera de las dos.',
    en: 'Parallel capacitors share voltage and their charges add: Qtotal = (C1 + C2)·V. Equivalent capacitance therefore increases. In series, equivalent capacitance is smaller than either capacitor.',
  },
  G5C14: {
    es: 'Sin acoplamiento mutuo apreciable, las tensiones inductivas en serie se suman y Leq = L1 + L2. Para aumentar inductancia se añade otra en serie. El acoplamiento entre bobinas modificaría esta suma y debe considerarse en un diseño real.',
    en: 'With negligible mutual coupling, series inductive voltages add and Leq = L1 + L2. Add an inductor in series to increase inductance. Coupling between coils would modify this sum and matters in real designs.',
  },
  E5A01: {
    es: 'En resonancia serie, las tensiones reactivas de L y C se oponen y se cancelan en la suma aplicada. La corriente puede ser grande y las tensiones individuales alcanzar aproximadamente Q veces la aplicada. No se crea energía: se intercambia entre los campos y se repone la pérdida resistiva.',
    en: 'At series resonance, L and C reactive voltages oppose and cancel in the applied sum. Current can be large and individual voltages can approach Q times the applied voltage. Energy is exchanged between fields and resistive loss is replenished; no energy is created.',
  },
  E5A03: {
    es: 'En resonancia serie XL = XC. Z = R + j(XL − XC) se reduce a R, por lo que el módulo de impedancia queda aproximadamente igual a la resistencia del circuito, incluidas sus pérdidas.',
    en: 'At series resonance XL = XC. Z = R + j(XL − XC) reduces to R, so impedance magnitude is approximately the circuit resistance, including losses.',
  },
  E5A04: {
    es: 'En el modelo RLC paralelo usado aquí, las susceptancias de L y C se cancelan en resonancia. La admitancia restante es la conductancia 1/R y, por tanto, la impedancia es aproximadamente R. No debe confundirse esta R paralela equivalente con una pequeña resistencia serie de una bobina.',
    en: 'In the parallel RLC model used here, L and C susceptances cancel at resonance. Remaining admittance is conductance 1/R, so impedance is approximately R. This equivalent parallel R is not the same as a coil’s small series resistance.',
  },
  E5A05: {
    es: 'El factor de calidad satisface aproximadamente Q = f0/B para la banda de media potencia. Manteniendo f0, aumentar Q reduce B: el ajuste es más selectivo y necesita retocarse al cambiar más de frecuencia.',
    en: 'Quality factor approximately satisfies Q = f0/B for half-power bandwidth. At fixed f0, increasing Q reduces B: matching is more selective and needs retuning over a smaller frequency change.',
  },
  E5A06: {
    es: 'En resonancia paralela, las corrientes reactivas de L y C son grandes y opuestas; circulan dentro del tanque y se cancelan en la entrada. Por eso puede haber corriente interna máxima con corriente mínima suministrada por la fuente.',
    en: 'At parallel resonance, large opposing L and C reactive currents circulate inside the tank and cancel at the input. Maximum internal current can therefore coexist with minimum source current.',
  },
  E5A07: {
    es: 'En resonancia paralela la impedancia de entrada es máxima para el circuito y la excitación considerados. Con tensión de entrada fija, Ientrada = V/Z alcanza un mínimo, aunque las corrientes dentro de L y C puedan ser grandes.',
    en: 'At parallel resonance input impedance is maximum for the circuit and excitation considered. At fixed input voltage, Iinput = V/Z is minimum, even though L and C branch currents can be large.',
  },
  E5A08: {
    es: 'En resonancia serie, la reactancia inductiva y capacitiva se cancelan. La impedancia resultante es resistiva y el desfase entre tensión total y corriente es cero: están en fase.',
    en: 'At series resonance inductive and capacitive reactance cancel. The resulting impedance is resistive and total voltage-current phase angle is zero: they are in phase.',
  },
  E5A09: {
    es: 'Para el modelo RLC paralelo con R como resistencia paralela equivalente, Q = R/XL = R/XC en resonancia. No uses la fórmula serie Q = X/R con esa misma R: pertenece a un modelo diferente.',
    en: 'For the parallel RLC model with R as equivalent parallel resistance, Q = R/XL = R/XC at resonance. Do not use the series formula Q = X/R with that same R; it belongs to a different model.',
  },
  E5A13: {
    es: 'En un circuito serie resonante, las tensiones reactivas internas crecen aproximadamente con Q para una misma tensión de excitación. Sus fases opuestas permiten que su suma siga siendo compatible con la tensión aplicada. Esto puede exigir componentes con mayor tensión admisible.',
    en: 'In a series resonant circuit, internal reactive voltages grow approximately with Q at fixed excitation. Their opposing phases keep the sum consistent with applied voltage. Components may therefore need higher voltage ratings.',
  },
  E5B01: {
    es: 'Una constante de tiempo τ = RC deja un factor e⁻¹ ≈ 0,368 en una descarga. En carga desde cero, el avance es 1 − e⁻¹ ≈ 0,632 del cambio final. No significa que la carga esté completa después de τ.',
    en: 'One time constant τ = RC leaves a factor e⁻¹ ≈ 0.368 during discharge. Charging from zero reaches 1 − e⁻¹ ≈ 0.632 of the final change. Charging is not complete after τ.',
  },
  E5B02: {
    es: 'La admitancia se escribe Y = G + jB. G es conductancia y B susceptancia; ambas se expresan en siemens. B no representa aquí ni resistencia ni densidad de flujo magnético.',
    en: 'Admittance is written Y = G + jB. G is conductance and B susceptance; both use siemens. Here B represents neither resistance nor magnetic flux density.',
  },
  E5B03: {
    es: 'Si Z = |Z|∠φ, Y = 1/Z = (1/|Z|)∠(−φ). Se invierte el módulo y se cambia el signo del ángulo. Invertir solo la parte resistiva de una impedancia compleja no calcula la admitancia.',
    en: 'If Z = |Z|∠φ, Y = 1/Z = (1/|Z|)∠(−φ). Invert the magnitude and reverse the angle. Inverting only the resistive component of complex impedance does not produce admittance.',
  },
  E5B05: {
    es: 'Para reactancia pura Z = jX, su inversa es Y = 1/(jX) = −j/X. Por tanto el módulo de susceptancia es 1/|X|; además su signo es el opuesto. Se pasa de ohmios a siemens.',
    en: 'For pure reactance Z = jX, its inverse is Y = 1/(jX) = −j/X. Susceptance magnitude is therefore 1/|X| and its sign is reversed. Units change from ohms to siemens.',
  },
  E5B06: {
    es: 'La admitancia Y = G + jB separa una parte real, conductancia, y una imaginaria, susceptancia. Por definición B es la parte imaginaria de Y y se mide en siemens. No es la parte imaginaria de Z, que es reactancia.',
    en: 'Admittance Y = G + jB separates real conductance and imaginary susceptance. B is by definition the imaginary part of Y, measured in siemens. The imaginary part of Z is instead reactance.',
  },
  E5B09: {
    es: 'Para un condensador ideal i = C·dv/dt. Derivar una tensión sinusoidal adelanta su fase 90°, por lo que la corriente adelanta 90° a la tensión. Las pérdidas reales pueden apartar el valor del ideal.',
    en: 'For an ideal capacitor i = C·dv/dt. Differentiating sinusoidal voltage advances phase by 90°, so current leads voltage by 90°. Real losses can change the ideal value.',
  },
  E5B10: {
    es: 'Para una bobina ideal v = L·di/dt. La tensión es la derivada de la corriente y la adelanta 90°. Equivale a decir que la corriente retrasa 90° respecto a la tensión.',
    en: 'For an ideal inductor v = L·di/dt. Voltage is the derivative of current and leads it by 90°. Equivalently, current lags voltage by 90°.',
  },
  E5B12: {
    es: 'La admitancia es Y = 1/Z. Describe la facilidad de paso de corriente y se mide en siemens. Cuando Z es compleja, la inversión afecta tanto a la parte real como a la imaginaria; no se invierten por separado.',
    en: 'Admittance is Y = 1/Z. It describes ease of current flow and is measured in siemens. For complex Z, inversion affects both real and imaginary parts; do not invert them separately.',
  },
  E5C01: {
    es: 'Una reactancia capacitiva pura tiene R = 0 y X negativo. Por eso 100 Ω capacitivos se escriben Z = 0 − j100 Ω, no +j100 ni 100 + j0.',
    en: 'Pure capacitive reactance has R = 0 and negative X. Therefore 100 Ω capacitive reactance is Z = 0 − j100 Ω, not +j100 or 100 + j0.',
  },
  E5C02: {
    es: 'La forma polar Z = |Z|∠φ da distancia al origen y ángulo de fase. La forma rectangular R + jX da las componentes resistiva y reactiva. Son dos representaciones del mismo número complejo.',
    en: 'Polar form Z = |Z|∠φ gives distance from the origin and phase angle. Rectangular form R + jX gives resistive and reactive components. Both represent the same complex number.',
  },
  E5C03: {
    es: 'Una inductancia ideal presenta Z = jXL, en el eje imaginario positivo. Su ángulo de impedancia es +90°: la tensión adelanta a la corriente.',
    en: 'An ideal inductance has Z = jXL on the positive imaginary axis. Its impedance angle is +90°: voltage leads current.',
  },
  E5C04: {
    es: 'Una escala logarítmica, a menudo expresada en dB, permite mostrar grandes diferencias de ganancia o atenuación en un espacio legible. No significa que cada división corresponda al mismo incremento lineal de tensión.',
    en: 'A logarithmic scale, often expressed in dB, shows large gain or attenuation ranges in readable space. Equal divisions do not represent equal linear voltage increments.',
  },
  E5C05: {
    es: 'Un diagrama fasorial representa amplitudes y fases mediante vectores giratorios de referencia común. Permite sumar tensiones o impedancias considerando sus fases, a diferencia de sumar solo sus módulos.',
    en: 'A phasor diagram represents amplitudes and phases as vectors with a common reference. It supports sums of voltages or impedances including phase rather than adding magnitudes alone.',
  },
  E5C06: {
    es: 'En Z = 50 − j25 Ω, la parte real 50 es resistencia y la parte imaginaria negativa corresponde a 25 Ω de reactancia capacitiva. La suma de impedancias corresponde a la conexión serie.',
    en: 'For Z = 50 − j25 Ω, real part 50 is resistance and the negative imaginary part is 25 Ω capacitive reactance. Adding impedances corresponds to a series connection.',
  },
  E5C07: {
    es: 'Una resistencia pura tiene reactancia cero. En el plano rectangular de impedancia, el eje horizontal representa R y el vertical X; por eso la resistencia se sitúa sobre el horizontal.',
    en: 'A pure resistance has zero reactance. On the rectangular impedance plane, the horizontal axis is R and vertical axis X, placing resistance on the horizontal axis.',
  },
  E5C08: {
    es: 'Las coordenadas polares expresan directamente módulo y ángulo. Son útiles cuando se desea mostrar fase; pueden convertirse a rectangulares mediante R = |Z|cosφ y X = |Z|sinφ.',
    en: 'Polar coordinates directly express magnitude and angle. They are useful for displaying phase and convert to rectangular form using R = |Z|cosφ and X = |Z|sinφ.',
  },
  E5C09: {
    es: 'En el plano complejo de impedancia, la coordenada horizontal es la parte real R y la vertical es la reactancia X. La parte positiva vertical es inductiva y la negativa capacitiva.',
    en: 'In the complex impedance plane, the horizontal coordinate is real resistance R and the vertical coordinate is reactance X. Positive vertical values are inductive and negative ones capacitive.',
  },
}

export function calculationExplanation(id: string): Explanation | undefined {
  const item = calculations.find((entry) => entry.id === id)
  if (!item) return conceptual[id]
  const result = Number(item.calculate().toPrecision(6))
  return {
    es: `${item.es} Cálculo: ${item.formula} ≈ ${result.toLocaleString('es', { maximumSignificantDigits: 6 })} ${item.unit}. Redondeo de la opción del banco: ${item.expected.toLocaleString('es', { maximumSignificantDigits: 6 })} ${item.unit}.`,
    en: `${item.en} Calculation: ${item.formula} ≈ ${result.toLocaleString('en', { maximumSignificantDigits: 6 })} ${item.unit}. Rounded pool option: ${item.expected.toLocaleString('en', { maximumSignificantDigits: 6 })} ${item.unit}.`,
  }
}
