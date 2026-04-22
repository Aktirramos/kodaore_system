# Diseño — Fase 0: audit de UI y de motion (`docs/ui-audit.md`)

Fecha: 2026-04-22
Fase del proyecto de rediseño: **Fase 0 — Reconocimiento**
Próxima fase (no tocar aún): Fase 1 — Dirección visual + de movimiento

## 1. Objetivo y scope

Documentar el estado actual de la UI y del sistema de movimiento de Kodaore para que la Fase 1 pueda decidir dirección visual y dirección de motion con datos, no intuiciones.

Incluye: tokens, tipografía, paleta efectiva, componentes, inventario de animaciones, performance (Lighthouse + perf traces), accesibilidad y longitudes i18n en eu vs es.

Excluye: toda decisión de rediseño. Ningún cambio en `components/`, `app/`, `lib/`, `globals.css` ni en las capas bloqueadas del CLAUDE.md (`prisma/schema.prisma`, `middleware.ts`, `lib/auth`, `lib/observability`, `lib/audit`, `lib/security`, `api/`, envío de mail).

Sí se commitea código nuevo: un set de tests de captura en `tests/audit/`, un config Playwright independiente, un script helper en `scripts/`, y entradas nuevas en `.gitignore`. Todo en su propio commit, separado del commit del `docs/ui-audit.md`.

Criterio de "done" completo en la sección 7.

## 2. Decisiones operativas aprobadas

| Decisión | Elegida |
|---|---|
| Servidor contra el que se captura | PM2 en `:3000` (build de producción, ya corriendo). No se para ni se reinicia. |
| Localización de artefactos | `.audit/baseline/…` (fuera de `docs/`), añadido a `.gitignore`. Solo `docs/ui-audit.md` y el código de captura van al repo. |
| Profundidad de inventario de componentes | Shallow: listar, agrupar por función aparente y marcar sospechas de duplicación. Sin diffing estructural. |
| Estructura del audit document | Híbrida: capa 1 de foundations globales + capa 2 de route atlas por ruta. |
| Credenciales | Extraídas de `prisma/seed.mjs`. Admin global: `admin.global`. Familia: `familia@kodaore.eus`. Password por defecto `Kodaore2026!` (override posible por `SEED_DEFAULT_PASSWORD`). No se escriben en `docs/ui-audit.md`. |

## 3. Matriz de captura

### 3.1 Rutas

**Principales (15 — 8 screenshots cada una: top + full × mobile + desktop × eu + es)**
- Públicas: `/`, `/sedes`, `/sedes/azkoitia`, `/fototeca`, `/erropak`
- Auth: `/acceso`, `/acceso/crear-cuenta`
- Admin: `/admin`, `/admin/students`, `/admin/groups`, `/admin/billing`
- Portal: `/portal`, `/portal/profile`, `/portal/payments`, `/portal/messages`

**Secundarias (solo desktop, solo eu, screenshot mínimo)**
- `/sedes/azpeitia`, `/sedes/zumaia`, `/legal/terms`, `/legal/privacy`

### 3.2 Viewports

| Nombre | Resolución | Device-scale | Representa |
|---|---|---|---|
| mobile | 390 × 844 | 3 | Familia en móvil (iPhone 14 Pro) |
| desktop | 1440 × 900 | 1 | Admin en portátil |

Tablet no se captura. Si un breakpoint 768–1024 rompe algo, se anota puntualmente.

### 3.3 Locales

`eu` y `es`. Euskera es el worst case de longitud.

### 3.4 Artefactos por ruta

| Tipo | Dónde | Qué |
|---|---|---|
| Screenshot top | Cada combinación principal | Above-the-fold, viewport completo |
| Screenshot full | Cada combinación principal | `fullPage: true` |
| Screenshot min | Secundarias | Solo top, solo desktop eu |
| Lighthouse | 6 rutas × 2 viewports × solo eu | JSON + HTML |
| Perf trace | 4 rutas con motion notable × 2 viewports | JSON + resumen |
| Vídeo | 4 flujos (sección 4) | WebM |

Rutas con Lighthouse: `/`, `/acceso`, `/admin/students`, `/admin/billing`, `/portal/profile`, `/portal/payments`.

Rutas con perf trace: `/`, `/acceso`, `/admin/students`, `/portal/payments`.

### 3.5 Volumen total

- 15 × 2 × 2 × 2 = **120 screenshots** principales
- + 4 × 1 × 1 × 1 = 4 screenshots secundarios (solo top, solo desktop, solo eu) → **124 screenshots**
- **12 Lighthouse reports** (6 rutas × 2 viewports × 1 locale)
- **8 perf traces** (4 rutas × 2 viewports)
- **4 vídeos**

### 3.6 Naming convention

```
.audit/baseline/{ruta-slug}/{mobile|desktop}/{eu|es}/{top|full}.png
.audit/baseline/lighthouse/{ruta-slug}/{desktop|mobile}.{json,html}
.audit/baseline/perf/{ruta-slug}-{desktop|mobile}.json
.audit/baseline/videos/flujo-{n}-{nombre}.webm
.audit/state/{admin|familia}.json
```

`ruta-slug` es el path con `/` sustituido por `__` y los corchetes fuera. Ej: `admin__students`, `sedes__azkoitia`.

La misma convención se usa en Fase 5 bajo `.audit/post/...` para que el diff sea directo.

## 4. Vídeos de flujos

| Flujo | Viewport | Locale | Rango temporal | Qué captura |
|---|---|---|---|---|
| 1 — Login familia | mobile | eu | ~8–12 s | Loader inicial, submit con estado loading, transición a `/eu/portal`, primer pintado del portal. |
| 2 — Navegación admin | desktop | eu | ~15–20 s | Login `admin.global` → `/eu/admin` → students → groups → billing. Sidebar, transición entre páginas, render de tablas, hover sobre filas. |
| 3 — Apertura de modales | desktop | eu | variable | 1–2 modales reales dentro de admin (se identifican los que existen antes de grabar). Entrada, foco inicial, cierre. |
| 4 — Submit de form con validación | desktop | es | ~20–25 s | `/es/acceso/crear-cuenta` → campos inválidos → submit → error → corrección → success. |

Antes de grabar el flujo 3 hay que listar qué modales existen hoy en `/admin/*`. Si la acción principal (`nuevo alumno`) no es modal sino ruta, se usa la edición inline o el flujo más parecido que sí sea modal, y se anota el hallazgo en el inventario de componentes.

Grabación en WebM con `video: { mode: "on", size: { width: 1440, height: 900 } }` (override del global `retain-on-failure`). Se renombran post-hoc al layout de la sección 3.6.

## 5. Stack técnico de captura

### 5.1 Screenshots y vídeos — Playwright

- Tests en `tests/audit/capture-baseline.spec.ts`. No toca la suite de `tests/e2e/`.
- Config nuevo: `playwright.audit.config.ts` con proyectos `chromium-desktop` y `chromium-mobile`, `reuseExistingServer: true` apuntando a PM2 `:3000`.
- Auth: `storageState` generado por setup previo en `tests/audit/_setup/login-admin.ts` y `tests/audit/_setup/login-familia.ts`. Persistido en `.audit/state/*.json`.
- Script helper: `scripts/run-audit-baseline.mjs` — ejecuta Playwright con el config de audit y reorganiza artefactos al layout final.

### 5.2 Lighthouse — `chrome-devtools:lighthouse_audit` MCP

- Llamada directa al MCP por ruta. JSON + HTML.
- Emulación: desktop y mobile nativas de Lighthouse.
- Rutas autenticadas: login vía Playwright, export de cookies, paso al MCP. Si el MCP no permite cookies directas, se cae de vuelta a medir LCP/CLS/INP de admin/portal solo con perf trace (ver 5.3) y se ejecuta Lighthouse únicamente en rutas públicas.

### 5.3 Performance traces — `chrome-devtools:performance_*` MCP

- Solo las 4 rutas con motion notable (ver 3.4).
- Cada trace captura: carga inicial + scroll hasta el final + un hover guiado sobre un elemento con animación.
- `performance_analyze_insight` después para extraer LCP, INP, CLS, long tasks y frames dropped.
- Resumen numérico tabulado en el route atlas de la ruta correspondiente.

### 5.4 Por qué dos herramientas

- Playwright: screenshots consistentes, vídeos, flujos multi-paso, auth, mobile emulation.
- DevTools MCP: Lighthouse oficial (scores estándar), traces CDP reales, INP medido correctamente.
- No es redundancia; cada una cubre lo que la otra no hace bien.

### 5.5 Protocolo de captura

1. Warmup: visitar cada ruta sin medir para cachear SSR + Prisma + chunks de Next.
2. Segunda visita: la que se mide.
3. Anotar build en la cabecera del audit: `git rev-parse HEAD`, `npm list next react`, fecha y hora.
4. Ejecución completa estimada: 25–35 min en local.

## 6. Estructura del documento `docs/ui-audit.md`

Documento en dos capas (híbrido aprobado).

### 6.1 Capa 1 — Foundations as-is

Bloque global que sirve de insumo directo para Fase 1.

**6.1.1 Tokens**
Tabla con `--background`, `--foreground`, `--ink-muted`, `--surface`, `--surface-strong`, `--brand`, `--brand-emphasis`, `--brand-contrast`, `--brand-warm`, `--danger`. Para cada uno: valor, roles reales en los que se usa (grep), y huecos detectados (ausencia de success/warning/info, ausencia de escala de grises, ausencia de niveles de superficie intermedios, ausencia de tokens de radius/shadow/spacing nombrados).

**6.1.2 Tipografía**
Familias (Manrope sans, Space Grotesk heading). Inventario real de `text-*` y `font-*` usados en la base. Casos de `clamp(...)` vs tamaños fijos. Tabla "texto en eu vs es" por componente crítico.

**6.1.3 Paleta efectiva**
Pareja de marca carmesí + esmeralda. Tres capas de fondo global (body gradient + grain SVG + kodaore-shell radial gradients) listadas y medidas. Uso intensivo de `color-mix(in srgb, ...)`. Contrastes WCAG AA por combinación brand/surface. Paleta efectiva (colores tras `color-mix`), no la declarada.

**6.1.4 Componentes — catalog shallow**
Listado por carpeta con una línea por componente (qué hace, dónde se usa, tiene animación sí/no):
- `components/` (raíz, ~20 archivos)
- `app/[locale]/(backoffice)/admin/_shared/`
- `app/[locale]/(backoffice)/admin/*/_*` si existen
- `app/[locale]/(family-portal)/portal/_components/`
- `app/[locale]/(family-portal)/portal/_utils/` si exporta UI

Marca `⚠️` en candidatos a duplicación (p. ej. `admin-billing-actions-table.tsx` + `admin-groups-actions-table.tsx` + `admin-students-actions-table.tsx`).

**6.1.5 Inventario de motion**
Tabla cerrada con columnas:

| nombre | tipo | archivo:línea | duración | curva | trigger | alcance | reduced-motion | coste perf | problema |
|---|---|---|---|---|---|---|---|---|---|

Tipos posibles: `css-keyframe`, `css-transition`, `js-driven`, `vanta`, `3d-scroll`.

Triggers posibles: `mount`, `hover`, `focus`, `scroll`, `route-change`, `idle-infinite`.

Entradas mínimas esperadas:
- `fade-rise`, `fade-reveal-left` + delays 100–500
- `kodaore-route-motion` (`PageTransitionShell`)
- `k-hover-lift`, `k-hover-soft`, `k-hover-action`, `k-row-hover`
- `kodaore-loader-*` (word-rise, wave-sweep, hint-bob) y `InitialLoader` 3D scroll-driven
- `VantaWavesBackground` acoplado a scroll + mousemove
- `AnimatedSiteHeader` (compacta al scroll, `backdrop-blur-xl`)
- `kodaore-footer-top-line` (infinito 7s)
- `kodaore-social-icon` hover + glow
- `k-back-top` bob infinito
- Los `transition duration-*` de Tailwind aplicados a imágenes (hero, sedes, fototeca, erropak)

Sub-tablas:
- **Animaciones infinitas** (las que no paran nunca — candidatas a coste perf recurrente).
- **Animaciones que disparan layout** (candidatas a CLS).

**6.1.6 Diagnóstico global (síntesis corta)**
Un párrafo neutro describiendo el estado: qué se observa, qué falta, qué se acumula. Sin prescripciones — es audit, no propuesta. Decisiones en Fase 1.

### 6.2 Capa 2 — Route atlas

Plantilla fija por ruta, breve:

```
### /ruta — Nombre humano
Audiencia: pública | auth familia | auth admin

**Screenshots**
- mobile eu: [top] [full]   mobile es: [top] [full]
- desktop eu: [top] [full]  desktop es: [top] [full]

**Métricas** (si se midieron)
- Lighthouse desktop: Perf 00 / A11y 00 / BP 00 / SEO 00
- Lighthouse mobile:  Perf 00 / A11y 00 / BP 00 / SEO 00
- Perf trace: LCP 0ms, INP 0ms, CLS 0.00, long tasks N, frames dropped N%

**Motion en esta ruta**
- [referencias a entradas del inventario global 6.1.5]

**Componentes clave**
- [referencias a entradas del inventario global 6.1.4]

**Observaciones visuales**
- 2–5 bullets concretos y neutros

**Observaciones de motion**
- 2–5 bullets, tono idéntico

**i18n**
- longitudes eu vs es en títulos/CTAs, overflow visible, breakpoints afectados

**Riesgos para Fase 4**
- 1–3 bullets sobre qué va a doler cambiar aquí
```

Enlaces relativos a `.audit/baseline/…`. Referencias al inventario global con `→ 6.1.5/fade-rise`.

## 7. Entregables y criterios de "done"

### 7.1 Entregables

**Commiteable:**
- `docs/ui-audit.md` (capa 1 + capa 2).
- `tests/audit/capture-baseline.spec.ts` + `tests/audit/_setup/login-admin.ts` + `tests/audit/_setup/login-familia.ts`.
- `playwright.audit.config.ts`.
- `scripts/run-audit-baseline.mjs`.
- Ajuste de `.gitignore` para excluir `.audit/`.

**No commiteable (solo local, bajo `.gitignore`):**
- `.audit/baseline/` con screenshots, vídeos, Lighthouse reports, perf traces.
- `.audit/state/` con `storageState` JSON de admin y familia.

### 7.2 Criterios de "done"

1. `docs/ui-audit.md` renderiza sin enlaces rotos a `.audit/`.
2. Las 15 rutas principales tienen sus 8 screenshots cada una (mobile/desktop × eu/es × top/full).
3. Las 4 rutas secundarias tienen screenshot mínimo (desktop eu, top).
4. Los 4 vídeos existen y son reproducibles en navegador.
5. Las 6 rutas con Lighthouse tienen JSON + HTML para desktop y mobile.
6. Las 4 rutas con perf trace tienen JSON + resumen numérico en el route atlas correspondiente.
7. Sección 6.1.5 contiene todas las animaciones que grep encuentra en `app/` y `components/` (keyframes + transitions no triviales), no solo las recordadas a mano.
8. Dos commits atómicos: primero el código de captura (`feat(audit): scaffold de captura Fase 0`), luego el documento (`docs(ui): audit de Fase 0`).

### 7.3 Qué NO está en Fase 0

- Ninguna decisión de dirección visual o de motion.
- Ningún cambio en `components/`, `app/` (salvo nada), `lib/`, `globals.css`.
- Ninguna modificación de capas bloqueadas del CLAUDE.md.
- Ninguna opinión prescriptiva en el audit: los bullets describen, no prescriben.

## 8. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Lighthouse no acepta cookies fácilmente → no se puede medir admin/portal. | Caer a solo perf trace para esas rutas y anotarlo. Lighthouse queda en públicas. |
| PM2 está sirviendo build antiguo y no refleja el estado "actual" del código. | Anotar `git rev-parse HEAD` y fecha del build PM2 en la cabecera. Si hay gap grande, avisar y ofrecer `pm2 restart`. |
| `InitialLoader` intercepta scroll inicial → Playwright no puede scrollear en la carga. | Espera a que `html[data-loader-phase]` sea `hidden` antes de interactuar. Ya es un atributo observable del DOM. |
| Vanta Waves falla en headless Chromium (WebGL limitado). | El componente ya tiene fallback estático por media query y por reduced-motion. Documentar que la captura desktop con WebGL sí renderiza Vanta; mobile no. |
| Seed password puede haber sido cambiada por `SEED_DEFAULT_PASSWORD`. | Probar `Kodaore2026!` primero; si falla login, pedir confirmación al usuario en vez de seguir a ciegas. |
| Tiempo total de ejecución se dispara. | 25–35 min es estimación optimista. Si supera 60 min, romper en dos sesiones (públicas + autenticadas). |

## 9. Siguiente paso

Terminada esta Fase 0 y validada por el usuario, **párate**. No avanzar a Fase 1 sin checkpoint humano, tal como marca el workflow.

Pendiente del spec: generar el plan de implementación con `superpowers:writing-plans` sobre este diseño.
