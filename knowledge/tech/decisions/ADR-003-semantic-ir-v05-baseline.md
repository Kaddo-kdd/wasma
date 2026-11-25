---
type: adr
id: ADR-003
status: accepted
date: 2026-10-17
accepted_at: 2026-11-25
created_from: knowledge/tech/discovery/decision-candidates.md
related_work_items:
  - AN-003
code:
  - crates/ir/
  - crates/ir/schemas/
---

# ADR-003 — Semantic IR v0.5 como baseline estable y política de compatibilidad

## Context

La POC congeló Semantic IR v0.5 como la gramática validada por `verify_ir` (ver [extraction-matrix.md](../extraction-matrix.md) C-01, S-01). Soporta: tipos numéricos, booleanos, registros, aritmética, comparaciones, condicionales, llamadas e imports. Hay 4 schemas versionados (`ir.schema.json`, `v2`, `v3`, `v4`) y la POC validó la evolución entre ellos.

El roadmap identifica tres caminos de evolución (OQ L144): `string`, streams/efectos, errores. La extensión a v0.6 con `string` es necesaria para WASI preview2 (INIT-07-02).

El principio del roadmap "equivalencia funcional primero" prohíbe incorporar nuevas características antes de alcanzar paridad con la POC, salvo correcciones necesarias para compatibilidad, seguridad o integridad.

La selección exacta de la versión de Wasmtime (OQ L145) sigue abierta; cualquier cambio de runtime requiere pruebas de compatibilidad y regresión.

## Options Considered

### Opción A — Fijar v0.5 como estable y congelar schemas v2/v3/v4 como histórico

Pros: la POC validó v0.5; permite migrar las 8 pruebas `irtool`. Preserva el linaje de evolución.
Contras: ninguna significativa.

### Opción B — Rehacer la IR desde cero con nombres distintos

Pros: oportunidad de limpiar nombres y estructura.
Contras: destruye el valor de recuperación de la POC; invalida las 8 pruebas sin ganancia funcional. Rompe el principio #1 del roadmap.

### Opción C — Saltar directamente a v0.6 con `string` y errores

Pros: habilita RM-07 antes.
Contras: viola "equivalencia funcional primero"; introduce extensiones no probadas antes de validar el MVP. **Rechazada** por principio del roadmap.

## Decision

### Decisión histórica original (2026-10-17)

Se adopta la **Opción A** con política de evolución explícita:

- **Baseline estable:** Semantic IR **v0.5** tal como está definida en `_reference/poc-agent-native/spec/semantic-ir-v0.5-spec.md` y `semantic-ir-v0.5.schema.json`. Se migra como `crates/ir/schemas/ir.schema.json` (ver S-01 en matriz).
- **Linaje histórico:** `ir.schema.v2.json`, `v3.json`, `v4.json` se migran como histórico documentado en `crates/ir/schemas/history/`. No son API pública; existen para auditoría.
- **Política de evolución (propuesta inicial):**
  - Toda extensión a v0.6+ se materializa **bajo flag** (propuesto inicialmente como `--ir-version=0.6`, implementado como `--experimental`; ver decisión vigente abajo), nunca por defecto.
  - Las nuevas características (`string`, errores) se añaden una por una, cada una con suite de regresión propia.
  - v0.5 **sigue siendo la ruta estable y por defecto** hasta que v0.6 tenga equivalencia funcional demostrada en todos los escenarios de la POC.
- **Baseline de Wasmtime (estado original):** quedó `[open]` el 2026-10-17 hasta validar soporte de Component Model/WIT y regresión v0.5 (resuelto operativamente en `29.0.1`; ver decisión vigente abajo).
- **Compatibilidad hacia atrás:** cualquier cambio en v0.5 que no sea retrocompatible exige incrementar la mayor (v1.0) y mantener v0.5 en modo lectura.

### Decisión vigente ratificada (2026-11-25)

- **Ratificada por autorización humana explícita (Etapa C / Fase 1F, 2026-11-25):** Se ratifica IR v0.5 (`crates/ir/schemas/ir.schema.json`) como contrato estable por defecto y la evolución experimental IR v0.6 (`crates/ir/schemas/ir.schema.v0.6.json`: `string`, `result<T, E>`) bajo el flag **`--experimental`** en `wasma verify` y `wasma build` (enmienda ratificada respecto al nombre propuesto `--ir-version=0.6`, sin cambios a la CLI).
- **Versionado vigente de Wasmtime (precisión `Cargo.toml` vs. `Cargo.lock`):**
  - `crates/runtime/Cargo.toml` declara `wasmtime = { version = "29.0.1", ... }` (**requisito semver caret `^29.0.1`**) y `wasmtime-wasi = { version = "=29.0.1", ... }` (**pin estricto `=29.0.1`**).
  - `Cargo.lock` (versionado en el repositorio) resuelve ambos paquetes exactamente a **`29.0.1`**.
  - Se ratifica `29.0.1` (tal como la resuelve actualmente `Cargo.lock`) como baseline operativa vigente sin cambios a `Cargo.toml` y sin afirmar certificaciones externas.
- **Política de deprecación de v0.5:** Permanece **`[open]`** (no aprobada ni declarada para `v0.1.0`); su definición queda pospuesta al punto de revisión de promoción de IR v0.6 a estable (`post-v0.1.0`).

## Consequences

**Positivas:**
- Las 8 pruebas `irtool` migran con compatibilidad 1:1.
- Los 5 programas IR fixture de la POC (ver S-02) siguen siendo válidos.
- La extensión futura `string` para RM-07 queda explícitamente separada del MVP.

**Negativas:**
- v0.6 no se promueve a estable hasta que M3 (regresión POC) esté verde.
- El pin provisional de Wasmtime puede desactualizarse rápido; requiere revisión en cada cierre de bloque.

**Riesgos del roadmap mitigados:**
- R-04 (baseline Wasmtime no fijada) — gestionado por `[open]` explícito con criterios.
- R-09 (divergencia v0.5↔v0.6) — mitigado por flag experimental.

**Seguimientos abiertos:**
- `[closed — 2026-11-25]` Versión exacta de Wasmtime baseline — fijada actualmente en `29.0.1` en `crates/runtime/Cargo.toml` (ver reconciliación abajo).
- `[closed — 2026-11-25]` Formato exacto del flag en la CLI — implementado como `--experimental` en `wasma verify` y `wasma build` (no `--ir-version=0.6`).
- `[open — post-v0.1.0]` Política de deprecación de IR v0.5 cuando IR v0.6 sea promovida a estable — pendiente de revisión explícita al evaluar la estabilización de v0.6 tras `v0.1.0`.

## Reconciliación documental (2026-11-25)

> **Nota de trazabilidad:** Esta sección reconcilia los puntos `[open]` originales (`2026-10-17`) con el estado real de `main` tras M2–M7. No modifica `Cargo.toml` ni el comportamiento de la CLI, ni declara deprecación de v0.5; la ratificación a `status: accepted` (`accepted_at: 2026-11-25`) corresponde a autorización humana explícita en Etapa C / Fase 1F.

- **Versión vigente de Wasmtime:** `crates/runtime/Cargo.toml` declara `wasmtime = "29.0.1"` (requisito caret `^29.0.1`) y `wasmtime-wasi = "=29.0.1"` (pin estricto); `Cargo.lock` resuelve ambos paquetes exactamente a `29.0.1`. Esta baseline operativa está respaldada por la suite de workspace, los tests de límites/fuel/WASI y CI en Linux, Windows y macOS; no implica certificación externa ni garantía LTS más allá del soporte upstream.
- **Alineación del flag experimental en la CLI:** La evolución a IR v0.6 no usa `--ir-version=0.6`, sino el flag explícito `--experimental` en `crates/cli/src/commands/verify.rs` y `crates/cli/src/commands/build.rs`, que habilita `allow_experimental` en el verificador y en `wasma_compiler::CompileContext::with_experimental(true)`.
- **Separación de garantías v0.5 vs. v0.6:**
  - **IR v0.5 (baseline estable por defecto):** `crates/ir/schemas/ir.schema.json` (con linaje histórico preservado en `crates/ir/schemas/history/ir.schema.v{2,3,4}.json`), cubierta por la suite de regresión histórica de la POC y la ruta por defecto sin flags.
  - **IR v0.6 (capacidades experimentales opt-in):** `crates/ir/schemas/ir.schema.v0.6.json`, incorpora `string` y `result<T, E>` (RM-07 / `INI-007`) exclusivamente bajo `--experimental`, sin romper ni alterar el contrato por defecto de v0.5.
- **Política de deprecación (trabajo futuro):** No se declara ninguna deprecación de v0.5 en `v0.1.0`. El punto de revisión queda fijado para la evaluación de promoción de v0.6 a estable en el ciclo posterior a `v0.1.0`.

## Related Capabilities

- Semantic IR Verification.
- Component Compilation.

## Related Work Items

- AN-003 (este ADR).
- AN-002 (matriz de extracción C-01, S-01, S-02).
- Precondición de: INIT-02-01, INIT-02-02, INIT-07-02.
