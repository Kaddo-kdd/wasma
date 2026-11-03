---
id: AN-074
type: feature
status: in-progress
created_at: 2026-10-26T00:00:00.000Z
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

## Fuera de alcance

- SDKs para lenguajes distintos de Rust o TypeScript (considerables en iniciativas posteriores).
- Publicación de crates en crates.io (cubierto en AN-078).
- Publicación de releases oficiales en GitHub Releases (cubierto en AN-076).
