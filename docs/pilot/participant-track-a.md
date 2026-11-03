# Instrucciones para Participantes — Perfil A: Usuario de CLI (AN-075)

> [!NOTE]
> **Aviso de pre-release técnica:** Los paquetes utilizados en esta sesión corresponden a candidatos técnicos para la evaluación de experiencia de desarrollador de la versión v0.1.0 de Wasma. No constituyen aún una release pública oficial.

---

## Objetivo de la sesión
Evaluar la facilidad para descubrir, instalar, verificar y usar la herramienta de línea de comandos `wasma` para compilar y ejecutar componentes WebAssembly de forma autónoma.

Por favor, comparte tu pantalla y expresa en voz alta tus pensamientos, dudas e impresiones mientras realizas las tareas.

---

## Tareas a realizar

### Tarea 1: Descubrimiento y Verificación del Paquete Candidato
1. Accede al portal oficial de Wasma (`https://wasma.org/`) o al repositorio del proyecto (`https://github.com/Kaddo-kdd/wasma`).
2. Localiza la sección de instalación y obtén el paquete candidato precompilado correspondiente a tu sistema operativo (Linux, Windows o macOS) junto con el archivo de sumas criptográficas `SHA256SUMS`.
3. Sigue el procedimiento de verificación de integridad para comprobar que la suma criptográfica del archivo descargado coincide con la indicada en el catálogo.

### Tarea 2: Instalación de la CLI
1. Descomprime el paquete en tu entorno.
2. Configura tu entorno para poder invocar la herramienta directamente desde tu terminal en cualquier ubicación.
3. Comprueba que la herramienta responde correctamente en tu terminal e inspecciona los comandos disponibles.

### Tarea 3: Tutorial de Inicio Rápido (Quickstart)
1. Navega a la guía de inicio rápido en el portal: `https://wasma.org/docs/first-component/`.
2. Sigue las instrucciones de la guía para crear la especificación de tu primer componente, verificarla, compilarla y ejecutarla pasando el valor de prueba indicado en el tutorial.
3. Confirma en tu terminal que obtienes el resultado esperado.

### Tarea 4: Exploración del Motor de Reglas Comerciales
1. Localiza en la documentación o en el repositorio la guía y el código de la aplicación de referencia del motor de reglas comerciales (`examples/business-rules/`).
2. Siguiendo las instrucciones de la guía, ejecuta la suite de pruebas automatizadas incluida para este componente.
3. Modifica una entrada o caso de prueba (por ejemplo, alterando un monto de orden o categoría de cliente) y vuelve a evaluar las reglas, observando el resultado en consola.

---

### Al terminar
Avísale al facilitador para completar un breve cuestionario de cierre de 3 minutos. ¡Muchas gracias por tu tiempo y feedback!
