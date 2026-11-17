---
type: delivery-plan
id: PLAN-001
title: Wasma Production Runtime & Release Delivery
status: draft
objective: >-
  Plan maestro de entrega para el runtime WebAssembly agent-native Wasma,
  desde la selección de arquitectura y pruebas de concepto hasta la
  estabilización para producción, documentación y lanzamiento público.
success_criteria:
  - Runtime WebAssembly agent-native caracterizado con benchmarks objetivos y reproducibles cross-OS.
  - Ejecución determinista, metering de fuel y aislamiento de memoria y estado verificados.
  - Toolchain independiente: un desarrollador puede instalar la CLI, descargar un componente y ejecutarlo sin Rust ni LLM.
  - Pipeline de empaquetado, firma Minisign y distribución multiplataforma (Linux x86_64, Windows x86_64, macOS ARM64).
  - Portal público Starlight con documentación técnica exhaustiva y validación empírica con desarrolladores externos completada.
milestones:
  - id: M1
    title: Runtime Selection & Feasibility
    exit_criteria:
      - ADR formal de selección de motor WebAssembly documentado y aprobado.
      - Línea base de overhead de memoria y tiempo de ejecución evaluada.
  - id: M2
    title: Core Engine Architecture & Host Contract
    exit_criteria:
      - Interfaz de funciones de host y contrato de errores formalizado en crates/wasma-core.
      - Scaffold del motor de ejecución y arnés básico de pruebas operativo.
  - id: M3
    title: Proof of Concept & Determinism
    exit_criteria:
      - Membrana de aislamiento de estado y sandbox de sistema de archivos validado.
      - Suite de determinismo funcional ejecutada satisfactoriamente.
      - Cierre técnico y consolidación de regresión del POC completada.
  - id: M4
    title: Multi-Tenant Sandbox & Security Baseline
    exit_criteria:
      - Sistema determinista de fuel metering implementado para entornos de producción.
      - Techo de memoria y límites de concurrencia multi-inquilino impuestos.
  - id: M5
    title: High-Performance Engine Pooling
    exit_criteria:
      - Pool de motores optimizado para arranque en frío (cold-start) implementado.
      - Reutilización thread-local de instancias validada bajo alta concurrencia.
      - Benchmarks de motores de reglas sintéticos y reales ejecutados.
  - id: M6
    title: Component Model Integration
    exit_criteria:
      - Soporte canónico de tipos del WebAssembly Component Model implementado.
      - Validación de especificaciones WIT y scaffolding de bindings anfitrión-huésped.
  - id: M7
    title: WASI & CLI Runner Distribution
    exit_criteria:
      - Soporte de WASI Preview 2, relojes y HTTP saliente integrado.
      - Ejecutable CLI runner empaquetado para distribución.
  - id: M8
    title: Production Hardening & Authoring
    exit_criteria:
      - Pipeline de detección de regresiones de rendimiento en CI activo.
      - Auditoría de seguridad con fuzzing y sanitizadores de memoria aprobada.
      - Matriz multiplataforma verificada y componentes de autoría integrados.
  - id: M9
    title: Developer Documentation & Release Launch
    exit_criteria:
      - Portal de documentación para desarrolladores desplegado en producción con Starlight.
      - Validación empírica con desarrolladores externos (piloto AN-075) y reporte de fricciones cerrado.
      - Publicación oficial v0.1.0 y cierre de distribución (AN-076) formalizado tras veredicto favorable.
---

# Wasma Production Runtime & Release Delivery

Plan maestro de entrega para la ingeniería y lanzamiento de Wasma.
Estructura la totalidad del trabajo realizado y pendiente a lo largo de 9 milestones
alineados con el roadmap técnico del proyecto y la iniciativa de experiencia de desarrollador.
