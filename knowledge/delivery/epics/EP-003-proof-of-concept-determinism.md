---
type: epic
id: EP-003
title: Autonomous Runtime Engine & Acceptance Regression
status: planned
plan: PLAN-001
milestone: M3
outcome: >-
  Materializar el motor de ejecución autónomo basado en Wasmtime con tipificación de errores, controles deny-by-default,
  línea base inicial de latencia, resolver de dependencias y el executor declarativo de pruebas de aceptación YAML.
depends_on:
  - EP-002
success_criteria:
  - Motor de ejecución crates/runtime (wasma-runtime) autónomo, sin dependencias de compilador ni LLM (auditado por lint CI de ADR-002).
  - Propagación de errores tipados fail-explicit (RuntimeError) y controles deny-by-default pre-instantiate a tres niveles verificados.
  - Línea base técnica de latencia inicial (cold start, warm invocation, cache-hit) publicada en documentación técnica.
  - Resolver de componentes content-addressed con capacidad de limpieza de caché (reset()) implementado.
  - Executor de aceptación YAML operativo y cierre técnico de M3 alcanzado bajo la matriz de equivalencia POC (0 exactas, 6 parciales, 4 aplazadas).
---

# EP-003: Autonomous Runtime Engine & Acceptance Regression

Extracción e implementación del motor de ejecución runtime autónomo desacoplado de compiladores y LLMs, garantizando contención estricta deny-by-default, gestión tipada de errores del anfitrión, medición inicial de latencia y verificación regresiva mediante suites declarativas YAML.
