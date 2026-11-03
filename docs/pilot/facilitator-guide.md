# Guía de Observación para el Facilitador — Piloto de Adopción Externa (AN-075)

## 1. Principios de Observación
El objetivo de la prueba piloto es evaluar la autonomía real y la fricción que experimentan desarrolladores externos ajenos a Wasma al descubrir, instalar, verificar y utilizar la plataforma. Para garantizar la validez de los datos:
1. **Observación pasiva estricta**: El facilitador actúa como observador silencioso. No debe guiar, corregir ni sugerir comandos.
2. **Respuesta ante preguntas del participante**:
   - Si el participante pregunta *«¿Qué comando debo poner ahora?»* o *«¿Esto está bien?»*, responder:
     > *«Por favor procede como lo harías normalmente si estuvieras evaluando una nueva herramienta por tu cuenta.»*
3. **Criterio de intervención de rescate**:
   - Solo se interviene si el participante queda completamente bloqueado por más de **5 minutos** en el mismo obstáculo o si manifiesta explícitamente su intención de abandonar la tarea.
   - Toda intervención debe registrarse inmediatamente en la ficha de sesión, especificando el motivo, la ayuda brindada y marcando la tarea como **no autónoma**.

---

## 2. Preparación Previa a la Sesión (Preflight)
Antes de conectar con el participante:
1. Asignar un identificador anónimo correlativo (`DEV-01` a `DEV-10`).
2. Confirmar el consentimiento informado del participante (grabación de pantalla/audio con fines exclusivos de análisis interno; cero publicación de datos personales).
3. Verificar que los enlaces a los paquetes candidatos y documentación estén activos y accesibles.
4. Asegurar que la herramienta de cronometraje y la ficha de registro estén listas.

---

## 3. Guion de Bienvenida y Encuadre (2 minutos)
> *«Hola, gracias por participar en esta sesión de evaluación técnica. Estamos probando una nueva plataforma WebAssembly llamada Wasma.*
> *Queremos evaluar la experiencia de desarrollador, la claridad de la documentación y la facilidad de uso.*
> *Te pedimos que compartas tu pantalla y pienses en voz alta mientras avanzas.*
> *Ten en cuenta que te estamos evaluando a la herramienta y a su documentación, no a ti. Cualquier duda, tropiezo o confusión es un hallazgo valioso para nosotros.*
> *Yo estaré en silencio observando y tomando notas para no interferir en tu flujo natural. ¿Tienes alguna pregunta antes de comenzar?»*

---

## 4. Conducción de la Sesión

### A. Tarea Común: Quickstart
- Indicar al participante que comience con las instrucciones asignadas (Track A o Track B).
- **Iniciar cronómetro $T_{disc}$**: desde que abre el navegador buscando el portal/repositorio.
- **Iniciar cronómetro $T_{verif}$**: desde que inicia la descarga hasta que valida el checksum SHA-256.
- **Iniciar cronómetro $T_{prep}$**: desde la descompresión hasta que ejecuta `wasma --version`.
- **Iniciar cronómetro $T_{qs}$**: en el instante en que abre `/docs/first-component/` y comienza el paso 1.
- **Detener $T_{qs}$**: en el instante en que el comando `wasma run` devuelve `42`.

### B. Tareas Especializadas
- Para **Perfil A**: cronometrar y observar la ejecución del motor de reglas (`examples/business-rules/`) y su modificación.
- Para **Perfil B**: cronometrar y observar la navegación, compilación y explicación del host embebido (`examples/embedded-host/`).

---

## 5. Cierre y Debriefing (5 minutos)
Al finalizar las tareas prácticas:
1. Enviar el enlace al formulario breve de evaluación posterior (`docs/pilot/post-session-survey.md`).
2. Formular verbalmente las preguntas cualitativas clave:
   - *«¿El nombre Wasma y su propósito te resultaron claros desde el inicio?»*
   - *«¿Notaste alguna referencia o inconsistencia respecto a nombres anteriores como Agent Native?»*
   - *«¿Cuál fue el momento de mayor fricción durante la sesión?»*
3. Agradecer la participación y cerrar la grabación.
