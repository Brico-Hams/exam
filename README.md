# 📻 EA5KAO Ham Exam Prep — Preparación Examen Radioaficionado FCC

**Autor: Anatol EA5KAO** · [github.com/anatolbricoham/exam](https://github.com/anatolbricoham/exam)

Aplicación multiplataforma (**Web + Android**) para preparar los tres exámenes de licencia de
radioaficionado de EE. UU., en **español e inglés**.

| Nivel | Elemento | Vigencia del banco | Preguntas | Aprueba con |
|---|---|---|---|---|
| Technician | 2 | 2026-07-01 → 2030-06-30 | 35 | 26 |
| General | 3 | 2023-07-01 → 2027-06-30 | 35 | 26 |
| Amateur Extra | 4 | 2024-07-01 → 2028-06-30 | 50 | 37 |

## Funciones

- **Banco completo** de los tres exámenes (409 / 423 / 599 preguntas) con sus figuras.
- **Selección de grupos**: el alumno marca subelementos y grupos (T1A, G2B, E9C…) o *Todo el banco*. La selección se guarda por nivel.
- **Tres modos de examen** (se califican, se guarda el historial y se pueden repasar las falladas):
  - *Oficial*: una pregunta al azar por cada grupo del syllabus (35/35/50); aprueba con 26/26/37.
  - *Grupos seleccionados*: una pregunta por cada grupo elegido; aprueba con el 74 % (como el oficial).
  - *Todo lo seleccionado*: todas las preguntas de los grupos elegidos, en orden aleatorio, con la misma regla del 74 %.
- **Práctica** con retroalimentación inmediata, por grupos seleccionados o solo con las preguntas falladas.
- **Tarjetas (flashcards)** y vista **"solo respuesta correcta"** (como el método K8DAA).
- Progreso por subelemento: una pregunta cuenta como dominada tras 2 aciertos seguidos.
- Interfaz en español/inglés y contenido en modo **inglés**, **español** o **bilingüe**.
- Página de **referencias**: FCC, NCVEC, ARRL, KP4ARA, HamStudy, HamExam, K8DAA y GLAARG.
- Funciona sin conexión. El progreso se guarda localmente en `localStorage`.

## Datos y licencias

- Los bancos de preguntas del NCVEC son de **dominio público**. Se importan en formato JSON desde
  [russolsen/ham_radio_question_pool](https://github.com/russolsen/ham_radio_question_pool) (Apache-2.0),
  junto con sus figuras.
- **Las traducciones al español no son oficiales**: el examen oficial se presenta en inglés.
  Cada pregunta indica el origen de su traducción.
- **Español — GLAARG PR VE Team** (fuente preferida): los bancos en español de
  [GLAARG PR](https://www.glaargpr.com/?page_id=229) tienen derechos de autor, así que **no se incluyen en el
  repositorio** (`src/data/i18n/es-glaarg/` está en `.gitignore`). Cada usuario los genera localmente desde los PDF:

  ```bash
  npm run import-glaarg
  ```

  El importador valida cada pregunta contra el banco oficial (misma respuesta correcta). General y Extra quedan
  cubiertos al 100 %. El banco Technician de GLAARG corresponde a 2022‑2026, así que solo se aplican las preguntas
  que no cambiaron en el banco 2026‑2030.
- **Español — traducción propia** (respaldo): `src/data/i18n/es/` contiene una traducción completa de los tres
  bancos, que se usa cuando no hay versión GLAARG de una pregunta.
- Las traducciones de KP4ARA tienen derechos de autor y **no se copian aquí**; solo se enlazan.

Para actualizar los bancos (por ejemplo, cuando salga un banco nuevo), edita la configuración `POOLS`
en [scripts/import-pools.mjs](scripts/import-pools.mjs) y ejecuta:

```bash
npm run import-pools
```

### Añadir traducciones

Edita `src/data/i18n/es/{technician,general,extra}.json`:

```json
{
  "T1A01": {
    "question": "Texto de la pregunta en español",
    "answers": ["A", "B", "C", "D"]
  }
}
```

Las respuestas deben ir **en el mismo orden** que en inglés. Si la traducción no tiene 4 respuestas,
se ignora y se muestra el texto en inglés.

Para fusionar traducciones por subelemento (archivos `T1.json`, `G2.json`…):

```bash
node scripts/merge-translations.mjs <carpeta>
```

## Desarrollo

Requisitos: Node.js 20+.

```bash
npm install
npm run dev        # servidor de desarrollo
npm test           # pruebas (vitest)
npm run lint       # oxlint
npm run build      # build web en dist/
```

El build web (`dist/`) es estático. Usa rutas relativas y `HashRouter`, así que se puede publicar
en cualquier hosting estático (GitHub Pages, Netlify, etc.).

## Android (Capacitor)

Requisitos: Android Studio (incluye JDK 17+ y el Android SDK).

```bash
npm run android:sync   # build web + copia a android/
npm run android:open   # abre el proyecto en Android Studio
npm run android:run    # build y ejecuta en un dispositivo/emulador
```

Desde Android Studio puedes generar el APK/AAB firmado (*Build → Generate Signed Bundle / APK*).

## Estructura

```
scripts/import-pools.mjs   Importador de bancos NCVEC (JSON + figuras)
scripts/import-glaarg.mjs  Importador de los PDF en español de GLAARG PR
scripts/merge-translations.mjs  Fusiona traducciones por subelemento
src/data/pools/            Bancos generados (inglés)
src/data/i18n/es/          Traducción propia al español (overlay)
src/data/i18n/es-glaarg/   Traducción GLAARG (generada localmente, ignorada por git)
src/lib/                   Lógica: exámenes, progreso, i18n, referencias
src/pages/                 Pantallas (inicio, nivel, estudio, práctica, examen, referencias)
public/figures/            Diagramas de los bancos
android/                   Proyecto nativo Capacitor
```

---

*English:* Cross-platform (web + Android) study app for the US amateur radio license exams
(Technician, General, Amateur Extra). It uses the public-domain NCVEC question pools, offers simulated exams,
practice, flashcards and progress tracking, and supports bilingual content. Run it with `npm install && npm run dev`.

---

? Anatol EA5KAO ? 73!

---

© Anatol EA5KAO — 73!
