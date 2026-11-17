---
type: epic
id: EP-007
title: Console I/O, Authorized WASI & IR v0.6 String Extensions
status: planned
plan: PLAN-001
milestone: M7
outcome: >-
  Habilitar capacidades de I/O autorizadas mediante un adaptador en memoria WASI Preview 2 gobernado por políticas,
  extender Semantic IR a v0.6 para soportar cadenas de texto y tipos de error, y enriquecer el executor YAML con stubs de consola.
depends_on:
  - EP-006
success_criteria:
  - Adaptador WASI Preview 2 (wasi:cli/stdio) determinista en memoria con autorización granular bajo principio Requested ∩ Granted.
  - Extensión experimental de Semantic IR a v0.6 incorporando tipos string y result<T, E> bajo flag --experimental sin romper v0.5.
  - Executor YAML enriquecido con stubs deterministas de consola (stdin, stdout, stderr) y soporte de tipos v0.6.
  - Soporte de componentes y binarios reales compilados a wasm32-wasip2 bajo política deny-by-default.
---

# EP-007: Console I/O, Authorized WASI & IR v0.6 String Extensions

Incorporación controlada de entrada y salida estándar conforme a la especificación WASI Preview 2, expandiendo el sistema de tipos de Semantic IR para el manejo de cadenas y errores sin comprometer el determinismo, bajo estricta autorización de flujos por el host.
