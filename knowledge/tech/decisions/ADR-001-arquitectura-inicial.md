---
type: adr
id: ADR-001
status: accepted
date: 2026-10-17
accepted_at: 2026-11-25
created_from: knowledge/tech/discovery/decision-candidates.md
related_work_items:
  - AN-003
code:
  - crates/
---

# ADR-001 — Arquitectura inicial del workspace y dependencias entre módulos

## Context

El repositorio nuevo `Kaddo-kdd/agent-native` arranca con solo `LICENSE`. La POC congelada en `_reference/poc-agent-native/@26b6a18` concentra la lógica en tres crates:

- `irtool/lib.rs` (2749 LOC) — modelo IR, verifier, backend WASM y hash SHA-256 en un solo archivo.
- `orchestrator/lib.rs` (1963 LOC) — interpretación de narrativa, build, publicación atómica y SHA-256 fusionados.
- `runner/main.rs` (2278 LOC) — carga Wasmtime, host polyfill con allow-list y executor YAML.

La [matriz de extracción](../extraction-matrix.md) demuestra que estas fronteras están **marcadas internamente** por funciones públicas, pero mezcladas en el mismo crate. Reproducirlas sin fronteras limpias en el producto nuevo hereda deuda experimental y rompe la invariante "runtime no depende de LLM ni del compiler".

Esta decisión es bloqueante de INIT-01-01 (workspace) y precondición de todos los crates de RM-02/03/04.

## Options Considered

### Opción A — 5 crates desde el día uno (replicando POC + `cli`)

Pros: separación máxima; cada crate tiene API pública versionable.
Contras: 5 APIs públicas sin uso real todavía; alta probabilidad de rediseñarlas antes de M3; fragmenta el workspace sin beneficio inmediato.

### Opción B — Monolito con módulos internos

Pros: velocidad inicial; fronteras internas vía `pub(crate)`.
Contras: Rompe la invariante "runtime no depende del compiler" en el nivel de dependencia Cargo; dificulta reutilizar `runtime` desde SDK externo (INIT-05-02).

### Opción C — 3 crates (`ir`, `compiler`, `runtime`) + bin `cli`, con fronteras internas estrictas para la orquestación

Pros: respeta las tres invariantes del roadmap (runtime independiente, compiler puro, CLI sin lógica); captura las 3 responsabilidades de `orchestrator` como módulos internos (`spec::`, `build::`, `publish::`) sin crear un crate adicional sin justificación.
Contras: la orquestación vive en `cli` o en un módulo compartido; cuando las APIs estabilicen puede requerir extracción a un cuarto crate `orchestrator`.

## Decision

### Decisión histórica original (2026-10-17)

Se adopta la **Opción C**:

- **Workspace inicial:** `crates/ir`, `crates/compiler`, `crates/runtime`, `crates/cli` (bin).
- **Reglas de dependencia (invariantes):**
  - `ir` no depende de nada del producto (ni del LLM, ni del runtime, ni de Kaddo).
  - `compiler` depende únicamente de `ir`.
  - `runtime` depende únicamente de `ir`; **nunca** de `compiler` ni del LLM.
  - `cli` depende de los tres anteriores y no concentra lógica de dominio.
- **Orquestación (narrativa → spec → LLM → publicación):** vive inicialmente dentro de la capa de `cli` como módulos (`spec::`, `build::`, `publish::`) con fronteras `pub(crate)`. Se extrae a un crate `orchestrator` separado **sólo si** se cumple **al menos una** de estas condiciones *(nota 2026-11-25: la condición 2 fue alcanzada y cuenta con excepción temporal ratificada hasta después de `v0.1.0`; ver decisión vigente abajo)*:
  1. Un consumidor externo necesita invocar la orquestación sin la CLI.
  2. La publicación atómica (`publish::`) crece a > 500 LOC con pruebas aisladas.
  3. El adaptador LLM (`build::agent::`) requiere un contrato de versionamiento independiente del `cli`.
- **Interoperabilidad conservada:** `runtime` debe poder cargar componentes WIT-compatibles **independientes de su origen** (no sólo los generados por Agent-Native). Diseñar un runtime cerrado está prohibido por este ADR.
- **Lint CI:** una regla verifica que `runtime` no referencia `compiler` ni crates/adaptadores LLM; otra verifica que `compiler` no referencia store de artefactos ni `runtime`.

### Decisión vigente ratificada (2026-11-25)

- **Ratificada por autorización humana explícita (Etapa C / Fase 1F, 2026-11-25):** Se mantienen los 4 crates actuales (`wasma-ir`, `wasma-compiler`, `wasma-runtime`, `wasma-cli`) y las invariantes de dependencia verificadas en CI para `v0.1.0`.
- **Excepción temporal ratificada sobre el criterio de extracción de `orchestrator`:** Aunque la condición #2 fue alcanzada (`crates/cli/src/publish/` suma 596 LOC con suites dedicadas `atomic_publish.rs` y `publish_traceability.rs`), se aprueba explícitamente la **excepción temporal hasta después de `v0.1.0`**, difiriendo la extracción de `wasma-orchestrator`.
  - *Justificación:* No existen consumidores externos de orquestación sin CLI (condición #1) ni necesidad de versionamiento independiente del adaptador LLM (condición #3); extraer un quinto crate antes de cerrar `AN-075` y `AN-076` añadiría riesgo de empaquetado sin beneficio inmediato.
  - *Riesgos asumidos por la excepción:* Acoplamiento acumulado dentro de `crates/cli` (`publish/`: 596 LOC, `spec/`: 1,260 LOC, `agent/`: 1,116 LOC), mayor esfuerzo de refactorización al exponer APIs públicas futuras y menor aislamiento en revisiones de cambios de orquestación.
  - *Punto de revisión obligatorio:* Al cerrar `v0.1.0` (`INI-009`), considerando consumidores externos, evolución de APIs y complejidad de mantenimiento, o antes si se activa la condición #1 o #3.

## Consequences

**Positivas:**
- Las tres invariantes del roadmap quedan expresadas en el grafo de dependencias Cargo, auditables por lint.
- INIT-01-01 puede abrir el workspace con contenido técnico claro por crate.
- INIT-04-05 (publicación) tiene desde el inicio una ubicación modular definida (`cli::publish::`), no en `compiler`.
- La extracción futura a `orchestrator` queda gobernada por criterios objetivos.

**Negativas:**
- La capa de orquestación crece dentro de `cli`, lo que puede dificultar su revisión aislada hasta la extracción.
- Dos consumidores externos del runtime pueden adelantarse al momento ideal de extraer `orchestrator`.
- Si la condición 1 se cumple antes que la 2 o la 3, hay que rediseñar la API pública de los módulos internos.

**Riesgos del roadmap mitigados:**
- R-03 (acoplamiento accidental runtime→compiler) — por lint CI.

**Seguimientos abiertos:**
- `[closed — 2026-11-25]` Diseñar el lint CI concreto — resuelto en `.github/workflows/ci.yml` (`Enforce ADR-002`, líneas 74–86) mediante `cargo tree -p wasma-runtime --prefix none --edges normal` y `cargo tree -p wasma-compiler --prefix none --edges normal` en Linux, Windows y macOS.
- `[open — post-v0.1.0]` Reevaluar la extracción de un crate `orchestrator` tras el lanzamiento `v0.1.0` (ver sección de reconciliación abajo).

## Reconciliación documental (2026-11-25)

> **Nota de trazabilidad:** Esta sección documenta el estado real verificado en `main` tras completar M1–M8 y la migración de identidad de [ADR-008](ADR-008-identidad-tecnica-migracion-wasma.md) (`accepted`). Conserva la fecha (`2026-10-17`) y procedencia originales; la ratificación a `status: accepted` (`accepted_at: 2026-11-25`) corresponde a autorización humana explícita en Etapa C / Fase 1F.

- **Identidad vigente (ADR-008):** Los cuatro paquetes del workspace corresponden hoy a `wasma-ir` (`crates/ir`), `wasma-compiler` (`crates/compiler`), `wasma-runtime` (`crates/runtime`) y `wasma-cli` (`crates/cli`, binario `wasma`).
- **Invariantes verificadas en código y CI:** `Cargo.toml` mantiene los 4 crates con `resolver = "2"`. El paso `Enforce ADR-002` en `.github/workflows/ci.yml` verifica en los 3 OS que `wasma-runtime` no depende de `wasma-compiler` y que `wasma-compiler` no depende de `wasma-runtime` en `[dependencies]`.
- **Evaluación del criterio de extracción de `orchestrator`:**
  - *Condición 1 (consumidor externo de orquestación sin CLI):* **no activada**; los consumidores embebidos consumen `wasma-runtime` directamente (`examples/embedded-host/`, `examples/aws-lambda/`).
  - *Condición 2 (`publish::` > 500 LOC con pruebas aisladas):* **umbral cuantitativo alcanzado** (`crates/cli/src/publish/` suma 596 LOC repartidas en `atomic.rs`, `error.rs`, `mod.rs`, `publisher.rs` y `store.rs`, respaldadas por las suites dedicadas `crates/cli/tests/atomic_publish.rs` y `crates/cli/tests/publish_traceability.rs`; además `spec/` suma 1,260 LOC y `agent/` suma 1,116 LOC dentro de `crates/cli/src/`).
  - *Condición 3 (versionamiento independiente del adaptador LLM):* **no activada**; el adaptador LLM sigue acotado al flujo de build de la CLI.
- **Decisión vigente para `v0.1.0` (ratificada el 2026-11-25):** Mantener la estructura actual de 4 crates para `v0.1.0` y **diferir** la extracción de `wasma-orchestrator` a `post-v0.1.0`. Extraer un quinto crate en la recta final del piloto externo (`AN-075`) y release (`AN-076`) introduciría riesgo de reempaquetado y cambio de fronteras públicas sin demanda de consumidores externos.
- **Condiciones futuras y punto de revisión:** Reevaluar formalmente la extracción tras `v0.1.0` si (a) aparece un consumidor externo de `spec::`/`publish::`/`agent::` fuera de la CLI, (b) el proveedor LLM real requiere ciclo de publicación independiente, o (c) se abre un bloque de arquitectura posterior a `INI-009`.

## Related Capabilities

- Foundation & Governance (nuevo dominio candidato).
- Independent Runtime Execution.
- Component Compilation.
- CLI as Primary Interface.

## Related Work Items

- AN-003 (este ADR).
- Precondición de: INIT-01-01, INIT-02-01, INIT-02-02, INIT-03-01, INIT-04-05.
