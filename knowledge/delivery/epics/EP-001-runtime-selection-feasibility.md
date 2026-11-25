---
type: epic
id: EP-001
title: 'Foundation, Architecture Baseline & POC Governance'
status: in-progress
plan: PLAN-001
milestone: M1
outcome: >-
  Establecer la gobernanza estricta de la POC histórica, definir la matriz de
  extracción hacia el producto, materializar los cinco ADRs arquitectónicos
  bloqueantes en estado de borrador y configurar el workspace Cargo inicial con
  CI cross-OS.
depends_on: []
success_criteria:
  - >-
    Aislamiento y política de solo lectura de _reference/ establecida en
    .gitignore y documentación técnica.
  - >-
    Matriz de extracción POC formalizada clasificando componentes a migrar,
    rediseñar o descartar.
  - >-
    Materialización documental de los cinco ADRs fundacionales (ADR-001 a
    ADR-005) como propuestas arquitectónicas en estado de borrador (draft).
  - >-
    Aceptación formal humana (status: accepted) de las cinco decisiones
    arquitectónicas bloqueantes (ADR-001 a ADR-005).
  - >-
    Workspace Cargo multimodular inicial (crates/ir, crates/compiler,
    crates/runtime, crates/cli) operativo con pipeline CI validado en Linux,
    Windows y macOS.
outcome_verifications:
  - criterion: >-
      Aislamiento y política de solo lectura de _reference/ establecida en
      .gitignore y documentación técnica.
    status: passed
    evidence: >-
      Regla /_reference/ verificada mediante git check-ignore; git ls-files
      confirma que no hay archivos de _reference/ versionados y cargo metadata
      confirma que la POC está excluida del workspace. Política documentada en
      reference-policy.md.
    reference: >-
      .gitignore, knowledge/tech/reference-policy.md,
      knowledge/tech/codebase.md, knowledge/tech/current-state.md
    method: automated
    verified_at: '2026-11-25'
    verified_by: Judlup
  - criterion: >-
      Matriz de extracción POC formalizada clasificando componentes a migrar,
      rediseñar o descartar.
    status: passed
    evidence: >-
      Inspección documental de knowledge/tech/extraction-matrix.md confirma
      matriz pieza-a-pieza de la POC (@26b6a18e) con 41 entradas clasificadas y
      totales reconciliados (23 migrate, 6 redesign, 12 drop), incluyendo
      destinos, pruebas, responsables y riesgos. Enlazada desde
      knowledge/tech/codebase.md (línea 70).
    reference: 'knowledge/tech/extraction-matrix.md, knowledge/tech/codebase.md'
    method: manual
    verified_at: '2026-11-25'
  - criterion: >-
      Materialización documental de los cinco ADRs fundacionales (ADR-001 a
      ADR-005) como propuestas arquitectónicas en estado de borrador (draft).
    status: passed
    evidence: >-
      Verificación de archivos y frontmatter confirma que ADR-001 a ADR-005
      existen en knowledge/tech/decisions/ con type: adr, status: draft y date:
      2026-10-17, y están indexados como materializados en
      knowledge/tech/discovery/decision-candidates.md. Esta evidencia acredita
      exclusivamente su materialización documental como borradores, no su
      aprobación formal.
    reference: >-
      knowledge/tech/decisions/ADR-001-arquitectura-inicial.md,
      knowledge/tech/decisions/ADR-002-runtime-independiente.md,
      knowledge/tech/decisions/ADR-003-semantic-ir-v05-baseline.md,
      knowledge/tech/decisions/ADR-004-seguridad-minima-transversal.md,
      knowledge/tech/decisions/ADR-005-modelo-memoria-canonical-abi.md,
      knowledge/tech/discovery/decision-candidates.md
    method: automated
    verified_at: '2026-11-25'
  - criterion: >-
      Aceptación formal humana (status: accepted) de las cinco decisiones
      arquitectónicas bloqueantes (ADR-001 a ADR-005).
    status: manual-review-required
    evidence: >-
      Inspección de frontmatter confirma que los cinco ADRs fundacionales
      (ADR-001 a ADR-005) permanecen en status: draft (0/5 en status: accepted).
      No existe aceptación formal humana registrada; criterio retenido en
      manual-review-required hasta decisión humana explícita.
    reference: >-
      knowledge/tech/decisions/ADR-001-arquitectura-inicial.md,
      knowledge/tech/decisions/ADR-002-runtime-independiente.md,
      knowledge/tech/decisions/ADR-003-semantic-ir-v05-baseline.md,
      knowledge/tech/decisions/ADR-004-seguridad-minima-transversal.md,
      knowledge/tech/decisions/ADR-005-modelo-memoria-canonical-abi.md
    method: manual
    verified_at: '2026-11-25'
  - criterion: >-
      Workspace Cargo multimodular inicial (crates/ir, crates/compiler,
      crates/runtime, crates/cli) operativo con pipeline CI validado en Linux,
      Windows y macOS.
    status: passed
    evidence: >-
      cargo metadata --no-deps verifica los 4 paquetes miembros del workspace
      (wasma-ir, wasma-compiler, wasma-runtime, wasma-cli) sin referencias a
      _reference/; rust-toolchain.toml fija Rust 1.85.0 (rustfmt, clippy); cargo
      tree -p wasma-runtime confirma 0 dependencias hacia wasma-compiler
      (ADR-002). Pipeline .github/workflows/ci.yml validado en verde en
      ubuntu-latest, windows-latest y macos-latest (GitHub Actions Run
      44127404785, 7/7 jobs en success).
    reference: >-
      Cargo.toml, rust-toolchain.toml, crates/ir/Cargo.toml,
      crates/compiler/Cargo.toml, crates/runtime/Cargo.toml,
      crates/cli/Cargo.toml, .github/workflows/ci.yml,
      https://github.com/Kaddo-kdd/wasma/actions/runs/44127404785
    method: automated
    verified_at: '2026-11-25'
---

# EP-001: Foundation, Architecture Baseline & POC Governance

Fase fundacional y de gobernanza técnica que convierte el repositorio vacío en una base de desarrollo verificable, aislando el código de referencia de la POC, materializando los acuerdos arquitectónicos bloqueantes en estado de borrador para revisión humana y levantando la infraestructura inicial de compilación y CI multiplataforma.
