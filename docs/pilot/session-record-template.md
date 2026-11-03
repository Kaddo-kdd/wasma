# Ficha de Registro de Sesión — Piloto Wasma (DEV-XX)

> [!IMPORTANT]
> **Confidencialidad y Privacidad:** No registre en este documento ningún dato personal identificable (nombres reales, correos electrónicos, empresas o rutas personales del sistema de archivos como `/Users/nombre/...`). Utilice únicamente el ID anónimo.

---

## 1. Metadatos de la Sesión
- **ID de Participante**: `DEV-XX` (identificador correlativo anónimo: DEV-01 a DEV-10)
- **Fecha y Hora**: `AAAA-MM-DD HH:MM`
- **Perfil Asignado**: [ ] Perfil A (CLI) | [ ] Perfil B (Backend)
- **Sistema Operativo**: [ ] Linux x86_64 | [ ] Windows x86_64 | [ ] macOS ARM64 | [ ] Otro
- **Shell Utilizado**: [ ] Bash | [ ] Zsh | [ ] PowerShell | [ ] CMD
- **Nivel de Experiencia**:
  - WebAssembly: [ ] Ninguno | [ ] Básico | [ ] Intermedio | [ ] Avanzado
  - Rust: [ ] Ninguno | [ ] Básico | [ ] Intermedio | [ ] Avanzado

---

## 2. Registro de Tareas y Tiempos Segregados

> **Criterio metodológico de inclusión para métricas de tiempo:**
> - *Participantes elegibles:* Aquellos asignados a la tarea correspondiente.
> - *Participantes incluidos en $T_{qs}$:* Aquellos que disponen del entorno preparado y completaron la tarea con estado `completed`.
> - *Participantes excluidos:* Tareas con estado `failed`, `partial` o `not-attempted` (se reportan por separado en la tasa de autonomía y abandono).

| Tarea | Métrica | Inicio (`HH:MM:SS`) | Fin (`HH:MM:SS`) | Duración Neta | Resultado de la Tarea |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Descubrimiento** | $T_{disc}$ | | | `__ min __ s` | [ ] `completed` [ ] `partial` [ ] `failed` [ ] `not-attempted` |
| **Descarga y SHA-256** | $T_{verif}$ | | | `__ min __ s` | [ ] `completed` [ ] `partial` [ ] `failed` [ ] `not-attempted` |
| **Instalación y PATH** | $T_{prep}$ | | | `__ min __ s` | [ ] `completed` [ ] `partial` [ ] `failed` [ ] `not-attempted` |
| **Quickstart (Común)** | $T_{qs}$ | | | `__ min __ s` | [ ] `completed` [ ] `partial` [ ] `failed` [ ] `not-attempted` |
| **Especializada (Track A/B)** | $T_{spec}$ | | | `__ min __ s` | [ ] `completed` [ ] `partial` [ ] `failed` [ ] `not-attempted` |
| **Sesión Completa** | $T_{total}$ | | | `__ min __ s` | [ ] `completed` [ ] `partial` [ ] `failed` [ ] `not-attempted` |

> *$T_{qs}$ se mide estrictamente desde el instante en que el participante inicia el paso 1 de `/docs/first-component/` (con la CLI instalada y funcional) hasta que obtiene en consola el resultado `42`. Incluye lectura, creación de archivos, ejecución y correcciones autónomas.*

---

## 3. Tareas Abandonadas o No Completadas
- ¿Hubo alguna tarea abandonada o fallida?: [ ] No | [ ] Sí
- Si la respuesta es sí, detallar:
  - **Tarea abandonada**:
  - **Minuto de abandono**: `MM:SS`
  - **Causa raíz del abandono**: [ ] Bloqueo técnico P0 | [ ] Frustración/confusión documental P1 | [ ] Tiempo límite excedido | [ ] Otra:

---

## 4. Registro y Tipología de Intervenciones del Facilitador
- **Autonomía Global en la Sesión**: [ ] Totalmente autónoma (0 intervenciones) | [ ] Parcialmente autónoma (con intervenciones menores) | [ ] No autónoma (intervención crítica requerida)
- **Total de Intervenciones**: `__`

| # | Minuto | Tarea / Paso | Tipo de Intervención | Causa Observable del Bloqueo | Acción Realizada por el Facilitador | Impacto en Autonomía |
| :-: | :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | `MM:SS` | | [ ] Aclaración [ ] Rescate [ ] Entorno/OS | | | [ ] Leve [ ] Crítico (penaliza AC) |
| 2 | `MM:SS` | | [ ] Aclaración [ ] Rescate [ ] Entorno/OS | | | [ ] Leve [ ] Crítico (penaliza AC) |

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
