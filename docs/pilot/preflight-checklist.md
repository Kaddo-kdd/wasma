# Lista de Comprobación Preflight — Piloto de Adopción (AN-075)

Antes de iniciar cualquier sesión de prueba con desarrolladores externos, el facilitador debe ejecutar y verificar rigurosamente cada uno de los siguientes puntos:

---

## 1. Procedencia y Validación de Binarios Candidatos Multiplataforma

### A. Procedencia Inmutable de los Artefactos
- **Workflow de origen**: `Release Multi-Platform` (AN-070).
- **Run ID de GitHub Actions**: `41271134318`.
- **Commit SHA de procedencia**: `0ffa96346d92ace905b392b3147aff776da5fab9`.
- **Integridad de empaquetado**: Los archivos se utilizan en su forma original generada por CI. **Queda estrictamente prohibido reempaquetar, renombrar o recompilar los binarios.**

### B. Inventario y Hashes SHA-256 Oficiales
Verificar que los paquetes disponibles coinciden exactamente con el catálogo inmutable `SHA256SUMS`:

1. **Windows x86_64 MSVC**:
   - Archivo: `wasma-v0.1.0-dev-0ffa963-x86_64-pc-windows-msvc.zip`
   - SHA-256: `2e81f9f4ef9894abd69e3cf123f504ca7bce9062c73b73d03509a0160636b472`
   - SHA-256 del binario extraído `wasma.exe`: `807f7dbeb3e5a936546ed69dec472d3c081165372ee29e4e49bd722563fa3db5`
   - Método de instalación: Descompresión ZIP, extracción a carpeta local y configuración en `$env:PATH`.
2. **Linux x86_64 GNU**:
   - Archivo: `wasma-v0.1.0-dev-0ffa963-x86_64-unknown-linux-gnu.tar.gz`
   - SHA-256: `b0a7ddbf1c1df3e877bf408ebc46dd6622ec20fa49c323ba0c8227b6c507c95d`
   - Método de instalación: Extracción con `tar -xzf`, verificación de permisos de ejecución (`chmod +x wasma` si es necesario) y colocación en el `PATH`.
3. **macOS ARM64 (Apple Silicon)**:
   - Archivo: `wasma-v0.1.0-dev-0ffa963-aarch64-apple-darwin.tar.gz`
   - SHA-256: `d866a2fe0a9e22fb753a6697fa297072a297e6e5888e404fbe9e3ce7e2fc2c4b`
   - Método de instalación: Extracción con `tar -xzf` y colocación en el `PATH`.
   - *Nota de observación:* **No sugerir proactivamente la eliminación de atributos de cuarentena (`xattr -d`) ni la desactivación de Gatekeeper.** Se debe observar naturalmente la interacción del participante con los avisos de seguridad del sistema operativo y si la guía oficial le orienta adecuadamente.

### C. Mecánica de Entrega Autorizada (Ronda 1)
- [ ] **Canal Privado Exclusivo**: La distribución autorizada para la Ronda 1 se realiza exclusivamente mediante **entrega directa de los paquetes originales comprimidos y su catálogo `SHA256SUMS` por un canal privado** (transferencia de archivos en la sesión).
- [ ] **Prohibiciones estrictas de publicación**:
  - Queda terminantemente **prohibido habilitar nuevos servicios o repositorios de hospedaje externo** sin autorización previa.
  - Queda prohibido generar enlaces públicos de staging o publicar una release preliminar en GitHub Releases.
  - Se mantienen estrictamente intactos los gates de seguridad (`publish: if: false`), firmas Minisign y tags de AN-076.
- [ ] **Etiquetado transparente de pre-release**:
  > *«Binario candidato para validación de experiencia de desarrollador (pre-release técnica v0.1.0). No constituye una release pública oficial.»*

### D. Estado de Validación Preflight por Plataforma y Gestión de Riesgos
- [ ] **Windows x86_64 (MSVC) — VALIDADO**:
  - Binario candidato `wasma.exe` (SHA-256: `807f7dbeb3e5a936546ed69dec472d3c081165372ee29e4e49bd722563fa3db5`) verificado localmente.
  - `wasma --version` devuelve `wasma 0.1.0`.
  - Quickstart verificado: generación de `identity.wasm` (44 bytes) e invocación con resultado `42`.
  - Suite de reglas comerciales verificada: `wasma test --suite examples/business-rules/suite.yaml --component examples/business-rules/discount_rules.wasm` con **24/24 PASSED**.
- [ ] **Linux x86_64 y macOS ARM64 — RIESGO OPERACIONAL ABIERTO**:
  - **Advertencia metodológica**: Las comprobaciones automatizadas de CI en AN-070 (Run `41271134318`) confirman la compilación y empaquetado del candidato, pero **no equivalen a una prueba manual del binario candidato contra los ejemplos actuales de `main`**.
  - **Disponibilidad de entorno**: Si el facilitador dispone de un entorno nativo compatible antes de la sesión, debe ejecutar el Quickstart y las 24 pruebas de `suite.yaml`. Si no se dispone de dicho entorno (host de desarrollo sin WSL/Docker), **se mantiene el riesgo operativo formalmente abierto y no se declara la plataforma como completamente validada**.

---

## 2. Validación del Portal y Documentación
- [ ] **Disponibilidad del portal (`https://wasma.org/`)**:
  - [ ] Respuesta HTTP 200 en la página principal `/`.
  - [ ] Respuesta HTTP 200 en `/docs/installation/`.
  - [ ] Respuesta HTTP 200 en `/docs/first-component/`.
  - [ ] Respuesta HTTP 200 en `/docs/examples/business-rules/`.
  - [ ] Respuesta HTTP 200 en `/docs/examples/embedded-host/`.
- [ ] **Integridad de enlaces internos**:
  - [ ] Ningún enlace roto o que apunte a `localhost` o rutas de staging internas.
  - [ ] Los enlaces a GitHub apuntan a la rama `main` del repositorio canónico `https://github.com/Kaddo-kdd/wasma`.
- [ ] **Coherencia visual y footer**:
  - [ ] El footer muestra `web v0.1.0` y el enlace al commit desplegado en producción (`5cb29f1`).

---

## 3. Verificación de Comandos y Ejemplos
- [ ] **Comando `wasma` funcional**:
  - [ ] `wasma --version` devuelve `wasma 0.1.0`.
  - [ ] `wasma --help` despliega ayuda clara con los subcomandos `build`, `verify`, `test`, `run`, `publish`.
- [ ] **Quickstart sin toolchain de Rust**:
  - [ ] El tutorial funciona de punta a punta sin que `cargo` ni `rustc` estén instalados o en el `PATH`.
  - [ ] El ciclo `verify` -> `build` -> `run --component identity.wasm --function identity 42` produce el resultado `42`.
- [ ] **Suite de pruebas de reglas comerciales**:
  - [ ] Comando verificado: `wasma test --suite examples/business-rules/suite.yaml --component examples/business-rules/discount_rules.wasm` (o desde `examples/business-rules/`: `wasma test --suite suite.yaml --component discount_rules.wasm`) aprueba los 24 casos.
- [ ] **Cero dependencias externas en tiempo de ejecución**:
  - [ ] La CLI no requiere claves de API (p. ej. `WASMA_LLM_KEY` ni variables `AGENT_NATIVE_*`) ni conexión a internet para compilar o ejecutar componentes locales.

---

## 4. Gobernanza, Privacidad y Baseline Experimental (Ronda 1)
- [ ] **Baseline Experimental Congelado**:
  - [ ] Commit del portal y documentación: `5cb29f1290ed750b5686050d1a6d35880bf7c0f4`.
  - [ ] Commit del binario candidato: `0ffa96346d92ace905b392b3147aff776da5fab9`.
  - [ ] Run ID de distribución CI: `41271134318`.
  - [ ] Versión de instrumentos de evaluación: `AN-075-v1.0 (Ronda 1)`.
- [ ] **Consentimiento informado en 3 capas independientes**:
  - [ ] Capa 1: Participación voluntaria y registro métrico anónimo (obligatoria).
  - [ ] Capa 2: Compartir pantalla durante la sesión remota (obligatoria para observación).
  - [ ] Capa 3: Grabación audiovisual con fines de análisis técnico interno (opcional; si se declina, se procede con toma de notas sin excluir al participante).
- [ ] **Medición y Autonomía**:
  - [ ] La entrega logística del paquete se cronometra por separado ($T_{transfer}$) de la verificación SHA-256 ($T_{verif}$) y no se computa como asistencia técnica.
  - [ ] No indicar a los participantes la desactivación preventiva de Gatekeeper o SmartScreen.
- [ ] **Ficha anónima preparada (Zero-PII)**:
  - [ ] ID único asignado (`DEV-01` a `DEV-10`).
  - [ ] Cero almacenamiento de nombres, emails o datos de contacto en el repositorio Git (mantenidos exclusivamente de forma offline y confidencial por el responsable humano del piloto).
- [ ] **Segregación de pruebas internas**:
  - [ ] Las corridas técnicas internas y preflight del facilitador **nunca** se contabilizarán como sesiones del piloto ni formarán parte de la muestra de 5 a 10 desarrolladores externos.
- [ ] **Alineación con AN-076**:
  - [ ] Confirmar que los gates de publicación oficial (`publish: if: false`, firma oficial de release Minisign, tags Git) no se han alterado ni vulnerado.
