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
  - "Toolchain independiente: un desarrollador puede instalar la CLI, descargar un componente y ejecutarlo sin Rust ni LLM."
  - Pipeline de empaquetado, firma Minisign y distribución multiplataforma (Linux x86_64, Windows x86_64, macOS ARM64).
  - Portal público Starlight con documentación técnica exhaustiva y validación empírica con desarrolladores externos completada.
milestones:
  - id: M1
    title: Foundation, Architecture Baseline & POC Governance
    exit_criteria:
      - Aislamiento y política de solo lectura de _reference/ establecida en .gitignore y documentación técnica.
      - Matriz de extracción POC formalizada clasificando componentes a migrar, rediseñar o descartar.
      - Materialización documental de los cinco ADRs fundacionales (ADR-001 a ADR-005) como propuestas arquitectónicas en estado de borrador (draft).
      - "Aceptación formal humana (status: accepted) de las cinco decisiones arquitectónicas bloqueantes (ADR-001 a ADR-005)."
      - Workspace Cargo multimodular inicial (crates/ir, crates/compiler, crates/runtime, crates/cli) operativo con pipeline CI validado en Linux, Windows y macOS.
  - id: M2
    title: Autonomous Semantic IR & Component Compiler
    exit_criteria:
      - Modelo de datos Semantic IR v0.5 y verificador determinista con diagnósticos localizados en crates/ir (wasma-ir).
      - Suite de regresión histórica de la POC (8 tests originales de irtool) reproducida satisfactoriamente.
      - Compilador determinista crates/compiler (wasma-compiler, IR → WASM Component) con cálculo canónico de SHA-256.
      - Convención normativa de contratos WIT estructurada (public, internal, fixtures) sin acoplamiento a contratos implícitos.
      - Fundamentación técnica del modelo de memoria lineal y ciclo de vida bajo Canonical ABI respaldada por la materialización de ADR-005 (con aceptación formal pendiente).
  - id: M3
    title: Autonomous Runtime Engine & Acceptance Regression
    exit_criteria:
      - Motor de ejecución crates/runtime (wasma-runtime) autónomo, sin dependencias de compilador ni LLM (auditado por lint CI de ADR-002).
      - Propagación de errores tipados fail-explicit (RuntimeError) y controles deny-by-default pre-instantiate a tres niveles verificados.
      - Línea base técnica de latencia inicial (cold start, warm invocation, cache-hit) publicada en documentación técnica.
      - Resolver de componentes content-addressed con capacidad de limpieza de caché (reset()) implementado.
      - Executor de aceptación YAML operativo y cierre técnico de M3 alcanzado bajo la matriz de equivalencia POC (0 exactas, 6 parciales, 4 aplazadas).
  - id: M4
    title: Specification Ingestion, Agent Pipeline & Atomic Publication
    exit_criteria:
      - Intérprete de narrativa estructurada Markdown a modelo canónico SystemSpec operativo en la capa de orquestación (crates/cli/src/spec/).
      - Adaptador LLM modular con verificación offline demostrada (proveedores fixtures y synthesizer en CI) y presencia de HttpLlmProvider como stub determinista sin conectividad de red activa en M4 (Decisión D1 de M4).
      - Evolución incremental de especificaciones demostrada mediante reconciliador de SystemSpec y cálculo de SpecDiff (caso esclusas v1→v2).
      - Publicación atómica de componentes en almacenamiento versionado local con puntero activo (active.json) y rollback verificado ante fallos.
      - Trazabilidad determinista de procedencia incorporada en manifiestos (source_wi, source_spec_hash, source_git_commit).
  - id: M5
    title: Standalone CLI & Embedded Runtime SDK Distribution
    exit_criteria:
      - Binario CLI unificado (wasma) con soporte de subcomandos build, verify, test, run y publish bajo formatos human y json.
      - API pública del SDK de runtime estabilizada (Engine, Component, Val, HostPolicy) y demostrada mediante ejemplo canónico de embebido (crates/runtime/examples/embed_runtime.rs).
      - Estrategia de empaquetado, firma Minisign y verificación criptográfica formalizada en ADR-006 (en estado accepted).
      - Pipeline automatizado de release en GitHub Actions (.github/workflows/release.yml) operativo para Linux x86_64, Windows x86_64 y macOS aarch64.
  - id: M6
    title: Deep Runtime Security, Resource Limits & Integrity Verification
    exit_criteria:
      - Policy loader manifest-driven con control deny-by-default y validación estricta de capabilities al cargar componentes.
      - Contención determinista de CPU vía fuel accounting con recuperación limpia de traps en Linux, macOS y Windows MSVC (Wasmtime 29.0.1).
      - Límites de memoria lineal y tablas gobernados mediante ResourceLimiter con tests de agotamiento y contención de blast radius.
      - Invariante de aislamiento multi-tenant garantizada mediante ciclo de vida de Store e instancias limpias por invocación (sin reutilización cruzada).
      - Subcomando wasma run --verify con validación de hash SHA-256 y verificación de firma Minisign en tiempo de carga.
      - Fixtures de bajo nivel de estrés extremo (recursión profunda, allocación masiva y trampas) superados sin caídas de proceso.
  - id: M7
    title: Console I/O, Authorized WASI & IR v0.6 String Extensions
    exit_criteria:
      - Adaptador WASI Preview 2 (wasi:cli/stdio) determinista en memoria con autorización granular bajo principio Requested ∩ Granted.
      - Extensión experimental de Semantic IR a v0.6 incorporando tipos string y result<T, E> bajo flag --experimental sin romper v0.5.
      - Executor YAML enriquecido con stubs deterministas de consola (stdin, stdout, stderr) y soporte de tipos v0.6.
      - Soporte de componentes y binarios reales compilados a wasm32-wasip2 bajo política deny-by-default.
  - id: M8
    title: Cross-OS Performance Benchmarking & Bounded Concurrency
    exit_criteria:
      - Harness de benchmarks formal basado en Criterion con soporte multiplataforma y generación reproducible de artefactos en CI.
      - Línea base pública de rendimiento cross-OS con distribuciones de latencia p50/p95/p99 publicada en docs/benchmarks/ para tres sistemas operativos.
      - Evaluación técnica experimental de warm pool concluida con decisión formal y justificada de no-adopción para preservar el aislamiento de Store.
      - Concurrencia host-side mediante workers acotados de instancia fresca con control de backpressure, gestión de fallos y pruebas de saturación.
  - id: M9
    title: Public Release, Technical Identity & Developer Adoption
    exit_criteria:
      - Unificación formal de la identidad técnica Wasma en crates, binario, repositorio y documentación respaldada por ADR-008 (en estado accepted).
      - Portal público de documentación Starlight desplegado con identidad de autor, procedencia de commit en el footer y guías de onboarding.
      - Pipeline de publicación, empaquetado multiplataforma y firma criptográfica Minisign validado en prerelease.
      - Piloto de validación empírica con desarrolladores externos (AN-075) concluido con reporte de fricciones cerrado y veredicto favorable.
      - Publicación oficial v0.1.0 y cierre formal de la iniciativa de release (AN-076) formalizado tras veredicto favorable.
---

# Wasma Production Runtime & Release Delivery

Plan maestro de entrega para la ingeniería y lanzamiento de Wasma.
Estructura la totalidad del trabajo realizado y pendiente a lo largo de 9 milestones
alineados con el roadmap técnico del proyecto y la iniciativa de experiencia de desarrollador.
