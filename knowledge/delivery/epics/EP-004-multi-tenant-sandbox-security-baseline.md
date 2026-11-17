---
type: epic
id: EP-004
title: Specification Ingestion, Agent Pipeline & Atomic Publication
status: planned
plan: PLAN-001
milestone: M4
outcome: >-
  Integrar el pipeline generativo extremo a extremo: parsing de narrativa Markdown a SystemSpec, adaptador LLM
  modular (fixtures, synthesizer, real), evolución incremental de reglas (esclusas v1→v2) y publicación atómica con rollback.
depends_on:
  - EP-002
success_criteria:
  - Intérprete de narrativa estructurada Markdown a modelo canónico SystemSpec operativo en la capa de orquestación (crates/cli/src/spec/).
  - Adaptador LLM modular con verificación offline demostrada (proveedores fixtures y synthesizer en CI) y presencia de HttpLlmProvider como stub determinista sin conectividad de red activa en M4 (Decisión D1 de M4).
  - Evolución incremental de especificaciones demostrada mediante reconciliador de SystemSpec y cálculo de SpecDiff (caso esclusas v1→v2).
  - Publicación atómica de componentes en almacenamiento versionado local con puntero activo (active.json) y rollback verificado ante fallos.
  - Trazabilidad determinista de procedencia incorporada en manifiestos (source_wi, source_spec_hash, source_git_commit).
---

# EP-004: Specification Ingestion, Agent Pipeline & Atomic Publication

Implementación del pipeline de especificaciones de alto nivel y publicación versionada, abarcando la interpretación de historias y reglas de negocio, la síntesis reproducible mediante adaptadores LLM deterministas y la gestión de almacenamiento atómico con garantías de reversión y procedencia.
