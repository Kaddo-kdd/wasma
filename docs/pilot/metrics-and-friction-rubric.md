# Plantilla de Métricas y Rúbrica de Fricciones (AN-075)

## 1. Reglas de Cálculo y Denominadores Explícitos
Para asegurar rigor metodológico y transparencia:
- Ninguna tasa combinará participantes que no hayan recibido la misma tarea.
- Se reportarán medianas ($p50$) y rangos intercuartiles o mínimos/máximos en lugar de medias aritméticas para métricas de tiempo.
- Dado el tamaño de muestra cualitativo ($N = 5\text{ a }10$), los resultados se presentan como evidencia descriptiva de usabilidad, sin atribuirles significancia estadística inferencial.
- **Prohibición de datos ficticios:** Bajo ninguna circunstancia se registrarán valores simulados como evidencia real. Todo dato numérico en los reportes debe proceder exclusivamente de una sesión genuina con un participante externo.

### Criterio de Reporte para Métricas Temporales
Para cada métrica cronometrada ($T_{disc}, T_{verif}, T_{prep}, T_{qs}, T_{spec}$) el reporte debe desglosar obligatoriamente:
1. **Participantes elegibles ($N_{\text{elegibles}}$):** Total de desarrolladores a quienes se les asignó la tarea.
2. **Participantes completados ($N_{\text{completados}}$):** Participantes que alcanzaron el estado `completed` en la tarea.
3. **Participantes excluidos ($N_{\text{excluidos}}$):** Participantes con estado `failed`, `partial` o `not-attempted` (su tiempo no contamina el cálculo de la mediana y se contabilizan en la tasa de fallo/abandono).

$$\text{Mediana}(T) = \text{percentil 50 de los tiempos registrados para } N_{\text{completados}}$$

### Fórmulas de Métricas Cuantitativas

| Métrica | Definición / Fórmula | Denominador Explícito | Umbral de Éxito |
| :--- | :--- | :--- | :--- |
| **Tasa de Autonomía en Quickstart** | $\frac{N_{\text{qs\_autónomos}}}{N_{\text{qs\_intentados}}} \times 100$ | Total de participantes que iniciaron el Quickstart ($N_{\text{qs\_intentados}}$) | $\ge 80\%$ |
| **Tiempo Mediano de Quickstart ($T_{qs}$)** | $\text{Mediana}(T_{qs})$ sobre $N_{\text{qs\_completados}}$ | Participantes con entorno preparado que obtuvieron el resultado `42` | $\le 5\text{ minutos}$ ($300\text{ s}$) |
| **Tasa de Verificación SHA-256** | $\frac{N_{\text{sha\_verificado}}}{N_{\text{paquetes\_descargados}}} \times 100$ | Total de participantes que intentaron descargar y verificar el paquete | $\ge 90\%$ |
| **Tasa de Autonomía en Reglas (Track A)** | $\frac{N_{\text{reglas\_autónomos}}}{N_{\text{track\_A\_intentados}}} \times 100$ | Participantes asignados exclusivamente al Perfil A | $\ge 75\%$ |
| **Tasa de Comprensión Host (Track B)** | $\frac{N_{\text{host\_comprendido}}}{N_{\text{track\_B\_intentados}}} \times 100$ | Participantes asignados exclusivamente al Perfil B | $\ge 75\%$ |
| **Tasa de Tareas Abandonadas** | $\frac{N_{\text{tareas\_abandonadas}}}{N_{\text{tareas\_totales\_intentadas}}} \times 100$ | Suma total de tareas intentadas por todos los participantes | $\le 10\%$ |
| **Densidad de Fricciones Críticas** | $\sum P_0 / N_{\text{total\_participantes}}$ | Total general de participantes evaluados | $= 0\text{ (cero } P_0 \text{ no resueltos)}$ |

---

## 2. Rúbrica de Severidad de Fricciones
La severidad se asigna en función del impacto funcional sobre la autonomía del usuario, utilizando el tiempo únicamente como evidencia complementaria y no como determinante exclusivo:

### P0 — Bloqueante (Showstopper)
- **Definición**: Incidencia o defecto que interrumpe por completo el flujo de trabajo y hace imposible finalizar una tarea esencial sin asistencia externa del observador o sin modificar el código fuente del proyecto.
- **Impacto**: Requiere intervención de rescate para continuar o provoca el abandono definitivo de la tarea (`failed`).
- **Ejemplos**:
  - El comando `wasma` falla con un panic, crash o segfault en un sistema operativo soportado.
  - El hash SHA-256 del binario no coincide con `SHA256SUMS`.
  - El enlace de descarga del paquete candidato está caído o devuelve HTTP 404 / 403.
  - La suite `wasma test` o el build fallan debido a un error de tipado o versión en los contratos incluidos.

### P1 — Fricción Mayor (Major Friction)
- **Definición**: Dificultad severa que requiere intervención de aclaración del observador para evitar el abandono, causa una desviación sustancial del flujo esperado o desorienta profundamente al participante debido a documentación contradictoria, mensajes de error engañosos o requisitos implícitos no declarados.
- **Impacto**: La tarea se clasifica como `partial` o penaliza la tasa de autonomía si el facilitador debe destrabar al participante.
- **Ejemplos**:
  - La documentación omite explicar cómo agregar la CLI al `PATH` en Windows/macOS y el usuario no sabe cómo invocar el binario.
  - Mensaje de error de la CLI críptico o sin indicación de qué parámetro falta.
  - Confusión severa entre `agent-native` y `wasma` que lleva al usuario a buscar paquetes o comandos inexistentes.

### P2 — Fricción Menor (Minor Friction)
- **Definición**: Dificultad, duda momentánea o parámetro poco intuitivo que el participante logra resolver de manera autónoma en poco tiempo mediante ensayo y error o consultando la ayuda (`--help`).
- **Impacto**: Cero penalización en autonomía; la tarea se califica como `completed` de forma autónoma.
- **Ejemplos**:
  - Duda inicial sobre si la opción de fuel requiere número entero o notación especial.
  - El usuario intenta ejecutar `wasma run` sin compilar previamente, pero lee el mensaje de error y ejecuta `wasma build` por sí mismo.
  - Redacción ambigua en un párrafo del tutorial que obliga a releerlo dos veces.

### P3 — Sugerencia Ergonómica / Cosmética (Enhancement)
- **Definición**: Observación constructiva, mejora visual, ajuste de redacción o propuesta de atajo que facilitaría la ergonomía pero no interfiere con la ejecución exitosa de la tarea.
- **Impacto**: Registro en el reporte de mejoras para backlog; nulo impacto en la tasa de éxito.
- **Ejemplos**:
  - Sugerencia de colorear la salida del resumen de tests en `wasma test`.
  - Sugerencia de incluir un botón «Copiar comando» en los bloques de código del portal.
  - Propuesta de simplificar la salida de `--version` para incluir el commit SHA además de la versión semántica.
