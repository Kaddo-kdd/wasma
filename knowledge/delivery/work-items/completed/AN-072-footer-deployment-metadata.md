---
id: AN-072
type: feature
status: completed
created_at: 2026-10-26T00:00:00.000Z
ready_at: '2026-11-01'
completed_at: '2026-11-02'
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

## Evidencia de validación técnica y remota

1. **Commit canónico sincronizado**:
   - [`46cdf26bb7657281c85f54c43f765eacd6536726`](https://github.com/Kaddo-kdd/wasma/commit/46cdf26bb7657281c85f54c43f765eacd6536726): `feat(website): add deployment version and commit provenance (AN-072)`.
2. **Workflows automáticos en GitHub Actions**:
   - **Website** (Run [`41343916070`](https://github.com/Kaddo-kdd/wasma/actions/runs/41343916070)): Exitoso (1m 45s, jobs `website` y `documentation-smoke` aprobados).
   - **CI Multiplataforma** (Run [`41343916041`](https://github.com/Kaddo-kdd/wasma/actions/runs/41343916041)): Exitoso (10m 52s, 7 de 7 jobs aprobados en Linux, Windows y macOS ARM64).
3. **Auditoría del artefacto de construcción estática (`wasma-static-site`)**:
   - Versión `web v0.1.0` leída desde `website/package.json`.
   - SHA corto visible de 7 caracteres: `commit 46cdf26 ↗`.
   - Enlace completo al commit con los 40 caracteres hexadecimales: `https://github.com/Kaddo-kdd/wasma/commit/46cdf26bb7657281c85f54c43f765eacd6536726`.
   - Atributos `target="_blank"` y `rel="noopener noreferrer"` verificados.
4. **Auditoría de despliegue en producción (`https://wasma.org/`)**:
   - Respuesta HTTP 200 servida en vivo por Netlify.
   - Presencia de `<div class="deploy-meta" aria-label="Versión y procedencia del despliegue">`.
   - Coincidencia exacta entre el commit del despliegue (`COMMIT_REF=46cdf26bb7657281c85f54c43f765eacd6536726`) y el hipervínculo servido.
   - Enlace de GitHub comprobado directamente con HTTP 200.
5. **Comportamiento en entorno de desarrollo (`dev`)**:
   - Degradación segura a texto plano `<span class="dev-badge">dev</span>` sin generar hipervínculos externos en ausencia de procedencia pública verificable.
   - Suite de 11 tests automatizados en `website/scripts/checks.test.mjs` validando casos positivos, degradación por SHA inválido o truncado y fallback local.
6. **Verificación visual responsive y accesibilidad**:
   - Separación vertical superior de 8 px en línea independiente respecto a la licencia MIT (`display: block` en `<small>` y `display: flex; margin-top: 8px` en `.deploy-meta`).
   - Foco visible por teclado (`:focus-visible` con contorno de 2 px en color `--accent`).
   - Cero desbordamiento (`0 px scroll horizontal`, `PASS`) en Chromium headless a 1440 px, 768 px y 375 px para temas claro y oscuro.

## Learning

1. **Procedencia determinista en build-time vs APIs de cliente en runtime**:
   - La procedencia del despliegue debe generarse de forma estática y determinista durante el build del portal en el servidor de CI/hosting, sin incurrir en llamadas a la API REST de GitHub ni dependencias de red desde el navegador del cliente. Esto preserva la privacidad del usuario, elimina límites de cuota (rate limits) y garantiza que el portal siga funcionando íntegramente como un sitio estático seguro.
2. **Independencia de la versión web frente a la CLI del producto**:
   - Es indispensable mantener desacoplada la versión semántica del portal (`website/package.json`) de la versión del binario de Wasma (`Cargo.toml`). El prefijo explícito `web v...` previene confusiones a evaluadores y desarrolladores respecto al estado de madurez de la herramienta de línea de comandos.
3. **Validación sintáctica de SHA vs autenticidad criptográfica**:
   - Validar que un hash cumpla la expresión regular hexadecimal de 40 caracteres (`/^[0-9a-f]{40}$/i`) es una salvaguarda indispensable para evitar URLs rotas o inyecciones malformadas, pero no constituye una prueba criptográfica de que el commit exista o esté firmado. La procedencia pública solo es garantizable cuando proviene de variables de entorno de plataformas de hosting confiables (`COMMIT_REF`, `GITHUB_SHA`).
4. **Degradación segura en builds locales sin enlaces rotos**:
   - Los builds ejecutados localmente sin procedencia pública verificada deben degradar a `dev` en texto plano en lugar de generar hipervínculos que resultarían en errores 404 en GitHub si el commit aún no ha sido publicado. Si una variable de entorno declarada contiene un valor inválido, el sistema debe fallar de forma segura a `dev` inmediatamente, sin sustitución silenciosa.
5. **Validación visual integral de metadatos discretos**:
   - Añadir metadatos en un footer existente requiere verificar la disposición de elementos padre/hijo (`display: block` vs `inline`) para evitar que textos secundarios se sitúen en la misma línea visual o rompan la armonía del diseño. Comprobar el espaciado vertical (8 px) y la ausencia de desbordamiento horizontal en viewports estrechos (375 px) es fundamental antes de la publicación.
6. **Desacoplamiento entre CI y CDN de hosting**:
   - Un resultado exitoso en el workflow de GitHub Actions no garantiza que la plataforma de hosting (Netlify) haya finalizado la propagación en sus nodos de borde. Auditar directamente el HTML servido en vivo por la URL pública con HTTP 200 es imprescindible para verificar el despliegue real en producción.
