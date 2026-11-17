---
type: epic
id: EP-004
title: Multi-Tenant Sandbox & Security Baseline
status: planned
plan: PLAN-001
milestone: M4
outcome: >-
  Fortalecer las garantías de seguridad y aislamiento del runtime para permitir
  la coexistencia segura de múltiples agentes concurrentes.
depends_on:
  - EP-003
success_criteria:
  - Mecanismo determinista de fuel metering implementado y verificado en ejecución.
  - Límites de concurrencia y aislamiento estricto entre inquilinos impuestos.
  - Techo máximo de consumo de memoria verificado bajo cargas de estrés.
---

# EP-004: Multi-Tenant Sandbox & Security Baseline

Imposición de barreras de contención, límites de recursos y metering determinista para entornos multi-agente.
