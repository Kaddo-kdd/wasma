---
id: AN-070
type: feature
status: completed
created_at: 2026-10-26T00:00:00.000Z
ready_at: '2026-10-31'
completed_at: '2026-10-31'
title: 'Empaquetado, instalación y prerelease multiplataforma'
knowledge_level: K3
suggested_knowledge_level: K3
scope_confidence: high
initiative: INI-009
source_roadmap_initiative: INIT-09-03
priority: P0
depends_on:
  - AN-069
domains:
  - Distribution & Release
code:
  - .github/workflows/release.yml
  - docs/installation.md
  - crates/cli/tests/release_packaging_test.rs
expected_value: >-
  Generar paquetes binarios comprimidos y reproducibles para Linux x86_64 GNU,
  Windows x86_64 MSVC y macOS ARM64 con la identidad técnica aprobada de Wasma y
  smoke tests en entornos limpios.
project_state: ai-assisted
template_version: 1
---

# AN-070 — Empaquetado, instalación y prerelease multiplataforma

## Contexto y problema

Los usuarios y evaluadores de Wasma deben poder descargar e instalar un binario precompilado para su sistema operativo (Linux x86_64, Windows x86_64 y macOS ARM64) sin necesidad de disponer del toolchain de Rust instalado. AN-069 estableció la compilación base, el empaquetado reproducible, la limpieza de staging y la verificación estricta de inventario en CI. AN-070 formaliza la verificación de instalación y los smoke tests de ejecución autónoma en runners limpios, junto con las guías canónicas de instalación manual para cada plataforma.

## Alcance implementado

- Verificar que los paquetes `.tar.gz` (Linux GNU y macOS ARM64) y `.zip` (Windows MSVC) contienen exactamente la estructura requerida: binario ejecutable (`wasma` o `wasma.exe`), `LICENSE` y `README.md`.
- Implementar y formalizar un job de `smoke-test` matricial en runners limpios (`ubuntu-latest`, `windows-latest`, `macos-latest` ARM64) que:
  - No realiza checkout del repositorio (`actions/checkout` omitido).
  - Descarga exclusivamente el artefacto validado `release-bundle`.
  - Verifica la suma criptográfica SHA-256 del paquete contra el manifiesto `SHA256SUMS` antes de descomprimir.
  - Extrae el contenido en un directorio temporal aislado.
  - Verifica permisos de ejecución (0755 en POSIX) y estructura exacta de archivos.
  - Limpia variables de entorno heredadas (`AGENT_NATIVE_*`).
  - Invoca de forma autónoma el binario precompilado:
    - `wasma --help` (comprobando código de retorno 0 y mención a la identidad técnica Wasma).
    - `wasma --version` (comprobando código de retorno 0 y reporte exacto de `wasma 0.1.0`).
  - En Windows, valida explícitamente `$LASTEXITCODE -eq 0` para ambas invocaciones nativas.
  - Ejecuta una prueba negativa asegurando que la ausencia del binario en un paquete incompleto es detectada y rechazada.
- Redactar y auditar la guía de instalación manual en [`docs/installation.md`](file:///docs/installation.md) cubriendo las 3 plataformas objetivo con rutas estándar (`/usr/local/bin`, `%USERPROFILE%\bin` o variables `PATH`), verificación previa de sumas SHA-256, advertencia sobre el manejo prudente de atributos de Gatekeeper (`com.apple.quarantine`) en macOS y requisitos de runtime (Visual C++ Redistributable en Windows).
- Formalizar 13 pruebas automatizadas en [`crates/cli/tests/release_packaging_test.rs`](file:///crates/cli/tests/release_packaging_test.rs) que validan todas las invariantes de smoke testing, ejecución autónoma, pruebas negativas y análisis sintáctico AST de los scripts PowerShell del workflow.

## Criterios de aceptación

- AC-01: El pipeline compila y empaqueta binarios reproducibles en modo release bajo la identidad técnica aprobada para las 3 plataformas objetivo (`x86_64-unknown-linux-gnu`, `x86_64-pc-windows-msvc` y `aarch64-apple-darwin`), excluyendo directorios de staging.
- AC-02: Cada paquete comprimido contiene exclusivamente el binario ejecutable (`wasma` / `wasma.exe`) con permisos correctos (0755 en Unix), junto con `LICENSE` y `README.md`.
- AC-03: Pruebas automatizadas de desempaquetado y smoke tests en runners limpios (Linux, Windows, macOS) ejecutando `wasma --help` y `wasma --version` con retorno exitoso (código 0, `$LASTEXITCODE -eq 0`).
- AC-04: Guía de instalación manual verificada en `docs/installation.md` para cada uno de los 3 sistemas operativos sin suposiciones de rutas heredadas de Agent Native.

## Fuera de alcance

- Instalador binario desatendido tipo script `curl | sh` (evaluable tras validar seguridad y firma).
- Publicación formal de releases en GitHub (reservado para AN-076).
- Empaquetado para gestores de paquetes de terceros (Homebrew, winget, APT/RPM).

## Evidencia de validación técnica

1. **Commits de referencia**:
   - `2d48522`: `feat(release): add clean-runner installation smoke tests (AN-070)`
   - `5fe67f0`: `fix(release): correct PowerShell interpolation in Windows smoke test (AN-070)`
   - `0ffa963`: `fix(release): enforce Windows smoke test exit codes (AN-070)`
2. **Workflows automáticos**:
   - **Website**: Run [`41270372373`](https://github.com/Kaddo-kdd/wasma/actions/runs/41270372373) — Exitoso (Green, 1m 53s).
   - **CI Multiplataforma**: Run [`41270372589`](https://github.com/Kaddo-kdd/wasma/actions/runs/41270372589) — Exitoso (Green, 12m 1s). Superó compilación, formateo, clippy y tests en Linux x86_64, Windows x86_64 y macOS ARM64.
3. **Workflow Release Multi-Platform (Run [`41271134318`](https://github.com/Kaddo-kdd/wasma/actions/runs/41271134318))**:
   - `pre-flight`: Exitoso en 3s (control fail-closed verificado).
   - `build` Windows (`x86_64-pc-windows-msvc`): Exitoso en 3m 26s (`wasma-v0.1.0-dev-0ffa963-x86_64-pc-windows-msvc.zip`).
   - `build` macOS ARM64 (`aarch64-apple-darwin`): Exitoso en 2m 15s (`wasma-v0.1.0-dev-0ffa963-aarch64-apple-darwin.tar.gz`).
   - `build` Linux (`x86_64-unknown-linux-gnu`): Exitoso en 1m 40s (`wasma-v0.1.0-dev-0ffa963-x86_64-unknown-linux-gnu.tar.gz`).
   - `validate`: Exitoso en 23s. Verificación de inventario estricto, catálogo `SHA256SUMS` determinista y firma efímera Minisign validada.
   - `smoke-test` Windows MSVC (ID `124744700603`): Exitoso en 5s. Descarga en runner limpio sin checkout; SHA-256 verificado; extracción en directorio temporal; variables `AGENT_NATIVE_*` removidas; `wasma.exe --help` y `wasma.exe --version` (`wasma 0.1.0`) ejecutados con `$LASTEXITCODE -eq 0`; prueba negativa de paquete incompleto superada.
   - `smoke-test` macOS ARM64 (ID `124744700641`): Exitoso en 7s. Descarga en runner limpio sin checkout; SHA-256 verificado; extracción; permisos 0755; `wasma --help` y `wasma --version` (`wasma 0.1.0`) ejecutados con código 0; prueba negativa superada.
   - `smoke-test` Linux GNU (ID `124744700662`): Exitoso en 6s. Descarga en runner limpio sin checkout; SHA-256 verificado; extracción; permisos 0755; `wasma --help` y `wasma --version` (`wasma 0.1.0`) ejecutados con código 0; prueba negativa superada.
   - `sign-official`: Omitido (`skipped`, 0s, `if: false`). Cero secretos consultados ni expuestos.
   - `publish`: Omitido (`skipped`, 0s, `if: false`). Cero releases o tags creados.
4. **Suite de pruebas de packaging local y CI**: 13 pruebas automatizadas en `crates/cli/tests/release_packaging_test.rs` aprobadas al 100 %.
5. **Integridad de documentación**: Guía canónica [`docs/installation.md`](file:///docs/installation.md) completada y auditada.

## Learning

1. **Sintaxis e interpolación de variables en PowerShell (`pwsh`)**:
   - En cadenas interpoladas de PowerShell (`"..."`), un identificador de variable seguido inmediatamente por dos puntos (como `$ArchiveName:`) es interpretado por el analizador como una referencia de variable calificada por unidad de almacenamiento o ámbito (como `$env:VAR` o `$global:VAR`), disparando un `ParserError: InvalidVariableReferenceWithDrive` antes de iniciar la ejecución del script.
   - Para interpolar variables de forma segura cuando van seguidas inmediatamente de caracteres de puntuación o dos puntos, se debe delimitar obligatoriamente el identificador mediante llaves `${ArchiveName}:` o aislar la expresión mediante paréntesis descriptivos (`$ArchiveName (expected ...)`).
2. **Validación de sintaxis de scripts PowerShell mediante análisis AST en Rust**:
   - Las pruebas de integración en Rust pueden y deben invocar el analizador sintáctico nativo de PowerShell (`[System.Management.Automation.Language.Parser]::ParseInput(...)`) para inspeccionar los bloques de script incluidos en flujos YAML de GitHub Actions. Esto detecta errores sintácticos específicos de PowerShell en el entorno de desarrollo local sin depender del ciclo remoto de CI.
3. **Control estricto de códigos de salida en PowerShell (`$LASTEXITCODE`)**:
   - A diferencia de los cmdlets de PowerShell, los ejecutables nativos externos (`wasma.exe`) no lanzan excepciones terminantes de forma automática bajo `$ErrorActionPreference = "Stop"` cuando retornan un código distinto de cero.
   - Es indispensable comprobar explícitamente `if ($LASTEXITCODE -ne 0) { throw ... }` inmediatamente después de invocar cualquier binario nativo en scripts PowerShell de CI para garantizar un comportamiento fail-closed ante fallos silenciosos.
4. **Aislamiento en smoke tests con runners limpios**:
   - Para validar de manera fidedigna la experiencia del usuario final, los smoke tests de instalación deben ejecutarse en runners donde `actions/checkout` esté omitido por completo, descargando el paquete empaquetado exclusivamente desde el bundle de release, verificando el hash SHA-256 previo y purgando variables de entorno heredadas. Esto asegura que el binario no presente dependencias ocultas del entorno de compilación, de Cargo ni de rutas de desarrollo.

## Entregable

Paquetes multiplataforma validados con smoke tests automatizados en entornos limpios en Linux x86_64, Windows x86_64 y macOS ARM64, comprobación de exit codes nativos, verificación sintáctica de scripts y documentación de instalación canónica para usuarios finales en `docs/installation.md`.
