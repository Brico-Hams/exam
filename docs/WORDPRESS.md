# Publicar en WordPress / Deploy alongside WordPress

**BricoHams · EA5KAO Ham Exam Prep · Los DamWatts**

**Autor de la aplicación / Application author: Anatol EA5KAO**

## Español

### Qué contiene la entrega

ZIP de la aplicación web compilada en modo público, con los bancos USA y España,
cómics Los DamWatts, ilustraciones, licencias, branding y marca de agua.
No contiene traducciones GLAARG opcionales. Funciona como sitio estático;
**no es un plugin ni un tema de WordPress**. No se sube por
«Plugins → Añadir plugin» ni se instala desde la biblioteca de medios.
No modifica WordPress, la base de datos ni el tema.

### Compilar y verificar

Requisitos de construcción: Node 22 y dependencias del proyecto instaladas desde
el lockfile (`npm ci` al preparar el entorno). No se necesita Node en el hosting.

```powershell
npm test -- --mode public
npm run lint
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\package-wordpress.ps1
```

Resultados en `artifacts\wordpress\`: ZIP, checksum `.sha256`, inventario `.json`
con commit y hashes de cada archivo, y copia de esta guía. El script verifica
todos los archivos dentro del ZIP. No sobrescribe un paquete existente del mismo
commit; consérvalo y usa otro nombre si necesitas archivarlo antes de recompilar.

### Despliegue automático en cada push

El workflow `.github/workflows/deploy-bricohams.yml` publica la app sin pasos
manuales cada vez que se hace push a `main` con cambios en la aplicación (o al
lanzarlo a mano desde Actions). Ejecuta tests, lint y el build público, y sube
`dist/` a los dos WordPress del hosting:

| Sitio | Carpeta en el hosting | URL |
|---|---|---|
| bricohams.org | `htdocs/radio-examenes` | https://bricohams.org/radio-examenes/ |
| bricohams.com | `bricohams.com/htdocs/wp-content/radio-examenes` | https://bricohams.com/wp-content/radio-examenes/ |

Solo escribe dentro de esas carpetas, comprueba antes que la raíz es un
WordPress (`wp-includes/`), no borra nada, sube `index.html` el último y
termina comprobando que la página publicada coincide con el build.

Conexión: SFTP de 1984 Hosting en `ernie.shared.1984.is`, puerto 2222. La clave
pública del servidor va fijada en el workflow (RSA
`SHA256:dOwYtoYzRLbe1khWJIRME3JuJj84I8G2ZdEnKvyXXco`), así que rechaza cualquier
otro servidor. Credenciales: solo como *secrets* del repositorio (Settings →
Secrets and variables → Actions), nunca en el código: `BRICOHAMS_SFTP_USER` y
`BRICOHAMS_SFTP_PASSWORD`. Sin ellos el workflow avisa y no despliega. Los
mismos secrets sirven para `bricohams-web-tools` (Misión Zorro).

### Instalar desde el panel del hosting o SFTP

1. Haz una copia de seguridad del sitio y anota la ruta pública real del dominio.
   Usa primero staging si está disponible. No hacen falta credenciales en Git.
2. Con el administrador de archivos del hosting (cPanel/Plesk o equivalente),
   sube el ZIP a una ubicación temporal, fuera del directorio público si es posible.
3. Extrae el ZIP. Contiene **una carpeta `radio-examenes`** con `index.html`,
   `assets`, `figures` y demás archivos estáticos. Copia esa carpeta al directorio
   público del dominio que aloja WordPress (por ejemplo, `public_html`).
   No sobrescribas `wp-admin`, `wp-content`, `wp-includes` ni `.htaccess`.
   Si WordPress está en una subcarpeta, adapta la URL al lugar donde copies la app.
4. Alternativa SFTP: extrae localmente y sube la carpeta completa. No basta con
   subir solo `index.html` o el ZIP sin extraer.
5. Si ya existe `radio-examenes`, usa una carpeta nueva de versión y compruébala
   antes de cambiar el enlace/iframe. No borres ni sobrescribas datos sin respaldo.
6. Abre la URL real con HTTPS: `https://TU-DOMINIO/radio-examenes/`.
   `TU-DOMINIO` es un marcador, no una URL de despliegue confirmada.
7. Comprueba USA, España, General, Extra, respuesta, flashcard, figura y cómic.
   Prueba también `radio-examenes/#/spain` y una recarga directa.
8. El servidor debe servir `.js`, `.css`, `.svg` y `.webmanifest` con MIME correcto.
   Si devuelve la página de WordPress al pedir un asset, corrige la ruta/reglas
   del hosting. El router usa `#`: no necesita nuevas reglas de reescritura.
9. Revalida `index.html` y figuras sin hash; los assets con hash admiten caché
   larga. Purga la caché/CDN tras publicar y evita HTML antiguo con assets borrados.
10. Elimina únicamente el ZIP temporal de subida cuando hayas confirmado la copia
    y conservado el paquete de respaldo. No dejes fuentes ni herramientas expuestas.

### Mostrarla en una página de WordPress

En el editor crea una página, añade un bloque **HTML personalizado** y pega:

```html
<iframe
  src="/radio-examenes/"
  title="BricoHams · Preparación de radioaficionado · Los DamWatts"
  width="100%"
  height="950"
  style="display:block;border:0;min-height:80vh"
  loading="lazy">
</iframe>
<p><a href="/radio-examenes/" target="_blank" rel="noopener">
  Abrir la aplicación en una ventana completa
</a></p>
```

Adapta ambas rutas si elegiste otra carpeta. Usa altura mayor si lo necesitas:
no hay ajuste automático de altura. Preferible mismo dominio y HTTPS.
Si WordPress elimina el iframe, pide al administrador que lo publique mediante
un mecanismo autorizado; no desactives filtros de seguridad globales.
Si el hosting bloquea el marco con CSP o `X-Frame-Options`, pide una configuración
para permitir el mismo origen, sin retirar las protecciones de todo el sitio.
Un enlace directo es una alternativa que no necesita iframe.

### Límites y aceptación

- No se ha subido ni activado esta entrega en el WordPress real de BricoHams.
- No incluye login WordPress, usuarios, pagos Stripe ni sincronización entre
  dispositivos. El progreso USA vive en `localStorage` del navegador/origen;
  sesiones/resultados España son temporales. Conservar dominio y navegador
  no garantiza copia de seguridad: documenta la persistencia antes de migrar.
- Cambiar solo la carpeta del mismo origen conserva el espacio de almacenamiento;
  cambiar dominio, esquema o puerto lo cambia. Dos versiones del mismo origen
  comparten claves de almacenamiento: evita usarlas a la vez para escribir progreso.
- La web no garantiza reapertura sin conexión. No es una APK ni un servidor Node.
- No se usa sandbox en el iframe del ejemplo porque la app requiere scripts,
  almacenamiento, confirmaciones y enlaces; un administrador que añada sandbox
  debe probar explícitamente esas funciones.
- Los cómics mantienen los avisos pendientes y las licencias del banco.
  La marca de agua no sustituye la atribución BricoHams CC BY-SA 4.0.

## English

This is a **static public web build**, not a WordPress plugin or theme.
It includes US/Spain question banks, original DamWatts character artwork,
comics, diagrams, branding, watermark and content credits. Optional GLAARG
translations are excluded.

Run the three commands above to test, lint and package. The output directory
contains a ZIP, SHA-256 checksum, per-file verified inventory and this guide.
The ZIP contains a single `radio-examenes` folder.

1. Back up the site and test on staging first.
2. Upload/extract through your hosting file manager or upload the extracted folder
   through SFTP. Place it under the domain's actual public root, alongside
   WordPress. Do not overwrite WordPress directories, configuration or rewrite rules.
3. Open `https://YOUR-DOMAIN/radio-examenes/` over HTTPS, adapting the path.
   This is a placeholder, not a confirmed live deployment.
4. Add the iframe example above to a Custom HTML block in a WordPress page,
   replacing both paths if necessary. Set its height as needed; no automatic
   height adjustment is implemented. Keep the full-window link as a fallback.
5. If HTML filtering removes the iframe, use an administrator-approved publishing
   method. Do not disable site-wide security filters. Frame headers must allow
   same-origin embedding; the example intentionally does not add sandbox.
6. Verify all question banks, images, answers, comics, mock-exam confirmation
   dialogs, reload and mobile layout from the actual public URL and embedded page.
7. Serve JS/CSS/SVG/webmanifest with correct MIME types, revalidate HTML/unhashed
   figures and preserve old hashed assets until cached HTML is no longer in use.
   Hash routes do not require extra rewrite rules.
8. For updates, upload a separate versioned folder and validate before changing
   links. Keep the previous package for rollback and clean up only known temporary
   upload files after verifying backups.

No deployment to the actual BricoHams WordPress site is claimed. The package has
no WordPress authentication, Stripe integration or cross-device sync. US progress
uses origin-local browser storage; Spain sessions/results are temporary. Folders
on the same origin share storage keys; different origins do not. Offline reopening
is not guaranteed. Pool licensing and pending-review notices remain in place.
