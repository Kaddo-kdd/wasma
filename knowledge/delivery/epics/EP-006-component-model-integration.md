---
type: epic
id: EP-006
title: Deep Runtime Security, Resource Limits & Integrity Verification
status: planned
plan: PLAN-001
milestone: M6
outcome: >-
  Endurecer la seguridad operativa y el control de recursos del runtime: políticas de capabilities manifest-driven,
  presupuesto de CPU vía fuel, contención de memoria con ResourceLimiter, aislamiento multi-tenant y verificación de integridad en carga.
depends_on:
  - EP-003
  - EP-005
success_criteria:
  - Policy loader manifest-driven con control deny-by-default y validación estricta de capabilities al cargar componentes.
  - Contención determinista de CPU vía fuel accounting con recuperación limpia de traps en Linux, macOS y Windows MSVC (Wasmtime 29.0.1).
  - Límites de memoria lineal y tablas gobernados mediante ResourceLimiter con tests de agotamiento y contención de blast radius.
  - Invariante de aislamiento multi-tenant garantizada mediante ciclo de vida de Store e instancias limpias por invocación (sin reutilización cruzada).
  - Subcomando wasma run --verify con validación de hash SHA-256 y verificación de firma Minisign en tiempo de carga.
  - Fixtures de bajo nivel de estrés extremo (recursión profunda, allocación masiva y trampas) superados sin caídas de proceso.
---

# EP-006: Deep Runtime Security, Resource Limits & Integrity Verification

Fortalecimiento de las defensas y gobernanza de ejecución en producción, introduciendo contención cuantitativa de CPU y memoria, políticas granulares de capacidades de host por manifiesto, garantías de aislamiento estricto entre inquilinos y comprobación criptográfica previa a la instanciación.
