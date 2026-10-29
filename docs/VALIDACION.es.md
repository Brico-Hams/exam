# Informe de validación y cargas de trabajo

**EA5KAO Ham Exam Prep · Anatol EA5KAO · 2026-10-18**

[English](VALIDATION.en.md) · [Procedimientos completos](GUIA-TECNICA.es.md)

## 1. Trazabilidad

- Código de la compilación Android: `0b43ec7025b6dc325588e02f6f933927776273ef`.
- [Ejecución Android en GitHub Actions](https://github.com/Brico-Hams/exam/actions/runs/39112076520).
- Modo público: excluye traducciones GLAARG opcionales y usa las propias.
- Las decisiones de revisión de España del commit anterior se conservan.
- [Mediciones HTTP completas](results/load-local.json): incluyen huellas de los
  assets, hash del generador, commit base y estado de trabajo modificado.
  La simulación se realizó durante la preparación de esta documentación:
  `workingTreeDirty=true` es intencionado y no equivale a medir un commit limpio.

## 2. Comprobaciones ejecutadas

| Comprobación | Resultado |
|---|---|
| `npm test` | 147 pruebas correctas, 7 archivos |
| `npm test -- --mode public` | 147 pruebas correctas, 7 archivos |
| `npm run lint` | Correcto |
| `npm run build:public` | TypeScript y Vite correctos |
| Exclusión GLAARG | No aparecen 459 enunciados distintivos de Extra en el JS público; el build elimina el overlay opcional |
| Sintaxis helper PowerShell | Analizador sin errores |
| Preflight APK local sin JDK21 | Rechazo explícito, como se esperaba |
| HTTP 200 con HTML incorrecto | Los siete pedidos de la prueba negativa fallan por contenido |
| Destino remoto sin autorización explícita | Rechazado antes de generar solicitudes |
| Umbral p95 forzado a 1 ms | Informe escrito y código 1, sin errores de contenido |
| Argumentos CLI inválidos | Ocho configuraciones rechazadas antes de generar carga |
| Navegador sobre build público | Cargan los tres bancos USA y España; SVG disponible; sin desbordamiento horizontal a 390 px |
| Compilación Android alojada | Correcta; APK, firma debug, manifest y assets verificados |
| Descarga y publicación APK | SHA-256 local y digest del asset de GitHub coinciden |

El build público produce aproximadamente 2,066 MB decimales de JavaScript sin
comprimir y 506 kB gzip según el informe Vite. El tamaño grande es un aviso
conocido por los bancos incluidos, no un fallo. El tamaño gzip puede variar por
la herramienta y no equivale al tráfico real del hosting.

## 3. Entorno y método de carga

- Windows, Node `v22.23.3`, 12 CPU lógicas, 31,64 GiB de memoria total.
- Cliente y servidor Vite preview comparten el mismo equipo.
- Destino local: `http://127.0.0.1:4183/`, sin TLS ni WAN.
- Modelo cerrado, 30 sesiones por fase, concurrencia 1/5/20.
- `cold-visit`: cinco archivos por sesión: HTML, CSS, JS y dos SVG.
- `figure-navigation`: dos SVG por sesión; no es una navegación React completa.
- 180 sesiones sintéticas, **630 solicitudes**, **cero errores de contenido/HTTP**.
- Aproximadamente 189,94 MB de bytes descomprimidos verificados en total.
- Todos los archivos se comparan por SHA-256 con el build local.
- Umbral: cero errores y p95 de solicitud <=2.000 ms por fase.

## 4. Mediciones

| Perfil | Concurrencia | Solicitudes | Errores | p95 solicitud (ms) | p95 sesión (ms) | Solicitudes/s |
|---|---:|---:|---:|---:|---:|---:|
| Visita fría | 1 | 150 | 0 | 93,681 | 135,837 | 44,85 |
| Visita fría | 5 | 150 | 0 | 190,527 | 263,916 | 105,13 |
| Visita fría | 20 | 150 | 0 | 762,920 | 997,587 | 113,61 |
| Figuras | 1 | 60 | 0 | 9,400 | 15,282 | 185,95 |
| Figuras | 5 | 60 | 0 | 25,620 | 50,173 | 373,46 |
| Figuras | 20 | 60 | 0 | 46,679 | 85,308 | 523,66 |

Todas las fases cumplen el umbral local. p95 usa el percentil de rango más cercano.
La duración incluye lectura del cuerpo y hash; no es solo tiempo hasta primer byte.
Son muestras cortas en una máquina compartida, no pruebas de resistencia prolongadas.

## 5. Qué no demuestra esta simulación

No certifica 20 alumnos simultáneos en producción ni un máximo de capacidad.
No mide JS/React, consumo de memoria del alumno, FPS, WebView, `localStorage`,
CDN real, red móvil, compresión del proveedor, TLS, comportamiento de caché de
navegador ni sesiones de 45 minutos. No se ha ejecutado carga contra terceros.
El cálculo y la selección de preguntas tienen pruebas funcionales, no una
medición de carga de navegador concurrente.

Para aceptar producción hay que repetir contra un staging autorizado con el mismo
build, probar dispositivos reales y medir tiempo hasta interacción y estabilidad.
Los comandos y criterios están en la sección 8 de la guía técnica.

## 6. Instalación y publicación

La compilación local se bloqueó correctamente: el equipo solo tiene Java 8
y no se encontró un SDK Android. No se instalaron herramientas ni se aceptaron
licencias nuevas en nombre del propietario. Se usa el entorno alojado de Actions.

La APK de esta entrega es **debug, para pruebas**, no release firmada por el
propietario ni AAB de Google Play. La verificación automatizada comprueba firma,
manifest y assets; no equivale a instalar/ejecutar en un dispositivo.

**Resultado: compilación correcta y prerelease publicada.**

- [Descargar APK debug](https://github.com/Brico-Hams/exam/releases/download/v1.0.0-debug.20261018/EA5KAO-Ham-Exam-1.0.0-debug.apk).
- [Prerelease con checksum y procedencia](https://github.com/Brico-Hams/exam/releases/tag/v1.0.0-debug.20261018).
- Tamaño: **5.769.967 bytes**; Android 7+ (`minSdk=24`, `targetSdk=36`).
- Paquete `com.hamexamprep.app`, versión Android `1.0`, `versionCode=1`.
- Compilada: `2026-10-18T08:46:16.7613489Z`.
- SHA-256:
  `d00432e3d233bd57428298efe98e1e1d410616e0ed3cac7f78b53afec7f10f06`.
- [Evidencia de compilación en JSON](results/android-build.json).

La APK se descargó del artefacto `12131220839`, se contrastó con su
`build-info.json` y se subió a la prerelease. GitHub confirmó el mismo digest.
Además, se contrastaron localmente por SHA-256 los **93 archivos web** de la APK
contra el `dist/` descargado de CI: todos coinciden. Respecto al build local usado
para medir carga, 91 archivos coinciden byte a byte; solo `index.html` y
`manifest.webmanifest` difieren en finales de línea, sin cambios de contenido.
El artefacto de Actions tiene retención de 30 días; los assets de la prerelease
no dependen de esa retención. Al ser un repositorio privado, la descarga requiere
acceso al repositorio. **No se ha instalado ni ejecutado la APK en dispositivo o
emulador**, ni se ha probado una actualización sobre una instalación anterior.

GitHub Pages queda documentado y preparado con workflow manual; no se ha activado
ni publicado el sitio como parte de estas comprobaciones.
