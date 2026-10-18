import type { Lang } from './types'

export interface TopicGuide {
  id: string
  groups: string[]
  title: Record<Lang, string>
  text: Record<Lang, string>
}

export const topicGuides: TopicGuide[] = [
  {
    id: 'fcc-purpose', groups: ['T1A'],
    title: { es: 'Finalidad del servicio y definiciones', en: 'Service purpose and definitions' },
    text: {
      es: 'La parte 97 del título 47 del CFR establece el servicio de radioaficionados de EE. UU. Sus objetivos incluyen formación, experimentación y comunicaciones de emergencia, no un servicio comercial. Las definiciones reglamentarias determinan qué es una estación, una comunicación de terceros o una estación auxiliar: el significado cotidiano de un término no sustituye su definición legal. La sección citada por la pregunta identifica el fundamento que debe consultarse.',
      en: 'Title 47 CFR Part 97 establishes the US amateur service. Its purposes include training, experimentation and emergency communication, not commercial service. Regulatory definitions determine what constitutes a station, third-party communication or auxiliary station: everyday usage does not replace the legal definition. The section cited by the question identifies the relevant rule.',
    },
  },
  {
    id: 'fcc-bands', groups: ['T1B', 'G1A', 'E1A'],
    title: { es: 'Atribuciones, privilegios y límites de banda', en: 'Allocations, privileges and band edges' },
    text: {
      es: 'Una frecuencia solo puede usarse si coinciden la atribución al servicio, los privilegios de la licencia, la emisión autorizada y cualquier restricción específica. Todo el espectro transmitido debe quedar dentro del segmento permitido: en USB se extiende por encima de la portadora y en LSB por debajo. Una atribución secundaria obliga a no causar interferencia perjudicial al servicio primario y no otorga protección frente a él. Consulta el apartado y la edición aplicables, no una tabla de otro nivel de licencia.',
      en: 'A frequency is usable only when the service allocation, license privileges, permitted emission and specific restrictions all agree. The entire transmitted spectrum must fit within the authorized segment: USB extends above the carrier and LSB below it. A secondary allocation requires avoiding harmful interference to the primary service and provides no protection from it. Use the applicable subsection and edition, not a band chart for another license class.',
    },
  },
  {
    id: 'fcc-licensing', groups: ['T1C', 'G1D', 'E1E'],
    title: { es: 'Licencias, exámenes y acreditación', en: 'Licensing, examinations and accreditation' },
    text: {
      es: 'La autorización procede de la FCC; los examinadores voluntarios administran pruebas bajo un coordinador, pero aprobar una prueba no equivale por sí solo a disponer de cualquier privilegio de emisión. La clase de licencia, la vigencia, las acreditaciones de elementos y la aparición de la autorización en la base de datos determinan cuándo pueden ejercerse los privilegios. Las excepciones para licencias antiguas y los requisitos de los examinadores deben comprobarse en la sección citada, sin extrapolarlos a todos los aspirantes.',
      en: 'Authorization comes from the FCC. Volunteer examiners administer tests under a coordinator, but passing a test alone does not confer every transmitting privilege. License class, validity, element credit and the authorization record determine when privileges can be exercised. Exceptions for old licenses and examiner requirements must be checked in the cited rule rather than generalized to all applicants.',
    },
  },
  {
    id: 'fcc-permitted', groups: ['T1D', 'G1E', 'E1F'],
    title: { es: 'Comunicaciones permitidas y restricciones', en: 'Permitted communications and restrictions' },
    text: {
      es: 'El servicio de aficionados no autoriza automáticamente radiodifusión, comunicaciones comerciales, mensajes cifrados para ocultar su significado ni comunicaciones de terceros con cualquier país. Hay excepciones específicas que no deben convertirse en permisos generales. Diferencia el contenido, el destinatario, el modo de emisión y la finalidad. La respuesta del banco debe leerse junto con el supuesto exacto y la norma citada; una práctica técnicamente posible puede estar reglamentariamente prohibida.',
      en: 'The amateur service does not automatically authorize broadcasting, commercial traffic, messages encoded to obscure their meaning or third-party communication with every country. Specific exceptions are not blanket permissions. Distinguish content, recipient, emission mode and purpose. Read the pool answer together with the exact scenario and cited rule: a technically possible practice may still be prohibited.',
    },
  },
  {
    id: 'fcc-control', groups: ['T1E', 'E1C'],
    title: { es: 'Operador de control y control de estación', en: 'Control operator and station control' },
    text: {
      es: 'Toda transmisión requiere un operador de control autorizado. Control local, remoto y automático describen cómo se supervisa la estación, no clases de licencia distintas. El titular y el operador tienen responsabilidades reglamentarias; el equipo no amplía los privilegios del operador. En una estación remota importa dónde se encuentra el transmisor y qué autorización corresponde allí. Las condiciones especiales de control automático, potencia o ancho de banda se aplican al caso concreto de la pregunta.',
      en: 'Every transmission requires an authorized control operator. Local, remote and automatic control describe station supervision, not different license classes. The licensee and control operator have regulatory responsibilities; equipment does not expand the operator’s privileges. For a remote station, the transmitter location and authorization there matter. Special automatic-control, power or bandwidth conditions apply to the specific scenario in the question.',
    },
  },
  {
    id: 'fcc-identification', groups: ['T1F'],
    title: { es: 'Identificación y responsabilidad de la estación', en: 'Station identification and accountability' },
    text: {
      es: 'El indicativo permite atribuir una transmisión a una autorización. La identificación debe cumplir los intervalos y métodos admitidos por la FCC; el nombre del operador o la identificación automática de un repetidor no reemplazan siempre la identificación de la estación usuaria. También existen deberes de inspección y condiciones para comunicaciones de terceros. Distingue quién transmite, quién controla y quién es titular antes de aplicar la regla citada.',
      en: 'A call sign associates a transmission with an authorization. Identification must follow FCC intervals and permitted methods; an operator’s name or a repeater’s automatic identification does not always replace identification by the user station. Inspection duties and conditions for third-party traffic also apply. Distinguish transmitter, control operator and licensee before applying the cited rule.',
    },
  },
  {
    id: 'fcc-station', groups: ['G1B', 'E1B'],
    title: { es: 'Normas de estación, emisiones e interferencias', en: 'Station, emission and interference rules' },
    text: {
      es: 'La autorización de radioaficionado no exime de límites de emisiones no deseadas, condiciones de emplazamiento, seguridad ni obligaciones frente a otros servicios. Una emisión espuria es energía no deseada fuera de la emisión necesaria; no basta con que la frecuencia principal esté permitida. Altura, proximidad a aeropuertos, zonas protegidas y emisiones especiales tienen requisitos propios. No deduzcas que una excepción a un trámite elimina los demás requisitos: consulta la sección específica.',
      en: 'An amateur authorization does not waive unwanted-emission limits, siting conditions, safety or duties toward other services. A spurious emission is unwanted energy outside the necessary emission; an authorized main frequency alone is insufficient. Height, airport proximity, protected areas and special emissions have separate requirements. An exception to one procedure does not remove the other requirements: consult the specific section.',
    },
  },
  {
    id: 'fcc-power', groups: ['G1C'],
    title: { es: 'Potencia y límites de emisión', en: 'Power and emission limits' },
    text: {
      es: 'La potencia máxima depende de banda, clase de licencia y condiciones de operación. Además del límite numérico se exige la potencia necesaria para la comunicación. Distingue PEP, potencia media, potencia de entrada y potencia radiada: no son intercambiables. La anchura de banda o el tipo de emisión pueden imponer restricciones adicionales aunque no se alcance la potencia máxima. La referencia FCC del enunciado es la que fija la condición concreta.',
      en: 'Maximum power depends on band, license class and operating conditions. In addition to numerical limits, use the power necessary for the communication. PEP, average power, input power and radiated power are not interchangeable. Bandwidth or emission type may impose further restrictions even below maximum power. The question’s FCC reference determines the specific condition.',
    },
  },
  {
    id: 'fcc-special-stations', groups: ['E1D'],
    title: { es: 'Estaciones espaciales, telemando y telemetría', en: 'Space stations, telecommand and telemetry' },
    text: {
      es: 'La telemetría comunica mediciones a distancia; el telemando envía órdenes para actuar sobre un sistema. Las estaciones espaciales y de control tienen reglas particulares de autorización, frecuencias y control. Que un enlace sea por satélite no elimina los requisitos de identificación y los privilegios de su operador. Las excepciones de codificación o control se justifican por la función específica y no se extienden a mensajes ordinarios.',
      en: 'Telemetry communicates remote measurements; telecommand sends instructions that act on a system. Space and control stations have specific authorization, frequency and control rules. A satellite link does not remove identification requirements or operator privileges. Coding or control exceptions are justified by the specific function and do not extend to ordinary messages.',
    },
  },
  {
    id: 'repeaters', groups: ['T2A', 'T2B'],
    title: { es: 'Operación VHF/UHF y repetidores', en: 'VHF/UHF and repeater operation' },
    text: {
      es: 'Un repetidor recibe en una frecuencia y retransmite en otra: el desplazamiento es la diferencia entre ambas. La función inversa permite escuchar la entrada para evaluar un enlace directo. CTCSS y DCS son mecanismos de apertura del receptor, no cifrado ni reserva de frecuencia. Ajusta frecuencia, desplazamiento y tono según el sistema local; escucha antes de transmitir. Ganancia de micrófono excesiva puede producir desviación excesiva y distorsión.',
      en: 'A repeater receives on one frequency and retransmits on another; the offset is their difference. Reverse lets you listen to the input to assess a direct path. CTCSS and DCS control receiver access; they are not encryption or frequency reservations. Set frequency, offset and tone for the local system and listen before transmitting. Excess microphone gain can cause overdeviation and distortion.',
    },
  },
  {
    id: 'emergencies', groups: ['T2C'],
    title: { es: 'Emergencias y redes de tráfico', en: 'Emergencies and traffic nets' },
    text: {
      es: 'En una red dirigida, el control organiza turnos y tráfico para evitar colisiones y priorizar comunicaciones urgentes. Los mensajes deben conservar precisión y trazabilidad, por lo que se usan formatos y confirmaciones. Participar en una emergencia no suspende automáticamente la parte 97: cualquier excepción de socorro tiene un supuesto limitado. Distingue un ejercicio, una comunicación de rutina y una amenaza inmediata para la vida o los bienes.',
      en: 'In a directed net, net control organizes turns and traffic to avoid collisions and prioritize urgent communication. Messages need accuracy and traceability, so formats and acknowledgments are used. An emergency does not automatically suspend Part 97; a distress exception has a limited scope. Distinguish exercises, routine traffic and immediate threats to life or property.',
    },
  },
  {
    id: 'hf-voice', groups: ['G2A'],
    title: { es: 'Operación de voz en HF', en: 'HF voice operation' },
    text: {
      es: 'USB y LSB seleccionan qué banda lateral transporta la voz; la elección habitual depende de la banda y del modo. Una convención de operación no es por sí sola una obligación reglamentaria. En SSB la potencia y el ancho ocupado varían con la voz y el procesado, por lo que una portadora de ajuste o una lectura de potencia media no representan siempre la emisión normal. Escucha y ajusta el receptor antes de transmitir.',
      en: 'USB and LSB select which sideband carries speech; customary choice depends on band and mode. An operating convention is not automatically a regulatory requirement. SSB power and occupied bandwidth vary with speech and processing, so a tuning carrier or average-power reading does not always represent normal operation. Listen and adjust the receiver before transmitting.',
    },
  },
  {
    id: 'hf-conduct', groups: ['G2B', 'G2D', 'E2C'],
    title: { es: 'Procedimientos, concursos y responsabilidad operativa', en: 'Procedures, contests and operating responsibility' },
    text: {
      es: 'Una frecuencia compartida no se convierte en propiedad de una estación o concurso. Escuchar, preguntar si está en uso y evitar interferencias deliberadas son criterios diferentes de obtener permiso exclusivo. Registros, intercambios de concurso y programas de observación documentan comunicaciones, pero no sustituyen la autoridad de la FCC. En operación remota, identifica la estación de acuerdo con el lugar y las condiciones del transmisor, no solo la ubicación del operador.',
      en: 'A shared frequency does not become the property of a station or contest. Listening, asking whether it is in use and avoiding deliberate interference are different from receiving exclusive permission. Logs, contest exchanges and monitoring programs document communication but do not replace FCC authority. For remote operation, identify according to transmitter location and conditions, not just operator location.',
    },
  },
  {
    id: 'cw', groups: ['G2C'],
    title: { es: 'Telegrafía y procedimiento CW', en: 'Telegraphy and CW procedure' },
    text: {
      es: 'CW transmite información con intervalos de portadora y pausas. QSK o full break-in permite escuchar entre elementos de transmisión; no significa transmitir y recibir simultáneamente sin aislamiento. Los códigos Q y abreviaturas reducen el tráfico, pero una pregunta y una afirmación pueden tener significados distintos. Ritmo, velocidad y separación de caracteres afectan a la inteligibilidad tanto como la potencia.',
      en: 'CW conveys information through carrier intervals and pauses. QSK or full break-in permits listening between transmitted elements; it does not mean unrestricted simultaneous transmission and reception. Q codes and abbreviations shorten traffic, but questions and statements can differ in meaning. Rhythm, speed and character spacing affect readability as well as power.',
    },
  },
  {
    id: 'hf-data', groups: ['G2E', 'G8C', 'E2D', 'E2E'],
    title: { es: 'Protocolos y modos digitales', en: 'Digital protocols and modes' },
    text: {
      es: 'Distingue modulación, protocolo y aplicación: FSK describe cambios de frecuencia, mientras que un protocolo define estructura, sincronización y tratamiento de errores. AFSK genera tonos de audio que modulan un transmisor; FSK directa actúa sobre la frecuencia RF. Cada modo equilibra velocidad, ancho de banda y tolerancia al ruido. Los niveles de audio excesivos y ALC pueden distorsionar modos digitales, aunque el medidor indique más potencia.',
      en: 'Distinguish modulation, protocol and application: FSK describes frequency changes, while a protocol defines structure, synchronization and error handling. AFSK generates audio tones that modulate a transmitter; direct FSK acts on RF frequency. Each mode trades speed, bandwidth and noise tolerance. Excess audio and ALC action can distort digital modes even when the meter indicates more power.',
    },
  },
  {
    id: 'waves', groups: ['T3B'],
    title: { es: 'Ondas electromagnéticas', en: 'Electromagnetic waves' },
    text: {
      es: 'En una onda plana en el espacio libre, los campos eléctrico y magnético son perpendiculares entre sí y a la dirección de propagación. La frecuencia y longitud de onda cumplen c = f·λ, con λ en metros ≈ 300/f en MHz. La polarización se refiere a la orientación del campo eléctrico. Las designaciones HF, VHF y UHF son intervalos de frecuencia, no modos de modulación ni niveles de licencia.',
      en: 'In a free-space plane wave, electric and magnetic fields are perpendicular to each other and to propagation. Frequency and wavelength satisfy c = f·λ, with meters approximately 300/f in MHz. Polarization refers to electric-field orientation. HF, VHF and UHF designate frequency ranges, not modulation modes or license classes.',
    },
  },
  {
    id: 'vhf-paths', groups: ['T3A', 'T3C', 'E3A'],
    title: { es: 'Trayectos, multitrayecto y modos de propagación', en: 'Paths, multipath and propagation modes' },
    text: {
      es: 'Las señales que llegan por varios caminos se suman con fases distintas y pueden reforzarse o cancelarse: mover una antena cambia esa suma. VHF/UHF suele depender del horizonte radioeléctrico, pero dispersión, conductos troposféricos, reflexión lunar y meteoros permiten trayectos especiales. La orientación y polarización también importan. Un mecanismo excepcional no garantiza que cualquier señal atraviese obstáculos o alcance cualquier distancia.',
      en: 'Signals arriving over several paths add with different phases and can reinforce or cancel; moving an antenna changes that sum. VHF/UHF often depends on the radio horizon, but scattering, tropospheric ducts, moon reflection and meteors support special paths. Orientation and polarization also matter. An exceptional mechanism does not guarantee that every signal penetrates obstacles or reaches any distance.',
    },
  },
  {
    id: 'solar', groups: ['G3A', 'E3C'],
    title: { es: 'Actividad solar e ionosfera', en: 'Solar activity and the ionosphere' },
    text: {
      es: 'La radiación solar modifica la ionización y, con ello, las frecuencias que un trayecto ionosférico puede soportar. Una mayor actividad puede mejorar ciertas bandas HF, pero fulguraciones y perturbaciones geomagnéticas también causan absorción y apagones. Los índices solares y geomagnéticos describen fenómenos distintos y no predicen por sí solos un enlace concreto. La región iluminada, la hora y la geometría del trayecto explican por qué el efecto no es uniforme.',
      en: 'Solar radiation changes ionization and therefore the frequencies an ionospheric path can support. Higher activity can improve some HF bands, but flares and geomagnetic disturbances also cause absorption and blackouts. Solar and geomagnetic indices describe different phenomena and do not alone predict a particular link. Illumination, time and path geometry explain why effects are not uniform.',
    },
  },
  {
    id: 'ionospheric-paths', groups: ['G3B', 'G3C', 'E3B'],
    title: { es: 'Capas ionosféricas y geometría del enlace', en: 'Ionospheric regions and path geometry' },
    text: {
      es: 'La región D suele absorber HF; las regiones E y F pueden devolverla a la Tierra por refracción. MUF es la frecuencia máxima utilizable para un trayecto y momento dados; LUF depende de pérdidas y del nivel útil de señal. La distancia de salto y la zona de silencio cambian con frecuencia y ángulo de radiación. Los caminos corto y largo pueden producir señales con retardos distintos: no implican necesariamente dos emisores.',
      en: 'The D region commonly absorbs HF; E and F regions can refract it back to Earth. MUF is the maximum usable frequency for a given path and time; LUF depends on losses and useful signal level. Skip distance and skip zones vary with frequency and radiation angle. Short and long paths can deliver signals with different delays; they need not indicate two transmitters.',
    },
  },
  {
    id: 'station-setup', groups: ['T4A', 'G4E'],
    title: { es: 'Instalación, alimentación y operación móvil', en: 'Installation, power supplies and mobile operation' },
    text: {
      es: 'Una fuente debe suministrar la tensión, polaridad y corriente que necesita el equipo durante la transmisión; la potencia RF no equivale a la potencia eléctrica consumida. Los cables introducen caída de tensión y deben protegerse según su corriente admisible. En antenas móviles, acortamiento y carga reactiva reducen tamaño a costa de rendimiento o ancho de banda. Conexiones mecánicas y eléctricas, retorno de corriente y ruido del vehículo forman parte del sistema.',
      en: 'A supply must provide the voltage, polarity and current needed during transmission; RF output is not the same as electrical input power. Cables introduce voltage drop and need protection consistent with current capacity. In mobile antennas, shortening and reactive loading reduce size at a cost in efficiency or bandwidth. Mechanical and electrical connections, current return and vehicle noise are system considerations.',
    },
  },
  {
    id: 'controls', groups: ['T4B', 'G4A'],
    title: { es: 'Controles del transceptor', en: 'Transceiver controls' },
    text: {
      es: 'El control de RF modifica la ganancia de etapas de recepción; el de AF cambia el audio, por lo que no corrigen el mismo problema. Filtros IF/DSP seleccionan ancho y posición de la banda recibida; notch elimina una región estrecha y puede afectar una señal útil. RIT desplaza la recepción sin cambiar necesariamente la transmisión. La ganancia de micrófono y el ALC deben limitar la distorsión, no usarse como sustitutos de potencia disponible.',
      en: 'RF gain changes receiver-stage gain; AF gain changes audio, so they do not address the same problem. IF/DSP filters select receive bandwidth and position; a notch removes a narrow region and may affect a wanted signal. RIT shifts reception without necessarily changing transmission. Microphone gain and ALC should limit distortion rather than substitute for available power.',
    },
  },
  {
    id: 'units', groups: ['T5A', 'T5B'],
    title: { es: 'Magnitudes eléctricas, unidades y escalas', en: 'Electrical quantities, units and scales' },
    text: {
      es: 'Tensión se mide en voltios, corriente en amperios, resistencia en ohmios y potencia en vatios: no son magnitudes intercambiables. Los prefijos modifican la unidad: kilo = 10³, mega = 10⁶, mili = 10⁻³, micro = 10⁻⁶ y nano = 10⁻⁹. Al pasar a una unidad más pequeña aumenta el número. Escribe primero la equivalencia y comprueba dimensiones; por ejemplo 1 A = 1000 mA y 1 MHz = 1000 kHz.',
      en: 'Voltage is measured in volts, current in amperes, resistance in ohms and power in watts; these are not interchangeable quantities. Prefixes scale the unit: kilo = 10³, mega = 10⁶, milli = 10⁻³, micro = 10⁻⁶ and nano = 10⁻⁹. Converting to a smaller unit increases the number. Write the conversion first and check dimensions; for example 1 A = 1000 mA and 1 MHz = 1000 kHz.',
    },
  },
  {
    id: 'ohm-and-power', groups: ['T5C', 'T5D', 'G5B'],
    title: { es: 'Leyes de Ohm, Kirchhoff y potencia', en: "Ohm's law, Kirchhoff's laws and power" },
    text: {
      es: 'Para una resistencia, V = I·R. En continua, P = V·I = I²R = V²/R. En serie la corriente es común; en paralelo la tensión es común y las corrientes se suman. Capacitancia e inductancia almacenan energía en campos eléctrico y magnético, respectivamente; no son potencia disipada. Para una sinusoide Vrms = Vpico/√2 y Vpp = 2Vpico. Potencias se comparan con 10·log10(P2/P1); un cambio de tensión usa 20·log10 solo bajo las condiciones de impedancia apropiadas.',
      en: 'For a resistor, V = I·R. For DC, P = V·I = I²R = V²/R. Series current is common; parallel voltage is common and branch currents add. Capacitance and inductance store electric- and magnetic-field energy respectively, not dissipated power. For a sine wave Vrms = Vpeak/√2 and Vpp = 2Vpeak. Power ratios use 10·log10(P2/P1); voltage ratios use 20·log10 only under appropriate impedance conditions.',
    },
  },
  {
    id: 'passive-components', groups: ['T6A', 'G5C', 'G6B'],
    title: { es: 'Componentes pasivos y transformadores', en: 'Passive components and transformers' },
    text: {
      es: 'Las resistencias disipan energía; condensadores y bobinas la almacenan en campos eléctrico y magnético. En serie las resistencias e inductancias ideales no acopladas se suman; los condensadores se combinan mediante inversos. En paralelo ocurre lo contrario para esas combinaciones ideales. Un transformador requiere flujo magnético variable: V2/V1 = N2/N1 y las corrientes ideales guardan la razón inversa. Material del núcleo, pérdidas y acoplamiento limitan el comportamiento real.',
      en: 'Resistors dissipate energy; capacitors and inductors store it in electric and magnetic fields. Series resistances and ideal uncoupled inductances add; capacitors combine by reciprocals. Parallel combinations reverse those ideal rules. A transformer needs changing magnetic flux: V2/V1 = N2/N1 and ideal currents have the inverse ratio. Core material, losses and coupling limit real behavior.',
    },
  },
  {
    id: 'basic-semiconductors', groups: ['T6B', 'G6A'],
    title: { es: 'Semiconductores y fuentes de energía', en: 'Semiconductors and energy sources' },
    text: {
      es: 'Un diodo tiene conducción muy distinta según polarización; un transistor permite controlar una corriente mediante otra señal. La caída directa y los límites de tensión, corriente y temperatura dependen del dispositivo, no de un valor universal. Una batería es una fuente electroquímica con resistencia interna y límites de carga/descarga; distintas químicas necesitan tratamientos diferentes. Identifica el tipo de componente y su condición de operación antes de aplicar una cifra o modelo.',
      en: 'A diode conducts very differently with bias direction; a transistor controls a current using another signal. Forward drop and voltage, current and temperature limits depend on the device, not a universal number. A battery is an electrochemical source with internal resistance and charge/discharge limits; different chemistries need different treatment. Identify component type and operating condition before applying a number or model.',
    },
  },
  {
    id: 'schematics', groups: ['T6C'],
    title: { es: 'Lectura de esquemas', en: 'Reading schematics' },
    text: {
      es: 'Un esquema representa conexiones eléctricas con símbolos normalizados, no la posición física de las piezas. Sigue los terminales y nodos para identificar la función: dos líneas que se cruzan no siempre están conectadas; observa la marca de unión. Los números de componente del dibujo se refieren a esa figura concreta. No memorices solo el número: compara la forma del símbolo y sus terminales con el componente indicado en la respuesta.',
      en: 'A schematic represents electrical connections with standard symbols, not physical component positions. Follow terminals and nodes to identify function: crossing lines are not always connected; check the junction mark. Component numbers refer to that particular figure. Do not memorize only a number: compare the symbol shape and terminals with the component named in the answer.',
    },
  },
  {
    id: 'basic-circuits', groups: ['T6D', 'T7A', 'G7C'],
    title: { es: 'Funciones de los bloques electrónicos', en: 'Functions of electronic blocks' },
    text: {
      es: 'Distingue la función de cada bloque: un rectificador convierte alterna en corriente unidireccional; un filtro selecciona componentes espectrales; un amplificador aumenta una señal usando energía de alimentación; un oscilador genera una señal periódica. Un mezclador genera sumas y diferencias de frecuencia y un detector recupera la información. Para seguir una cadena de radio, identifica qué bloque cambia frecuencia, amplitud o contenido, sin atribuir todas esas funciones a un único componente.',
      en: 'Distinguish block functions: a rectifier converts AC into unidirectional current; a filter selects spectral components; an amplifier increases a signal using supply energy; an oscillator generates a periodic signal. A mixer produces frequency sums and differences and a detector recovers information. In a radio chain, identify which block changes frequency, amplitude or content rather than assigning all those functions to one component.',
    },
  },
  {
    id: 'interference', groups: ['T7B', 'G4C', 'E4E'],
    title: { es: 'Diagnóstico de interferencias', en: 'Interference diagnosis' },
    text: {
      es: 'Antes de corregir una interferencia identifica fuente, trayecto de acoplamiento y equipo afectado. Sobrecarga de entrada, rectificación involuntaria, ruido de alimentación y emisiones espurias requieren medidas distintas. Filtros, ferritas, apantallamiento y conexiones adecuadas actúan sobre mecanismos concretos; más ganancia no suele resolver una sobrecarga. Un notch automático puede eliminar tonos útiles como CW. Comprueba el resultado con pruebas controladas, no cambiando muchos parámetros a la vez.',
      en: 'Before correcting interference identify the source, coupling path and affected equipment. Input overload, unintended rectification, supply noise and spurious emissions need different measures. Filters, ferrites, shielding and suitable connections target specific mechanisms; more gain generally does not cure overload. An automatic notch may remove wanted tones such as CW. Verify with controlled tests rather than changing many settings at once.',
    },
  },
  {
    id: 'feedline-tests', groups: ['T7C'],
    title: { es: 'Cargas ficticias y medidas de adaptación', en: 'Dummy loads and matching measurements' },
    text: {
      es: 'Una carga ficticia absorbe potencia RF para probar un transmisor sin radiar intencionadamente; debe soportar potencia y frecuencia de uso. La ROE mide la desadaptación en el punto de medida, no el rendimiento de radiación. Un cable con pérdidas puede ocultar una mala adaptación al reducir la señal reflejada que vuelve al medidor. Comprueba conectores, continuidad, aislamiento y entrada de agua antes de culpar a la antena.',
      en: 'A dummy load absorbs RF power for transmitter testing without intentional radiation; it must handle the operating power and frequency. SWR measures mismatch at the measurement point, not radiation efficiency. A lossy cable can hide a poor match by reducing the reflected signal returning to the meter. Check connectors, continuity, insulation and water ingress before blaming the antenna.',
    },
  },
  {
    id: 'measurement', groups: ['T7D', 'G4B', 'E4A', 'E4B'],
    title: { es: 'Instrumentación y errores de medida', en: 'Instrumentation and measurement errors' },
    text: {
      es: 'El voltímetro se conecta en paralelo y el amperímetro en serie; un ohmímetro necesita un circuito sin alimentación y puede verse afectado por caminos en paralelo. La impedancia y el ancho de banda del instrumento alteran la medida. Osciloscopios, frecuencímetros y analizadores miden magnitudes distintas: frecuencia de muestreo, base de tiempos, referencia y calibración limitan su exactitud. Distingue exactitud, resolución y precisión; más dígitos no garantizan menor error.',
      en: 'Connect a voltmeter in parallel and an ammeter in series. An ohmmeter needs an unpowered circuit and parallel paths can affect readings. Instrument impedance and bandwidth affect the measurement. Oscilloscopes, counters and analyzers measure different quantities: sampling rate, timebase, reference and calibration limit accuracy. Distinguish accuracy, resolution and precision; more digits do not guarantee less error.',
    },
  },
  {
    id: 'modulation-basics', groups: ['T8A', 'G8A', 'G8B', 'E7E', 'E8B'],
    title: { es: 'Modulación, mezcla y ancho de banda', en: 'Modulation, mixing and bandwidth' },
    text: {
      es: 'AM varía amplitud, FM frecuencia y PM fase; una banda lateral única conserva solo parte del espectro de AM. Un mezclador produce frecuencias suma y diferencia, que deben seleccionarse con filtros. En FM el índice es desviación máxima/frecuencia moduladora y la regla de Carson aproxima B ≈ 2(Δf + fm). No confundas frecuencia de audio, desviación, frecuencia de portadora y ancho total ocupado; cada una entra de forma distinta en el cálculo.',
      en: 'AM varies amplitude, FM frequency and PM phase; single sideband retains only part of the AM spectrum. A mixer produces sum and difference frequencies that filters must select. For FM, the index is peak deviation/modulating frequency and Carson’s rule approximates B ≈ 2(Δf + fm). Audio frequency, deviation, carrier frequency and total occupied bandwidth are different quantities and enter calculations differently.',
    },
  },
  {
    id: 'satellites', groups: ['T8B', 'E2A'],
    title: { es: 'Satélites y efecto Doppler', en: 'Satellites and Doppler shift' },
    text: {
      es: 'El enlace ascendente va de Tierra al satélite y el descendente en sentido inverso. Un transpondedor puede trasladar una banda de frecuencias y, si es inversor, invertir el orden espectral. El movimiento relativo causa Doppler: acercamiento aumenta la frecuencia recibida y alejamiento la reduce. La trayectoria, polarización, potencia y horario de paso condicionan el enlace. Un pase ascendente describe el desplazamiento hacia el norte, no la dirección del enlace ascendente.',
      en: 'Uplink goes from Earth to satellite; downlink goes the other way. A transponder can translate a frequency range and an inverting transponder reverses spectral order. Relative motion causes Doppler: approach increases received frequency and recession decreases it. Orbit, polarization, power and pass timing affect the link. An ascending pass describes northward motion, not uplink direction.',
    },
  },
  {
    id: 'activities', groups: ['T8C'],
    title: { es: 'Radiolocalización y actividades operativas', en: 'Direction finding and operating activities' },
    text: {
      es: 'La radiogoniometría combina dirección de llegada y medidas desde varios puntos para localizar una fuente; señal más intensa no significa siempre menor distancia por reflexiones y obstáculos. Concursos, activaciones, redes y enlaces por Internet tienen intercambios y procedimientos diferentes. Un enlace de voz a través de Internet no convierte toda su ruta en propagación radioeléctrica. Identifica la finalidad y el medio de cada actividad antes de comparar sus herramientas.',
      en: 'Direction finding combines arrival bearings and measurements from several locations to locate a source; a stronger signal does not always mean a shorter distance because of reflections and obstacles. Contests, activations, nets and Internet-linked systems have different exchanges and procedures. An Internet voice link does not make its entire route radio propagation. Identify each activity’s purpose and medium before comparing tools.',
    },
  },
  {
    id: 'digital-basics', groups: ['T8D', 'E8C', 'E8D'],
    title: { es: 'Codificación, símbolos y comunicaciones digitales', en: 'Coding, symbols and digital communication' },
    text: {
      es: 'Un símbolo puede representar varios bits: Rbit = Rsímbolo·log2(M) para M estados equiprobables sin contar redundancia. La corrección de errores añade información redundante y reduce la tasa útil respecto a la bruta. QAM combina componentes en cuadratura para codificar amplitud y fase. En espectro ensanchado el receptor usa la secuencia o patrón conocido para recuperar la señal; su resistencia a ciertas interferencias no implica inmunidad universal ni secreto automático.',
      en: 'A symbol may represent several bits: Rbit = Rsymbol·log2(M) for M equally likely states before redundancy. Error correction adds redundancy and reduces useful throughput relative to raw rate. QAM combines quadrature components to encode amplitude and phase. A spread-spectrum receiver uses a known sequence or pattern to recover the signal; resistance to some interference does not mean universal immunity or automatic secrecy.',
    },
  },
  {
    id: 'antenna-basics', groups: ['T9A', 'G9B', 'G9D', 'E9A', 'E9H'],
    title: { es: 'Antenas, polarización y rendimiento', en: 'Antennas, polarization and efficiency' },
    text: {
      es: 'Una antena convierte energía guiada en radiación. Ganancia describe concentración angular respecto a una referencia: no crea potencia. Polarización sigue el campo eléctrico y una desadaptación de polarización puede reducir la señal. Longitud, altura y suelo alteran impedancia y diagrama; una antena de tamaño reducido puede perder rendimiento. Antenas receptoras de bajo ruido pueden priorizar relación señal/ruido frente a señal absoluta. Calcula λ = v/f y aplica la fracción de onda adecuada al diseño.',
      en: 'An antenna converts guided energy into radiation. Gain describes angular concentration relative to a reference; it does not create power. Polarization follows the electric field and polarization mismatch can reduce the signal. Length, height and ground alter impedance and pattern; reduced-size antennas may lose efficiency. Low-noise receiving antennas may prioritize signal-to-noise ratio over absolute strength. Calculate λ = v/f and apply the wave fraction appropriate to the design.',
    },
  },
  {
    id: 'feedlines', groups: ['T9B', 'G9A', 'E9F'],
    title: { es: 'Líneas de transmisión', en: 'Transmission lines' },
    text: {
      es: 'La impedancia característica depende de geometría y dieléctrico, no simplemente de la longitud. La velocidad es v = c·FV y la longitud eléctrica se obtiene con λlínea = c·FV/f. La desadaptación produce reflexiones: ROE = (1 + |Γ|)/(1 − |Γ|). Pérdidas aumentan con longitud y dependen de frecuencia y construcción. Conectores, agua y curvaturas pueden degradar la línea; una ROE baja a la entrada no demuestra que toda la potencia llegue a la antena.',
      en: 'Characteristic impedance depends on geometry and dielectric, not simply length. Speed is v = c·VF and line wavelength is c·VF/f. Mismatch produces reflections: SWR = (1 + |Γ|)/(1 − |Γ|). Loss increases with length and depends on frequency and construction. Connectors, water and bends can degrade a line; low input SWR does not prove all power reaches the antenna.',
    },
  },
  {
    id: 'beam-antennas', groups: ['G9C', 'E9B', 'E9C', 'E9D'],
    title: { es: 'Diagramas y agrupaciones de antenas', en: 'Antenna patterns and arrays' },
    text: {
      es: 'Los campos de los elementos se suman vectorialmente: separación y fase determinan refuerzos, nulos y dirección de máxima radiación. El ancho de haz de 3 dB se mide entre puntos de mitad de potencia, no mitad de tensión. Relación frente/espalda, lóbulos laterales y ganancia son propiedades distintas. En una apertura ideal fija, la ganancia escala como (D/λ)²; duplicar frecuencia produce aproximadamente +6 dB si se mantienen eficiencia y condiciones.',
      en: 'Element fields add vectorially: spacing and phase determine reinforcement, nulls and peak direction. A 3 dB beamwidth is measured between half-power points, not half-voltage points. Front-to-back ratio, sidelobes and gain are different properties. For a fixed ideal aperture, gain scales as (D/λ)²; doubling frequency gives approximately +6 dB if efficiency and conditions remain unchanged.',
    },
  },
  {
    id: 'matching', groups: ['E9E', 'E9G'],
    title: { es: 'Adaptación de impedancias y carta de Smith', en: 'Impedance matching and Smith charts' },
    text: {
      es: 'Una red de adaptación transforma la impedancia presentada al generador; no elimina automáticamente las pérdidas ni hace resonante físicamente toda la antena. En la carta de Smith se normaliza Z con Z0 y se representan impedancia, admitancia y coeficiente de reflexión. Un desplazamiento por una línea cambia la fase de Γ; en una línea ideal sin pérdidas mantiene su módulo. Para leer la carta identifica antes si usas impedancia o admitancia y hacia qué extremo avanzas.',
      en: 'A matching network transforms the impedance seen by a source; it does not automatically eliminate losses or make the whole antenna physically resonant. A Smith chart normalizes Z to Z0 and represents impedance, admittance and reflection coefficient. Moving along a line changes the phase of Γ; an ideal lossless line preserves its magnitude. Identify impedance versus admittance and direction of travel before reading the chart.',
    },
  },
  {
    id: 'electrical-safety', groups: ['T0A', 'G0B', 'E0A'],
    title: { es: 'Seguridad eléctrica', en: 'Electrical safety' },
    text: {
      es: 'Una tensión baja puede suministrar corriente suficiente para quemaduras o incendio si la fuente tiene baja resistencia interna. Fusibles e interruptores protegen frente a sobrecorriente; un diferencial/GFCI detecta desequilibrio de corriente, y la tierra de protección cumple otra función. Desconecta, verifica ausencia de tensión y considera energía almacenada antes de intervenir. Una pica de tierra no sustituye la unión equipotencial ni garantiza protección personal por sí sola. No uses una explicación de examen como procedimiento de trabajo en tensión.',
      en: 'Low voltage can still supply enough current for burns or fire when source resistance is low. Fuses and breakers protect against overcurrent; a GFCI detects current imbalance, and protective grounding has a different function. Disconnect, verify absence of voltage and account for stored energy before servicing. A ground rod does not replace bonding or guarantee personal protection by itself. Do not treat an exam explanation as a live-working procedure.',
    },
  },
  {
    id: 'tower-safety', groups: ['T0B'],
    title: { es: 'Torres, estructuras y rayos', en: 'Towers, structures and lightning' },
    text: {
      es: 'Una torre reúne riesgos de caída, contacto con líneas eléctricas, esfuerzos mecánicos y descargas atmosféricas. La protección depende de diseño, unión equipotencial, conductores y procedimientos adecuados, no de una pieza aislada. Los trayectos de descarga deben evitar curvas innecesarias y la instalación debe ajustarse a normas y personal competente. Nunca deduzcas que una toma de tierra hace seguro tocar una instalación durante una tormenta.',
      en: 'A tower combines fall, power-line contact, mechanical and lightning hazards. Protection depends on design, bonding, conductors and suitable procedures, not one isolated component. Discharge paths should avoid unnecessary bends and installation must follow standards and competent practice. Never infer that grounding makes an installation safe to touch during a storm.',
    },
  },
  {
    id: 'rf-safety', groups: ['T0C', 'G0A'],
    title: { es: 'Exposición a radiofrecuencia', en: 'RF exposure' },
    text: {
      es: 'La RF es radiación no ionizante, pero puede calentar tejidos y producir riesgos de contacto. La evaluación considera frecuencia, potencia media, ganancia, distancia, ciclo de trabajo y entorno. PEP no equivale siempre a potencia media. Los límites de exposición controlada y no controlada tienen condiciones distintas y el campo cercano puede invalidar aproximaciones de campo lejano. Una exención de evaluación rutinaria no es autorización para superar los límites de exposición.',
      en: 'RF is non-ionizing radiation but can heat tissue and create contact hazards. Evaluation considers frequency, average power, gain, distance, duty cycle and surroundings. PEP is not always average power. Controlled and uncontrolled exposure limits have different conditions, and near-field conditions can invalidate far-field approximations. Exemption from routine evaluation is not permission to exceed exposure limits.',
    },
  },
  {
    id: 'television', groups: ['E2B'],
    title: { es: 'Televisión y codificación de vídeo', en: 'Television and video coding' },
    text: {
      es: 'El vídeo requiere transportar una secuencia de imágenes y su sincronización. Compresión y codificación de canal resuelven problemas distintos: la primera reduce datos y la segunda añade redundancia frente a errores. Una tasa de código 3/4 significa tres bits de información por cada cuatro bits codificados, antes de otras sobrecargas. La constelación, tasa de símbolos y filtrado determinan el ancho de banda junto con el protocolo; no basta contar píxeles.',
      en: 'Video requires an image sequence and synchronization. Compression and channel coding solve different problems: compression reduces data, while channel coding adds error-protection redundancy. A 3/4 code rate means three information bits per four coded bits before other overhead. Constellation, symbol rate and filtering determine bandwidth along with the protocol; counting pixels alone is insufficient.',
    },
  },
  {
    id: 'receiver-performance', groups: ['E4C', 'E4D'],
    title: { es: 'Ruido y rango dinámico del receptor', en: 'Receiver noise and dynamic range' },
    text: {
      es: 'Sensibilidad mide la capacidad de detectar señales débiles; rango dinámico mide el margen antes de degradación por señales fuertes. Compresión, bloqueo, intermodulación y mezcla recíproca son mecanismos distintos. El ruido de fase del oscilador puede trasladar energía de una señal próxima al canal recibido. Un previo ayuda si domina el ruido posterior, pero puede empeorar sobrecarga. Compara medidas con el mismo ancho de banda, separación y criterio de distorsión.',
      en: 'Sensitivity measures weak-signal detection; dynamic range measures margin before strong-signal degradation. Compression, blocking, intermodulation and reciprocal mixing are different mechanisms. Oscillator phase noise can spread energy from a nearby signal into the receive channel. A preamp helps when later noise dominates but may worsen overload. Compare measurements at the same bandwidth, spacing and distortion criterion.',
    },
  },
  {
    id: 'resonance', groups: ['G5A', 'E5A'],
    title: { es: 'Reactancia y resonancia RLC', en: 'Reactance and RLC resonance' },
    text: {
      es: 'XL = 2πfL aumenta con frecuencia y XC = 1/(2πfC) disminuye. En resonancia ideal XL = XC y f0 = 1/(2π√LC). En serie se cancelan las reactancias y la impedancia queda limitada por pérdidas; en paralelo ideal la impedancia es máxima. El factor Q relaciona energía almacenada y pérdidas: un Q alto estrecha la banda. Las tensiones en L y C pueden ser mayores que la aplicada por su oposición de fase, sin violar conservación de energía.',
      en: 'XL = 2πfL increases with frequency and XC = 1/(2πfC) decreases. Ideal resonance has XL = XC and f0 = 1/(2π√LC). In series the reactances cancel and losses limit impedance; ideal parallel resonance gives maximum impedance. Q relates stored energy and loss: high Q narrows bandwidth. Opposing phase allows L and C voltages to exceed applied voltage without violating energy conservation.',
    },
  },
  {
    id: 'time-phase', groups: ['E5B'],
    title: { es: 'Constantes de tiempo y fase', en: 'Time constants and phase' },
    text: {
      es: 'En un RC de primer orden τ = RC: tras una constante de tiempo la carga alcanza aproximadamente 63,2 % del cambio final o la descarga conserva 36,8 %. En un RL, τ = L/R. Una sinusoide puede describirse por amplitud y fase; en una capacitancia ideal la corriente adelanta a la tensión y en una inductancia la retrasa. No apliques relaciones de régimen permanente a todo instante de un transitorio.',
      en: 'For a first-order RC, τ = RC: after one time constant charging reaches about 63.2% of the final change or discharging retains 36.8%. For RL, τ = L/R. A sinusoid has amplitude and phase; ideal capacitor current leads voltage, while inductor current lags. Do not apply steady-state relationships to every instant of a transient.',
    },
  },
  {
    id: 'complex-impedance', groups: ['E5C', 'E5D'],
    title: { es: 'Impedancia compleja y potencia en alterna', en: 'Complex impedance and AC power' },
    text: {
      es: 'Z = R + jX: reactancia inductiva es positiva y capacitiva negativa. En serie se suman impedancias; en paralelo se suman admitancias, no módulos de impedancia. Para señales sinusoidales P = Vrms·Irms·cosφ y la potencia aparente es Vrms·Irms. El efecto pelicular concentra corriente alterna hacia la superficie y eleva resistencia efectiva. Antes de operar con fasores usa una misma referencia de fase y unidades coherentes.',
      en: 'Z = R + jX: inductive reactance is positive and capacitive reactance negative. Series impedances add; parallel admittances add, not impedance magnitudes. For sinusoidal signals P = Vrms·Irms·cosφ and apparent power is Vrms·Irms. Skin effect concentrates AC near the surface and increases effective resistance. Use a common phase reference and consistent units before calculating with phasors.',
    },
  },
  {
    id: 'advanced-semiconductors', groups: ['E6A', 'E6B', 'E6E'],
    title: { es: 'Dispositivos semiconductores y polarización', en: 'Semiconductor devices and bias' },
    text: {
      es: 'Las uniones y materiales determinan tensión de ruptura, movilidad, capacitancias y frecuencia útil. Un Zener aprovecha una región de ruptura controlada; no cualquier diodo puede operar allí sin daño. BJT, JFET y MOSFET tienen mecanismos de control y terminales distintos. La polarización fija el punto de trabajo y los parámetros de pequeña señal no sustituyen los límites absolutos. Distingue propiedades del material, función del circuito y condiciones de operación.',
      en: 'Junctions and materials determine breakdown voltage, mobility, capacitances and useful frequency. A Zener uses controlled breakdown; not every diode can operate there safely. BJTs, JFETs and MOSFETs have different control mechanisms and terminals. Bias sets the operating point and small-signal parameters do not replace absolute ratings. Distinguish material properties, circuit function and operating conditions.',
    },
  },
  {
    id: 'logic', groups: ['E6C', 'E7A'],
    title: { es: 'Lógica y circuitos secuenciales', en: 'Logic and sequential circuits' },
    text: {
      es: 'Las puertas combinacionales dependen de sus entradas actuales; biestables y circuitos secuenciales también conservan estado. Un biestable tiene dos estados estables y puede almacenar un bit; contadores y divisores se construyen con transiciones de estado. La histéresis usa umbrales distintos para subida y bajada y evita conmutaciones repetidas cerca del umbral. El resultado debe obtenerse de la tabla de verdad, flanco activo y estado previo, no solo del nombre de la puerta.',
      en: 'Combinational gates depend on current inputs; bistable and sequential circuits also retain state. A bistable has two stable states and can store a bit; counters and dividers use state transitions. Hysteresis provides different rising and falling thresholds and prevents repeated switching near a threshold. Derive results from the truth table, active edge and previous state, not the gate name alone.',
    },
  },
  {
    id: 'magnetic-piezo', groups: ['E6D'],
    title: { es: 'Materiales magnéticos y piezoeléctricos', en: 'Magnetic and piezoelectric materials' },
    text: {
      es: 'La permeabilidad y las pérdidas de un núcleo dependen del material y de frecuencia; un núcleo adecuado para una función puede ser inadecuado para otra. La saturación reduce la respuesta incremental. El efecto piezoeléctrico convierte esfuerzo mecánico en señal eléctrica y viceversa, lo que permite resonadores de cuarzo. Un cristal no oscila por sí solo: necesita un circuito activo y realimentación adecuados a su modo y resonancia.',
      en: 'Core permeability and loss depend on material and frequency; a core suitable for one function may be unsuitable for another. Saturation reduces incremental response. Piezoelectricity converts mechanical stress to electrical signal and vice versa, enabling quartz resonators. A crystal does not oscillate alone; it needs a suitable active circuit and feedback for its mode and resonance.',
    },
  },
  {
    id: 'optical', groups: ['E6F'],
    title: { es: 'Optoelectrónica', en: 'Optoelectronics' },
    text: {
      es: 'La energía de un fotón es E = h·f. En una célula fotovoltaica, la luz genera portadores en el semiconductor y una unión permite separarlos para entregar energía. Fotodiodos, LED y dispositivos fotoconductores intercambian energía óptica y eléctrica de formas distintas: emitir luz no equivale a detectar luz. Material, longitud de onda, polarización y temperatura determinan la respuesta y el rendimiento.',
      en: 'Photon energy is E = h·f. In a photovoltaic cell light generates semiconductor carriers and a junction separates them to deliver energy. Photodiodes, LEDs and photoconductive devices exchange optical and electrical energy differently: emitting light is not the same as detecting it. Material, wavelength, bias and temperature determine response and efficiency.',
    },
  },
  {
    id: 'power-supplies', groups: ['G7A', 'E7D'],
    title: { es: 'Fuentes, regulación y disipación', en: 'Power supplies, regulation and dissipation' },
    text: {
      es: 'Rectificación, filtrado y regulación son etapas diferentes: convertir a corriente unidireccional no elimina rizado ni fija tensión. Un regulador lineal disipa aproximadamente (Vin − Vout)·I; uno conmutado transfiere energía mediante conmutación y filtrado. Resistencias de descarga reducen energía almacenada, pero no garantizan ausencia de tensión sin comprobarla. Corriente admisible, estabilidad, temperatura y transitorios limitan una fuente real.',
      en: 'Rectification, filtering and regulation are different stages: producing unidirectional current neither removes ripple nor fixes voltage. A linear regulator dissipates approximately (Vin − Vout)·I; a switching regulator transfers energy by switching and filtering. Bleeder resistors reduce stored energy but do not establish absence of voltage without verification. Current capacity, stability, temperature and transients limit a real supply.',
    },
  },
  {
    id: 'amplifiers', groups: ['G7B', 'E7B', 'G4D'],
    title: { es: 'Amplificación, linealidad y realimentación', en: 'Amplification, linearity and feedback' },
    text: {
      es: 'La clase de amplificación describe polarización y ángulo de conducción, no una garantía de potencia. La linealidad conserva la forma de la envolvente y es necesaria en modos de amplitud variable como SSB. Compresión excesiva produce intermodulación y ensancha el espectro. La realimentación negativa puede estabilizar ganancia y reducir distorsión; la realimentación positiva no deseada puede causar oscilación y motivar neutralización.',
      en: 'Amplifier class describes bias and conduction angle, not guaranteed power. Linearity preserves envelope shape and is needed for variable-amplitude modes such as SSB. Excess compression produces intermodulation and spectral spreading. Negative feedback can stabilize gain and reduce distortion; unwanted positive feedback can cause oscillation and require neutralization.',
    },
  },
  {
    id: 'filters', groups: ['E7C'],
    title: { es: 'Filtros y redes de selección', en: 'Filters and selective networks' },
    text: {
      es: 'Un filtro paso bajo atenúa frecuencias altas, uno paso alto las bajas y uno paso banda limita ambos extremos. Orden, topología y aproximación determinan pendiente, rizado y retardo; igual frecuencia de corte no implica igual respuesta. Redes π y T describen conexiones, no por sí solas todo el comportamiento. En filtros LC, las reactancias cambian con frecuencia y las terminaciones influyen en la respuesta real.',
      en: 'A low-pass filter attenuates high frequencies, a high-pass low frequencies and a band-pass limits both ends. Order, topology and approximation determine slope, ripple and delay; equal cutoff frequency does not imply equal response. Pi and T describe connections, not the full behavior by themselves. In LC filters reactances vary with frequency and terminations affect the actual response.',
    },
  },
  {
    id: 'dsp', groups: ['E7F'],
    title: { es: 'Muestreo y procesamiento digital', en: 'Sampling and digital processing' },
    text: {
      es: 'Un ADC toma muestras y cuantiza amplitud. Para una señal limitada en banda, el criterio de Nyquist exige muestrear por encima del doble de la frecuencia máxima bajo sus supuestos; un filtro antialias evita que componentes no deseadas se plieguen en banda. La resolución en bits limita cuantización y rango ideal, mientras que la tasa limita frecuencias representables. SDR describe procesamiento definido por software; no elimina filtros, ruido ni límites analógicos.',
      en: 'An ADC samples and quantizes amplitude. For a band-limited signal, Nyquist sampling requires a rate above twice the highest frequency under its assumptions; an anti-alias filter prevents unwanted components folding into the band. Bit resolution limits quantization and ideal range, while sample rate limits representable frequencies. SDR describes software-defined processing; it does not remove filters, noise or analog limits.',
    },
  },
  {
    id: 'opamps', groups: ['E7G'],
    title: { es: 'Amplificadores operacionales', en: 'Operational amplifiers' },
    text: {
      es: 'El operacional ideal tiene ganancia abierta e impedancia de entrada muy grandes y baja impedancia de salida. Con realimentación negativa y sin saturación, sus entradas quedan a tensiones casi iguales; no significa que estén unidas eléctricamente. En el inversor ideal Av = −Rf/Rin y en el no inversor Av = 1 + Rf/Rg. Ganancia-ancho de banda, slew rate y tensiones de alimentación limitan el modelo real.',
      en: 'An ideal op-amp has very high open-loop gain and input impedance and low output impedance. With negative feedback and no saturation its input voltages are nearly equal; this does not mean they are electrically connected. Ideal inverting gain is −Rf/Rin and non-inverting gain is 1 + Rf/Rg. Gain-bandwidth, slew rate and supply voltages limit real behavior.',
    },
  },
  {
    id: 'oscillators', groups: ['E7H'],
    title: { es: 'Osciladores y estabilidad', en: 'Oscillators and stability' },
    text: {
      es: 'Un oscilador usa un circuito activo y realimentación para sostener una señal periódica. El lazo debe cumplir condiciones de amplitud y fase en la frecuencia de oscilación; la no linealidad limita amplitud en régimen permanente. Tanques LC, cristales y lazos de enganche de fase fijan o controlan frecuencia de formas distintas. Deriva térmica, ruido de fase, carga y alimentación afectan estabilidad; una frecuencia nominal exacta no garantiza ausencia de ruido.',
      en: 'An oscillator uses an active circuit and feedback to sustain a periodic signal. The loop must meet amplitude and phase conditions at the oscillation frequency; nonlinearity limits steady-state amplitude. LC tanks, crystals and phase-locked loops set or control frequency in different ways. Thermal drift, phase noise, loading and supply affect stability; an exact nominal frequency does not guarantee low noise.',
    },
  },
  {
    id: 'waveform-analysis', groups: ['E8A'],
    title: { es: 'Formas de onda y análisis de Fourier', en: 'Waveforms and Fourier analysis' },
    text: {
      es: 'Una señal periódica puede representarse como suma de componente continua, fundamental y armónicos. Una onda cuadrada simétrica ideal sin componente continua contiene armónicos impares; formas no ideales pueden añadir otros componentes. Valores pico, pico a pico, medio y eficaz describen propiedades distintas. El valor eficaz determina calentamiento resistivo y el factor de cresta relaciona pico con eficaz; las conversiones de una sinusoide no valen para todas las formas.',
      en: 'A periodic signal can be represented as DC, a fundamental and harmonics. An ideal symmetric zero-DC square wave contains odd harmonics; nonideal forms may add other components. Peak, peak-to-peak, mean and RMS describe different properties. RMS determines resistive heating and crest factor relates peak to RMS; sine-wave conversions do not apply to every waveform.',
    },
  },
]

export function topicForGroup(group: string): TopicGuide | undefined {
  return topicGuides.find((guide) => guide.groups.includes(group))
}
