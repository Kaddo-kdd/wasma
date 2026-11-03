# Plantilla de Informe Consolidado — Validación con Desarrolladores Externos y Reporte de Fricciones (AN-075)

> **Ubicación final del informe generado:** `knowledge/delivery/reports/an-075-pilot-friction-report.md`
> [!NOTE]
> **Estructura de Plantilla Documental:** Los campos con corchetes y tablas a continuación constituyen la estructura estandarizada que se completará tras la ejecución de las sesiones reales. Cero datos simulados se registrarán como evidencia definitiva.

---

## 1. Resumen Ejecutivo
- **Objetivo**: Validación empírica de descubrimiento, instalación, verificación y uso de Wasma v0.1.0 con desarrolladores externos ajenos a la plataforma.
- **Participantes evaluados**: $N = \text{X}$ desarrolladores (Perfil A: X, Perfil B: X).
- **Resultados clave**:
  - Tasa global de autonomía en Quickstart: `__ %` ($N_{\text{autónomos}} / N_{\text{total\_intentados}}$).
  - Tiempo mediano de Quickstart ($T_{qs}$): `__ min __ s` (calculado sobre $N_{\text{qs\_completados}}$).
  - Tasa de verificación de integridad SHA-256: `__ %` ($N_{\text{sha\_ok}} / N_{\text{descargas}}$).
  - Cero bloqueos de identidad entre Wasma y Agent Native confirmados.
- **Dictamen hacia AN-076**: [ ] GO | [ ] GO con Condiciones | [ ] NO-GO.

---

## 2. Demografía y Entornos Evaluados (Anonimizados)

| ID | Perfil Asignado | Sistema Operativo | Arquitectura | Shell | Experiencia WASM | Experiencia Rust |
| :-: | :---: | :---: | :---: | :---: | :---: | :---: |
| `DEV-01` | [CLI / Backend] | | | | | |
| `DEV-02` | [CLI / Backend] | | | | | |
| ... | ... | ... | ... | ... | ... | ... |

---

## 3. Resultados Cuantitativos y Tiempos Segregados

### A. Desglose de Participantes por Tarea
- **Quickstart ($T_{qs}$):** Elegibles: `__` | Completados: `__` | Excluidos: `__` (Fallidos / Abandonados)
- **Descubrimiento ($T_{disc}$):** Elegibles: `__` | Completados: `__` | Excluidos: `__`
- **Descarga y SHA ($T_{verif}$):** Elegibles: `__` | Completados: `__` | Excluidos: `__`
- **Instalación y PATH ($T_{prep}$):** Elegibles: `__` | Completados: `__` | Excluidos: `__`
- **Especializada Track A (Reglas):** Elegibles: `__` | Completados: `__` | Excluidos: `__`
- **Especializada Track B (Host):** Elegibles: `__` | Completados: `__` | Excluidos: `__`

### B. Distribución Temporal (Minutos y Segundos)

| ID | $T_{disc}$ | $T_{verif}$ | $T_{prep}$ | $T_{qs}$ (Neto) | $T_{spec}$ | $T_{total}$ |
| :-: | :---: | :---: | :---: | :---: | :---: | :---: |
| `DEV-01` | | | | | | |
| `DEV-02` | | | | | | |
| ... | | | | | | |
| **Mediana ($p50$)** | `__ min` | `__ min` | `__ min` | `__ min` | `__ min` | `__ min` |
| **Rango (Mín - Máx)** | `_ - _` | `_ - _` | `_ - _` | `_ - _` | `_ - _` | `_ - _` |

### C. Tasas de Éxito con Denominadores Explícitos
- **Autonomía en Quickstart**: `__ / __` (`__ %`)
- **Verificación exitosa de SHA-256**: `__ / __` (`__ %`)
- **Autonomía en Reglas comerciales (Track A)**: `__ / __` (`__ %`)
- **Comprensión del host embebido (Track B)**: `__ / __` (`__ %`)
- **Tasa de tareas abandonadas**: `__ / __` (`__ %`)
- **Total de Intervenciones requeridas**: `__` intervenciones (Aclaraciones: `__`, Rescates críticos: `__`).

---

## 4. Matriz Completa de Fricciones Registradas

| ID | Severidad | Tarea / Componente | Descripción de la Fricción | Evidencia Observable | Causa Raíz | Mitigación Propuesta | Asignación / Hito |
| :-: | :-: | :--- | :--- | :--- | :--- | :--- | :--- |
| **F-01** | `P0` | | | | | | AN-076 (Bloqueante) |
| **F-02** | `P1` | | | | | | AN-076 (Recomendada) |
| **F-03** | `P2` | | | | | | Backlog post-v0.1.0 |
| **F-04** | `P3` | | | | | | Backlog post-v0.1.0 |

---

## 5. Análisis Cualitativo y Percepción de Marca
- **Comprensión del valor de Wasma**: Síntesis de opiniones sobre determinismo, sandboxing y simplicidad de la CLI.
- **Transición Agent Native → Wasma**: Análisis cualitativo sobre si persisten dudas o si el nombre Wasma resultó natural.
- **Puntuaciones del cuestionario posterior (Medianas sobre escala 1 a 5)**:
  - Facilidad de descubrimiento y descarga: `__ / 5`
  - Verificación SHA-256: `__ / 5`
  - Quickstart: `__ / 5`
  - Claridad de la documentación: `__ / 5`
  - Comprensión de límites de ejecución y host (Track B): `__ / 5`
  - Percepción global del producto: `__ / 5`

---

## 6. Recomendaciones Priorizadas para la Release Oficial v0.1.0 (AN-076)
1. **Acciones correctivas inmediatas (previas al corte de release)**:
   - ...
2. **Mejoras documentales y de onboarding**:
   - ...
3. **Iniciativas técnicas para el backlog post-v0.1.0**:
   - ...

---

## 7. Dictamen Final y Condiciones de Gate
- **Recomendación para AN-076**: `[GO / GO con Condiciones / NO-GO]`
- **Condiciones explícitas verificadas**:
  - [ ] 0 defectos P0 pendientes en código, contratos o distribución.
  - [ ] Tasa de autonomía en Quickstart $\ge 80\%$.
  - [ ] Mediana de Quickstart $T_{qs} \le 5\text{ min}$.
  - [ ] Procedencia inmutable de binarios candidatos validada.
