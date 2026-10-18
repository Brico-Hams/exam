import type { Lang } from './types'

export const FRANCHISE = {
  name: 'Los DamWatts',
  team: { es: 'Chomp, Chip, RESI, CONDI y TRANSI', en: 'Chomp, Chip, RESI, CONDI and TRANSI' },
  credit: 'Los DamWatts · Anatol EA5KAO',
}

export const COMIC_TITLES = {
  es: 'Los DamWatts: ¡A toda carga!',
  en: 'The DamWatts: Fully Charged!',
  hu: 'Gát-Wattok: Túltöltve!',
}

type SceneId = 'resistance' | 'capacitor' | 'transistor' | 'short' | 'regulations' | 'radio'
export interface ComicScene {
  id: SceneId
  guest: string
  opening: string
  clue: string
  solution: string
  ending: string
  metaphor: string
}

type Dialogue = Omit<ComicScene, 'id'>
const scenes: Record<SceneId, Record<Lang, Dialogue>> = {
  resistance: {
    es: {
      guest: 'RESI',
      opening: '¡RESI ha montado un atasco de electrones con un tronco y un silbato! Chomp trae un sacapuntas gigante. Chip: «¡Los ohmios no se afilan!». El indicador del taller entra en amarillo.',
      clue: 'RESI despliega un recibo de tres metros: «¡Nada de empujar! Primero los cálculos». Chip busca la pista en el cuaderno:',
      solution: 'Chomp guarda el sacapuntas: «Vale, resolveré esto sin hacer virutas». El banco señala esta respuesta:',
      ending: 'RESI sella el recibo… y se queda pegado al sello. Chomp: «¡Por fin una resistencia al papeleo!». Explica qué relación une la pista y la respuesta.',
      metaphor: 'RESI es una metáfora. Una resistencia relaciona tensión y corriente y disipa energía; no es un guardia que decide qué electrones pasan.',
    },
    en: {
      guest: 'RESI',
      opening: 'RESI has caused an electron traffic jam with a log and a whistle! Chomp brings a giant pencil sharpener. Chip: “You cannot sharpen ohms!” The workshop gauge turns yellow.',
      clue: 'RESI unrolls a three-meter receipt: “No pushing! Calculations first.” Chip checks the notebook:',
      solution: 'Chomp puts the sharpener away: “Fine, no wood shavings this time.” The pool identifies this answer:',
      ending: 'RESI stamps the receipt… and gets stuck to the stamp. Chomp: “Now that is resistance to paperwork!” Explain how the clue supports the answer.',
      metaphor: 'RESI is a metaphor. A resistor relates voltage and current and dissipates energy; it is not a guard choosing which electrons may pass.',
    },
  },
  capacitor: {
    es: {
      guest: 'CONDI',
      opening: 'CONDI aparece con una mochila tan hinchada que no cabe por la puerta del taller. Chomp: «¿Guardaste también el recreo de mañana?». ¡El reloj de la misión sigue corriendo!',
      clue: 'Chip coloca un cartel: «Sin confeti ni explosiones». CONDI busca entre sus bolsillos y encuentra la pista:',
      solution: 'Chomp saca una libreta de la mochila: «¡La respuesta no se almacena por arte de magia!». Consultemos la del banco:',
      ending: 'CONDI abre el bolsillo equivocado y salen cien notas adhesivas. Una dice «recordar ordenar». Explica la pista sin confundir almacenamiento de energía con creación de energía.',
      metaphor: 'La mochila es una metáfora: un condensador almacena energía en un campo eléctrico. Explotar no forma parte de su funcionamiento normal; puede conservar carga tras desconectarlo.',
    },
    en: {
      guest: 'CONDI',
      opening: 'CONDI arrives with a backpack too swollen to fit through the workshop door. Chomp: “Did you pack tomorrow’s recess too?” The mission clock keeps ticking!',
      clue: 'Chip puts up a “No confetti, no explosions” sign. CONDI searches a pocket and finds the clue:',
      solution: 'Chomp pulls a notebook from the bag: “Answers are not stored by magic!” Let’s consult the pool answer:',
      ending: 'CONDI opens the wrong pocket and a hundred sticky notes tumble out. One says “remember to organize.” Explain the clue without confusing stored energy with created energy.',
      metaphor: 'The backpack is a metaphor: a capacitor stores energy in an electric field. Exploding is not normal operation; it may retain charge after disconnection.',
    },
  },
  transistor: {
    es: {
      guest: 'TRANSI',
      opening: 'TRANSI custodia la discoteca del taller. Chomp presenta un carné de biblioteca. «¡Ese no es el tipo de señal que buscamos!», dice Chip. La bola de espejos se queda a oscuras.',
      clue: 'TRANSI levanta una ceja y una ficha técnica. Chip: «Antes de abrir la compuerta imaginaria, entendamos el dispositivo». Esta es la pista:',
      solution: 'Chomp cambia el carné por el cuaderno: «¡Entrada para una respuesta, por favor!». El banco indica:',
      ending: 'Vuelve la música y TRANSI baila sin mover las patas: solo la cola. Chomp le concede el premio al mínimo desplazamiento. Explica cómo la pista apoya la respuesta.',
      metaphor: 'El portero es una metáfora: un transistor puede amplificar o conmutar según su circuito. Un BJT y un FET no se controlan igual; no toda señal débil se ignora ni toda salida es binaria.',
    },
    en: {
      guest: 'TRANSI',
      opening: 'TRANSI guards the workshop dance club. Chomp presents a library card. “Not the kind of signal we need!” says Chip. The mirror ball goes dark.',
      clue: 'TRANSI raises an eyebrow and a data sheet. Chip: “Before opening the imaginary gate, understand the device.” Here is the clue:',
      solution: 'Chomp swaps the library card for a notebook: “Admission for one answer, please!” The pool identifies:',
      ending: 'The music returns. TRANSI dances without moving his feet, only his tail. Chomp awards him the minimum-displacement prize. Explain how the clue supports the answer.',
      metaphor: 'The bouncer is a metaphor: a transistor may amplify or switch depending on its circuit. BJTs and FETs have different control mechanisms; weak signals are not always ignored and outputs are not always binary.',
    },
  },
  short: {
    es: {
      guest: 'Banda del Corto',
      opening: '¡La Banda del Corto intenta saltarse el recorrido del circuito en patinetes diminutos! Su mapa solo dice «atajo». Chomp grita: «¡Eso no es un plan, es una mala abreviatura!».',
      clue: 'Chip mantiene al equipo lejos del montaje: «El susto es de dibujos; la seguridad es real». Revisemos la pista antes de actuar:',
      solution: 'Chomp intercepta el mapa con una pinza de papel, no con los dientes. Para esta pregunta, el banco indica:',
      ending: 'Los villanos toman un «atajo» y vuelven al punto de salida. Chomp les ofrece un mapa con instrucciones. Explica la respuesta y recuerda: nunca pruebes el gag en un circuito real.',
      metaphor: 'La banda es ficticia. Un cortocircuito crea un camino de impedancia muy baja entre puntos con distinta tensión; no tiene por qué ir a tierra. No se muerden cables ni se manipulan circuitos energizados.',
    },
    en: {
      guest: 'Short-Circuit Crew',
      opening: 'The Short-Circuit Crew tries to skip the circuit route on tiny scooters! Their map only says “shortcut.” Chomp: “That is not a plan, it is a bad abbreviation!”',
      clue: 'Chip keeps everyone away from the assembly: “The scare is cartoon fiction; safety is real.” Check the clue before acting:',
      solution: 'Chomp catches the map with a paper clip, not his teeth. For this question, the pool identifies:',
      ending: 'The villains take a “shortcut” straight back to the start. Chomp offers a map with instructions. Explain the answer, and never try the gag on a real circuit.',
      metaphor: 'The crew is fictional. A short circuit creates a very low-impedance path between points at different voltages; it need not go to earth. Never bite cables or work on energized circuits.',
    },
  },
  regulations: {
    es: {
      guest: 'Archivo de permisos',
      opening: 'Una avalancha de formularios persigue a Chomp por el archivo. «¡Me he inscrito en una carrera de obstáculos administrativos!». Chip detiene el ventilador que mezclaba los papeles.',
      clue: 'Chip rescata la ficha de esta misión: «No vale una regla de otro país ni de otra licencia». Busquemos el fundamento:',
      solution: 'Chomp encuentra el sello correcto dentro de su bocadillo. Antes de estampar nada, esta es la respuesta del banco:',
      ending: 'El sello dice «pendiente de merienda». Chip lo cambia por el cuaderno de referencias. Explica qué norma se aplica y comprueba su vigencia.',
      metaphor: 'La persecución es ficticia. Las normas dependen del país, la licencia y la fecha. El humor no sustituye la referencia legal ni certifica la vigencia del banco.',
    },
    en: {
      guest: 'Permit archive',
      opening: 'An avalanche of forms chases Chomp through the archive. “I entered an administrative obstacle race!” Chip stops the fan that was scattering the papers.',
      clue: 'Chip rescues the mission sheet: “A rule from a different country or license will not do.” Let’s find the foundation:',
      solution: 'Chomp finds the correct stamp inside his sandwich. Before stamping anything, here is the pool answer:',
      ending: 'The stamp reads “pending snack.” Chip swaps it for the reference notebook. Explain which rule applies and check that it is current.',
      metaphor: 'The chase is fictional. Rules depend on country, license and date. Humor does not replace the legal reference or certify that the pool is current.',
    },
  },
  radio: {
    es: {
      guest: 'Taller del silicio',
      opening: '¡El reloj del taller anuncia otra misión! Chomp se pone una antena de sombrero. Chip: «¡Queremos una buena idea, no una cabeza sintonizada!». El panel parpadea como una pista de baile.',
      clue: 'Chip abre el cuaderno mientras Chomp intenta bajar el volumen del reloj con una almohada. Esta es la pista real de la pregunta:',
      solution: 'Chomp retira la almohada: «¡La respuesta se razona, no se silencia!». El banco señala:',
      ending: 'El reloj por fin calla… porque era la alarma de la merienda. Chomp: «¡Misión crujiente!». Explica cómo se relacionan la pista y la respuesta antes de continuar.',
      metaphor: 'Los accesorios y la alarma son ficción cómica, no instrucciones de montaje. La explicación técnica es la del banco o la guía del tema indicada.',
    },
    en: {
      guest: 'Silicon workshop',
      opening: 'The workshop clock announces another mission! Chomp wears an antenna as a hat. Chip: “We need a good idea, not a tuned head!” The panel flashes like a dance floor.',
      clue: 'Chip opens the notebook while Chomp tries to quiet the clock with a pillow. Here is the actual question clue:',
      solution: 'Chomp removes the pillow: “Reason out the answer, do not silence it!” The pool identifies:',
      ending: 'The clock finally stops… it was the snack alarm. Chomp: “Crunchy mission accomplished!” Explain how the clue and answer connect before moving on.',
      metaphor: 'The props and alarm are cartoon fiction, not assembly instructions. Technical explanations come from the identified pool or topic guide.',
    },
  },
}

export function comicScene(question: string, regulations: boolean, lang: Lang): ComicScene {
  const text = question.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const id: SceneId = regulations ? 'regulations'
    : /\bshort[ -]circuit|cortocircuit|electric shock|descarga electrica/.test(text) ? 'short'
      : /transistor|\bbjt\b|\bfet\b|\bmosfet\b/.test(text) ? 'transistor'
        : /capacit|condensador/.test(text) ? 'capacitor'
          : /resist|ohm/.test(text) ? 'resistance' : 'radio'
  return { id, ...scenes[id][lang] }
}
