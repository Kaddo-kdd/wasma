---
id: AN-073
type: docs
status: completed
created_at: 2026-10-26T00:00:00.000Z
ready_at: '2026-11-02'
completed_at: '2026-11-02'
title: 'Onboarding, quickstart y reconciliación de documentación'
knowledge_level: K3
suggested_knowledge_level: K3
scope_confidence: high
initiative: INI-009
source_roadmap_initiative: INIT-09-06
priority: P0
depends_on:
  - AN-068
  - AN-070
domains:
  - 'Developer Experience, Documentation & Branding'
code:
  - README.md
  - docs/**
  - website/src/content/docs/**
  - website/scripts/**
expected_value: >-
  Crear una ruta de inicio rápido para desarrolladores utilizando únicamente la
  CLI y rutas definitivas de Wasma, probando el tutorial desde la release
  candidata y documentando cualquier alias transitorio.
project_state: ai-assisted
template_version: 1
---

# AN-073 — Onboarding, quickstart y reconciliación de documentación

## Contexto y problema

La documentación del proyecto conservaba referencias a la compilación local desde fuentes como única vía y comandos heredados con la sintaxis de desarrollo previa (`agent-native`, `--spec`, etc.). Se requiere una ruta clara, rápida y accesible para usuarios y evaluadores que deseen comenzar en 5 minutos utilizando el binario oficial precompilado de Wasma, separando taxativamente los requisitos de usuario final (binarios autónomos sin toolchain de Rust) de los de desarrollo y contribución interna (compilación desde fuentes con Cargo). Asimismo, se debe reconciliar la documentación del repositorio y del portal web eliminando comandos obsoletos, preservando la narrativa histórica de evolución Wasma (antes Agent Native) y explicitando que la publicación formal de releases en GitHub Releases se activa en AN-076.

## Alcance

- Publicar en el portal web (`website/src/content/docs/docs/first-component.md`) y en el repositorio (`README.md`) una guía «Quickstart / Inicio rápido» de 5 minutos orientada exclusivamente al uso del binario precompilado y la CLI definitiva (`wasma`).
- Actualizar la documentación canónica de instalación (`docs/installation.md` y `website/src/content/docs/docs/installation.md`), estructurando los paquetes de distribución precompilados v0.1.0 (`wasma-v0.1.0-x86_64-unknown-linux-gnu.tar.gz`, `wasma-v0.1.0-aarch64-apple-darwin.tar.gz`, `wasma-v0.1.0-x86_64-pc-windows-msvc.zip`) y su catálogo `SHA256SUMS`, aclarando que los enlaces de GitHub Releases se activan formalmente con el tag oficial en AN-076.
- Separar explícitamente en la documentación la ruta de usuarios (instalación de binarios sin requisitos de Rust o Cargo) de la ruta de contribuidores (compilación de fuentes con `cargo build --locked --release -p wasma-cli --bin wasma`).
- Reconciliar la nomenclatura y comandos en `README.md`, `docs/installation.md`, `website/src/content/docs/docs/cli.md` y `website/src/content/docs/docs/installation.md`, erradicando invocaciones obsoletas del binario `agent-native` y reemplazándolas por los subcomandos reales (`verify`, `build`, `run`, `test`, `publish`).
- Preservar la mención histórica autorizada por ADR-008 sobre el origen del proyecto («Wasma, antes Agent Native») y documentar el alias transitorio legado bajo la feature opt-in `legacy-alias`.
- Asegurar que el tutorial de onboarding se complete sin depender de conectividad a internet tras obtener el ejecutable, sin credenciales ni servicios LLM (`WASMA_LLM_KEY`), ejecutando el ciclo canónico: `verify identity.json` → `build identity.json --output identity.wasm` → `run --component identity.wasm --function identity --fuel 100000 42` (salida: `42`) → `test --suite identity.yaml --component identity.wasm`.
- Validar de punta a punta el tutorial con el binario candidato reproducido en AN-070 en un entorno aislado sin Cargo ni Rust en el `PATH`.

## Criterios de aceptación

- AC-01: Se publica una guía «Quickstart / Inicio rápido» de 5 minutos en el portal orientada exclusivamente al uso del binario precompilado y la CLI definitiva (`wasma`).
- AC-02: Se actualiza la página `/docs/installation/` y la documentación canónica del repositorio con la estructura, nombres y verificación criptográfica de los paquetes oficiales precompilados v0.1.0 (`SHA256SUMS`), separando los requisitos de usuario de los de desarrollo y aclarando que la publicación en GitHub Releases se activa en AN-076.
- AC-03: Se eliminan menciones a nombres o rutas heredadas no aprobadas en la documentación pública, documentando de forma clara cualquier alias transitorio aprobado en AN-077 y ADR-008.
- AC-04: El tutorial de onboarding y el flujo de verificación son probados y validados de punta a punta contra el binario candidato reproducido por el pipeline de AN-070 en un entorno aislado sin Cargo ni Rust en el `PATH`, registrando versión, commit, plataforma y procedencia.
- AC-05: Todos los ejemplos del quickstart son ejecutables sin requerir conectividad tras la descarga del binario, sin claves de API ni dependencias adicionales no estándar.

## Validación

- Ejecución de `website/scripts/test-docs.mjs` validando los bloques de código del tutorial contra el binario ejecutable de Wasma mediante `WASMA_BIN`.
- Ejecución de la suite de validación del portal: `pnpm --dir website check`, `pnpm --dir website test`, `pnpm --dir website build`, `pnpm --dir website check:links` y `pnpm --dir website check:content`.
- Ejecución de la prueba de aceptación en entorno aislado sin Cargo ni Rust en el PATH verificando el ciclo completo `verify`, `build`, `run` (produciendo `42`) y `test`.
- Verificación formal de Work Item con `kaddo_verify_work_item`.

## Entregable

- `knowledge/delivery/work-items/completed/AN-073-onboarding-quickstart-docs-reconciliation.md` cerrado formalmente y verificado.
- `README.md` actualizado con la CLI real `wasma`, diferenciación usuario/desarrollador, eliminación de comandos ficticios y banner Wasma.
- `docs/installation.md` y `website/src/content/docs/docs/installation.md` actualizados con paquetes precompilados v0.1.0 y activación en AN-076.
- `website/src/content/docs/docs/first-component.md` y `website/src/content/docs/docs/cli.md` reconciliados con la CLI canónica.
- Evidencia de ejecución del tutorial aislado con mediciones de tiempo y verificación de aceptación.

## Evidencia de validación técnica

1. **Sincronización remota y workflows automáticos**:
   - **Commit publicado en `origin/main`**: [`70dc67e1121ba7e9d52afb50f57c5d2f1405aa5d`](https://github.com/Kaddo-kdd/wasma/commit/70dc67e1121ba7e9d52afb50f57c5d2f1405aa5d).
   - **Workflow Website**: Run [`41495253497`](https://github.com/Kaddo-kdd/wasma/actions/runs/41495253497) — Exitoso (2m 18s). Jobs `website` y `documentation-smoke` en verde. Artefacto `wasma-static-site` generado.
   - **Workflow CI Multiplataforma**: Run [`41495253749`](https://github.com/Kaddo-kdd/wasma/actions/runs/41495253749) — Exitoso (13m 27s). Matriz completa Linux x86_64, Windows x86_64 y macOS ARM64 aprobada al 100%.
   - **Despliegue en producción (`https://wasma.org/`)**: Verificado con HTTP 200 en `/`, `/docs/installation/` y `/docs/first-component/`. El pie de página refleja `web v0.1.0 · commit 70dc67e ↗`.

2. **Procedencia del binario candidato validado**:
   - **GitHub Actions Run ID**: `41271134318` (`Release Multi-Platform`, AN-070).
   - **Commit SHA completo**: `0ffa96346d92ace905b392b3147aff776da5fab9`.
   - **Artefacto origen**: `release-bundle` (descargado vía GitHub CLI).
   - **Paquete candidato**: `wasma-v0.1.0-dev-0ffa963-x86_64-pc-windows-msvc.zip`.
   - **SHA-256 del paquete**: `2e81f9f4ef9894abd69e3cf123f504ca7bce9062c73b73d03509a0160636b472` (comprobación exacta contra el catálogo `SHA256SUMS` del artefacto).
   - **SHA-256 del binario extraído (`wasma.exe`)**: `807f7dbeb3e5a936546ed69dec472d3c081165372ee29e4e49bd722563fa3db5`.
   - **Plataforma y arquitectura**: Windows x86_64 MSVC.

3. **Ejecución en entorno aislado**:
   - Toolchain de Cargo, Rust y LLVM excluidos taxativamente del `PATH` (comprobado: `cargo` no disponible en entorno de prueba).
   - Variables de entorno LLM eliminadas (`WASMA_LLM_*`, `AGENT_NATIVE_*`).
   - Verificación de versión: `wasma 0.1.0` (código de salida 0).
   - Verificación de ayuda: subcomandos `build`, `verify`, `test`, `run`, `publish` (código de salida 0).
   - Verificación y compilación: `identity.json` validado y compilado a `identity.wasm` (44 bytes, SHA-256 `fdcbf4c6...`).
   - Invocación determinista: `wasma run --component identity.wasm --function identity --fuel 100000 42` devolvió `[0]: S32(42)` con 2 unidades de fuel consumidas y formato JSON parseado exitosamente (`results: [42]`).
   - Suite declarativa: `wasma test --suite identity.yaml --component identity.wasm` superada con `PASSED (1/1)`.
   - Prueba negativa de contrato: `wasma run --component identity.wasm --function missing 42` terminó con código explícito `1`.

4. **Métricas de tiempo y alcance**:
   - **Tiempo de ejecución automatizada observado**: `508 ms` (~0.51 s) a `1.34 s` en la ejecución de los 6 pasos por la CLI.
   - **Calibración de diseño**: Este tiempo corresponde estrictamente a la ejecución de comandos en Windows x86_64. La promesa «Quickstart de 5 minutos» permanece como objetivo de diseño ergonómico para humanos y será observada y calibrada formalmente con desarrolladores externos en AN-075.

5. **Validación de documentación del portal**:
   - `test-docs.mjs` ejecutado con `WASMA_BIN` apuntando explícitamente a `wasma.exe` extraído del paquete candidato, confirmando `Using executable: ...\wasma.exe` y validando todos los bloques de código sin recurrir a rutas implícitas.

## Learning

1. **Documentación ejecutable continua**: Scripts automáticos como `test-docs.mjs` que extraen y ejecutan directamente los bloques de código desde los archivos Markdown son indispensables para detectar desviaciones silenciosas entre los ejemplos públicos y las APIs reales de la CLI.
2. **Validación contra artefactos distribuidos**: El onboarding y quickstart deben probarse obligatoriamente contra los paquetes binarios empaquetados por los pipelines de CI, en entornos limpios y sin herramientas de desarrollo en el `PATH`, para evitar falsos positivos derivados de dependencias locales no declaradas.
3. **Integridad de procedencia vs. firma criptográfica**: La verificación local del hash SHA-256 contra catálogos reproducibles (`SHA256SUMS`) constituye una primera línea de defensa esencial en la cadena de suministro, independiente y complementaria a la firma criptográfica Minisign oficial.
4. **Claridad sobre disponibilidad de releases**: Los artefactos y binarios candidatos generados por CI no deben presentarse como releases oficiales disponibles para descarga, explicitando siempre el hito en el que se activan formalmente en GitHub Releases (AN-076).
5. **Diferenciación entre tiempo automatizado y experiencia humana**: El tiempo de ejecución automatizado observado de 508 ms (~0.51 s) mide la eficiencia de procesamiento de la CLI en el sandbox, pero no representa la duración completa del onboarding humano.
6. **Piloto ergonómico en AN-075**: La promesa ergonómica de «Quickstart de 5 minutos» se mantiene como objetivo de diseño y debe validarse mediante observación y retroalimentación empírica con desarrolladores externos en AN-075.

## Fuera de alcance

- Documentación avanzada de contribución interna al runtime o compilador.
- Nuevos vídeos o material multimedia fuera del portal web.
- Publicación anticipada de releases oficiales o creación de tags Git en GitHub (reservado a AN-076).
