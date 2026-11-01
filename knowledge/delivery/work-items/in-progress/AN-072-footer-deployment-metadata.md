---
id: AN-072
type: feature
status: in-progress
created_at: 2026-10-26T00:00:00.000Z
title: 'Versión, commit y procedencia del despliegue en el footer'
knowledge_level: K2
suggested_knowledge_level: K2
scope_confidence: high
initiative: INI-009
source_roadmap_initiative: INIT-09-05
priority: P1
depends_on:
  - AN-079
domains:
  - 'Developer Experience, Documentation & Branding'
code:
  - website/src/layouts/Site.astro
  - website/src/components/**
  - website/src/lib/**
  - website/src/styles/**
  - website/package.json
  - website/scripts/**
expected_value: >-
  Agregar al footer global del sitio web metadatos automáticos de versión del
  portal, SHA corto del commit Git y procedencia del build enlazada al
  repositorio canónico tras AN-079.
project_state: ai-assisted
template_version: 1
ready_at: '2026-11-01'
---

# AN-072 — Versión, commit y procedencia del despliegue en el footer

## Contexto y problema

Actualmente el pie de página de `wasma.org` muestra la licencia MIT y enlaces de navegación, pero carece de metadatos sobre la versión específica del portal web y el commit exacto de Git correspondiente al despliegue en producción. Para ofrecer total transparencia y trazabilidad a evaluadores, auditores y desarrolladores tras la migración de AN-079, el footer debe indicar qué versión del sitio y qué commit específico está servido, enlazando al commit en el repositorio canónico `https://github.com/Kaddo-kdd/wasma`, sin confundir la versión web con la versión de la CLI de Wasma.

## Alcance

- Extraer la versión semántica del portal directamente desde `website/package.json` en tiempo de compilación.
- Resolver el SHA completo del commit de construcción siguiendo una estrategia de resolución segura y reproducible:
  1. Priorizar variables de entorno provistas por la plataforma de CI/hosting (como `COMMIT_REF` en Netlify o `GITHUB_SHA` en GitHub Actions).
  2. Fallback verificable mediante Git local (`git rev-parse HEAD`).
  3. Fallback seguro a entorno de desarrollo (`dev`) cuando no exista información o no se ejecute en un repositorio Git válido.
- Validar formalmente el formato del SHA completo (cadena hexadecimal de 40 caracteres, `/^[0-9a-f]{40}$/i`) antes de construir el hipervínculo externo.
- Renderizar en el pie de página global (`website/src/layouts/Site.astro`) los metadatos de despliegue de forma discreta:
  - Etiqueta explícita de versión web: `web v{version}`.
  - SHA corto de 7 caracteres (`{shortSha}`), enlazado directamente a `https://github.com/Kaddo-kdd/wasma/commit/{fullSha}` con `target="_blank"` y `rel="noopener noreferrer"`.
  - En caso de modo `dev` o SHA no verificable, mostrar `dev` como texto plano sin generar hipervínculos rotos.
- Generar e inyectar todos los metadatos durante el build estático de Astro, sin dependencias de red, librerías pesadas ni llamadas a APIs externas en tiempo de ejecución en el cliente.
- Mantener la distinción explícita e inequívoca entre la versión del portal web y la versión de la CLI de Wasma.
- Garantizar coherencia con el sistema de tokens (`--muted`, `--line`, `--accent`), navegación accesible por teclado, foco visible y diseño responsivo sin scroll horizontal a 375, 768 y 1440 px en temas claro y oscuro.
- No introducir telemetría, cookies ni analíticas de terceros.

## Criterios de aceptación

- AC-01: El footer de `website/src/layouts/Site.astro` muestra la versión web obtenida de `website/package.json` con etiqueta clara de portal (`web v...`), distinguiéndose formalmente de la versión de la CLI de Wasma.
- AC-02: Se obtiene el SHA completo del commit de build priorizando `COMMIT_REF` (o `GITHUB_SHA`), con fallback local verificable a `git rev-parse HEAD` y estado explícito `dev` si no se dispone de información de commit.
- AC-03: Se valida que el SHA sea un hash hexadecimal auténtico de 40 caracteres antes de construir el hipervínculo; en caso válido, se muestra el SHA corto (7 caracteres) enlazado a `https://github.com/Kaddo-kdd/wasma/commit/{SHA}` con `target="_blank"` y `rel="noopener noreferrer"`.
- AC-04: Los metadatos se integran en tiempo de build de Astro de forma determinista y estática, sin incurrir en dependencias de red ni llamadas a APIs en tiempo de ejecución en el cliente.
- AC-05: El componente en el footer respeta los tokens del sistema de diseño (`--muted`, `--line`, `--accent`), foco visible por teclado, soporte para temas claro y oscuro y visualización responsive sin scroll horizontal a 375, 768 y 1440 px.

## Fuera de alcance

- Añadir telemetría, contadores de visitas o analíticas en el footer.
- Sincronizar artificialmente la versión web con la versión de la CLI de Cargo.
- Llamadas a la API REST de GitHub desde el navegador del cliente.

## Validación

1. **Verificación de resolución de metadatos:** Comprobar que la versión leída coincide exactamente con `website/package.json` y que la resolución de SHA maneja `COMMIT_REF`, `GITHUB_SHA`, `git rev-parse HEAD` y fallback `dev`.
2. **Pruebas automatizadas de validación:** Pruebas unitarias de la función de extracción y formateo cubriendo casos positivos (SHA válido de 40 caracteres con link generado) y negativos (SHA inválido, vacío o `dev` degradado a texto plano).
3. **Auditoría de hipervínculos:** Ejecución de `pnpm --dir website check:links` asegurando que todos los enlaces internos y rutas son válidos.
4. **Verificación estática y de contenido:** Ejecución de `pnpm --dir website check`, `pnpm --dir website test`, `pnpm --dir website check:content` y `pnpm --dir website build`.
5. **Verificación de accesibilidad y diseño:** Comprobación de contraste en temas claro y oscuro, foco de teclado en el enlace del commit y renderizado sin desbordamiento a 375, 768 y 1440 px.

## Entregable

Componente de metadatos de procedencia del despliegue en el footer global de Wasma, con resolución segura de versión y SHA, enlace verificado al repositorio canónico, tests automatizados y validaciones locales del portal aprobadas.
