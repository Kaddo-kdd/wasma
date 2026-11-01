---
id: AN-071
type: feature
status: in-progress
created_at: 2026-10-26T00:00:00.000Z
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
ready_at: '2026-11-01'
---

# AN-071 — Sección de autor e identidad editorial del proyecto

## Contexto y problema

El portal de Wasma presenta la arquitectura, las capacidades y la documentación, pero carece de contexto sobre quién respalda el proyecto, su origen y su trayectoria de evolución desde el prototipo y núcleo técnico Agent Native. Una sección de autor profesional fortalece la confianza de desarrolladores externos sin convertir la landing en una página personal.

## Alcance

- Diseñar e implementar un componente de autor sobrio, elegante y accesible («Sobre el autor») en la landing principal de Wasma (`website/src/pages/index.astro`), diferenciado de la cuadrícula de capacidades técnicas.
- Integrar la navegación hacia la sección en `website/src/layouts/Site.astro`.
- Estructurar el contenido editorial cubriendo los ejes requeridos:
  - Visibilidad al nombre del creador: Julián Darío Luna Patiño.
  - Perfil profesional y rol: Creador de Wasma · Arquitectura de software y open source.
  - Motivación de Wasma: Explorar una arquitectura donde la construcción asistida por IA se separa de la verificación, compilación y ejecución, utilizando contratos explícitos y componentes WebAssembly.
  - Evolución histórica: Origen en el proyecto exploratorio Agent Native y consolidación hacia Wasma, donde especificación, verificación, compilación y ejecución tienen responsabilidades independientes.
  - Compromiso open source: Proyecto open source bajo licencia MIT, con código fuente, decisiones arquitectónicas y hoja de ruta disponibles públicamente.
  - Enlaces externos profesionales discretos y verificables: perfiles profesionales y repositorio de comunidad (`github.com/judlup`, `trycatch.tv`, `github.com/Kaddo-kdd/wasma`) con URLs reales en atributos `href`.
- Reutilizar las variables de diseño existentes (`--bg`, `--surface`, `--text`, `--muted`, `--line`, `--accent`), garantizando soporte pleno para temas claro y oscuro, foco visible de teclado y adaptabilidad sin desbordamiento ni scroll horizontal a 375, 768 y 1440 px.

## Criterios de aceptación

- AC-01: Se incorpora un componente accesible y responsive «Sobre el autor» en `website/src/pages/index.astro`, ubicado tras la sección de capacidades y antes del cierre/CTA final.
- AC-02: Se presenta la información aprobada: nombre del creador (Julián Darío Luna Patiño), perfil profesional, motivación de Wasma, enfoque en herramientas open source y relación histórica con Agent Native sin atribuciones incorrectas.
- AC-03: Se integran enlaces externos verificables a perfiles profesionales y repositorios de comunidad.
- AC-04: El diseño respeta los tokens de color (`tokens.css`), contraste y soporte para temas claro y oscuro.
- AC-05: Se mantiene la navegación accesible por teclado y la visualización correcta a 375, 768 y 1440 px sin scroll horizontal.

## Fuera de alcance

- Crear una página `/autor/` separada (evaluable para fases posteriores).
- Modificar el banner principal o la identidad de marca del producto.

## Validación

1. Verificación de diseño responsive: Comprobar renderizado y ausencia de scroll horizontal a 375 px, 768 px y 1440 px en ambos temas (oscuro y claro).
2. Verificación de accesibilidad: Contraste de colores, foco visible de teclado en enlaces y atributos semánticos.
3. Verificación de hipervínculos: Enlaces externos con URLs reales en atributos `href` y ejecución de `pnpm check:links` en `website/`.
4. Verificación de contenido y tests: Ejecución de `pnpm check`, `pnpm test`, `pnpm check:content` y `pnpm build`.
5. Verificación de Work Item en Kaddo: `kaddo_verify_work_item`.

## Entregable

Sección «Sobre el autor» integrada en la landing page de Wasma con contenido editorial aprobado, diferenciación visual clara respecto a las capacidades técnicas, tokens reales del sistema de diseño, capturas multiplataforma/multitema validadas y pruebas locales verificadas.
