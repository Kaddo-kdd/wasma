# Ficha de Registro de Sesión — Piloto Wasma (DEV-XX)

> [!IMPORTANT]
> **Confidencialidad y Privacidad (Zero-PII):** No registre en este documento ningún dato personal identificable (nombres reales, correos electrónicos, empresas o rutas personales del sistema de archivos como `/Users/nombre/...`). Utilice únicamente el identificador anónimo `DEV-XX`. La correspondencia con datos de contacto se conserva exclusivamente de forma privada y offline por el responsable humano del piloto fuera del repositorio Git.

---

## 1. Metadatos de la Sesión y Consentimiento
- **ID de Participante**: `DEV-XX` (identificador correlativo anónimo: DEV-01 a DEV-10)
- **Fecha y Hora**: `AAAA-MM-DD HH:MM`
- **Perfil Asignado**: [ ] Perfil A (CLI / SysOps) | [ ] Perfil B (Backend / Rust)
- **Sistema Operativo**: [ ] Linux x86_64 | [ ] Windows x86_64 | [ ] macOS ARM64 | [ ] Otro
- **Shell Utilizado**: [ ] Bash | [ ] Zsh | [ ] PowerShell | [ ] CMD
- **Nivel de Experiencia Declarado**:
  - WebAssembly: [ ] Ninguno | [ ] Básico | [ ] Intermedio | [ ] Avanzado
  - Rust: [ ] Ninguno | [ ] Básico | [ ] Intermedio | [ ] Avanzado

### Identificador de Baseline Experimental (Ronda 1)
- **Commit Portal y Documentación**: `5cb29f1290ed750b5686050d1a6d35880bf7c0f4`
- **Commit Binario Candidato**: `0ffa96346d92ace905b392b3147aff776da5fab9`
- **Run ID de Distribución CI**: `41271134318` (AN-070)
- **Hash SHA-256 Paquete Candidato Entregado**: `________________________________________________________________`
- **Versión de Instrumentos de Evaluación**: `AN-075-v1.0 (Ronda 1)`

### Consentimiento Informado (3 Capas Independientes)
- Finalidad declarada al participante: Análisis técnico interno de experiencia de usuario sobre la documentación y herramientas de Wasma. Cero divulgación de datos personales; datos procesados bajo anonimización estricta.
- [ ] **Capa 1: Participación voluntaria y métricas anónimas** (Obligatoria para participar)
- [ ] **Capa 2: Compartir pantalla durante la sesión remota** (Obligatoria para la observación remota)
- [ ] **Capa 3: Grabación audiovisual con fines de análisis técnico interno** (Opcional; si se declina, el participante interviene plenamente mediante toma de notas observacionales)

---

## 2. Registro de Tareas y Tiempos Segregados

> **Criterios metodológicos de cronometraje:**
> - *Agenda de referencia:* Los 45 minutos constituyen una referencia de coordinación temporal, **no un límite artificial** para truncar o declarar fallida una tarea al cumplirse 5 minutos de reloj.
> - *Participantes elegibles ($N_{elegible}$):* Aquellos asignados formalmente a la tarea correspondiente.
> - *Participantes incluidos en medias temporales ($N_{completado}$):* Aquellos que completaron la tarea con estado `completed`.
> - *Participantes no incluidos en medias temporales:* Tareas con estado `abandoned`, `omitted_time_limit` o `not-attempted` (se reportan obligatoriamente en el denominador de la tasa de autonomía y tasa de abandono).

| Tarea | Métrica | Inicio (`HH:MM:SS`) | Fin (`HH:MM:SS`) | Duración Neta | Estado Observable |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Descubrimiento de Docs** | $T_{disc}$ | | | `__ min __ s` | [ ] `completed` [ ] `abandoned` [ ] `omitted_time_limit` [ ] `not-attempted` |
| **Entrega Logística Candidato** | $T_{transfer}$ | | | `__ min __ s` | *Intervención logística programada pre-release (sin costo de autonomía)* |
| **Verificación Checksum SHA-256** | $T_{verif}$ | | | `__ min __ s` | [ ] `completed` [ ] `abandoned` [ ] `omitted_time_limit` [ ] `not-attempted` |
| **Preparación / PATH** | $T_{prep}$ | | | `__ min __ s` | [ ] `completed` [ ] `abandoned` [ ] `omitted_time_limit` [ ] `not-attempted` |
| **Quickstart (Común Obligatorio)** | $T_{qs}$ | | | `__ min __ s` | [ ] `completed` [ ] `abandoned` [ ] `omitted_time_limit` [ ] `not-attempted` |
| **Perfil A: Reglas (`suite.yaml`)**| $T_{rules}$ | | | `__ min __ s` | [ ] `completed` [ ] `abandoned` [ ] `omitted_time_limit` [ ] `not-attempted` |
| **Perfil B: Cargo Build (Red/CPU)**| $T_{cargo}$ | | | `__ min __ s` | [ ] `completed` [ ] `abandoned` [ ] `omitted_time_limit` [ ] `not-attempted` |
| **Perfil B: Integración Host** | $T_{integ}$ | | | `__ min __ s` | [ ] `completed` [ ] `abandoned` [ ] `omitted_time_limit` [ ] `not-attempted` |
| **Sesión Completa** | $T_{total}$ | | | `__ min __ s` | [ ] `completed` [ ] `abandoned` [ ] `omitted_time_limit` [ ] `not-attempted` |

> *$T_{qs}$ se mide estrictamente desde el instante en que el participante inicia el paso 1 de `/docs/first-component/` (con la CLI instalada y funcional) hasta que obtiene en consola el resultado `42`. Incluye lectura, creación de archivos, ejecución y correcciones autónomas.*

---

## 3. Tareas Abandonadas, Omitidas o No Completadas
- ¿Hubo alguna tarea abandonada u omitida?: [ ] No | [ ] Sí
- Si la respuesta es sí, detallar:
  - **Tarea**:
  - **Minuto de interrupción**: `MM:SS`
  - **Estado observable**: [ ] `abandoned` [ ] `omitted_time_limit` [ ] `failed`
  - **Causa raíz observable**: [ ] Bloqueo técnico P0 | [ ] Frustración/confusión documental P1 | [ ] Tiempo límite de sesión excedido | [ ] Otra:

---

## 4. Registro y Tipología de Intervenciones del Facilitador
- **Autonomía Global en la Sesión**: [ ] Totalmente autónoma (0 asistencias técnicas) | [ ] Asistida leve (1 asistencia técnica) | [ ] No autónoma (>1 asistencia técnica o rescate crítico)
- **Total de Asistencias Técnicas**: `__` *(Las entregas logísticas programadas no se contabilizan aquí).*

| # | Minuto | Tarea / Paso | Tipo de Intervención | Causa Observable del Bloqueo | Acción Realizada por el Facilitador | Impacto en Autonomía |
| :-: | :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | `MM:SS` | | [ ] Aclaración [ ] Rescate técnico [ ] Incidencia entorno | | | [ ] Menor [ ] Crítico (penaliza AC-03/04) |
| 2 | `MM:SS` | | [ ] Aclaración [ ] Rescate técnico [ ] Incidencia entorno | | | [ ] Menor [ ] Crítico (penaliza AC-03/04) |

---

## 5. Registro de Fricciones Identificadas

| ID | Minuto | Tarea | Severidad (P0-P3) | Evidencia Observable y Comportamiento del Participante | Cita Textual Relevante |
| :-: | :---: | :--- | :-: | :--- | :--- |
| F1 | `MM:SS` | | [ ] P0 [ ] P1 [ ] P2 [ ] P3 | | *«...»* |
| F2 | `MM:SS` | | [ ] P0 [ ] P1 [ ] P2 [ ] P3 | | *«...»* |
| F3 | `MM:SS` | | [ ] P0 [ ] P1 [ ] P2 [ ] P3 | | *«...»* |

---

## 6. Observaciones sobre la Transición Técnica (Agent Native → Wasma)
- ¿El participante comprendió el propósito y la propuesta de valor de Wasma?:
  [ ] Claramente comprensible [ ] Parcialmente comprensible [ ] Confuso
- ¿Detectó términos o referencias históricas a *Agent Native*?:
  [ ] No detectó referencias [ ] Las detectó pero no interfirieron [ ] Le generaron confusión o desvío
- **Notas y comentarios textuales del participante sobre la identidad/marca**:
  > *«...»*

---

## 7. Valoración Cualitativa Posterior (Cuestionario)
- Facilidad de descubrimiento y descarga: `__ / 5`
- Claridad del proceso de verificación SHA-256: `__ / 5`
- Facilidad y rapidez del Quickstart: `__ / 5`
- Claridad de la documentación y guías: `__ / 5`
- Comprensión de límites de recursos y aislamiento (si aplica): `__ / 5`
- Percepción global de solidez del producto: `__ / 5`
- **Comentario general del facilitador sobre la sesión**:
  > *«...»*
