# Marco de Decisión y Criterios de Transición GO / NO-GO hacia AN-076

El propósito fundamental de AN-075 no es únicamente recolectar observaciones, sino proporcionar una base empírica e inmutable para decidir si Wasma está listo para su primera release pública oficial v0.1.0 (AN-076).

---

## 1. Criterios de Evaluación y Umbrales
La recomendación formal de transición se estructurará bajo los siguientes umbrales:

| Criterio | Métrica / Condición | Umbral de Aprobación (GO) | Umbral de Rechazo (NO-GO) |
| :--- | :--- | :--- | :--- |
| **Autonomía Global** | Tasa de finalización autónoma en Quickstart | $\ge 80\%$ de los participantes | $< 60\%$ de los participantes |
| **Ergonomía Quickstart** | Mediana ($p50$) del tiempo neto $T_{qs}$ | $\le 5\text{ minutos}$ ($300\text{ s}$) | $> 8\text{ minutos}$ ($480\text{ s}$) |
| **Integridad de Suministro** | Verificación exitosa de hash SHA-256 | $\ge 90\%$ de los participantes | $< 70\%$ de los participantes |
| **Defectos Bloqueantes** | Fricciones de severidad P0 no resueltas | **Exactamente 0** defectos P0 | $\ge 1$ defecto P0 en runtime/CLI/ABI |
| **Claridad de Identidad** | Confusión de marca / binario (Agent Native vs Wasma) | Cero bloqueos derivados de nombres | Dudas que impidan encontrar o ejecutar la CLI |
| **Integración Host (Track B)** | Comprensión de límites de recursos y fallos | $\ge 75\%$ de respuestas acertadas | Desorientación sobre isolation vs cache |

---

## 2. Definición de Dictámenes

### Dictamen GO (Aprobado sin reservas)
- Se cumplen todos los umbrales de aprobación ($\ge 80\%$ autonomía, $T_{qs} \le 5\text{ min}$, 0 bloqueadores P0).
- Las fricciones detectadas se limitan a severidades P2 (menores) y P3 (sugerencias cosméticas) o P1 que ya han sido corregidas y validadas documentalmente.
- **Acción resultante**: Autorizar el cierre formal de AN-075 y proceder con la preparación de **AN-076 — Publicación oficial v0.1.0 y cierre de INI-009**.

### Dictamen GO CON CONDICIONES (Ready with Exceptions)
- Se alcanza la autonomía global y no existen fallos P0 en el binario ni en el runtime.
- Existen entre 1 y 3 fricciones P1 estrictamente documentales o de formato de mensajes de error de la CLI que pueden corregirse inmediatamente antes del corte final de la release.
- **Acción resultante**: Generar un plan de remediación acotado que se incorporará como prerrequisito explícito dentro del plan de handoff de AN-076.

### Dictamen NO-GO (Detención y Retrabajo)
- Se detecta al menos un fallo de severidad **P0** (p. ej. crash del runtime en una arquitectura soportada, vulnerabilidad en el sandbox, discrepancia entre el binario compilado y el catálogo SHA-256).
- La tasa de autonomía en el Quickstart cae por debajo del 60% o el tiempo mediano excede significativamente los 8 minutos.
- Se detecta una discrepancia conceptual o arquitectónica grave en la ABI o contratos WIT.
- **Acción resultante**: Suspender la publicación de AN-076. Abrir un Work Item de remediación técnica y repetir el piloto con nuevos participantes antes de autorizar la release.

---

## 3. Gobernanza del Dictamen
El dictamen final requiere:
1. Consolidación de todas las fichas de sesión anónimas (`DEV-01` a `DEV-10`).
2. Publicación del informe en `knowledge/delivery/reports/an-075-pilot-friction-report.md`.
3. Verificación de cumplimiento de los cinco Criterios de Aceptación mediante `kaddo_verify_work_item AN-075`.
4. Autorización humana explícita para formalizar la recomendación.
