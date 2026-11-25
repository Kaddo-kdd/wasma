---
type: adr
id: ADR-005
status: accepted
date: 2026-10-17
accepted_at: 2026-11-25
created_from: knowledge/tech/discovery/decision-candidates.md
related_work_items:
  - AN-003
  - AN-016
  - AN-035
  - AN-036
  - AN-037
code:
  - crates/ir/
  - crates/runtime/
---

# ADR-005 — Modelo de memoria y Canonical ABI

## Context

El supuesto inicial del roadmap (A2) fijaba dlmalloc + copia al host + reset entre tenants como estrategia por defecto. Fue retirado por el usuario por falta de sustento técnico. La POC usa un asignador incremental sin estrategia general de liberación (registrado como riesgo R-11); no se validó su comportamiento con instancias persistentes ni bajo presión de memoria.

Open Question L148 quedó `[deferred]` en `knowledge/tech/codebase.md`, con plan de resolución explícito: materializar este ADR y conducir los experimentos de INIT-02-05 antes de cerrar la estrategia definitiva.

Esta decisión impacta:
- Semánticas de retorno de registros bajo Canonical ABI.
- Ciclo de vida de instancias y reutilización entre tenants.
- Elegibilidad de componentes para `agent-native run` con instancias persistentes.

## Options Considered

### Opción A — Adoptar dlmalloc + copia al host + reset entre tenants como estrategia definitiva

Pros: patrón conocido en guests WASM.
Contras: no se midió en la POC; su comportamiento bajo instancias persistentes es desconocido. **Rechazada** por retirado del supuesto A2.

### Opción B — Instancias nuevas siempre; prohibir reutilización hasta tener garantías de aislamiento

Pros: seguro por defecto; alinea con `business.md` §Constraints "privilegio mínimo"; se puede optimizar después.
Contras: overhead por invocación; impacta p50/p95 cold start.

### Opción C — Modelo híbrido: instancias nuevas por defecto, pool con reset explícito tras validación de aislamiento

Pros: equilibra seguridad y rendimiento; permite experimentar en INIT-02-05 y validar en INIT-06-03.
Contras: más complejo; requiere diseño cuidadoso del API `Tenant`.

### Opción D — Permitir que el consumidor elija allocator vía trait object

Pros: máxima flexibilidad.
Contras: superficie de API grande para MVP; invita a decisiones no revisadas por el consumidor. **Diferida**.

## Decision

### Decisión vigente ratificada (2026-11-25)

**Ratificada por autorización humana explícita (Etapa C / Fase 1F, 2026-11-25):** Se ratifica la **Opción B (`fresh Store` + instancia fresca por invocación + `copy-on-return` + `ResourceLimiter`)** como contrato productivo único, y se **incorpora formalmente la decisión de `AN-064` de no adoptar warm pool genérico de instancias vivas** (descartando la proyección original de Opción C del `2026-10-17`). La concurrencia host-side se canaliza mediante **workers acotados de instancia fresca** (`AN-065`..`AN-067`, `experimental-workers`), nunca reutilizando instancias vivas entre invocaciones. Las estrategias futuras de *pooling allocator* de Wasmtime o allocators alternativos quedan sujetas a evidencia y Work Items independientes.

### Baseline operativa histórica (2026-10-17, vigente)

- Toda invocación del runtime crea una **instancia nueva**; el guest termina y libera recursos al final de cada invocación.
- Los **registros devueltos** por el componente se **copian al host** al cruzar la Canonical ABI; el runtime no retiene referencias al estado interno del guest.
- Se usa el allocator del guest **por defecto** generado por `wit-bindgen` (hoy dlmalloc, lo que **no** convierte dlmalloc en decisión; es el default del toolchain).
- **No hay reutilización de instancias entre tenants** en MVP. Ni siquiera dentro del mismo tenant si no hay evidencia de aislamiento.

### Antecedente histórico descartado — Ruta de optimización Opción C (2026-10-17, no adoptada por AN-064)

> **Estado (2026-11-25): Descartada.** Originalmente se proyectó habilitar un *warm pool* en `INIT-08-03` tras completar los pasos 1–3 abajo. Los pasos 1–3 se ejecutaron (`AN-016`, `AN-012`/`AN-013`, `AN-037`), pero el paso 4 (`AN-064`) demostró que la reutilización genérica de instancias vivas retiene estado mutable (globals), por lo que **no se habilitó warm pool**.

1. **INIT-02-05** documenta formalmente la semántica de Canonical ABI usada por el verifier + compiler (qué se copia, qué se mueve, qué cruza fronteras del guest).
2. **INIT-03-06** publica una línea base técnica (cold start, warm invocation, memoria por instancia) con la baseline operativa anterior.
3. **INIT-06-03** diseña `Tenant` API y pruebas de contaminación cruzada que **fallen sin aislamiento, pasen con él**.
4. *(Proyección original no adoptada)* Habilitar module cache + warm pool con wipe explícito entre tenants en `INIT-08-03`.

### Prohibiciones durante baseline operativa

- No introducir pool de instancias.
- No reutilizar `wasmtime::Store` entre invocaciones.
- No mantener referencias a memoria del guest en el host más allá del scope de la invocación.
- No optimizar prematuramente el allocator del guest sin evidencia.

### Qué queda explícitamente `[deferred]` tras AN-016

Las tres preguntas que originalmente quedaron `[open]` fueron ejercitadas por los experimentos de AN-016 (ver [`memory-model-notes.md`](../discovery/memory-model-notes.md) §3-§5). Ninguna se cerró con una decisión productiva, pero cada una ganó un **criterio objetivo de cierre**:

- **[deferred to: INIT-06-02]** — **Allocator alternativo** (p. ej. arena por invocación). AN-012/013 miden que el default `wit-bindgen` **no es el término dominante** del cold start (~2 µs warm vs ~389 µs cold está dominado por parsing + Cranelift, no por allocación). Criterio objetivo: antes de proponer un allocator alternativo hay que medir bytes allocados reales con `wasmtime::ResourceLimiter`, cuya integración vive en INIT-06-02 (fuel + instance limits). Hasta entonces, mantener el default.
- **[deferred to: INIT-06-03]** — **Estrategia de liberación en instancias persistentes**. El baseline operativa (fresh `Store` per invoke) hace la pregunta vacua: no hay instancias persistentes. INIT-06-03 debe decidir si levantar esa restricción con garantías de aislamiento multi-tenant; sólo entonces aplica una decisión sobre liberación.
- **[deferred to: RM-07 / INIT-07-02]** — **Comportamiento ante allocación masiva o fuga en el guest**. Los experimentos de AN-016 §3 muestran que la gramática v0.5 **impide** construir fixtures de estrés (sin loops, listas ni strings; records anidados rechazados por diseño — ver AN-016 §2 y `nested_records.rs`). El experimento se habilita cuando IR v0.6+ relaje esas restricciones. Mientras tanto, INIT-06-05 cubre fixtures de recursión a nivel WASM (fuera del dominio del compilador).

### Límites de memoria por instancia y contención (INIT-06-02 / AN-036)

Añadido por AN-036:

- **Contención de memoria lineal mediante `ResourceLimiter`:** Se intercepta cada solicitud individual de crecimiento dinámico (`ResourceLimiter::memory_growing()`) en tiempo de ejecución. Al alcanzar `max_memory_bytes`, el limiter deniega la petición retornando `Ok(false)`, lo que produce `-1` en el guest.
- **Diagnóstico heurístico de traps:** Si el guest aborta tras una denegación registrada (`unreachable`), el runtime mapea heurísticamente el trap a `RuntimeError::MemoryLimitExceeded`.
- **Delimitación de garantías:** Este límite opera evaluando solicitudes individuales de crecimiento de la memoria lineal dentro de un `Store` activo; **no** constituye una cuota acumulada de todas las memorias del Store, ni una cuota agregada o acumulativa entre múltiples invocaciones de un tenant, ni garantiza aislamiento de toda la memoria del proceso anfitrión (aspecto reservado para INIT-06-03).
- **Invariante no negociable de aislamiento:** Se ratifica la prohibición estricta de reutilización de instancias entre tenants. Cada invocación mantiene su propio `wasmtime::Store` fresco y aislado.

### Canonical ABI — [chosen] copy-on-return + fresh Store per invoke

Añadido por AN-016 con evidencia (`memory-model-notes.md` §4):

- **Records y primitivos retornados por el guest se copian al host** vía `wasmtime::component::Val` (confirmado con `program-005`/`make-point-sum`).
- **El `wasmtime::Store` se destruye al final de cada invocación**, liberando toda memoria lineal del guest sin acción del host.
- **Resources, strings y listas quedan fuera de alcance** de esta decisión (no cubiertos por IR v0.5).

Esta es la decisión productiva de ADR-005 sobre Canonical ABI: no quedó `[open]`; está documentada aquí.

## Consequences

**Positivas:**
- MVP seguro-por-defecto respecto a memoria: ningún estado cruza invocaciones ni tenants.
- La ruta de optimización queda explícita y gobernada por mediciones.
- R-11 (allocator incremental de la POC) no se hereda silenciosamente al producto nuevo.

**Negativas:**
- Cold start por invocación impacta p50/p95; se cuantifica en INIT-03-06.
- Rendimiento por invocación individual frente a implementaciones nativas incluye el coste de `Store` e instancia frescos *(actualización 2026-11-25: el warm pool proyectado originalmente para RM-08 fue descartado por `AN-064`; el escalado de throughput concurrente se aborda mediante workers acotados de instancia fresca en `AN-065`..`AN-067`)*.

**Riesgos del roadmap mitigados:**
- R-01 (fuga de estado entre tenants) — prohibida por diseño en baseline.
- R-11 (allocator incremental sin liberación general) — tratada por aislamiento por invocación.

**Seguimientos abiertos (reconciliados el 2026-11-25):**
- `[closed — 2026-11-25]` Instancias persistentes y warm pool (`INIT-06-03` / `INIT-08-03`) — `AN-037` ratificó el aislamiento por `Store` fresco y `AN-064` (`crates/runtime/tests/warm_pool_feasibility.rs`) demostró que la reutilización genérica de instancias vivas retiene estado mutable (globals), concluyendo con la **no-adopción** del warm pool genérico.
- `[closed — 2026-11-25]` Allocación masiva y estrés de memoria (`INIT-06-02` / `INIT-06-05` / `INIT-07-02`) — `AN-036` incorporó `ResourceLimiter` (`crates/runtime/src/limits.rs`), `INIT-06-05` cubrió fixtures WASM de estrés extremo (recursión, allocación masiva y traps) sin caída del proceso, y `INIT-07-02` incorporó `string` y `result<T, E>` en IR v0.6 bajo `--experimental`.
- `[deferred — post-v0.1.0]` Allocator alternativo del guest — no se introduce cambio de allocator para `v0.1.0`; permanece diferido a trabajo futuro condicionado a evidencia de perfilado que demuestre que la allocación del guest domina el coste frente a instanciación/ejecución.

Cerrados históricamente por AN-016 (ver `memory-model-notes.md`):
- `[chosen]` Canonical ABI: copy-on-return + fresh Store per invoke.
- `[chosen]` Eliminación de la dependencia del cwd en la resolución de WIT via `CompileContext` (impacto cruzado con el modelo de memoria vía reproducibilidad de artefactos).

## Reconciliación documental (2026-11-25)

> **Nota de trazabilidad:** Esta sección reconcilia la ruta de optimización proyectada originalmente el `2026-10-17` (Opción C / warm pool en `INIT-08-03`) con la evidencia empírica obtenida en RM-06 (`AN-036`, `AN-037`) y RM-08 (`AN-064`..`AN-067`). Conserva fecha y procedencia originales; la ratificación a `status: accepted` (`accepted_at: 2026-11-25`) corresponde a autorización humana explícita en Etapa C / Fase 1F.

- **Decisión vigente (baseline confirmada):** Se mantiene como contrato productivo único **`fresh Store` + instancia fresca por invocación**, **`copy-on-return`** al cruzar la Canonical ABI (`AN-016`), y contención de crecimiento de memoria lineal por solicitud mediante `ResourceLimiter` (`AN-036`, `crates/runtime/src/limits.rs`).
- **No-adopción de reutilización genérica de instancias vivas (`AN-064`):** El experimento `AN-064` (`crates/runtime/tests/warm_pool_feasibility.rs`) comprobó que una instancia Wasmtime reutilizada conserva estado mutable entre llamadas (p. ej. globals) y que la API usada por el runtime no ofrece un reset genérico verificable de `Store`, memoria, tablas, globals, recursos y host context. En consecuencia, **la ruta de warm pool genérico (Opción C original) queda formalmente descartada** para los componentes actuales.
- **Evolución real adoptada en RM-08 — Workers acotados de instancia fresca (`AN-065`, `AN-066`, `AN-067`):** En lugar de reutilizar instancias vivas, la concurrencia host-side se diseñó y caracterizó en `crates/runtime/src/workers.rs` (aislada tras la feature opt-in `experimental-workers`) con capacidad fija, backpressure explícito, recuperación ante fallos y creación de `Store` e instancia frescos por cada solicitud.
- **Distinción arquitectónica explícita (no confundir):**
  - *Reutilización de instancias vivas (warm pool de aplicación):* descartada por `AN-064` porque retiene estado mutable del guest entre invocaciones.
  - *Pooling allocation strategy de Wasmtime (`PoolingAllocationConfig` / pooling allocator a nivel de motor):* mecanismo interno de reserva/reciclaje de slots de memoria virtual del motor Wasmtime que **no** reutiliza el estado lógico de una instancia viva. No está activado ni implementado en esta reconciliación; cualquier evaluación futura requeriría un Work Item y pruebas de seguridad/compatibilidad cross-OS independientes.

## Related Capabilities

- Independent Runtime Execution.
- Host Capability Policy.
- Semantic IR Verification (sección Canonical ABI).

## Related Work Items

- AN-003 (este ADR).
- AN-016: experimentos de memoria, Canonical ABI y resolución WIT por contexto (ver `memory-model-notes.md`).
- Precondición de: INIT-02-05, INIT-03-01, INIT-06-02, INIT-06-03.
- Habilita (una vez cerrado tras experimentos): INIT-08-03.
