---
type: adr
id: ADR-002
status: accepted
date: 2026-10-17
accepted_at: 2026-11-25
created_from: knowledge/tech/discovery/decision-candidates.md
related_work_items:
  - AN-003
code:
  - crates/runtime/
---

# ADR-002 — Runtime independiente del LLM y del compiler

## Context

El propuesta de valor de Agent-Native documentada en `business.md` (goal #4) y `product.md` separa el **costo de construcción** del **costo de operación**: la IA interviene únicamente durante el build; los componentes publicados conservan su comportamiento operativo sin necesitar el agente que los generó.

La POC cumple parcialmente: `runner` depende de `irtool` por `path = "../irtool"` (ver [extraction-matrix.md](../extraction-matrix.md) C-07) y requiere Cargo para operar. El producto nuevo debe hacer esta independencia **técnica y auditable**, no un principio aspiracional.

## Options Considered

### Opción A — Runtime embebe un cliente LLM mínimo para "autoreparar" ejecuciones

Pros: narrativa comercial atractiva.
Contras: rompe la separación build/operación; introduce costo e inestabilidad por invocación; convierte al runtime en inútil sin credenciales de proveedor. **Rechazada** por `business.md` goal #4.

### Opción B — Runtime depende del compiler para reutilizar código de carga y metadatos

Pros: simplifica el share de utilidades (lectura de manifiestos, hash).
Contras: cualquier cambio en el compiler recompila/invalida el runtime; impide distribuir el runtime sin la toolchain del compiler; rompe INIT-05-02 (SDK Rust).

### Opción C — Runtime autosuficiente, consume `ir` para metadatos y `wasmtime` para ejecución; no referencia `compiler` ni LLM

Pros: ejecución distribuible sin Rust ni acceso a LLM; auditable por lint CI y por `cargo metadata`.
Contras: metadatos del artefacto (manifiesto, hash) deben especificarse como contrato estable en `ir` o en un crate de metadatos, no derivarse del `compiler`.

## Decision

### Decisión histórica original (2026-10-17)

Se adopta la **Opción C**:

- **Grafo de dependencias prohibidas:** `runtime` **no** puede declarar como dependencia Cargo (ni directa ni transitiva por `path`) a `compiler`, a ningún adaptador LLM, ni a crates de Kaddo.
- **Grafo permitido (propuesta inicial):** `runtime` depende únicamente de `ir` (para contratos de metadatos), `wasmtime` y utilidades de bajo nivel (serde, thiserror).
- **Contrato de metadatos (propuesta inicial — enmendada abajo):** originalmente se propuso definir `manifest::` dentro de `ir` o en un crate dedicado `metadata`.
- **Carga runtime de componentes externos:** el runtime acepta componentes WIT-compatibles independientes de su origen (incluidos los no generados por Agent-Native), siempre que respeten el manifiesto. Esta propiedad es parte del contrato del runtime, no una característica opcional.
- **Lint CI (obligatorio):** un paso de CI falla si `cargo tree -p runtime` lista `compiler`, cualquier adaptador LLM o cualquier crate de Kaddo. Este lint se materializa en INIT-01-01 junto con el workspace.

### Decisión vigente ratificada (2026-11-25)

- **Ratificada por autorización humana explícita (Etapa C / Fase 1F, 2026-11-25):** Se ratifica la independencia productiva de `wasma-runtime` (`crates/runtime/Cargo.toml`), sin declarar en `[dependencies]` a `wasma-compiler`, ningún adaptador LLM ni crates de Kaddo (auditado en CI con `--edges normal`).
- **Ubicación del contrato de manifiesto (enmienda ratificada respecto a 2026-10-17):** El contrato declarativo de capacidades (`ComponentManifest`, `ManifestCapabilities`, v0.1) vive en **`crates/runtime/src/manifest.rs`**, no en `wasma-ir`, evitando acoplar `wasma-ir` a políticas de autorización del host.
- **Grafo de dependencias vigentes (`crates/runtime/Cargo.toml`):**
  - `[dependencies]`: `wasma-ir`, `wasmtime` (caret `"29.0.1"`, resuelta a `29.0.1` en `Cargo.lock`), `wasmtime-wasi = "=29.0.1"`, `serde`, `serde_json`, `serde_yaml2`, `sha2`, `thiserror`, `bytes`.
  - `[dev-dependencies]`: permite `wasma-compiler` exclusivamente para compilar fixtures de pruebas internas; no entra en el grafo productivo ni alcanza a consumidores de `wasma-runtime`.

## Consequences

**Positivas:**
- INIT-05-02 (SDK Rust) es trivial: `cargo add agent-native-runtime` sin arrastrar el compiler.
- INIT-05-03 (release pipeline) puede construir binarios de `cli` que ejecutan componentes sin tooling de generación.
- La narrativa "ejecución sin IA" queda verificable mecánicamente.

**Negativas:**
- El contrato de manifiesto en `ir` debe mantenerse estable; cualquier cambio invalida publicaciones.
- La utilidad de impresión WAT (`print_wasm_to_wat`) de la POC vive en `compiler`, no en `runtime`; para depurar un runtime en producción hay que usar el `cli` del compilador por separado.

**Riesgos del roadmap mitigados:**
- R-03 (acoplamiento runtime→compiler).
- Business risk: ejecución dependiente del LLM.

**Seguimientos abiertos:**
- `[closed — 2026-11-25]` Diseñar el lint CI concreto para enforcement — materializado en `.github/workflows/ci.yml` (`Enforce ADR-002`, líneas 74–86) con `cargo tree -p wasma-runtime --prefix none --edges normal` en Linux, Windows y macOS.
- `[closed — 2026-11-25]` Definir la ubicación exacta de `manifest::` — resuelto en la implementación dentro de `crates/runtime/src/manifest.rs` (ver reconciliación abajo).

## Reconciliación documental (2026-11-25)

> **Nota de trazabilidad:** Esta sección alinea el texto original (`2026-10-17`) con la implementación real en `main` y la migración de identidad de [ADR-008](ADR-008-identidad-tecnica-migracion-wasma.md) (`accepted`). Conserva fecha y procedencia originales; la ratificación a `status: accepted` (`accepted_at: 2026-11-25`) corresponde a autorización humana explícita en Etapa C / Fase 1F.

- **Invariante productiva ratificada:** En `crates/runtime/Cargo.toml`, la sección `[dependencies]` de `wasma-runtime` **no incluye** `wasma-compiler`, ningún adaptador LLM ni dependencias de Kaddo. Esto se audita automáticamente en CI en los 3 OS.
- **Dependencias productivas reales vigentes (`crates/runtime/Cargo.toml`):** `wasma-ir`, `wasmtime = "29.0.1"`, `wasmtime-wasi = "=29.0.1"` (confinado a este crate para WASI Preview 2, AN-044), `serde`, `serde_json`, `serde_yaml2`, `sha2`, `thiserror` y `bytes`.
- **Dependencia exclusiva de pruebas (`[dev-dependencies]`):** `crates/runtime/Cargo.toml` declara `wasma-compiler` únicamente en `[dev-dependencies]` para generar fixtures WASM en pruebas internas de integración y humo. No forma parte del grafo productivo ni alcanza a consumidores de `wasma-runtime` (como `examples/embedded-host/` o `examples/aws-lambda/`).
- **Ubicación real del contrato de manifiesto:** Frente a la propuesta original (`ir::manifest::`), el contrato declarativo de capacidades del componente se implementó en `crates/runtime/src/manifest.rs` (`ComponentManifest`, `ManifestCapabilities`, versión `"0.1"`), evitando acoplar `wasma-ir` a detalles de policy del host.
- **Identidad vigente (ADR-008):** La referencia histórica `cargo add agent-native-runtime` corresponde hoy a `wasma-runtime` y el binario unificado a `wasma`.

## Related Capabilities

- Independent Runtime Execution.
- CLI as Primary Interface.

## Related Work Items

- AN-003 (este ADR).
- Precondición de: INIT-03-01, INIT-05-02, INIT-05-03.
