# Guía de Observación para el Facilitador — Piloto de Adopción Externa (AN-075)

## 1. Principios de Observación
El objetivo de la prueba piloto es evaluar la autonomía real y la fricción que experimentan desarrolladores externos ajenos a Wasma al descubrir, instalar, verificar y utilizar la plataforma. Para garantizar la validez de los datos:
1. **Observación pasiva estricta**: El facilitador actúa como observador silencioso. No debe guiar, corregir ni sugerir comandos o sintaxis.
2. **Distinción entre intervención logística e intervención técnica**:
   - **Intervención Logística Programada (Protocolo)**: Dado que Wasma v0.1.0 es una pre-release técnica y no cuenta aún con descargas públicas en GitHub Releases o gestores de paquetes, el facilitador entrega el enlace directo al archivo comprimido del binario candidato precompilado mediante un canal seguro predefinido. Esta acción es puramente organizativa y **no penaliza la métrica de autonomía técnica**.
   - **Asistencia Técnica de Rescate (Fricción)**: Si el participante queda completamente bloqueado por más de **5 minutos** en el mismo obstáculo o solicita ayuda explícita tras intentar resolverlo, el facilitador puede proporcionar la mínima indicación necesaria para desatascar. Toda asistencia técnica debe registrarse inmediatamente en la ficha de sesión, clasificarse según la severidad (P0-P3) y computar la tarea correspondiente como **no autónoma**.
3. **Respuesta ante preguntas del participante**:
   - Si el participante pregunta *«¿Qué comando debo poner ahora?»* o *«¿Esto está bien?»*, responder de forma neutral:
     > *«Por favor procede como lo harías normalmente si estuvieras evaluando una nueva herramienta por tu cuenta.»*
4. **Comportamiento ante avisos de seguridad del sistema operativo (Gatekeeper / SmartScreen)**:
   - El facilitador **no debe sugerir de antemano eludir, desactivar o modificar atributos de cuarentena** (por ejemplo, nunca indicar proactivamente `xattr -d com.apple.quarantine`).
   - Se debe observar de manera natural cómo reacciona el participante ante los diálogos de seguridad y si la documentación oficial le proporciona orientación comprensible para continuar.

---

## 2. Preparación Previa a la Sesión (Preflight y Privacidad)
Antes de conectar con el participante:
1. **Identificador Seudónimo**: Asignar un identificador correlativo (`DEV-01` a `DEV-10`). La tabla de mapeo entre identidades reales, correos y contactos personales la gestiona de forma confidencial y offline el responsable humano del piloto; **nunca se almacena PII en Git ni en artefactos del repositorio**.
2. **Consentimiento Informado en Tres Capas Independientes**:
   Verificar y registrar expresamente tres permisos por separado:
   - **Capa 1 (Obligatoria)**: Consentimiento para participar en la prueba y registrar métricas cuantitativas anónimas.
   - **Capa 2 (Obligatoria para la sesión remota)**: Consentimiento para compartir pantalla durante la ejecución de las tareas.
   - **Capa 3 (Opcional)**: Consentimiento para grabación audiovisual con fines exclusivos de análisis interno del equipo de desarrollo. Si el participante rechaza la grabación, **puede participar igualmente**: la sesión se conduce mediante toma de notas observacionales detalladas.
3. **Comprobación de Artefactos**: Confirmar que los paquetes candidatos precompilados de CI (Run 41271134318, commit `0ffa963`), sus sumas SHA-256 (`SHA256SUMS`) y el portal de documentación estén listos y verificados.
4. **Herramientas**: Disponer de cronómetro con capacidad de tiempos fraccionados y de la plantilla de registro de sesión individual (`docs/pilot/session-record-template.md`).

---

## 3. Guion de Bienvenida y Encuadre (2 minutos)
> *«Hola, muchas gracias por participar en esta sesión de evaluación técnica. Estamos probando Wasma, una plataforma para compilar y ejecutar componentes WebAssembly.*
> *Queremos evaluar la experiencia de desarrollador, la claridad de la documentación y la facilidad de adopción.*
> *Te pedimos que compartas tu pantalla y expreses en voz alta tus pensamientos, dudas e impresiones mientras realizas las tareas.*
> *Ten la certeza de que estamos evaluando la herramienta y su documentación, no tus habilidades. Cualquier duda, tropiezo o error en los comandos es un hallazgo sumamente valioso para nosotros.*
> *Como Wasma se encuentra en fase previa al lanzamiento oficial v0.1.0, el acceso al paquete precompilado te lo suministraré yo directamente cuando inicies esa tarea.*
> *Yo permaneceré en silencio observando y registrando notas para no alterar tu ritmo natural de trabajo. ¿Tienes alguna duda antes de comenzar?»*

---

## 4. Conducción de la Sesión y Cronometraje

> [!NOTE]
> **Flexibilidad de la Agenda vs. Cronometraje Riguroso:** La agenda prevista de 45 minutos es una referencia organizativa de coordinación, **no un límite artificial** para declarar fallida una tarea al cumplirse exactamente 5 minutos de reloj. El observador debe permitir que el participante continúe a su ritmo natural, registrando los tiempos netos reales, las tareas incompletas, los abandonos genuinos y cualquier asistencia técnica requerida.

### A. Tarea Común: Quickstart (Track A y Track B)
- Indicar al participante que inicie con las instrucciones asignadas.
- **Cronómetro $T_{disc}$ (Descubrimiento de documentación)**: desde que abre el navegador buscando el portal/repositorio hasta localizar la guía de instalación y primeros pasos.
- **Cronómetro $T_{transfer}$ (Entrega Logística Programada)**: medición del tiempo de traspaso directo del paquete precompilado y su catálogo `SHA256SUMS` a través del canal privado predefinido. Esta acción es puramente organizativa y **no se contabiliza como asistencia técnica ni afecta la autonomía**.
- **Cronómetro $T_{verif}$ (Verificación de integridad)**: medido de forma separada a $T_{transfer}$, desde que el participante dispone del paquete y las instrucciones hasta que calcula y valida el hash SHA-256 contra `SHA256SUMS`.
- **Cronómetro $T_{prep}$ (Preparación y desempaquetado)**: desde la descompresión y colocación en el PATH hasta que ejecuta exitosamente `wasma --version`.
- **Cronómetro $T_{qs}$ (Tiempo a Primer Componente Exitoso)**:
  - **Inicio**: en el instante en que abre `/docs/first-component/` y comienza a leer el paso 1 para crear el archivo `identity.json`.
  - **Fin**: en el instante en que el comando `wasma run --component identity.wasm --function identity 42` imprime `42`.
  - **Resultado Observable**: Registrar como `completed`, `abandoned` o `omitted_time_limit`.

### B. Tareas Especializadas
- **Para Perfil A (CLI / SysOps)**:
  - Cronometrar y observar la navegación al ejemplo de reglas comerciales (`https://wasma.org/docs/examples/business-rules/` o `examples/business-rules/`).
  - Observar la ejecución de la suite de pruebas automatizadas (`examples/business-rules/suite.yaml`) mediante `wasma test`.
  - Observar la modificación autónoma de una regla de negocio y su re-evaluación.
- **Para Perfil B (Rust / Backend / Host Embebido)**:
  - Registrar por separado el tiempo de resolución y compilación de dependencias de Cargo ($T_{cargo}$) para aislar los factores de red y hardware.
  - Cronometrar el tiempo cognitivo de comprensión e integración host ($T_{integ}$).
  - Evaluar la explicación conceptual en código sobre cuotas de combustible (fuel), límites de memoria y aislamiento estricto de componentes.

---

## 5. Cierre y Debriefing (5 minutos)
Al finalizar las tareas prácticas:
1. Enviar el enlace al formulario breve de evaluación posterior (`docs/pilot/post-session-survey.md`).
2. Formular verbalmente las preguntas cualitativas clave:
   - *«¿El propósito de Wasma y el concepto de componente WebAssembly te resultaron claros desde el inicio?»*
   - *«¿Notaste alguna referencia rota, enlace confuso o inconsistencia de nombres?»*
   - *«¿Cuál fue el momento de mayor fricción o confusión durante la sesión?»*
3. Agradecer la valiosa colaboración del participante y dar por terminada la llamada/grabación.
