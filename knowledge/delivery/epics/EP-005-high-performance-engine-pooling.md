---
type: epic
id: EP-005
title: Standalone CLI & Embedded Runtime SDK Distribution
status: planned
plan: PLAN-001
milestone: M5
outcome: >-
  Consolidar el producto en una herramienta autónoma distribuible: binario unificado CLI con soporte de comandos de ciclo de vida,
  API pública y estable del SDK de runtime para consumo embebido en Rust, y pipeline de release multiplataforma con firma Minisign.
depends_on:
  - EP-003
  - EP-004
success_criteria:
  - Binario CLI unificado (wasma) con soporte de subcomandos build, verify, test, run y publish bajo formatos human y json.
  - API pública del SDK de runtime estabilizada (Engine, Component, Val, HostPolicy) y demostrada mediante ejemplo canónico de embebido (crates/runtime/examples/embed_runtime.rs).
  - Estrategia de empaquetado, firma Minisign y verificación criptográfica formalizada en ADR-006 (en estado accepted).
  - Pipeline automatizado de release en GitHub Actions (.github/workflows/release.yml) operativo para Linux x86_64, Windows x86_64 y macOS aarch64.
---

# EP-005: Standalone CLI & Embedded Runtime SDK Distribution

Empaquetado y distribución de Wasma como herramienta de línea de comandos integral y SDK embebible, formalizando el contrato de la interfaz de usuario, estabilizando la API de consumo directo en Rust y automatizando la generación de binarios firmados criptográficamente para múltiples arquitecturas.
