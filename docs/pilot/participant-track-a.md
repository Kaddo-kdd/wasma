# Instrucciones para Participantes — Perfil A: Usuario de CLI (AN-075)

> [!NOTE]
> **Aviso de pre-release técnica:** Los paquetes utilizados en esta sesión corresponden a candidatos técnicos para la evaluación de experiencia de desarrollador de la versión v0.1.0 de Wasma. Al encontrarse en fase piloto, la descarga pública oficial en GitHub Releases aún no está habilitada. El facilitador te suministrará directamente el paquete candidato correspondiente a tu sistema operativo.

---

## Objetivo de la sesión
Evaluar la facilidad para comprender la documentación de instalación, verificar la integridad criptográfica del paquete recibido, instalar la herramienta de línea de comandos `wasma`, completar el tutorial de inicio rápido y evaluar un caso de negocio de forma autónoma.

Por favor, comparte tu pantalla y expresa en voz alta tus pensamientos, dudas e impresiones mientras realizas las tareas.

---

## Tareas a realizar

### Tarea 1: Descubrimiento de la Documentación de Instalación
1. Accede al portal oficial de Wasma (`https://wasma.org/`) o al repositorio canónico (`https://github.com/Kaddo-kdd/wasma`).
2. Localiza la guía de instalación y revisa los requisitos y la estructura de paquetes prevista para tu sistema operativo.
3. *Nota de pre-release:* Dado que la descarga pública oficial se activa en el hito v0.1.0, el facilitador te hará entrega del paquete candidato y del catálogo `SHA256SUMS` a través del canal de la sesión.

### Tarea 2: Verificación Criptográfica del Paquete Recibido
1. Siguiendo las instrucciones indicadas en la documentación de instalación, calcula el hash SHA-256 del archivo que te entregó el facilitador.
2. Compara el valor obtenido contra el catálogo `SHA256SUMS` suministrado y comprueba si la integridad es correcta.

### Tarea 3: Instalación de la CLI
1. Descomprime el paquete en tu entorno local.
2. Configura tu entorno para poder invocar la herramienta directamente desde cualquier ubicación en tu terminal.
3. Comprueba que la herramienta responde en tu terminal e inspecciona las opciones disponibles.

### Tarea 4: Tutorial de Inicio Rápido (Quickstart)
1. Navega a la guía de inicio rápido en el portal: `https://wasma.org/docs/first-component/`.
2. Sigue las instrucciones de la guía para crear la especificación de tu primer componente, verificarla, compilarla y ejecutarla pasando el valor de prueba indicado en el tutorial.
3. Confirma en tu terminal que obtienes el resultado esperado.

### Tarea 5: Exploración del Motor de Reglas Comerciales
1. Localiza en la documentación o en el repositorio la guía y el código de la aplicación de referencia del motor de reglas comerciales (`https://wasma.org/docs/examples/business-rules/`).
2. Siguiendo las instrucciones de la guía, ejecuta la suite de pruebas automatizadas incluida para este componente.
3. Modifica una entrada o caso de prueba (por ejemplo, alterando un monto de orden o tier de cliente) y vuelve a evaluar las reglas observando el resultado en consola.

---

### Al terminar
Avísale al facilitador para completar un breve cuestionario de cierre de 3 minutos. ¡Muchas gracias por tu tiempo y feedback!
