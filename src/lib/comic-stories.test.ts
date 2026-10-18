import { describe, expect, it } from 'vitest'
import { comicScene, COMIC_TITLES } from './comic-stories'

describe('Humorous comic scenes', () => {
  it.each([
    ['What is resistance in ohms?', 'resistance'],
    ['¿Qué almacena un condensador?', 'capacitor'],
    ['How does a MOSFET work?', 'transistor'],
    ['¿Qué es un cortocircuito?', 'short'],
    ['How does an antenna work?', 'radio'],
  ])('selects a relevant scene for %s', (question, id) => {
    for (const lang of ['es', 'en'] as const) {
      const scene = comicScene(question, false, lang)
      expect(scene.id).toBe(id)
      for (const field of ['opening', 'clue', 'solution', 'ending', 'metaphor'] as const) {
        expect(scene[field].length).toBeGreaterThan(30)
      }
    }
  })
  it('keeps legal questions in the archive even when they mention electrical components', () => {
    expect(comicScene('¿Se permite un transistor?', true, 'es').id).toBe('regulations')
  })
  it('distinguishes metaphors from technical claims', () => {
    expect(comicScene('capacitor', false, 'es').metaphor).toContain('Explotar no')
    expect(comicScene('transistor', false, 'en').metaphor).toContain('different control mechanisms')
    expect(comicScene('short circuit', false, 'es').metaphor).toContain('no tiene por qué ir a tierra')
  })
  it('preserves the three supplied franchise titles without enabling unsupported languages', () => {
    expect(COMIC_TITLES.en).toBe('Chomp & Chip: Circuit Chaos')
    expect(COMIC_TITLES.es).toBe('Chomp y Chip: Caos en el Circuito')
    expect(COMIC_TITLES.hu).toBe('Csomp és Csip: Áramkör para')
  })
})
