# 📻 EA5KAO Ham Exam Prep — España y EE. UU.

**Autor: Anatol EA5KAO** · [github.com/anatolbricoham/exam](https://github.com/anatolbricoham/exam)

Aplicación multiplataforma (**Web + Android**) para preparar los tres exámenes de licencia de
radioaficionado de EE. UU., en **español e inglés**, y el examen de España
(banco BricoHams con preguntas, explicaciones e ilustraciones en español).

| Nivel | Elemento | Vigencia del banco | Preguntas | Aprueba con |
|---|---|---|---|---|
| Technician | 2 | 2026-07-01 → 2030-06-30 | 35 | 26 |
| General | 3 | 2023-07-01 → 2027-06-30 | 35 | 26 |
| Amateur Extra | 4 | 2024-07-01 → 2028-06-30 | 50 | 37 |

## Funciones

- **Inicio por país**: dos bloques para elegir Estados Unidos (`/#/usa`) o España
  (`/#/spain`). Los tres niveles FCC y su progreso se muestran dentro de Estados Unidos.
- **Banco completo** de los tres exámenes (409 / 423 / 599 preguntas) con sus figuras.
- Los tres bancos y sus traducciones se incluyen en el archivo principal de la aplicación:
  cambiar de nivel no necesita descargar módulos adicionales. Esto aumenta la descarga
  inicial, pero evita bloqueos por archivos de bancos antiguos tras actualizar la web.
- **Selección de grupos**: el alumno marca subelementos y grupos (T1A, G2B, E9C…) o *Todo el banco*. La selección se guarda por nivel.
- **Tres modos de examen** (se califican, se guarda el historial y se pueden repasar las falladas):
  - *Oficial*: una pregunta al azar por cada grupo del syllabus (35/35/50); aprueba con 26/26/37.
  - *Grupos seleccionados*: una pregunta por cada grupo elegido; aprueba con el 74 % (como el oficial).
  - *Todo lo seleccionado*: todas las preguntas de los grupos elegidos, en orden aleatorio, con la misma regla del 74 %.
- **Práctica** con retroalimentación inmediata, por grupos seleccionados o solo con las preguntas falladas.
- **Tarjetas (flashcards)** y vista **"solo respuesta correcta"** (como el método K8DAA).
- **Explicación y fundamentos ES/EN**: aparece después de responder en práctica,
  al revelar una flashcard, en la lista de respuestas correctas y tras entregar
  el examen (incluidas las preguntas acertadas). No revela respuestas durante el examen.
  Incluye enlaces a las secciones del eCFR citadas en cada pregunta y fundamentos
  bilingües para **los 120 grupos y las 1.431 preguntas**. La asignación usa el grupo
  del banco, no coincidencias ambiguas de palabras en las opciones de respuesta.
  La interfaz distingue el fundamento compartido del grupo de una solución individual.
  Hay además razonamientos desarrollados de ley de Ohm, potencia, dB, valores RMS,
  unidades, transformadores, asociaciones de componentes, resonancia y fase.
  Los cálculos nuevos se recalculan en las pruebas con la tolerancia del redondeo
  de la opción. No se afirma disponer de 1.431 soluciones individuales paso a paso:
  la cobertura completa se refiere a los fundamentos, no a esos desarrollos.
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

## España — Radioaficionado / HAREC

Acceso desde la portada o `/#/spain`. Módulo independiente de los niveles FCC:

- Electricidad y radioelectricidad y Reglamentación.
- Cada parte tiene 30 preguntas, 45 minutos y aprobado con 15 aciertos, sin restar
  por errores. Las notas no se compensan. En la simulación completa se realiza
  primero Técnica y después Reglamentación, con temporizadores independientes.
  Al agotarse el tiempo se entrega automáticamente la parte actual. Los intentos
  y sus resultados duran durante la sesión; recargar la página abandona el intento.
- Práctica con corrección inmediata y flashcards, filtrables por temas.
- Las simulaciones toman 30 preguntas aleatorias distintas del banco de cada parte,
  excluyendo las marcadas para revisión; los filtros de estudio no afectan al examen.
- **Banco BricoHams, versión 2026-10-18**, aportado por el usuario: de 1.095
  registros se incorporan **1.094 preguntas únicas** (578 de electricidad y
  radioelectricidad y 516 de reglamentación). Se omite `bh-r421`, duplicada de
  `bh-r188` por enunciado y respuesta correcta. El registro omitido se conserva
  en [`src/data/spain-import-report.json`](src/data/spain-import-report.json).
- **73 ilustraciones SVG** incluidas sin alteraciones, con rutas locales para
  funcionar en web y Android sin conexión. Los esquemas del enunciado y las
  alternativas gráficas pueden ampliarse y se muestran también al revisar.
- Cada pregunta incluye la **explicación en español del paquete**. Se conservan
  las 16 notas del banco, incluidas sus correcciones. Las explicaciones en inglés
  no vienen en el archivo y se muestran como pendientes, sin traducciones ficticias.
- Las **206 preguntas marcadas para revisión normativa** (3 técnicas y 203 de
  reglamentación) están disponibles en práctica y flashcards con un aviso, pero
  quedan fuera de los simulacros. Quedan 575 técnicas y 313 de reglamentación
  disponibles para simular. La ausencia de marca no certifica la corrección o
  vigencia de las demás; este material no es un banco oficial.
- Se mezclan las alternativas de texto al iniciar cada sesión para evitar el
  sesgo del archivo, que coloca casi todas las claves primero. La respuesta
  correcta se recalcula y el banco original no cambia. Las siete preguntas
  gráficas con opciones fijas mantienen su orden y sus letras.
- Preguntas, explicaciones e ilustraciones: **BricoHams · CC BY-SA 4.0**,
  según la licencia indicada en el paquete. Se conserva la atribución y se
  distribuyen las adaptaciones de ese material bajo la misma licencia.
  [Aviso y enlaces al texto legal](public/figures/spain/LICENSE-BricoHams.txt).
  La autoría de la aplicación sigue siendo **Anatol EA5KAO**.
- Importación JSON desde la pantalla de España, con confirmación de permiso,
  validación y almacenamiento local. Los datos se añaden al banco existente;
  una importación inválida no modifica el banco. No se envían a ningún servidor.
  El almacenamiento local puede perderse al borrar los datos del navegador:
  conserva tus archivos originales.
- Al arrancar se combina el banco incluido con las preguntas guardadas localmente:
  una importación anterior vacía no oculta las preguntas recién incorporadas.

### Reimportar el paquete BricoHams

Extrae el ZIP original y pasa al conversor la carpeta que contiene
`preguntas_bricohams.json` e `ilustraciones`:

```powershell
npm run import-bricohams -- "C:\ruta\BricoHams_banco_preguntas"
```

El conversor valida claves, opciones, avisos y referencias de figuras; rechaza
SVG activos o con recursos externos. Genera el banco y el informe de importación,
y copia los SVG sin modificarlos. No descarga contenido de Internet.
No sustituye una revisión técnica o normativa del material.

### Importación local en la aplicación

El archivo debe ser una lista de objetos con estos campos:

| Campo | Contenido |
|---|---|
| `id` | Identificador único, por ejemplo `ES-TEC-0001` |
| `part` | `technical` o `regulations` |
| `topic` | Tema de estudio |
| `question` | Enunciado en español |
| `answers` | Cuatro opciones distintas en su orden de presentación |
| `correct` | Índice de la respuesta correcta: **0, 1, 2 o 3** |
| `source` | Procedencia y referencia del contenido autorizado |
| `figure` | Opcional: `figures/spain/nombre.svg` (también PNG o WebP) |
| `figureAlt` | Descripción accesible, obligatoria si hay figura |
| `answerFigures` | Opcional: cuatro posiciones, `null` o `{ "figure": "figures/spain/opcion.svg", "figureAlt": "Descripción" }` |
| `answersFixed` | Opcional: booleano para conservar el orden. Las opciones con figuras siempre lo conservan |
| `explanation` | Opcional: objeto con `es` obligatorio y `en` opcional, ambos no vacíos si se proporcionan |
| `reviewReason` | Opcional: motivo no vacío de revisión pendiente; excluye la pregunta de los simulacros |
| `note` | Opcional: nota del autor del banco; se muestra después de corregir o revelar |

Se omiten duplicadas por **parte + enunciado + figura del enunciado + respuesta
correcta**, incluida su figura si la hay, normalizando mayúsculas y espacios,
aunque las opciones estén reordenadas.
No se borran acentos, cifras ni unidades para evitar fusionar preguntas diferentes.
El mismo enunciado con las mismas alternativas pero claves diferentes produce
un error explícito, al igual que reutilizar un identificador para preguntas distintas.
Las variantes con alternativas diferentes no se consideran automáticamente contradictorias.
Una duplicada nunca elimina un aviso de revisión ya existente.
Las explicaciones de España se mostrarán al corregir o revelar la respuesta,
no durante la prueba. Si no vienen en el banco se indica que están pendientes;
no se aplican automáticamente normas FCC a las preguntas españolas.

Para distribuir el banco en web y Android, incorpora los objetos autorizados a
[`src/data/spain.json`](src/data/spain.json), coloca las ilustraciones propias en
`public/figures/spain/` y vuelve a compilar/sincronizar. La importación del navegador
solo carga texto y referencias: **no sube imágenes**. Las imágenes deben estar ya
incluidas en la aplicación. Las ilustraciones BricoHams incluidas conservan la
atribución y licencia del paquete suministrado.

Reglas de referencia: [Resolución de 3 de junio de 2014, BOE-A-2014-6461](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2014-6461).
La simulación es una ayuda educativa, no certifica la vigencia de las preguntas ni
reproduce una distribución temática oficial no publicada.

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
