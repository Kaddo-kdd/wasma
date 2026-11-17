---
type: epic
id: EP-002
title: Autonomous Semantic IR & Component Compiler
status: planned
plan: PLAN-001
milestone: M2
outcome: >-
  Extraer e implementar el modelo de Semantic IR v0.5, su motor de verificación determinista, y el compilador
  autónomo que transforma especificaciones IR en componentes WebAssembly reproducibles con verificación SHA-256.
depends_on:
  - EP-001
success_criteria:
  - Modelo de datos Semantic IR v0.5 y verificador determinista con diagnósticos localizados en crates/ir (wasma-ir).
  - Suite de regresión histórica de la POC (8 tests originales de irtool) reproducida satisfactoriamente.
  - Compilador determinista crates/compiler (wasma-compiler, IR → WASM Component) con cálculo canónico de SHA-256.
  - Convención normativa de contratos WIT estructurada (public, internal, fixtures) sin acoplamiento a contratos implícitos.
  - Fundamentación técnica del modelo de memoria lineal y ciclo de vida bajo Canonical ABI respaldada por la materialización de ADR-005 (con aceptación formal pendiente).
---

# EP-002: Autonomous Semantic IR & Component Compiler

Construcción del núcleo del pipeline de representación intermedia y compilación autónoma, formalizando el modelo de datos de Semantic IR v0.5, las reglas de verificación sin dependencias de runtime y la emisión reproducible de componentes WebAssembly con contratos WIT estandarizados.
