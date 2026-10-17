import type { Lang, LevelId } from './types'

export interface LevelInfo {
  id: LevelId
  element: number
  name: Record<Lang, string>
  examQuestions: number
  passing: number
  validFrom: string
  validTo: string
  prefix: string
}

export const LEVELS: LevelInfo[] = [
  {
    id: 'technician',
    element: 2,
    name: { en: 'Technician', es: 'Technician (Técnico)' },
    examQuestions: 35,
    passing: 26,
    validFrom: '2026-07-01',
    validTo: '2030-06-30',
    prefix: 'T',
  },
  {
    id: 'general',
    element: 3,
    name: { en: 'General', es: 'General' },
    examQuestions: 35,
    passing: 26,
    validFrom: '2023-07-01',
    validTo: '2027-06-30',
    prefix: 'G',
  },
  {
    id: 'extra',
    element: 4,
    name: { en: 'Amateur Extra', es: 'Amateur Extra' },
    examQuestions: 50,
    passing: 37,
    validFrom: '2024-07-01',
    validTo: '2028-06-30',
    prefix: 'E',
  },
]

export function getLevel(id: string | undefined): LevelInfo | undefined {
  return LEVELS.find((l) => l.id === id)
}

/** Sub-element topics share the same numbering across the three pools (x1 … x9, x0). */
const SUBELEMENT_TOPICS: Record<string, Record<Lang, string>> = {
  '1': { en: "Commission's Rules", es: 'Reglas de la Comisión (FCC)' },
  '2': { en: 'Operating Procedures', es: 'Procedimientos de operación' },
  '3': { en: 'Radio Wave Propagation', es: 'Propagación de ondas de radio' },
  '4': { en: 'Amateur Radio Practices', es: 'Prácticas de radioaficionado' },
  '5': { en: 'Electrical Principles', es: 'Principios eléctricos' },
  '6': { en: 'Circuit Components', es: 'Componentes de circuitos' },
  '7': { en: 'Practical Circuits / Station Equipment', es: 'Circuitos prácticos / equipo de estación' },
  '8': { en: 'Signals, Emissions and Modulation', es: 'Señales, emisiones y modulación' },
  '9': { en: 'Antennas and Feed Lines', es: 'Antenas y líneas de transmisión' },
  '0': { en: 'Electrical and RF Safety', es: 'Seguridad eléctrica y de RF' },
}

export function subelementTitle(subelement: string, lang: Lang): string {
  const digit = subelement.slice(1, 2)
  return SUBELEMENT_TOPICS[digit]?.[lang] ?? subelement
}
