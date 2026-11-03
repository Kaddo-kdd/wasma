# Instrucciones para Participantes — Perfil B: Desarrollador Backend / Sistemas (AN-075)

> [!NOTE]
> **Aviso de pre-release técnica:** Los paquetes y crates utilizados en esta sesión corresponden a candidatos técnicos para la evaluación de experiencia de desarrollador de la versión v0.1.0 de Wasma. No constituyen aún una release pública oficial.

---

## Objetivo de la sesión
Evaluar la comprensión de la arquitectura de ejecución, integración del runtime embebido (`wasma-runtime`), configuración de límites de recursos (fuel y memoria) y aislamiento estricto de fallos.

Por favor, comparte tu pantalla y expresa en voz alta tus pensamientos, dudas e impresiones mientras realizas las tareas.

---

## Tareas a realizar

### Tarea 1 (Común Obligatoria): Quickstart con la CLI Wasma
1. El facilitador te suministrará el paquete binario candidato de la CLI `wasma` correspondiente a tu plataforma mediante transferencia controlada (intervención logística pre-release).
2. Consulta la guía oficial en `https://wasma.org/docs/first-component/`.
3. Sigue los pasos descritos para compilar y ejecutar tu primer componente hasta obtener el resultado `42`.
*(Nota: Si decides omitir o abandonar esta tarea, o si se agota el tiempo asignado a este bloque, infórmalo al facilitador para registrar el estado observable correspondiente).*

### Tarea 2: Localización y Estructura del Host Embebido
1. Accede a la documentación del ejemplo del host embebido en `https://wasma.org/docs/examples/embedded-host/` o al código en `examples/embedded-host/`.
2. Revisa la estructura del proyecto, sus dependencias y cómo se vincula la aplicación host con el runtime de Wasma (`wasma-runtime`).

### Tarea 3: Compilación y Ejecución del Host Embebido
1. Abre el repositorio del proyecto en tu entorno de desarrollo local.
2. Siguiendo las instrucciones de la guía de documentación, compila y ejecuta la aplicación de integración host en tu terminal.
*(Nota metodológica: El facilitador medirá por separado el tiempo de descarga/compilación de dependencias de Cargo para aislar el rendimiento de red y CPU del tiempo de comprensión e integración técnica).*
3. Observa los escenarios ejecutados en la consola e identifica los diferentes tipos de ejecución y capturas de error que se presentan.

### Tarea 4: Análisis Conceptual y Explicación en Código
Examina el código fuente del demostrador (`examples/embedded-host/src/main.rs`) e identifica:
1. **Límites de Ejecución**: ¿Cómo configura el host las cuotas de combustible (fuel) y límites de memoria del componente? ¿Cómo reacciona ante un agotamiento o exceso de cuota?
2. **Políticas de Seguridad**: ¿Cómo maneja el host el intento de importar funciones del sistema no autorizadas?
3. **Aislamiento vs. Caché**: En tus propias palabras tras revisar la guía y el código, ¿cómo garantiza la arquitectura el aislamiento de memoria y fallos entre invocaciones independientes, y qué rol cumple el reinicio/desalojo de caché de módulos?

---

### Al terminar
Avísale al facilitador para completar un breve cuestionario de cierre de 3 minutos. ¡Muchas gracias por tu tiempo y feedback!
