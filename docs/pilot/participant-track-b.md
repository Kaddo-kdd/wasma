# Instrucciones para Participantes — Perfil B: Desarrollador Backend / Sistemas (AN-075)

> [!NOTE]
> **Aviso de pre-release técnica:** Los paquetes y crates utilizados en esta sesión corresponden a candidatos técnicos para la evaluación de experiencia de desarrollador de la versión v0.1.0 de Wasma. No constituyen aún una release pública oficial.

---

## Objetivo de la sesión
Evaluar la comprensión de la arquitectura de ejecución, integración del runtime embebido (`wasma-runtime`), configuración de límites de recursos (fuel y memoria) y aislamiento estricto de fallos.

Por favor, comparte tu pantalla y expresa en voz alta tus pensamientos, dudas e impresiones mientras realizas las tareas.

---

## Tareas a realizar

### Tarea 1 (Común): Quickstart con la CLI (Opcional según disponibilidad de tiempo)
1. Localiza el binario de la CLI `wasma` precompilado o utilízalo si ya se encuentra en tu entorno.
2. Completa los pasos de la guía `https://wasma.org/docs/first-component/` hasta obtener el resultado `42`.

### Tarea 2: Localización y Estructura del Host Embebido
1. Accede a la documentación del ejemplo del host embebido en `https://wasma.org/docs/examples/embedded-host/` o al código en `examples/embedded-host/`.
2. Revisa la estructura del proyecto, sus dependencias y cómo se vincula la aplicación host con el runtime de Wasma.

### Tarea 3: Compilación y Ejecución del Demostrador
1. Abre el repositorio del proyecto en tu entorno de desarrollo.
2. Siguiendo las instrucciones de la guía de documentación, compila y ejecuta la aplicación de integración host en tu terminal.
3. Observa los escenarios ejecutados en la consola e identifica los diferentes tipos de ejecución y capturas de error que se presentan.

### Tarea 4: Análisis Conceptual y Explicación en Código
Examina el código fuente del demostrador (`examples/embedded-host/src/main.rs`) e identifica:
1. **Límites de Ejecución**: ¿Cómo configura el host las cuotas de combustible (fuel) y límites de memoria del componente? ¿Cómo reacciona ante un agotamiento o exceso de cuota?
2. **Políticas de Seguridad**: ¿Cómo maneja el host el intento de importar funciones del sistema no autorizadas?
3. **Aislamiento vs. Caché**: En tus propias palabras tras revisar la guía y el código, ¿cómo garantiza la arquitectura el aislamiento de memoria y fallos entre invocaciones independientes, y qué rol cumple el reinicio/desalojo de caché de módulos?

---

### Al terminar
Avísale al facilitador para completar un breve cuestionario de cierre de 3 minutos. ¡Muchas gracias por tu tiempo y feedback!
