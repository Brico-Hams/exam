## Security review (SonarQube 2026-11-13)

### typescript:S5332 – Clear-text protocols should not be used (LOW) – `src/lib/references.ts:17`
- **Fallo**: la URL `http://www.arrl.org/question-pools` usaba un protocolo en claro. Según la regla (CWE-319, OWASP A2:2021 / A3:2017), un atacante en la red puede leer o modificar el tráfico sin ser detectado, por ejemplo redirigiendo al usuario a un destino malicioso.
- **Cambio**: el esquema pasa a `https://` (mismo host y ruta).
- **Sin pérdida de funcionalidad**: es solo un enlace de referencia; sigue apuntando al mismo recurso. Comprobación manual: abrir el enlace desde la pantalla de referencias.

### xml:S5332 – Clear-text protocols should not be used (LOW) – `android/app/src/main/AndroidManifest.xml:4`
- **Fallo**: sin `usesCleartextTraffic` explícito, en Android anteriores a 9 (API 28) el tráfico en claro queda permitido (CWE-319, OWASP A2:2021), exponiendo datos a interceptación y manipulación.
- **Cambio**: `android:usesCleartextTraffic="false"` en `<application>`.
- **Sin pérdida de funcionalidad**: no hay ninguna URL `http://` de destino en `src` ni en el código Android (solo URIs de espacio de nombres XML). Comprobación manual: ejecutar la app Android y verificar que las funciones con red siguen funcionando.

## Not changed - requires decision

### xml:S6358 – Android application backup should be disabled or restricted (MEDIUM) – `android/app/src/main/AndroidManifest.xml:4`
- **Fallo**: `android:allowBackup="true"` sin restricción permite exportar los datos locales a Google Cloud o vía `adb backup`, exponiendo datos sensibles o permitiendo restaurar datos manipulados (CWE-922, OWASP M9 / A1:2021).
- No se modificó: se había cambiado a `android:allowBackup="false"`, pero se revirtió a `true` porque desactivar la copia de seguridad elimina la copia y restauración automática de los datos de la app del usuario de Android, lo que supone una pérdida de funcionalidad. Decisión necesaria: desactivar la copia de seguridad o restringirla con `dataExtractionRules` / `fullBackupContent`.

### javascript:S4036 – OS commands should not rely on PATH resolution (LOW) – `scripts/load-test.mjs:102` y `:103`
- Las llamadas `execFileSync('git', ...)` (`rev-parse HEAD` y `status --porcelain`) resuelven `git` por PATH (CWE-426/427).
- No se modificó: la ruta absoluta de `git` depende de cada máquina (Windows/Linux/macOS) y fijar una inventada rompería el script; hacerla configurable cambiaría su comportamiento. Es un script de desarrollo local, no código de producción. Decisión necesaria: definir una ruta absoluta fija de `git` o aceptar el riesgo.
