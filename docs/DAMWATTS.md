# Los DamWatts

## Identidad de marca

**Franquicia:** Los DamWatts. Sustituye a la propuesta anterior «Chomp & Chip»,
que se parecía demasiado a una marca existente de personajes roedores.

| Idioma | Título |
|---|---|
| Español | Los DamWatts: ¡A toda carga! |
| English | The DamWatts: Fully Charged! |
| Magyar | Gát-Wattok: Túltöltve! |

El nombre une *dam* (presa) y *watts* (vatios). La interfaz usa el título ES o EN
del episodio. El título húngaro se conserva como identidad de franquicia, no
como promesa de traducir el banco o la aplicación.

La marca de agua es «Los DamWatts · Anatol EA5KAO». No cambia el nombre, los
iconos ni las claves de respuesta de EA5KAO Ham Exam Prep. La autoría de la
aplicación sigue siendo **Anatol EA5KAO**. Los textos de marca están centralizados
en `FRANCHISE` y `COMIC_TITLES` (`src/lib/comic-stories.ts`).

## Personajes

Los dibujos de la aplicación siguen las fichas de diseño de los personajes.
Todos son dibujos vectoriales originales, sin recursos de terceros.

| Personaje | Papel | Rasgo visual | Qué enseña |
|---|---|---|---|
| **Chomp** | Capitán y protagonista; abre cada misión | Castor marrón con pañuelo naranja e insignia de rayo | Comete los errores típicos; su presa es la metáfora del circuito |
| **Chip** | Cerebro del equipo; da la pista | Circuito integrado turquesa con punto de patilla 1 y cuaderno | Un CI reúne muchos componentes; método pista → cálculo → referencia |
| **RESI** | La resistencia | Casco naranja, gafas redondas, gota de sudor, tronco con bandas marrón-negro-rojo-oro (1 kΩ ± 5 %) | Limita la corriente (I = V/R) y disipa energía en calor |
| **CONDI** | El condensador | Mejillas hinchadas y mochila con forma de electrolítico, con su franja de signos menos | Almacena energía en un campo eléctrico; carga y descarga según R·C; polaridad |
| **TRANSI** | El transistor | Gafas de sol, placa «C B E» y la cola levantada como barrera | Una señal pequeña controla una corriente mayor; conmuta o amplifica; BJT ≠ FET |
| **Banda del Corto** | Villanos (EN: Short-Circuit Crew) | Electrones oscuros con signo menos, pelo de rayo y patinetes diminutos | Un corto es un camino de impedancia muy baja; no tiene por qué ir a tierra |

### Correcciones respecto a la versión anterior

- RESI, CONDI y TRANSI eran la misma cabeza de castor cambiando solo el color.
  Ahora cada uno tiene rasgos propios y reconocibles a tamaño de viñeta.
- La Banda del Corto era un único círculo; ahora son tres electrones con su signo.
- Chomp ya no lleva un cable en la boca: la serie insiste en no morder cables,
  así que el dibujo no debe sugerirlo.
- Las patillas de Chip se dibujan sin relleno (antes podían verse triángulos negros).

### Estilo de los castores (octubre de 2026)

Rediseño más detallado y pensado para un público joven, igual en la aplicación
(`BeaverBody`, `BeaverArms`, `Sneaker` y `Eyes` en `QuestionComic.tsx`) y en
la historieta «¡Misión Zorro!» (`#beaver`, `#paws`, `#sneaker` y `#eyes` en
`bricohams-web-tools/mision-zorro/index.html`):

- ojos grandes y brillantes con dos reflejos, colorete en las mejillas e interior
  de las orejas rosa;
- zapatillas deportivas naranjas con puntera blanca, franja y cordones;
- pelaje más cálido con brillo en la cabeza y la barriga, sombreado lateral,
  mechón en la frente, bigotes, hocico con boca y dientes con forma;
- patas delanteras con deditos (TRANSI conserva sus brazos cruzados) y cola con
  su trama de escamas.

Se mantienen las coordenadas de anclaje de la cuadrícula de 400×520 (cabeza,
ojos, hocico, cuello y mejillas), así que el pañuelo de Chomp, el casco y las
gafas de RESI, las mejillas y la mochila de CONDI y las gafas de TRANSI encajan
igual que antes.

## Lectura y alcance / Reading and scope

- Práctica: responde y abre «Leer cómic». Flashcards: revela la respuesta primero.
- Simulacros: solo después de entregar, en la revisión de respuestas.
- USA: inglés, español o ambos, según el selector de contenido.
- España: español; no se inventan traducciones ni se ocultan avisos pendientes.
- Son episodios generados por plantilla con la pregunta, la respuesta y la
  explicación disponible, no guiones escritos y revisados uno a uno.
- Las figuras del banco se muestran separadas y conservan su atribución y licencia.
- Las adaptaciones del contenido BricoHams conservan CC BY-SA 4.0. La marca de
  agua no convierte ese material en contenido exclusivo de la aplicación.

Cada episodio separa metáfora y ciencia y recuerda que nunca se deben morder
cables ni manipular circuitos energizados. Los personajes son caricaturas de
comportamiento, sin diagnósticos médicos. Las preguntas, claves y explicaciones
no cambian.

## English summary

**Franchise:** The DamWatts (*dam* + *watts*), replacing the earlier
“Chomp & Chip” proposal. Titles: “Los DamWatts: ¡A toda carga!” (ES),
“The DamWatts: Fully Charged!” (EN) and “Gát-Wattok: Túltöltve!” (HU, a
franchise title only). Watermark: “Los DamWatts · Anatol EA5KAO”. Branding
strings live in `FRANCHISE` and `COMIC_TITLES` in `src/lib/comic-stories.ts`.

The team is Chomp (beaver captain), Chip (turquoise integrated circuit),
RESI (resistor), CONDI (capacitor) and TRANSI (transistor); the villains are the
Short-Circuit Crew. Each guest now has distinct, original vector artwork
matching the character sheets. Comics appear only after an answer is revealed
or a mock exam is submitted. Pool questions, answers and explanations are
unchanged.

## Verificación / Verification

169 pruebas correctas (incluidas las nuevas de los dibujos de cada personaje),
`tsc` sin errores, lint y build público correctos. Se revisaron en navegador las
viñetas de RESI, CONDI, TRANSI, la Banda del Corto, Chomp y Chip.

169 passing tests (including new per-character artwork tests), clean `tsc`,
lint and public build. RESI, CONDI, TRANSI, the Short-Circuit Crew, Chomp and
Chip panels were checked in a browser.

Esta documentación registra decisiones editoriales, no una búsqueda de
disponibilidad ni una solicitud o registro de marca.

This is an editorial record, not a trademark availability search, application
or registration.
