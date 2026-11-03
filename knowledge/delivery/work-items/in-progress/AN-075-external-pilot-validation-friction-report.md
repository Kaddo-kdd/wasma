---
id: AN-075
type: spike
status: in-progress
created_at: 2026-10-26T00:00:00.000Z
ready_at: '2026-11-03'
title: Validación con desarrolladores externos y reporte de fricciones
knowledge_level: K3
suggested_knowledge_level: K3
scope_confidence: high
initiative: INI-009
source_roadmap_initiative: INIT-09-08
priority: P1
depends_on:
  - AN-073
  - AN-074
domains:
  - 'Developer Experience, Documentation & Branding'
code:
  - knowledge/delivery/work-items/**
  - docs/**
expected_value: >-
  Ejecutar una prueba piloto con 5 a 10 desarrolladores externos evaluando
  facilidad de descubrimiento, instalación, uso del comando definitivo Wasma y
  comprensión de la documentación sin asistencia.
project_state: ai-assisted
template_version: 1
---

# AN-075 — Validación con desarrolladores externos y reporte de fricciones

## Contexto y problema

La hipótesis central de INI-009 es que desarrolladores externos sin conocimiento previo de Wasma ni de su arquitectura interna puedan descubrir el producto, descargar e instalar un binario precompilado, verificar su integridad criptográfica, completar el Quickstart en menos de 5 minutos e interactuar con aplicaciones de referencia reales de forma completamente autónoma.

Tras completar la infraestructura de empaquetado (AN-070), el portal y onboarding (AN-073) y las aplicaciones de referencia (AN-074), es imprescindible someter la experiencia de desarrollador a una validación empírica y estructurada con usuarios reales antes de autorizar la release pública oficial v0.1.0 (AN-076). Esta prueba piloto revelará fricciones ergonómicas, ambigüedades en la documentación y posibles dudas respecto a la transición técnica de Agent Native a Wasma.

## Alcance

- Diseñar y preparar un protocolo formal de observación para un piloto con **5 a 10 desarrolladores externos** sin experiencia previa en Wasma.
- Estructurar **dos recorridos con tarea común de Quickstart** para disponer de una métrica base comparable:
  - **Tarea Común (ambos perfiles, cuando sea viable)**:
    - *Objetivo*: Medir la promesa ergonómica del Quickstart de 5 minutos ($T_{qs}$) en condiciones homogéneas.
    - *Alcance del cronómetro $T_{qs}$*: Se inicia en el instante en que el participante comienza el paso 1 de `/docs/first-component/` (con la CLI ya instalada y verificada en el shell) y concluye al obtener exitosamente el resultado `42`. Incluye lectura, creación de archivos (`identity.json`), copia de comandos, ejecución y corrección autónoma de errores.
    - *Medición segregada*: Se registran de manera independiente los tiempos de descubrimiento ($T_{disc}$), descarga y verificación de hash SHA-256 ($T_{verif}$), e instalación y configuración del entorno / PATH ($T_{prep}$).
  - **Perfil A — Usuario de la CLI (3 a 5 participantes)**:
    - *Objetivo*: Evaluar descubrimiento, instalación, verificación criptográfica, Quickstart y exploración del motor de reglas comerciales.
    - *Tareas especializadas*:
      1. Descubrir el producto en el portal `wasma.org` y repositorio canónico.
      2. Obtener el paquete candidato y verificar su hash SHA-256 contra `SHA256SUMS`.
      3. Instalar la CLI `wasma` y verificar la versión.
      4. Completar el tutorial de inicio rápido (`/docs/first-component/`) sin toolchains de Rust en el PATH.
      5. Modificar una entrada o valor de prueba y ejecutar la evaluación del componente `examples/business-rules/`.
  - **Perfil B — Desarrollador Backend / Sistemas (2 a 5 participantes)**:
    - *Objetivo*: Evaluar la comprensión del runtime embebido, límites de ejecución y políticas de seguridad.
    - *Tareas especializadas*:
      1. Completar la tarea común de Quickstart (opcional / cuando aplique para comparabilidad).
      2. Localizar la guía del host embebido (`/docs/examples/embedded-host/`).
      3. Compilar y ejecutar la aplicación host de referencia (`examples/embedded-host/`).
      4. Explicar e identificar en el código el funcionamiento de las cuotas deterministas de fuel y memoria (`ExecutionLimits`) y las políticas *deny-by-default* (`HostPolicy`).
      5. Comprender la distinción entre desalojo de caché (`Resolver::reset()`) y aislamiento estricto de fallos mediante Stores independientes.
- Observación pasiva estricta: los participantes realizan las tareas de forma autónoma. El observador no ofrece asistencia técnica activa; cualquier intervención requerida se registra minuciosamente y penaliza la tasa de autonomía.
- Diseñar el mecanismo de distribución de binarios candidatos asegurando que no se presenten como releases oficiales y preservando los gates de seguridad de AN-076.
- Recopilar, categorizar y priorizar todas las fricciones detectadas según una matriz de severidad formal, publicando un informe consolidado de hallazgos para orientar el cierre de AN-076 y el backlog posterior.

## Protocolo de medición e instrumentos

### 1. Instrumento de recolección de datos por sesión
Para cada participante se registrará una ficha estandarizada con los siguientes campos:
- **Identificador anónimo**: `DEV-01` a `DEV-10`.
- **Perfil asignado**: Perfil A (CLI) o Perfil B (Backend).
- **Entorno del participante**: Sistema operativo (Linux, Windows, macOS), arquitectura de CPU, shell predeterminado y nivel de familiaridad con WebAssembly / Rust.
- **Tiempos cronometrados segregados**:
  - *Tiempo de descubrimiento ($T_{disc}$)*: Desde la búsqueda inicial hasta localizar el paquete o repositorio.
  - *Tiempo de descarga y verificación ($T_{verif}$)*: Obtención del binario candidato y cotejo del hash SHA-256 contra `SHA256SUMS`.
  - *Tiempo de instalación y preparación ($T_{prep}$)*: Descompresión, adición al PATH y verificación de `wasma --version`.
  - *Tiempo de Quickstart ($T_{qs}$)*: Tiempo neto desde el primer comando de `/docs/first-component/` hasta la salida `42` (con binario funcional).
- **Tasa de autonomía**:
  - Finalización autónoma (Sí / Parcial / No).
  - Número y naturaleza de intervenciones requeridas del observador (con registro del incidente exacto y causa).
- **Puntos de fricción y bloqueos**: Registro cronológico de dudas, errores de sintaxis, mensajes confusos o desvíos conceptuales.
- **Percepción de identidad técnica**: Evaluación cualitativa sobre si persisten confusiones respecto a *Agent Native* o si el nombre *Wasma* y su propósito son claros.
- **Valoración cualitativa**: Facilidad percibida (1 a 5), aspectos más valorados y sugerencias directas de mejora.

### 2. Reglas de reporte y denominadores explícitos
- **Denominadores transparentes**: Cada métrica debe reportar su denominador exacto (p. ej. *Tasa de éxito en verificación de paquete: $N_{verif\_ok} / N_{total}$*; *Tasa de éxito en host embebido: $N_{host\_ok} / N_{perfil\_B}$*). No se combinarán participantes que no recibieron la misma tarea.
- **Medianas y valores individuales**: Se reportarán medianas y la distribución individual completa anonimizada; los resultados se presentan como evidencia cualitativa y empírica de usabilidad, sin atribuirles representatividad estadística poblacional dado el tamaño de muestra ($N=5\text{--}10$).

### 3. Rúbrica de severidad de fricciones
Las fricciones identificadas se clasificarán según criterios unívocos (utilizando el tiempo como evidencia complementaria, no como único factor determinante):
- **P0 — Bloqueante**: Falla o defecto crítico que impide al participante completar una tarea esencial sin asistencia externa del observador o sin modificación de código/configuración.
- **P1 — Fricción Mayor**: Dificultad severa que requiere intervención del observador, causa una desviación sustancial del flujo esperado o desorienta al desarrollador por mensajes contradictorios o documentación inexacta.
- **P2 — Fricción Menor**: Dificultad o duda recuperable de manera autónoma por el participante (mensaje poco intuitivo, parámetro confuso o fallo temporal corregido sin ayuda).
- **P3 — Sugerencia Ergonómica / Cosmética**: Propuesta de mejora estética, de redacción, atajos de CLI o formateo que no compromete la ejecución del flujo.

### 4. Criterios de éxito de la prueba piloto
Antes del inicio de las sesiones se establecen los siguientes umbrales de éxito:
1. **Tasa de finalización autónoma**: Al menos el 80% de los participantes deben completar su recorrido sin intervención crítica del observador.
2. **Promesa ergonómica del Quickstart**: La mediana ($p50$) del tiempo de Quickstart ($T_{qs}$) debe ser menor o igual a **5 minutos** entre quienes hayan preparado el entorno.
3. **Verificación de integridad**: Al menos el 90% de los participantes debe lograr verificar el hash SHA-256 de forma correcta.
4. **Coherencia de identidad técnica**: Cero participantes reportan bloqueos derivados de discrepancias entre `agent-native` y `wasma`.
5. **Informe de fricciones publicado**: Consolidación del 100% de hallazgos con clasificación de severidad y mitigaciones propuestas.

### 5. Protección y privacidad de los participantes
- Asignación estricta de identificadores anónimos (`DEV-01` .. `DEV-10`).
- Consentimiento informado previo para la toma de notas técnicas y eventual grabación de pantalla/audio de la sesión.
- Prohibición absoluta de registrar o versionar datos de carácter personal (nombres reales, correos, empresas, rutas de usuario del sistema operativo) en el repositorio o en los informes públicos de Kaddo.

## Distribución de paquetes candidatos

- **Procedencia inmutable**: Los binarios candidatos se obtienen exclusivamente de los artefactos compilados y empaquetados por los pipelines automatizados de GitHub Actions (Run ID `41271134318` o ejecuciones auditadas de `release-packaging`), cuyos hashes coinciden exactamente con el catálogo `SHA256SUMS`.
- **Canal de distribución**: Los archivos se entregarán mediante un canal seguro de pre-distribución técnica acompañado de su `SHA256SUMS` correspondiente, garantizando que el participante pueda descargarlos sin barreras de autenticación en GitHub ni vencimiento de artefactos (90 días).
- **Aviso de procedencia explícito**: Todo material distribuido contendrá la advertencia:
  > *«Binario candidato para validación de experiencia de desarrollador (pre-release técnica v0.1.0). No constituye una release pública oficial.»*
- **Preservación de controles**: No se habilitarán releases públicas en GitHub Releases, no se modificarán las condiciones de publicación (`publish: if: false`), no se crearán tags Git ni se aplicarán firmas Minisign oficiales durante esta fase, manteniéndose dichos mecanismos bajo la custodia estricta de AN-076.

## Criterios de aceptación

- AC-01: Se diseña el protocolo de prueba piloto con tareas concretas para los dos perfiles (CLI y Backend): localización del producto, verificación de integridad, instalación, Quickstart, ejecución de reglas comerciales y comprensión del host embebido.
- AC-02: Se reclutan entre 5 y 10 desarrolladores de perfiles diversos sin experiencia previa en Wasma ni en la arquitectura interna.
- AC-03: Se registran métricas observables y cuantitativas ($T_{disc}$, $T_{verif}$, $T_{prep}$, $T_{qs}$, tasa de autonomía e intervenciones) y evaluaciones cualitativas.
- AC-04: Se evalúa explícitamente si persisten confusiones derivadas del cambio de identidad técnica respecto a Agent Native.
- AC-05: Se publica un informe consolidado de hallazgos y fricciones clasificado por severidad (P0-P3) con propuestas de mejora priorizadas para la release v0.1.0 (AN-076) e iteraciones posteriores.

## Validación

- Revisión técnica y metodológica del protocolo de prueba, instrumentos de recolección y rúbrica de severidad.
- Comprobación previa de la disponibilidad e integridad de los paquetes candidatos para Linux x86_64, Windows x86_64 y macOS ARM64 mediante comprobación cruzada contra `SHA256SUMS`.
- Ejecución supervisada de las sesiones de prueba con participantes externos registrando métricas en fichas anónimas.
- Verificación de ausencia de datos personales (PII) en todos los documentos e informes generados.
- Verificación formal de Work Item con `kaddo_verify_work_item`.

## Entregable

- Protocolo de prueba piloto documentado con instrumentos de medición y rúbrica de severidad (`docs/pilot/`).
- Fichas anónimas de sesión (`DEV-01` a `DEV-10`).
- Informe consolidado de validación y fricciones (`knowledge/delivery/reports/an-075-pilot-friction-report.md`).
- Documento de Work Item verificado y actualizado en Kaddo.

## Fuera de alcance

- Soporte personalizado o consultoría individual durante la prueba.
- Modificación de los contratos de seguridad o publicación de releases oficiales (reservado a AN-076).
- Campañas públicas de marketing o convocatorias masivas abiertas.
