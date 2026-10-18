export const reviewDate = '2026-10-18'
export const reviewedSourceSha256 = '9ef1e454d235826033f25f37de279cb47b60303ce84156219dfb0ab1ee292c03'

const regulation = 'https://www.boe.es/buscar/act.php?id=BOE-A-2013-7624'
const antennas = 'https://www.boe.es/buscar/act.php?id=BOE-A-1986-33766'
const antennaLaw = 'https://www.boe.es/buscar/act.php?id=BOE-A-1983-31093'
const telecom = 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-10757'
const ref = (base, anchor, label) => ({ label, url: `${base}#${anchor}` })
const reg = (article) => ref(regulation, `a${article}`, `Orden IET/1311/2013, art. ${article}`)
const rd = (article) => ref(antennas, `a${article}`, `RD 2623/1986, art. ${article}`)
const law = (article, anchor) => ref(telecom, anchor, `Ley 11/2022, art. ${article}`)
const decisions = new Map()
function group(ids, sources, rationale, patch = {}) {
  for (const id of ids.split(' ')) {
    if (decisions.has(`bh-${id}`)) throw new Error(`Revisión duplicada: ${id}`)
    decisions.set(`bh-${id}`, { sources, rationale, patch })
  }
}
const change = (id, patch) => {
  const item = decisions.get(`bh-${id}`)
  if (!item) throw new Error(`Corrección sin referencia: ${id}`)
  Object.assign(item.patch = { ...item.patch }, patch)
}

group('e078 e203', [ref(regulation, 'ani', 'Orden IET/1311/2013, anexo I.4.1.1')],
  'Por debajo de 30 MHz se exigen al menos 40 dB de atenuación y, simultáneamente, un máximo de 50 mW por componente no esencial.')
change('e078', { answer: 'Al menos 40 dB por debajo de la potencia media en la banda necesaria, sin superar 50 mW',
  explanation: 'Para frecuencias inferiores a 30 MHz, cada componente no esencial debe cumplir ambos límites: estar 40 dB por debajo de la potencia media dentro de la anchura de banda necesaria y no exceder 50 mW. No basta con cumplir solo uno.' })
change('e203', { question: 'En frecuencias inferiores a 30 MHz, ¿qué atenuación mínima exige el anexo I.4.1.1 a cada componente no esencial, además del límite absoluto de 50 mW?',
  explanation: 'La atenuación mínima es 40 dB respecto de la potencia media dentro de la anchura de banda necesaria. Además, cada componente no esencial no puede superar 50 mW; ambos requisitos se aplican a la vez.' })
group('e390', [{ label: 'OpenStax, University Physics vol. 2, §9.5: P = I²R',
  url: 'https://openstax.org/books/university-physics-volume-2/pages/9-5-electrical-energy-and-power' }],
  'Con resistencia de radiación y distribución de corriente constantes, la potencia radiada es proporcional al cuadrado de la corriente eficaz de referencia.',
  { question: 'Manteniendo constantes la resistencia de radiación y la distribución de corriente de la antena, ¿cuándo se radia más potencia según un amperímetro de RF?',
    explanation: 'Con la misma antena, distribución de corriente y resistencia de radiación Rr, la potencia radiada es P = Ief² × Rr. Por eso aumenta con la corriente eficaz. Comparar corrientes entre antenas, puntos de medida o resistencias diferentes no permite concluir lo mismo.' })

group('r004 r142', [rd(6), rd(7)], 'Las obras ordinarias se comunican fehacientemente con un mes de antelación; las de indudable urgencia tienen un régimen distinto.')
change('r142', { question: 'Para obras ordinarias no urgentes que obliguen a desmontar una antena autorizada, la propiedad debe:' })
group('r011 r222 r252', [ref(antennaLaw, 'atercero', 'Ley 19/1983, art. 3')],
  'Las obras necesarias pueden obligar al desmontaje temporal, sin indemnización al titular; la instalación debe quedar finalmente en condiciones similares.')
group('r022 r280 r502', [rd(20), ref(antennaLaw, 'asegundo', 'Ley 19/1983, art. 2')],
  'El seguro cubre responsabilidad civil por daños materiales y corporales a la propiedad y a terceros; se formaliza después de autorizar el montaje y antes de expedir la licencia.')
group('r214 r241 r494', [ref(antennaLaw, 'asegundo', 'Ley 19/1983, art. 2')],
  'El titular responde de los daños derivados de instalación, conservación y desmontaje. No se confunde con daños causados por la propia propiedad, regulados en el art. 22 del RD 2623/1986.')
change('r494', { question: 'Si el desmontaje de tu antena para unas obras causa daños imputables a tu instalación, ¿quién responde de ellos?' })
group('r140 r282', [ref(antennaLaw, 'aprimero', 'Ley 19/1983, art. 1')],
  'El derecho requiere estar legitimado para usar el inmueble y disponer de autorización reglamentaria; no es un permiso para instalar de cualquier forma.')

group('r006 r013 r202', [reg(17)],
  'La autorización experimental se solicita al menos un mes antes. El plazo máximo inicial es dieciocho meses, ampliable; no es un límite general para toda autorización especial.')
change('r006', { question: '¿Con qué antelación mínima se solicita la autorización especial para emisiones experimentales del artículo 17?' })
change('r013', { question: '¿Cuál es el plazo máximo inicial de una autorización especial experimental del artículo 17?',
  explanation: 'El plazo máximo inicial es dieciocho meses. Puede ampliarse si resulta necesario en las condiciones del artículo 17.3.2; no es un máximo absoluto e improrrogable.' })
change('r202', { question: 'Una autorización experimental del artículo 17 puede concederse inicialmente, como máximo, por:',
  explanation: 'El máximo inicial es dieciocho meses, con posibilidad de ampliación conforme al artículo 17.3.2. No debe confundirse este régimen experimental con cualquier uso de una banda restringida.' })
group('r189 r228 r297 r483 r497', [reg(17)],
  'El aviso de uso portable se hace al menos cinco días antes, salvo usos temporales no continuados de hasta quince días naturales consecutivos; no depende de cruzar un distrito.',
  { explanation: 'El artículo 17.1 exige notificar el uso portable con al menos cinco días de antelación, pero exceptúa los usos temporales no continuados de hasta quince días naturales consecutivos. La excepción no se basa en el distrito.' })
change('r189', { question: 'Un uso portable temporal no continuado queda exento de notificación previa si no supera:',
  answer: 'Quince días naturales consecutivos' })
change('r228', { question: 'Para un uso portable de veinte días consecutivos fuera de la ubicación habitual, ¿qué notificación exige el artículo 17.1?' })
change('r297', { question: '¿Con qué antelación mínima se notifica un uso portable que no está incluido en la excepción de hasta quince días?' })
change('r483', { question: 'Un uso portable continuado que no se beneficia de la excepción del artículo 17.1 debe:',
  answer: 'Notificarse a la Jefatura correspondiente al menos cinco días antes' })
change('r497', { question: 'Para un uso portable no continuado de dos días, aunque se realice en otro distrito:',
  answer: 'No se exige notificación previa por la excepción de hasta quince días' })

group('r010 r098 r119 r268 r454 r516', [reg(25)],
  'El art. 25.h fija, salvo circunstancias especiales motivadas, 50 W fuera de casco urbano, 10 W dentro y ganancia máxima de 6 dBd para estaciones desatendidas VHF/UHF.')
for (const id of ['r010', 'r268']) change(id, { answer: '50 W',
  explanation: 'El máximo general de salida para una estación automática desatendida VHF/UHF fuera de casco urbano es 50 W, no 25 W. Dentro es 10 W. El sistema radiante no superará 6 dBd, salvo circunstancias especiales debidamente motivadas.' })
change('r119', { answer: '6 dBd',
  explanation: 'El límite general del sistema radiante es 6 dBd: decibelios respecto de un dipolo de media onda. No debe escribirse solo «6 dB» sin especificar la referencia.' })
group('r081', [reg(25)], 'El número autorizado depende de la cobertura preexistente y de la disponibilidad de canales.',
  { explanation: 'El artículo 25.a no fija un cupo por provincia: considera la cobertura del servicio preexistente y la disponibilidad de canales.' })
group('r074 r110 r133 r460', [reg(25)], 'El acceso libre y el código públicamente conocido se exigen a repetidores analógicos y digitales finales, no a todo nodo de red.',
  { explanation: 'El artículo 25.c exige acceso libre a los repetidores analógicos y digitales finales; si tienen código de acceso, debe ser públicamente conocido. Las interconexiones por redes públicas tienen además las reglas del artículo 23.' })
change('r074', { question: '¿Cómo debe ser el acceso por radio a un repetidor analógico o digital final de aficionado?' })
change('r110', { question: 'Un repetidor analógico tiene un código de acceso por radio. ¿Qué condición debe cumplir ese código?' })
change('r133', { question: '¿Quién puede acceder por radio a un repetidor analógico o digital final de aficionado?' })
change('r460', { question: 'Si un repetidor analógico necesita un tono o código para activarse por radio, ese código debe:' })
group('r094 r449', [reg(25)], 'El Morse de identificación automática no debe superar diez palabras por minuto; no se exige una velocidad exactamente igual a diez.',
  { answer: 'A una velocidad no superior a 10 palabras por minuto',
    explanation: 'El artículo 25.d fija un máximo de diez palabras por minuto para la identificación automática en Morse de los repetidores analógicos y un intervalo máximo de diez minutos entre identificaciones.' })
change('r094', { question: '¿Qué límite superior de velocidad fija el artículo 25.d para la identificación automática en Morse de un repetidor analógico?' })
change('r449', { question: 'Un repetidor analógico se identifica automáticamente en Morse. ¿Cuál es la velocidad máxima permitida por el artículo 25.d?' })
group('r127 r464', [reg(25)], 'Repetidores y radiobalizas requieren telemando y alimentación ininterrumpida para al menos seis horas sin alimentación externa.')
change('r127', { question: '¿Cuántas horas de autonomía mínima exige la alimentación de reserva de repetidores y radiobalizas si falla la red?' })
group('r100 r455', [reg(25)], 'Las estaciones automáticas desatendidas en HF no superan 50 W de potencia de salida.')

group('r021 r039 r041 r045 r069 r091 r122 r131 r143 r153 r168 r180 r182 r192 r218 r223 r274 r277 r285 r418 r445 r447 r448 r462 r463 r479 r499 r500 r503 r517',
  [reg(27)], 'El artículo 27 establece los prefijos, distritos, series de sufijos, reservas y exclusiones. Los casos temporales excepcionales no siguen todos los límites del distintivo ordinario.')
change('r069', { explanation: 'EG y EH se emplean para concursos internacionales y otros eventos de especial relevancia local, regional o autonómica. No es una clasificación exclusiva de todos los eventos internacionales, pues AO se reserva para acontecimientos de especial relevancia internacional.' })
change('r131', { question: '¿Cuántos caracteres tiene un distintivo permanente ordinario con prefijo de dos letras, una cifra y sufijo de tres letras?',
  explanation: 'Tiene seis caracteres, como EA4XYZ. No es un máximo absoluto de todos los distintivos españoles: el artículo 27 permite más cifras y sufijos de cuatro o más letras en usos temporales excepcionales.' })
change('r153', { question: 'Según la regla general del artículo 27, sin incluir sufijos temporales excepcionales de cuatro o más letras, ¿cómo se asignan los sufijos?',
  explanation: 'El artículo 27 establece series independientes y asignación por orden alfabético y turno de expedición, normalmente con tres letras. Los sufijos de una o dos letras tienen requisitos específicos y los temporales excepcionales pueden superar tres letras.' })
change('r180', { question: 'Además de cinco años de autorización española, ausencia de expediente sancionador en los últimos cinco años y el procedimiento de asignación, ¿qué práctica internacional exige el artículo 27 para un sufijo de dos letras?',
  explanation: 'El artículo 27 exige cinco años de autorización española y cinco años de práctica internacional para sufijos de dos letras, ausencia de expediente sancionador en los últimos cinco años y cumplir el procedimiento de asignación. La práctica internacional no es el único requisito.' })
change('r192', { explanation: 'La cifra 0 puede autorizarse solo temporalmente para actos inaugurados o visitados por S. M. el Rey, o vinculados a la Casa Real, y únicamente el día de la inauguración o visita indicado por el artículo 27.' })
change('r277', { answer: 'Un distintivo temporal para concursos, experimentos, demostraciones u otros eventos',
  explanation: 'EF, junto con ED y EE, puede autorizarse temporalmente para concursos, experimentos, demostraciones y eventos de ámbito local, regional, autonómico o nacional. «Sin especial relevancia» no es la definición del artículo 27.' })
change('r285', { question: '¿Para qué eventos se reserva el prefijo AO?',
  explanation: 'AO es un prefijo, no un sufijo. Se reserva para acontecimientos de especial relevancia internacional; también puede emplearse en las condiciones del artículo 27 por radioaficionados españoles fuera del territorio nacional.' })
change('r503', { question: 'Un distintivo con prefijo AO se reserva para eventos:',
  explanation: 'El prefijo AO se reserva para acontecimientos de especial relevancia internacional. AO no es un sufijo; el artículo 27 contempla además su uso por radioaficionados españoles fuera del territorio nacional.' })
change('r463', { answers: ['XXX', 'DEF', 'CCC', 'ABC'],
  explanation: 'XXX figura entre los grupos excluidos por el artículo 27. Se ha sustituido el distractor DDD porque también estaba excluido y hacía que hubiera dos respuestas correctas.' })
group('r002 r209 r237', [reg(27)], 'Los sufijos de una letra también pueden ser permanentes si se cumplen los requisitos; no están reservados exclusivamente a concursos internacionales.',
  { explanation: 'El artículo 27 contempla sufijos permanentes de una letra con requisitos de antigüedad, práctica internacional y asignación. También prevé su uso para concursos internacionales de alta competitividad o concursos dentro del año de solicitud. No hay una reserva exclusiva para concursos internacionales.' })
change('r002', { question: 'Además de su utilización en concursos, ¿puede asignarse un sufijo permanente de una letra?',
  answers: ['Sí, mediante el procedimiento y los requisitos del artículo 27', 'No, únicamente puede ser temporal para concursos internacionales', 'No, solo se permite en estaciones desatendidas', 'Sí, sin requisitos de antigüedad ni asignación'] })
change('r209', { question: '¿Es correcto afirmar que un sufijo de una letra solo puede utilizarse en concursos internacionales?',
  answers: ['No; existen asignaciones permanentes y otros usos en concursos previstos en el artículo 27', 'Sí, esa es su única utilización posible', 'No; se entrega libremente a cualquier solicitante', 'Sí, y solo a estaciones automáticas desatendidas'] })
change('r237', { question: '¿Qué afirmación describe correctamente la asignación de un sufijo de una letra?',
  answers: ['Puede ser permanente si se cumplen los requisitos; no es exclusivo de concursos', 'Solo puede utilizarse en concursos internacionales', 'Solo puede otorgarse a estaciones desatendidas', 'Es obligatorio para cualquier nuevo radioaficionado'] })
group('r136 r156', [reg(28)], 'La reasignación general espera al agotamiento de combinaciones. Hay excepciones para el antiguo titular y familiares de primer grado por fallecimiento, excluyendo en este último caso el sufijo de una letra.')
change('r136', { question: 'Como excepción a la regla general de reasignación, si fallece el titular y su distintivo no tiene sufijo de una letra, ¿a quién puede reasignarse?',
  explanation: 'Puede reasignarse a familiares de primer grado si el distintivo está disponible y cumplen el procedimiento correspondiente. El artículo 28 excluye de esta excepción familiar los distintivos con sufijo de una letra.' })
change('r156', { question: 'Como norma general, ¿cuándo se reasigna un distintivo ya utilizado, salvo las excepciones del artículo 28?',
  answer: 'Una vez agotadas todas las combinaciones posibles',
  explanation: 'La mera baja no basta para una reasignación general: se espera al agotamiento de combinaciones. Existen excepciones para el anterior titular con nueva autorización y ciertos familiares de primer grado por fallecimiento.' })
group('r123 r155 r174', [reg(28), reg(7)], 'El distintivo asociado es único y no cambia automáticamente por mudanza. El cambio de domicilio debe comunicarse. Los temporales los autoriza la Administración.')
change('r123', { question: '¿Quién autoriza un distintivo temporal de radioaficionado?',
  answers: ['La Administración competente de telecomunicaciones', 'El presidente del radioclub', 'La IARU', 'La comunidad de propietarios'],
  explanation: 'La autorización corresponde a la Administración. Las asociaciones reconocidas pueden proponer planes anuales conforme al artículo 28, pero no sustituyen a la autoridad que los aprueba.' })
change('r155', { question: 'Si el titular cambia de domicilio a otro distrito, ¿debe cambiar automáticamente su distintivo?',
  answer: 'No; debe comunicar el domicilio, pero el distintivo no se modifica automáticamente',
  explanation: 'El artículo 7.3 obliga a comunicar el cambio de domicilio. El artículo 28 no prevé cambiar automáticamente cifra o sufijo por mudanza; el distintivo sigue asociado a la autorización.' })
change('r174', { question: 'Tras una mudanza, ¿qué obligación establece el artículo 7.3 para el titular de la autorización?',
  answer: 'Comunicar a la Administración el cambio de domicilio para notificaciones',
  explanation: 'Debe comunicarse el domicilio para notificaciones. El artículo 28 mantiene el distintivo asociado a la autorización y no impone cambiarlo automáticamente al mudarse.' })

group('r048 r085 r128 r161 r198', [reg(19)],
  'La Administración autoriza el montaje; como regla general lo efectúa un instalador registrado. La Jefatura puede permitir el montaje propio de instalaciones simples sin riesgos razonables.')
group('r109 r459 r484', [reg(19), reg(9), reg(10)],
  'El reglamento no fija edad mínima; para la licencia de estación de un menor exige autorización fehaciente de padres o custodios, que asumen las responsabilidades correspondientes.')
group('r046 r073 r099 r279 r441', [rd(2), reg(19)],
  'La memoria es técnica y describe equipos, antenas y elementos accesorios; incluye los datos de la propiedad o del presidente de la comunidad. No debe confundirse con otros documentos personales de la solicitud.')
group('r159 r219 r247 r286 r467 r510', [rd(3), rd(4)],
  'La Administración comunica a la propiedad la memoria aceptada y oye sus alegaciones; la autorización administrativa no la concede la comunidad. Subsisten los recursos y derechos de la propiedad.')
change('r219', { explanation: 'La Administración tramita y autoriza el montaje. La propiedad puede alegar durante dos meses sobre el emplazamiento y los perjuicios y puede recurrir; no es correcto reducir sus derechos a una simple opinión sin efectos.' })
change('r286', { explanation: 'La mera votación vecinal no sustituye la autorización administrativa. La propiedad conserva el derecho de alegar sobre emplazamiento y perjuicios y de interponer los recursos correspondientes.' })
group('r053 r084 r120 r171 r183 r480', [reg(18)],
  'Las estaciones fijas precisan licencia; las colectivas, incluidas las automáticas desatendidas, solo se autorizan a asociaciones reconocidas.')
change('r480', { question: 'Además de la autorización personal, ¿qué hace falta para instalar y utilizar una estación fija?' })
group('r104 r139 r302 r312 r465 r507', [reg(20), rd(10)],
  'La licencia se expide tras finalizar el montaje y aportar la documentación. Las pruebas de modificación duran hasta 60 días sin afectar a la seguridad; los cambios permanentes se documentan y un traslado de antena se tramita como primera instalación.')
change('r302', { question: 'En una estación con licencia, ¿cuándo se remite documentación complementaria por una modificación experimental de hasta 60 días que no cambia la ubicación de la antena ni afecta a la seguridad?',
  explanation: 'El artículo 20 permite experimentar hasta 60 días sin afectar a la seguridad. Si la modificación se hace permanente, se remite la documentación complementaria. El cambio de ubicación de la antena se solicita como primera instalación.' })
change('r312', { question: 'Si una modificación experimental autorizada por el régimen del artículo 20 se convierte en permanente, ¿qué corresponde hacer?',
  answer: 'Remitir a la Administración la documentación complementaria con los cambios',
  explanation: 'Para las modificaciones que pasan a permanentes se remite documentación complementaria. El cambio de ubicación de la antena requiere tramitarlo como primera instalación; no basta con un aviso genérico.' })
change('r507', { question: 'En una estación con licencia, pruebas un cambio de antena durante un fin de semana, sin cambiar su ubicación ni afectar a la seguridad. ¿Qué permite el artículo 20?',
  answer: 'La prueba temporal; si se hace permanente, se remite documentación complementaria',
  explanation: 'El artículo 20 permite modificaciones experimentales hasta 60 días si no afectan a la seguridad. Si se hacen permanentes se documentan; si cambia la ubicación de la antena se aplica el procedimiento de primera instalación.' })
group('r076 r169 r444 r471', [reg(21)],
  'La falta de seguro vigente cancela la licencia de estación fija, no automáticamente la autorización personal. Cancelada la licencia, se exige desmontar las instalaciones incluidas las antenas.',
  { explanation: 'El artículo 21 distingue la licencia de estación de la autorización personal. La falta de seguro vigente cancela la licencia de estación fija. Cancelada esta, el interesado debe desmontar las instalaciones, incluidas las antenas, a su cargo. No se ha validado una excepción de conservación para recepción.' })
change('r076', { question: 'Cancelada la licencia de una estación fija, ¿qué exige el artículo 21.2 respecto de las antenas?',
  answer: 'Desmontarlas, junto con las instalaciones, a cargo del interesado' })
change('r169', { question: 'Cancelada la licencia de estación fija, ¿permite el artículo 21 mantener sin más su sistema radiante?',
  answer: 'No; exige desmontar las instalaciones, incluidas las antenas' })
change('r444', { answer: 'Se cancela la licencia de estación fija y deben desmontarse las instalaciones' })
change('r471', { question: '¿Quién asume los gastos de desmontaje cuando se cancela la licencia de estación fija?',
  answer: 'El interesado, incluidos los gastos de desmontar las antenas' })

group('r068 r107 r225 r439 r495', [reg(5), ref(regulation, 'daprimera', 'Orden IET/1311/2013, disposición adicional primera')],
  'La autorización conserva vigencia hasta renuncia o revocación; se suprimieron tanto el aviso quinquenal de continuidad como los efectos de no presentarlo.')
change('r068', { question: '¿Qué ocurrió con la obligación de comunicar cada cinco años la intención de seguir usando el espectro?',
  answer: 'Se suprimió, junto con las consecuencias de incumplirla',
  explanation: 'La disposición adicional primera de la Orden IET/1311/2013 eliminó la comunicación cada cinco años y los efectos de su incumplimiento. No puede enseñarse su omisión como causa actual de revocación.' })
change('r107', { answers: ['Que sea transferible a otra persona', 'Que sea personal e intransferible', 'Que habilite para las bandas del servicio de aficionados', 'Que tenga condiciones técnicas'],
  explanation: 'La afirmación falsa es que sea transferible: el artículo 5.4 la declara personal e intransferible. Ya no se exige el aviso quinquenal de continuidad.' })
change('r225', { question: 'Actualmente, ¿cada cuánto debe presentarse la antigua comunicación quinquenal de continuidad?',
  answer: 'Ya no se exige esa comunicación',
  explanation: 'La disposición adicional primera suprimió expresamente la comunicación quinquenal y las consecuencias de omitirla. La vigencia no depende de renovar ese aviso.' })
group('r172 r227 r272', [reg(5), reg(7), reg(8)], 'La autorización personal es distinta de la licencia de estación fija; no tener equipo no impide poseer autorización, y emitir requiere autorización vigente.')
change('r227', { question: 'Tras la revocación de la autorización, ¿qué ocurre con el derecho del interesado a emitir como radioaficionado?',
  answer: 'No puede emitir hasta obtener una nueva autorización',
  explanation: 'Para emitir es necesaria una autorización vigente. Su revocación no es una prohibición de estudiar radiotecnia o de toda actividad de recepción ni implica necesariamente una inhabilitación perpetua.' })
group('r229', [reg(7)], 'La autorización se expide bilingüe a petición del interesado en comunidades con lengua cooficial.')
group('r203 r435 r453 r490', [reg(5)], 'El apartado 5.6 permite equipos de construcción propia sin autorización previa bajo responsabilidad del radioaficionado y cumpliendo los requisitos técnicos.',
  { explanation: 'El artículo 5.6 permite equipos total o parcialmente de construcción propia sin autorización previa de la Administración, bajo responsabilidad del radioaficionado y cumpliendo el anexo I. La presentación de equipo y memoria en la Jefatura es optativa; no elimina las demás obligaciones de estación y seguridad.' })
change('r203', { question: 'Para utilizar un transmisor de construcción propia, ¿qué establece el artículo 5.6?',
  answer: 'No exige autorización previa del equipo; el radioaficionado responde de su conformidad técnica' })
group('r434 r485', [reg(5), reg(11)], 'Para el extranjero residente se contemplan HAREC o convenio de reciprocidad con el país de su licencia original; la mera participación del país en T/R 61-01 no equivale a ese trámite.')
change('r434', { question: 'Un extranjero residente con licencia de un país que tiene convenio de reciprocidad aplicable, ¿puede solicitar autorización española sin repetir la prueba?',
  answer: 'Sí, acreditando residencia, licencia y el supuesto de reciprocidad',
  explanation: 'El artículo 5.2.b sí contempla el convenio de reciprocidad con el país que otorgó la licencia original. Se requiere solicitud y acreditación documental de residencia y de las condiciones del convenio.' })
change('r485', { answers: ['Que su país simplemente aplique la licencia CEPT T/R 61-01', 'Superar la prueba española y completar el trámite de autorización', 'Acreditar residencia y un HAREC de un país que aplique T/R 61-02', 'Acreditar residencia y licencia amparada por un convenio de reciprocidad'],
  explanation: 'La mera aplicación nacional de T/R 61-01 no es por sí sola la vía de autorización para un residente. El artículo 5.2 contempla HAREC o reciprocidad, además de la vía de superar la prueba española.' })
group('r296', [reg(11), reg(12)], 'La licencia CEPT T/R 61-01 permite el uso temporal por visitantes en los países que aplican la recomendación, con las condiciones del país visitado.')
group('r266 r472', [reg(10)], 'Quien resulta apto en ambas partes recibe el certificado HAREC. Después debe solicitar la autorización y abonar la tasa; no se exige esperar cinco años.',
  { explanation: 'El artículo 10.3 dispone que quienes resulten aptos en ambas partes reciben el certificado HAREC, conforme a T/R 61-02. Esto habilita para solicitar la autorización, previo trámite y abono de la tasa; HAREC no sustituye a la autorización.' })
change('r266', { answer: 'Tras resultar apto en ambas partes de la prueba' })
change('r472', { question: '¿Qué certificado reciben quienes resultan aptos en las dos partes de la prueba española?' })

group('r026', [reg(30)], 'La colaboración es obligatoria a requerimiento de la Dirección General de Protección Civil y Emergencias, con los medios y bandas del servicio.')
group('r245 r249 r310 r349 r509', [reg(29)], 'La identificación es obligatoria al comienzo y al final y, en emisiones largas, al menos cada diez minutos.',
  { explanation: 'El artículo 29.1 obliga a transmitir el distintivo al comienzo y al final de cada emisión; si es larga, al menos cada diez minutos. No es una simple recomendación ni basta con una sola identificación intermedia.' })
change('r249', { answer: 'En emisiones largas, al menos cada diez minutos' })
change('r310', { question: 'Según el artículo 29.1, ¿en qué extremos de cada emisión se transmite obligatoriamente el distintivo?' })
change('r349', { question: 'En una emisión de larga duración, ¿cuándo es obligatorio transmitir el distintivo?',
  answer: 'Al comienzo, al final y al menos cada diez minutos' })
change('r509', { question: 'Durante un comunicado muy largo, además de al principio y al final, es obligatorio:',
  answer: 'Transmitir el distintivo al menos cada diez minutos' })
group('r322 r396', [reg(23)], 'La interconexión con instalaciones autorizadas debe tener fines propios de radioafición, no causar daños ni interferencias y cumplir las condiciones de acceso.',
  { explanation: 'El artículo 23 permite interconectar estaciones a través de instalaciones de telecomunicación autorizadas para fines de radioafición, sin daños ni interferencias. Las conexiones mediante redes públicas o enlaces entre repetidores tienen requisitos específicos de código y distintivo.' })
group('r348', [ref(regulation, 'ani', 'Orden IET/1311/2013, anexo I.4.6')], 'La estación debe disponer de las redes adaptadoras y filtros supresores de armónicos que sean precisos.')
change('r348', { question: '¿Qué elementos debe disponer una estación de radioaficionado, cuando sean precisos, según el anexo I.4.6?',
  explanation: 'El anexo I.4.6 exige las redes adaptadoras de impedancia y filtros supresores de armónicos (paso bajo) que sean precisos. Son elementos de la estación, no una propiedad intrínseca de cada antena.' })
group('r451', [reg(2), ref(regulation, 'ani', 'Orden IET/1311/2013, anexo I.3.1')],
  'La normativa española remite, como norma general, a los planes IARU Región 1 para evitar incompatibilidades. No sustituyen al CNAF ni autorizan frecuencias o potencias por sí solos.',
  { explanation: 'El artículo 2.2 y el anexo I.3.1 remiten como norma general a los planes de banda IARU Región 1. No son por sí solos una autorización de uso: prevalecen CNAF, reglamento y autorizaciones aplicables. Su remisión en la norma española impide tratarlos como una guía sin relevancia normativa.' })

group('r082', [law('106.15', 'a1-18')], 'La interceptación no autorizada de telecomunicaciones no destinadas al público, así como su divulgación, se tipifica como muy grave.')
group('r059', [law('106.8', 'a1-18')], 'No atender el requerimiento de cesación en supuestos de interferencias es muy grave, no grave.',
  { question: 'No atender el requerimiento de la Secretaría de Estado de cesar emisiones que producen interferencias es, según el artículo 106.8 de la Ley 11/2022, una infracción:',
    answer: 'Muy grave', explanation: 'El artículo 106.8 tipifica como muy grave no atender el requerimiento de cesación en supuestos de producción de interferencias. Se precisa este supuesto para no mezclarlo con otras desobediencias o cumplimientos tardíos.' })
group('r114', [law('107.36', 'a1-19')], 'La negativa u obstrucción a ser inspeccionado está tipificada como infracción grave.',
  { answer: 'Grave', explanation: 'La Ley 11/2022, artículo 107.36, tipifica como grave la negativa u obstrucción a la inspección y la no colaboración requerida. La respuesta «muy grave» del banco no corresponde a este precepto vigente.' })
group('r135', [law('108.2', 'a1-20')], 'Establecer comunicaciones usando estaciones no autorizadas es leve salvo que deba considerarse grave.',
  { question: 'Según el artículo 108.2 de la Ley 11/2022, establecer comunicaciones utilizando estaciones no autorizadas, salvo que deba considerarse grave, es una infracción:',
    answer: 'Leve', explanation: 'El artículo 108.2 establece la categoría leve con la salvedad expresa de los supuestos que deban calificarse como graves. No es correcto asignar automáticamente la categoría grave a cualquier caso.' })
group('r117 r278 r461', [law('109.1.c', 'a1-21')], 'El máximo general para infracciones graves es dos millones de euros; hay un régimen específico cuando sanciona la CNMC.',
  { explanation: 'La Ley 11/2022, artículo 109.1.c, fija con carácter general hasta dos millones de euros por infracciones graves. El mismo precepto prevé una regla diferente para las infracciones de competencia sancionadora de la CNMC.' })
change('r117', { question: 'Según la Ley 11/2022, fuera del régimen específico de la CNMC, ¿cuál es la multa máxima general por infracción grave?', answer: '2.000.000 €' })
change('r278', { question: 'En el régimen general del artículo 109.1.c de la Ley 11/2022, el límite máximo de dos millones de euros corresponde a infracciones:' })
change('r461', { question: 'Según el artículo 109.1.c de la Ley 11/2022, ¿hasta cuánto puede llegar con carácter general la multa por infracción grave, sin aplicar el régimen específico de la CNMC?' })
group('r146 r284 r433 r466', [law('108.12', 'a1-20'), law('107.34', 'a1-19')],
  'La falta o retraso injustificado de datos exigibles es leve; el art. 107.34 tipifica como graves determinadas persistencias y la información inexacta o falsa.',
  { explanation: 'La Ley 11/2022, artículo 108.12, considera leve no facilitar datos exigibles o retrasarlos injustificadamente. El artículo 107.34 recoge los supuestos graves, como la persistencia en los plazos allí indicados o aportar información inexacta o falsa.' })
change('r146', { question: 'No facilitar datos exigibles a la Administración o retrasarlos injustificadamente, sin concurrir el supuesto grave del artículo 107.34 de la Ley 11/2022, es una infracción:' })
change('r284', { question: 'Según el artículo 108.12 de la Ley 11/2022, el retraso injustificado de datos exigibles que no constituya la infracción grave del artículo 107.34 es:' })
change('r433', { question: 'En la Ley 11/2022 vigente, ¿cómo se tipifica la falta de datos exigibles o su retraso injustificado si no concurre el supuesto grave del artículo 107.34?' })
change('r466', { question: '¿Qué categoría asigna el artículo 108.12 de la Ley 11/2022 al retraso injustificado de datos exigibles, sin los requisitos del supuesto grave?' })
group('r291', [law('113.2', 'a1-25')], 'Las sanciones por faltas graves prescriben a los dos años; el cómputo tiene reglas e interrupciones específicas.',
  { question: 'Según la Ley 11/2022, ¿cuál es el plazo de prescripción de una sanción impuesta por infracción grave?',
    explanation: 'El artículo 113.2 fija dos años. Se cuentan desde el día siguiente a aquel en que sea ejecutable la resolución o termine el plazo para recurrirla; puede haber interrupción por el procedimiento de ejecución con conocimiento del interesado.' })
group('r292 r501 r505', [reg(34), law('105', 'a1-17')], 'El régimen sancionador se rige actualmente por la Ley 11/2022; las infracciones se clasifican en muy graves, graves y leves.')
group('r042 r064 r437', [reg(4)], 'El artículo 4 fija seis semanas para resolver y notificar los procedimientos enumerados y desestimación si no recae resolución expresa, sin eliminar la obligación de resolver.')
group('r027', [ref(regulation, 'ani', 'Orden IET/1311/2013, anexo I.3.1 y 3.2')],
  'La tabla del anexo I.3.1 indica 600 W p.c.e. para 50 MHz, no 100 W. El uso efectivo depende del CNAF, categoría de servicio y condiciones aplicables.',
  { question: '¿Qué potencia figura para 50 MHz en la tabla del anexo I.3.1, antes de aplicar las limitaciones por categoría secundaria u otras condiciones?',
    answer: '600 W p.c.e.',
    explanation: 'La tabla general del anexo I.3.1 indica 600 W p.c.e. en 50 MHz. Esto no autoriza por sí solo a emplearlos en cualquier segmento: el apartado 3.2 reduce al 50 % los valores en bandas secundarias y deben respetarse CNAF, seguridad e interferencias.' })

export function pendingReason(q) {
  const number = q.id.slice(3)
  if (['r024', 'r185', 'r275', 'r175'].includes(number)) return 'Falta contrastar el segmento exacto con el plan IARU Región 1 vigente y sus notas, el CNAF y las condiciones de autorización; no se ha validado esta clave.'
  if (['r287', 'r504'].includes(number)) return 'La exigencia histórica para 10 GHz no coincide con la lista de la disposición adicional segunda de la Orden IET/1311/2013 actualizada en 2015. Falta identificar la disposición histórica concreta y su aplicabilidad; no usar como regla vigente.'
  if (['r083', 'r170', 'r362'].includes(number)) return 'Falta identificar la disposición aplicable a esta forma de identificación de un operador invitado; el artículo 29 por sí solo no confirma el formato compuesto de la clave.'
  if (['r088', 'r339'].includes(number)) return 'La calificación sancionadora depende de la ley y del supuesto concreto. No se ha encontrado respaldo suficiente para atribuir automáticamente esta categoría a cualquier distintivo falso.'
  if (['r393', 'r400'].includes(number)) return 'La denominación del órgano administrativo es histórica. Falta contrastar la estructura competencial vigente antes de retirar la advertencia.'
  if (number === 'r428') return 'El anexo I.4.5 exige comprobación de frecuencia y medición indicativa de potencia, pero no establece literalmente que el medidor de ROE sea el instrumento imprescindible. Falta validar el alcance de la pregunta.'
  if (number === 'r395') return 'Falta identificar la norma técnica, condiciones de medida y fecha que justifican el límite de cuatro nanovatios para receptores.'
  if (number === 'r293') return 'Falta precisar la disposición y el alcance jurídico de la modificación del uso especial atribuida al CNAF; no se valida una formulación genérica.'
  if (number === 'r233') return 'Falta contrastar la atribución y la fecha histórica de 2009 con la edición correspondiente del Reglamento de Radiocomunicaciones de la UIT.'
  if (number === 'r406') return 'Falta contrastar formalmente la nomenclatura F3E con el apéndice de designación de emisiones vigente de la UIT.'
  if (number === 'r364') return 'Falta incorporar una referencia normativa precisa de la UIT para la forma continua de la señal de socorro Morse; no se ha validado documentalmente en esta revisión.'
  return 'El enunciado remite a un banco o reglamento antiguo sin identificar disposición, fecha y artículo. No se ha validado la respuesta histórica ni puede presentarse como normativa vigente.'
}

export function applySpainReview(q) {
  const decision = decisions.get(q.id)
  if (!decision) return null
  const before = structuredClone(q)
  const { patch, sources, rationale } = decision
  if (patch.question) q.question = patch.question
  if (patch.answers) q.answers = [...patch.answers]
  if (patch.answer) {
    const existing = q.answers.indexOf(patch.answer)
    if (existing >= 0) q.correct = existing
    else q.answers[q.correct] = patch.answer
  }
  if (patch.explanation) q.explanation = { es: patch.explanation }
  if (new Set(q.answers).size !== 4) throw new Error(`Opciones duplicadas tras revisar ${q.id}`)
  delete q.reviewReason
  const corrected = JSON.stringify([before.question, before.answers, before.correct, before.explanation]) !==
    JSON.stringify([q.question, q.answers, q.correct, q.explanation])
  q.validation = { date: reviewDate, sources, rationale, corrected }
  return { id: q.id, previouslyFlagged: Boolean(before.reviewReason), corrected,
    answerChanged: before.answers[before.correct] !== q.answers[q.correct], original: before, ...q.validation }
}

export const reviewedIds = [...decisions.keys()]
