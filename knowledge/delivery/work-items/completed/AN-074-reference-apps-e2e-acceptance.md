---
id: AN-074
type: feature
status: completed
created_at: 2026-10-26T00:00:00.000Z
completed_at: '2026-11-03'
title: Aplicaciones de referencia y pruebas E2E
knowledge_level: K3
suggested_knowledge_level: K3
scope_confidence: high
initiative: INI-009
source_roadmap_initiative: INIT-09-07
priority: P1
depends_on:
  - AN-070
domains:
  - 'Developer Experience, Documentation & Branding'
code:
  - examples/**
  - docs/**
  - website/src/content/docs/**
  - website/astro.config.mjs
  - .github/workflows/ci.yml
expected_value: >-
  Construir dos aplicaciones de referencia con manifests, código y ejemplos bajo
  los nombres finales de Wasma, verificando que la migración de identidad
  técnica no afecte los contratos WASM.
project_state: ai-assisted
template_version: 1
ready_at: '2026-11-02'
---

# AN-074 — Aplicaciones de referencia y pruebas E2E

## Contexto y problema

Los desarrolladores necesitan evaluar casos de uso realistas más allá de ejemplos elementales. Dos aplicaciones de referencia completas bajo la identidad definitiva de Wasma permitirán validar la versatilidad de la plataforma y comprobar de forma empírica que la migración técnica no alteró los contratos ni la ejecución de los componentes WebAssembly.

## Alcance

- Construir **Ejemplo 1: Motor de reglas de negocio** (`examples/business-rules/`), que implementa evaluación determinista de descuentos y tiers comerciales mediante Semantic IR, especificación formal, verificación con `wasma verify`, compilación con `wasma build`, ejecución directa con `wasma run` y suite declarativa YAML probada con `wasma test`.
- Construir **Ejemplo 2: Integración host embebida** (`examples/embedded-host/`), que demuestra cómo una aplicación Rust externa consume la librería `wasma-runtime`, configurando políticas deny-by-default (`HostPolicy`), límites de recursos deterministas (fuel y memoria vía `ExecutionLimits`) y manejo fail-explicit de errores y traps (`RuntimeError::FuelExhausted`, `RuntimeError::FunctionNotFound`).
- Incorporar ambas aplicaciones en `examples/` con manifests de Cargo actualizados a la identidad canónica (`wasma-*`), READMEs reproducibles paso a paso y suites de pruebas automatizadas E2E.
- Verificar empíricamente que la migración de identidad técnica no altera los contratos WebAssembly (WIT), las firmas de funciones ni los artefactos generados.
- Publicar guías y walkthroughs técnicos en el portal web (`website/src/content/docs/docs/examples/...`) con enlaces directos al código en el repositorio y navegación integrada en la barra lateral.

## Criterios de aceptación

- AC-01: Ejemplo 1 — Motor de reglas de negocio: componente que evalúa reglas deterministas de descuento o puntuación, con especificación, IR, verificación y pruebas YAML bajo la identidad definitiva.
- AC-02: Ejemplo 2 — Integración host: aplicación que embebe el runtime de Wasma (`wasma-runtime`) y ejecuta componentes demostrando cuotas de fuel, memoria y aislamiento estricto de fallos.
- AC-03: Ambas aplicaciones se incorporan en `examples/` con manifests de Cargo actualizados a los nuevos nombres, README reproducible y suite de tests automatizada.
- AC-04: Se verifica que la migración técnica de identidad no altere los contratos WebAssembly ni los artefactos generados.
- AC-05: Se publican guías y walkthroughs en el portal de documentación enlazando al código de ambos ejemplos.

## Validación

- Ejecución de `cargo test` para las suites de prueba de ambos ejemplos en `examples/`.
- Verificación estática, compilación y ejecución del motor de reglas mediante la CLI de Wasma (`verify`, `build`, `run`, `test`).
- Verificación de límites de ejecución y captura limpia de errores sin panic en la integración host.
- Verificación de links y build del portal con `pnpm --dir website check`, `pnpm --dir website test`, `pnpm --dir website build` y `pnpm --dir website check:links`.
- Verificación formal del Work Item mediante `kaddo_verify_work_item`.

## Entregable

- `examples/business-rules/` con especificación IR, suite YAML, README y tests E2E.
- `examples/embedded-host/` con manifest `Cargo.toml`, código Rust (`main.rs`), README y tests de integración.
- Guías y walkthroughs publicados en `website/src/content/docs/docs/examples/`.
- Documento de Work Item verificado y actualizado en Kaddo.

## Evidencia de validación técnica

1. **Sincronización remota y workflows automáticos**:
   - **Commit publicado en `origin/main`**: [`e4b6cef0dbc050ebe9d839399d1c5b5909e2e14b`](https://github.com/Kaddo-kdd/wasma/commit/e4b6cef0dbc050ebe9d839399d1c5b5909e2e14b) (`feat(examples): add business rules and embedded host reference apps (AN-074)`).
   - **Workflow Website**: Run [`41657249858`](https://github.com/Kaddo-kdd/wasma/actions/runs/41657249858) — Exitoso (2m 23s). Jobs `website` y `documentation-smoke` en verde. Artefacto `wasma-static-site` generado.
   - **Workflow CI Multiplataforma**: Run [`41657250038`](https://github.com/Kaddo-kdd/wasma/actions/runs/41657250038) — Exitoso (9m 12s). Matriz completa Linux x86_64, Windows x86_64 y macOS ARM64 aprobada al 100%.

2. **Ejemplo 1 — Motor de reglas comerciales (`examples/business-rules/`)**:
   - **Semantic IR v0.5**: `discount-rules.ir.json` con validaciones de frontera entera (`order_amount_cents <= 20_000_000`), códigos de error semánticos (200, 400, 404) y lógica de tiers (Bronze/Silver/Gold).
   - **Contrato WIT**: `rules.wit` (`wasma:examples@0.1.0`) con interfaz y tipo compuesto `discount-summary`.
   - **Componente WebAssembly reproducible**: `discount_rules.wasm` (1.616 bytes, SHA-256 `44d3fefb65a973809878becc0e20dbf144762d57019529d017bc76f4ff8cc629`). Regenerado en tiempo de compilación en CI y comparado byte a byte contra `$TMP_WASM` mediante `cmp -s`, confirmando correspondencia binaria exacta (`byte-identical: true`).
   - **Suite declarativa YAML**: `suite.yaml` con 24 casos ejecutados con `wasma test`: **24/24 PASSED** tanto localmente como en CI.

3. **Ejemplo 2 — Host Rust embebido (`examples/embedded-host/`)**:
   - **Crate independiente**: `Cargo.toml` con dependencia a `wasma-runtime` fuera del workspace raíz.
   - **Demostrador interactivo (`main.rs`)**: 7 escenarios implementados:
     1. Invocación nominal y consumo medido de fuel (62 unidades consumidas).
     2. Agotamiento calibrado de fuel con presupuesto = 31 unidades (`RuntimeError::FuelExhausted { limit: 31 }`).
     3. Rechazo estricto por cuota de memoria (módulo de 128 KiB bajo límite de 64 KiB `RuntimeError::MemoryLimitExceeded`).
     4. Captura limpia de función inexistente (`RuntimeError::FunctionNotFound`).
     5. Política *deny-by-default* en tiempo de carga (`RuntimeError::UnauthorizedImport`).
     6. Aislamiento estricto de fallos garantizado por `wasmtime::Store` fresco entre invocaciones.
     7. Caché direccionada por contenido mediante `Resolver` y desalojo con `resolver.reset()`.
   - **Suite de integración automatizada (`tests/host_integration.rs`)**: **7/7 tests aprobados** en Linux x86_64, Windows x86_64 y macOS ARM64 en CI (Run `41657250038`).
   - **Calidad y linters**: `cargo fmt --check` y `cargo clippy --all-targets --locked -- -D warnings` aprobados sin advertencias.

4. **Validación del portal web en producción (`https://wasma.org/`)**:
   - Endpoint `https://wasma.org/docs/examples/business-rules/`: HTTP 200 OK, 12 bloques de código y enlace canónico a GitHub.
   - Endpoint `https://wasma.org/docs/examples/embedded-host/`: HTTP 200 OK, 8 bloques de código y enlace canónico a GitHub.
   - Navegación lateral Astro/Starlight: Sección "Ejemplos" visible e interactiva.
   - Metadatos en el footer de `https://wasma.org/`: `web v0.1.0 (commit e4b6cef)` enlazando al commit de AN-074 en GitHub con `target="_blank"` y `rel="noopener noreferrer"`.

5. **Compatibilidad CLI y Runtime**:
   - El componente WASM generado y verificado por Wasma CLI se ejecuta indistintamente en la CLI (`wasma run`) y en el runtime embebido (`wasma-runtime`), confirmando coherencia total de tipos y ABI.

## Learning

1. **Las aplicaciones de referencia deben ejercitar contratos reales de la plataforma**: Los ejemplos de adopción deben construir componentes y hosts sobre Semantic IR, contratos WIT y APIs reales de `wasma-runtime`, evitando simplificaciones sintéticas que oculten fricciones de integración.
2. **Un ejemplo independiente requiere cobertura explícita de CI fuera del workspace**: Al mantener crates de ejemplo fuera del workspace raíz de Cargo (para evitar acoplamientos indeseados), el pipeline de CI debe incorporar pasos explícitos con `--manifest-path` para pruebas, formato (`cargo fmt`) y linter (`cargo clippy`) en todas las plataformas objetivo.
3. **Regeneración y comparación de artefactos WASM versionados**: Los archivos `.wasm` incluidos como referencia en el repositorio deben validarse en CI regenerándolos desde su IR fuente (`wasma build`) y comparándolos byte a byte (`cmp -s`) con el binario versionado, asegurando trazabilidad fidedigna entre código fuente y ejecutable.
4. **Determinismo binario observado y contexto del toolchain**: La igualdad exacta byte a byte observada en `discount_rules.wasm` refleja la estabilidad del compilador Wasma v0.5, pero debe documentarse explícitamente junto con la versión del compilador y sistema operativo, sin afirmar determinismo universal entre toolchains dispares.
5. **Calibración empírica de límites de fuel y memoria**: Probar traps de seguridad y cuotas de ejecución exige medir previamente el consumo real del componente (62 unidades de fuel en `evaluate-discount`) para configurar límites deterministas (31 unidades de fuel; 64 KiB de memoria frente a 128 KiB solicitados), evitando números mágicos arbitrarios.
6. **Responsabilidad de Resolver vs. Store en aislamiento**: `Resolver::reset()` es un mecanismo de invalidación y desalojo de caché de módulos en memoria, mientras que el aislamiento estricto de ejecución frente a fallos y traps depende exclusivamente de la instanciación de un `wasmtime::Store` fresco por cada solicitud (ADR-005).
7. **Alineación continua entre walkthroughs y pruebas E2E**: Las guías y tutoriales del portal web deben estar vinculados directamente al código fuente y respaldados por suites de prueba automatizadas para prevenir la obsolescencia documental.

## Fuera de alcance

- SDKs para lenguajes distintos de Rust o TypeScript (considerables en iniciativas posteriores).
- Publicación de crates en crates.io (cubierto en AN-078).
- Publicación de releases oficiales en GitHub Releases (cubierto en AN-076).
