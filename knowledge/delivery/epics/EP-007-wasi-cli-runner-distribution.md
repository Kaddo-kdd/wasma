---
type: epic
id: EP-007
title: WASI & CLI Runner Distribution
status: planned
plan: PLAN-001
milestone: M7
outcome: >-
  Proveer compatibilidad estándar con WASI Preview 2 y suministrar un ejecutable CLI
  runner portable para desarrolladores y entornos de ejecución.
depends_on:
  - EP-004
  - EP-006
success_criteria:
  - Adaptador WASI Preview 2 operativo con soporte de clocks y HTTP saliente.
  - Binario CLI runner empaquetado y distribuible para plataformas soportadas.
  - Verificación de conformidad y pruebas funcionales de la CLI superadas.
---

# EP-007: WASI & CLI Runner Distribution

Implementación de capacidades estándar del sistema y empaquetado de la herramienta de línea de comandos.
