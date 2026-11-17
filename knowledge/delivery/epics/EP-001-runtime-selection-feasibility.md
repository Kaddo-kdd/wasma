---
type: epic
id: EP-001
title: Foundation, Architecture Baseline & POC Governance
status: planned
plan: PLAN-001
milestone: M1
outcome: >-
  Establecer la gobernanza estricta de la POC histórica, definir la matriz de extracción hacia el producto,
  materializar los cinco ADRs arquitectónicos bloqueantes en estado de borrador y configurar el workspace Cargo inicial con CI cross-OS.
depends_on: []
success_criteria:
  - Aislamiento y política de solo lectura de _reference/ establecida en .gitignore y documentación técnica.
  - Matriz de extracción POC formalizada clasificando componentes a migrar, rediseñar o descartar.
  - Materialización documental de los cinco ADRs fundacionales (ADR-001 a ADR-005) como propuestas arquitectónicas en estado de borrador (draft).
  - "Aceptación formal humana (status: accepted) de las cinco decisiones arquitectónicas bloqueantes (ADR-001 a ADR-005)."
  - Workspace Cargo multimodular inicial (crates/ir, crates/compiler, crates/runtime, crates/cli) operativo con pipeline CI validado en Linux, Windows y macOS.
---

# EP-001: Foundation, Architecture Baseline & POC Governance

Fase fundacional y de gobernanza técnica que convierte el repositorio vacío en una base de desarrollo verificable, aislando el código de referencia de la POC, materializando los acuerdos arquitectónicos bloqueantes en estado de borrador para revisión humana y levantando la infraestructura inicial de compilación y CI multiplataforma.
