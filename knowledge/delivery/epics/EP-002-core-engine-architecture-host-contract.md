---
type: epic
id: EP-002
title: Core Engine Architecture & Host Contract
status: planned
plan: PLAN-001
milestone: M2
outcome: >-
  Diseñar e implementar el andamiaje del motor Wasma y el contrato de interfaz
  de llamadas de host con control riguroso de errores.
depends_on:
  - EP-001
success_criteria:
  - Interfaz de funciones de host definida e implementada en crates/wasma-core.
  - Estructura base del runtime y arnés de pruebas automatizadas integrado en CI.
  - Contrato normativo de manejo de errores y códigos de retorno validado.
---

# EP-002: Core Engine Architecture & Host Contract

Construcción del núcleo del motor de ejecución y formalización de la comunicación anfitrión-huésped.
