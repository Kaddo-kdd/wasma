---
id: AN-071
type: feature
status: completed
created_at: 2026-10-26T00:00:00.000Z
ready_at: '2026-11-01'
completed_at: '2026-11-01'
title: Sección de autor e identidad editorial del proyecto
knowledge_level: K2
suggested_knowledge_level: K2
scope_confidence: high
initiative: INI-009
source_roadmap_initiative: INIT-09-04
priority: P1
depends_on:
  - AN-077
domains:
  - Developer Experience, Documentation & Branding
code:
  - website/src/pages/index.astro
  - website/src/layouts/Site.astro
  - website/src/components/**
  - website/src/styles/**
expected_value: >-
  Incorporar una sección de autor sobria y contextualizada en la landing page
  principal aportando transparencia sobre el creador, origen de Wasma y su
  evolución desde Agent Native.
project_state: ai-assisted
template_version: 1
---

# AN-071 — Sección de autor e identidad editorial del proyecto

## Contexto y problema

El portal de Wasma presenta la arquitectura, las capacidades y la documentación, pero carecía de contexto sobre quién respalda el proyecto, su origen y su trayectoria de evolución desde el prototipo y núcleo técnico Agent Native. Una sección de autor profesional fortalece la confianza de desarrolladores externos sin convertir la landing en una página personal.

## Alcance implementado

- Diseñar e implementar un componente de autor sobrio, elegante y accesible («Sobre el autor») en la landing principal de Wasma (`website/src/pages/index.astro`), estructurado como un panel editorial delimitado (`.author-panel`) para diferenciarlo netamente de la cuadrícula de capacidades técnicas.
- Integrar la navegación hacia la sección en el pie de página global (`website/src/layouts/Site.astro`) bajo la columna «Explora» mediante el enlace semántico `/#autor`.
- Incorporar el contenido editorial aprobado por revisión humana:
  - Visibilidad al nombre del creador en titular de segundo nivel (`h2.author-name`): **Julián Darío Luna Patiño**.
  - Subtítulo formal en monoespaciado (`.author-role`): *Creador de Wasma · Arquitectura de software y open source*.
  - Párrafos de motivación técnica planteando la pregunta fundacional de Wasma: cómo aprovechar la inteligencia artificial para construir software sin depender de ella para controlar su ejecución, separando la construcción asistida de la verificación, compilación y ejecución.
  - Bloque 01 (*Origen y evolución*): *De Agent Native a Wasma*, documentando la transición desde la exploración técnica inicial hacia la consolidación de responsabilidades independientes en Wasma.
  - Bloque 02 (*Enfoque técnico*): *Menos suposiciones. Más garantías comprobables.*, detallando el uso de Semantic IR, validación estructural, compilación reproducible a WebAssembly y runtime con límites de recursos explícitos.
  - Bloque 03 (*Gobernanza y comunidad*): *Construido en abierto*, ratificando la licencia libre MIT y la disponibilidad pública del código fuente, decisiones arquitectónicas y roadmap.
  - Enlaces externos profesionales discretos y verificables con URLs reales en atributos `href`, `target="_blank"` y `rel="noopener noreferrer"`: GitHub (`https://github.com/judlup`), TryCatch.tv (`https://trycatch.tv`) y Repositorio Wasma (`https://github.com/Kaddo-kdd/wasma`).
- Reutilizar exclusivamente las variables de diseño existentes en el sitio (`--bg`, `--surface`, `--text`, `--muted`, `--line`, `--accent`), garantizando soporte pleno y contrastes óptimos en temas claro y oscuro sin romper la estética sobria del proyecto.
- Garantizar accesibilidad de navegación por teclado mediante `:focus-visible` destacado con contorno en `--accent` y adaptabilidad responsive sin desbordamiento ni scroll horizontal a 375, 768 y 1440 px.

## Criterios de aceptación

- AC-01: Se incorpora un componente accesible y responsive «Sobre el autor» en `website/src/pages/index.astro`, ubicado tras la sección de capacidades y antes del cierre/CTA final.
- AC-02: Se presenta la información aprobada: nombre del creador (Julián Darío Luna Patiño), perfil profesional, motivación de Wasma, enfoque en herramientas open source y relación histórica con Agent Native sin atribuciones incorrectas.
- AC-03: Se integran enlaces externos verificables a perfiles profesionales y repositorios de comunidad.
- AC-04: El diseño respeta los tokens de color (`tokens.css`), contraste y soporte para temas claro y oscuro.
- AC-05: Se mantiene la navegación accesible por teclado y la visualización correcta a 375, 768 y 1440 px sin scroll horizontal.

## Fuera de alcance

- Crear una página `/autor/` separada (evaluable para fases posteriores).
- Modificar el banner principal o la identidad de marca del producto.

## Evidencia de validación técnica y remota

1. **Commit canónico sincronizado**:
   - [`4900ab0e57b65587f4b6debcef00521f0ad45ab7`](https://github.com/Kaddo-kdd/wasma/commit/4900ab0e57b65587f4b6debcef00521f0ad45ab7): `feat(website): add author and project origin section (AN-071)`.
2. **Workflows automáticos en GitHub Actions**:
   - **Website** (Run [`41275780224`](https://github.com/Kaddo-kdd/wasma/actions/runs/41275780224)): Exitoso (1m 46s, jobs `website` y `documentation-smoke` aprobados).
   - **CI Multiplataforma** (Run [`41275780222`](https://github.com/Kaddo-kdd/wasma/actions/runs/41275780222)): Exitoso (12m 17s, 7 de 7 jobs aprobados en Linux, Windows y macOS ARM64).
3. **Auditoría de despliegue en producción (`https://wasma.org/`)**:
   - Respuesta HTTP 200 servida por Netlify con el contenido HTML verificado:
     - `id="autor"` presente y funcional.
     - Enlace en footer `/#autor` resuelve sin desvíos.
     - Creador y subtítulo presentes: `Julián Darío Luna Patiño` y `Creador de Wasma · Arquitectura de software y open source`.
     - Párrafos de motivación y los tres bloques narrativos coinciden palabra por palabra con el texto aprobado.
     - Enlaces externos a `github.com/judlup`, `trycatch.tv` y `github.com/Kaddo-kdd/wasma` comprobados.
4. **Verificación visual responsive y contrastes**:
   - Inspección directa en Chromium headless para temas claro y oscuro en 1440 px, 768 px y 375 px.
   - Cero desbordamiento (`0 px scroll horizontal`, `PASS`) en todas las resoluciones.
   - Contrastes comprobados en tema claro: fondo `#ffffff` sobre `#f7f6f2`, encabezados `#171020` (>14:1, WCAG AAA), acentos `#7132ae` (>7:1) y texto descriptivo `#62596e` (>5.5:1, WCAG AA).

## Learning

1. **Precisión de afirmaciones técnicas vs promesas no verificables**:
   - En la comunicación de proyectos de infraestructura y runtime, es crucial calibrar el alcance de las afirmaciones técnicas. Describir capacidades concretas y verificables (como Semantic IR, validación estructural, límites de recursos explícitos y compilación WebAssembly) genera mayor confianza técnica que emplear fórmulas hiperbólicas como «contratos matemáticos» o «demostraciones formales» que sugerirían garantías de corrección absoluta no implementadas.
2. **Diferenciación visual editorial de componentes de producto**:
   - Una sección de autor e identidad no debe presentarse con la misma retícula repetitiva de las capacidades de producto. Estructurarla dentro de un panel editorial delimitado (`.author-panel`) con superficie distinguible (`var(--surface)`), borde perimetral (`var(--line)`) y un encabezado asimétrico permite jerarquizar al creador y el propósito del proyecto sin competir con los elementos técnicos del sistema.
3. **Validación visual integral multiplataforma y multitema**:
   - La comprobación automatizada mediante navegadores headless tanto en tema claro como oscuro, junto con la verificación matemática de desbordamiento de ancho (`scrollWidth === innerWidth`), previene regresiones visuales críticas en dispositivos móviles (375 px) y asegura una legibilidad consistente en cualquier entorno de visualización.
