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
   - Método de instalación: Extracción con `tar -xzf`, verificación de permisos `0755` y enlace o adición al `PATH`.
3. **macOS ARM64 (Apple Silicon)**:
   - Archivo: `wasma-v0.1.0-dev-0ffa963-aarch64-apple-darwin.tar.gz`
   - SHA-256: `d866a2fe0a9e22fb753a6697fa297072a297e6e5888e404fbe9e3ce7e2fc2c4b`
   - Método de instalación: Extracción con `tar -xzf`, verificación de atributos de cuarentena (`xattr -d com.apple.quarantine wasma` si aplica) y adición al `PATH`.

### C. Mecánica de Entrega a Participantes Externos
- [ ] **Acceso sin barreras**: La descarga de artefactos directos desde la interfaz de GitHub Actions requiere inicio de sesión en GitHub. Para participantes que no tengan cuenta o para prevenir vencimiento (90 días), el facilitador proporcionará los paquetes mediante entrega directa o un canal de staging privado pre-aprobado.
- [ ] **Aprobación previa de hosting**: Queda prohibido habilitar nuevos servicios o repositorios de hospedaje externo sin previa autorización formal.
- [ ] **Etiquetado transparente de pre-release**:
  > *«Binario candidato para validación de experiencia de desarrollador (pre-release técnica). No constituye una release oficial v0.1.0.»*

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
  - [ ] El footer muestra `web v0.1.0` y el enlace al commit desplegado en producción.

---

## 3. Verificación de Comandos y Ejemplos
- [ ] **Comando `wasma` funcional**:
  - [ ] `wasma --version` devuelve `wasma 0.1.0`.
  - [ ] `wasma --help` despliega ayuda clara con los subcomandos `build`, `verify`, `test`, `run`, `publish`.
- [ ] **Quickstart sin toolchain de Rust**:
  - [ ] El tutorial funciona de punta a punta sin que `cargo` ni `rustc` estén instalados o en el `PATH`.
  - [ ] El ciclo `verify` -> `build` -> `run --component identity.wasm --function identity 42` produce el resultado `42`.
  - [ ] `wasma test` ejecuta la suite declarativa con éxito.
- [ ] **Cero dependencias externas en tiempo de ejecución**:
  - [ ] La CLI no requiere claves de API (p. ej. `WASMA_LLM_KEY` ni variables `AGENT_NATIVE_*`) ni conexión a internet para compilar o ejecutar componentes locales.

---

## 4. Gobernanza, Privacidad y Validez Metodológica
- [ ] **Consentimiento de participantes**:
  - [ ] Acuerdo informado previo para toma de notas y grabación técnica interna exclusiva.
- [ ] **Ficha anónima preparada**:
  - [ ] ID único asignado (`DEV-01` a `DEV-10`) sin registrar nombres personales, correos, empresas ni rutas personales.
- [ ] **Segregación de pruebas internas**:
  - [ ] Las corridas técnicas internas y preflight del facilitador **nunca** se contabilizarán como sesiones del piloto ni formarán parte de la muestra de 5 a 10 desarrolladores externos.
- [ ] **Alineación con AN-076**:
  - [ ] Confirmar que los gates de publicación oficial (`publish: if: false`, firma oficial de release Minisign, tags Git) no se han alterado ni vulnerado.
