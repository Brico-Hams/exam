import type { Lang } from './types'

export interface RefLink {
  label: string
  url: string
  note: Record<Lang, string>
}

export const OFFICIAL_REFS: RefLink[] = [
  {
    label: 'NCVEC — Question Pools',
    url: 'https://ncvec.org/',
    note: { es: 'Fuente primaria de los tres bancos (Word/PDF/texto).', en: 'Primary source of the three pools (Word/PDF/text).' },
  },
  {
    label: 'ARRL Question Pools',
    url: 'https://www.arrl.org/question-pools',
    note: { es: 'Archivos oficiales vigentes con erratas.', en: 'Current official files including errata.' },
  },
  {
    label: 'ARRL — General Class Pool & Syllabus 2023-2027 (.docx)',
    url: 'https://www.arrl.org/files/file/VEs/General%20Class%20Pool%20and%20Syllabus%202023-2027%20Public%20Release%20April%2015%202023.docx',
    note: { es: 'Syllabus oficial del Elemento 3.', en: 'Official Element 3 syllabus.' },
  },
  {
    label: 'FCC — Amateur Radio Service',
    url: 'https://www.fcc.gov/wireless/bureau-divisions/mobility-division/amateur-radio-service',
    note: { es: 'Información oficial de la FCC (Parte 97).', en: 'Official FCC information (Part 97).' },
  },
  {
    label: 'eCFR — 47 CFR Part 97',
    url: 'https://www.ecfr.gov/current/title-47/chapter-I/subchapter-D/part-97',
    note: { es: 'Texto de las reglas citadas en las preguntas [97.x].', en: 'Text of the rules cited in questions [97.x].' },
  },
]

export const SPANISH_REFS: RefLink[] = [
  {
    label: 'KP4ARA — Pool de preguntas',
    url: 'https://kp4ara.org/pool-de-preguntas-general',
    note: { es: 'Bancos Technician, General y Extra traducidos al español.', en: 'Technician, General and Extra pools in Spanish.' },
  },
]

export const PLATFORMS: RefLink[] = [
  {
    label: 'HamStudy.org',
    url: 'https://hamstudy.org/',
    note: { es: 'Flashcards y exámenes de práctica de los tres niveles.', en: 'Flashcards and practice exams for all three levels.' },
  },
  {
    label: 'HamExam.org',
    url: 'https://hamexam.org/',
    note: { es: 'Banco completo por subelementos, sin cuenta.', en: 'Full pool by sub-element, no account needed.' },
  },
  {
    label: 'K8DAA — Pools con solo respuestas correctas',
    url: 'https://www.k8daa.org/your-license/technician-pool-questions-with-only-the-correct-answers/',
    note: { es: 'PDFs de K8TB / AD7FO (Tech 2030, Gen 2027, Extra 2028).', en: 'K8TB / AD7FO PDFs (Tech 2030, Gen 2027, Extra 2028).' },
  },
  {
    label: 'GLAARG — Sesiones de examen',
    url: 'https://hamstudy.org/sessions/glaarg',
    note: { es: 'VEs con sesiones bilingües, virtuales y presenciales.', en: 'VEs offering bilingual online and in-person sessions.' },
  },
]

export const DATA_SOURCE: RefLink = {
  label: 'github.com/russolsen/ham_radio_question_pool',
  url: 'https://github.com/russolsen/ham_radio_question_pool',
  note: {
    es: 'Conversión a JSON de los bancos NCVEC (Apache-2.0). Actualiza con `npm run import-pools`.',
    en: 'JSON conversion of the NCVEC pools (Apache-2.0). Refresh with `npm run import-pools`.',
  },
}
