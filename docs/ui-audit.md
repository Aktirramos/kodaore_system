# Audit UI y motion — Fase 0 (scope reducido)

- Commit capturado: `4f954d1b2350e0fb5f2bed0ca5816cac0f09223c` (`ui-audit-fase-0`)
- Fecha de captura: `2026-04-22T09:40:11.317Z`
- Runtime: Next `^15.5.15`, React `^19.2.5`, Tailwind `^4`, Playwright `^1.59.1`
- Servidor medido: PM2 en `http://localhost:3000` (build producción).

> Documento descriptivo, no prescriptivo. Las decisiones de rediseño están en Fase 1.

## Alcance reducido

Fase 0 se ejecutó en modo reducido (solo rutas públicas) porque el entorno local de auth está desalineado: `prisma/schema.prisma` declara `provider = "postgresql"` pero `.env` apunta a MySQL, y `NEXTAUTH_URL` apunta a un dominio remoto. Estos son problemas de entorno local, no del código. Mientras no se resuelva, no es posible autenticar localmente contra PM2.

**Incluido en esta iteración:**
- 7 rutas principales públicas × 2 viewports × 2 locales × 2 tipos de screenshot = 56 PNGs.
- 4 rutas secundarias × solo desktop eu (top) = 4 PNGs.
- 1 vídeo: flujo 4 (validación del formulario de alta en `/es/acceso/crear-cuenta`).
- 4 Lighthouse reports (2 rutas × 2 viewports): `/` y `/acceso`.
- 4 perf traces (mismas 2 rutas × 2 viewports).
- Capa 1 (foundations) completa: tokens, tipografía, paleta, componentes, motion, diagnóstico.

**Diferido a Fase 0.b (cuando se fije el entorno):**
- 4 rutas admin (`/admin`, `/admin/students`, `/admin/groups`, `/admin/billing`).
- 4 rutas portal (`/portal`, `/portal/profile`, `/portal/payments`, `/portal/messages`).
- Vídeo flujo 1 (login familia), flujo 2 (navegación admin), flujo 3 (modales admin).
- Lighthouse y perf traces de rutas autenticadas.
- Entradas correspondientes en el route atlas (capa 2).

El código de captura ya está preparado para ejecutar todo lo diferido con `npm run audit:baseline` sin cambios adicionales, una vez que los `storageState` admin/familia se puedan generar.

## Capa 1 — Foundations as-is

### 1.1 Tokens

Tokens declarados en `app/globals.css` y expuestos a Tailwind vía `@theme inline`.

| Token | Valor | Usos (grep) | Rol observado |
|---|---|---|---|
| `--background` | `#08090a` | 5 | Fondo global único |
| `--foreground` | `#f8fafc` | 150 | Texto principal |
| `--ink-muted` | `#94a3b8` | 164 | Texto secundario |
| `--surface` | `#111827` | 63 | Tarjetas y paneles |
| `--surface-strong` | `#1f2937` | 69 | Superficies con peso |
| `--brand` | `#be123c` | 18 | Acciones primarias (carmesí) |
| `--brand-emphasis` | `#f43f5e` | 81 | Hover/focus brand |
| `--brand-contrast` | `#ffffff` | 6 | Texto sobre brand |
| `--brand-warm` | `#059669` | 26 | Acento secundario (esmeralda) |
| `--danger` | `#8a2020` | 2 | Estados de error |

**Huecos detectados en el sistema de tokens**
- No hay tokens semánticos para `success`, `warning`, `info`. El único estado tematizado es `danger`.
- No hay escala de grises intermedia: solo `foreground` (claro) e `ink-muted`. Nada entre ambos.
- No hay tokens para `radius`, `shadow` ni `spacing`: estos valores viven dispersos en utilities de Tailwind (`rounded-2xl`, `shadow-[...]`, `px-3`) sin nomenclatura semántica.
- No hay niveles intermedios de superficie (solo `surface` y `surface-strong`).

### 1.2 Tipografía

**Familias**
- Sans: Manrope — cargada por `next/font` en `app/layout.tsx`, expuesta como `--font-sans` (`--font-manrope`).
- Heading: Space Grotesk — cargada por `next/font` en `app/layout.tsx`, expuesta como `--font-heading` (`--font-space-grotesk`).

**Escala efectiva** (top 10 tamaños usados en `app/` + `components/`, por frecuencia)

| Clase | Apariciones |
|---|---|
| `text-sm` | 189 |
| `text-xs` | 114 |
| `text-3xl` | 31 |
| `text-xl` | 25 |
| `text-base` | 22 |
| `text-2xl` | 17 |
| `text-4xl` | 15 |
| `text-lg` | 13 |
| `text-[10px]` | 12 |
| `text-[11px]` | 6 |

**Pesos efectivos**

| Clase | Apariciones |
|---|---|
| `font-semibold` | 202 |
| `font-heading` | 70 |
| `font-medium` | 12 |

**Responsive tipográfico**
- Hay 4 usos de `clamp(...)` en componentes/hojas concretas (hero, loader, footer-watermark y un helper title en `globals.css`) que conviven con tamaños fijos `text-xl`, `text-2xl`, `text-3xl`, etc. en el resto del sitio. Convivencia inconsistente: partes del sitio escalan con viewport, otras no.
- Ejemplos de clamp detectados:
  - `app/globals.css:324` — `font-size: clamp(1.6rem, 3.7vw, 2.2rem);`
  - `components/initial-loader.tsx:299` — `fontSize: "clamp(1.25rem, 5vw, 2.2rem)"`
  - `components/site-footer.tsx:134` — `text-[clamp(3.8rem,17vw,16rem)]` (marca de agua).

**Longitudes eu vs es en componentes críticos** (muestreo desde `docs/textos-ui-inventario.md` y `lib/i18n.ts`)

| Componente/Clave | eu (chars) | es (chars) | ratio eu/es |
|---|---|---|---|
| `home.quickPanelItems[0]` (primer bullet de filosofía) | 41 | 32 | 1.28 |
| `home.pillars[1].title` (pilar "Valores y respeto") | 22 | 17 | 1.29 |
| `labels.priorityLang` (ficha "Idioma prioritario") | 21 | 18 | 1.17 |
| `values.paymentModel` (valor "Mensual, trimestral, anual") | 28 | 26 | 1.08 |
| `home.pillars[2].title` (pilar "Comodidad para familias") | 25 | 23 | 1.09 |

**Observaciones**
- No hay tokens tipográficos semánticos (`--text-display`, `--text-body`, `--text-caption`): toda tipografía es utility-class en el punto de uso. El único tematizado a nivel de `@theme inline` es la familia (`--font-sans`, `--font-heading`), no la escala.
- Hay una fuerte concentración en dos tamaños (`text-sm` y `text-xs`: 303 apariciones combinadas), lo que sugiere que el grueso del UI es texto denso de apoyo; los cuerpos `text-base` son comparativamente escasos (22) frente a ese bloque secundario.
- `font-semibold` (202) dobla a la suma de todos los demás pesos: el sitio no usa de forma consistente `font-normal` / `font-bold` como extremos; casi todo peso intencional va a `semibold`.
- Euskera tiende a ser más largo que castellano en las claves muestreadas (ratios 1.08–1.29). Ningún layout detectado trunca o rompe todavía, pero los márgenes son escasos en títulos cortos (pilares, labels de ficha) y conviene revisarlos antes de reducir densidad o aumentar tracking.

### 1.3 Paleta efectiva

**Capas de fondo global superpuestas sobre todo el sitio**
1. `body background-image`: gradiente lineal horizontal (`--brand` 18% → `--background` → `--brand-warm` 18%). Siempre visible.
2. `body::after`: SVG fractal noise (`feTurbulence`), opacidad 0.04, `mix-blend-mode: soft-light`. Textura global permanente.
3. `.kodaore-shell::before`: dos `radial-gradient` en las esquinas superiores (`--brand` 18% arriba-izq, `--brand-warm` 18% arriba-der). Se fija con `position: fixed`.

Tres capas de fondo permanentes se pintan sobre `--background` en toda la aplicación. Coste de repaint no medido cuantitativamente; candidato a verificar en Fase 1 si se mantienen.

**Uso de `color-mix(in srgb, ...)`**
- 31 ocurrencias en `app/globals.css`.
- 0 ocurrencias en componentes (ningún fichero `.tsx`/`.ts`/`.css` bajo `app/` o `components/` usa `color-mix` fuera de `globals.css`).
- Depende del orden de interpolación sRGB; produce ligeras diferencias entre navegadores (Chromium redondea distinto a Firefox en canales oscuros).

**Paleta efectiva** (tras `color-mix`, los colores que se pintan realmente)

| Composición | Resultado aproximado |
|---|---|
| `brand` 18% sobre `background` | `#290b13` |
| `brand-warm` 18% sobre `background` | `#07221b` |
| `brand-emphasis` 75% + `white` 25% (outline de focus) | `#f76f86` |
| `brand` 16% sobre blanco (gradient hover) | `#f5d9e0` |
| `brand-emphasis` 35% sobre gris oscuro (border hover) | `#773742` |

**Contraste WCAG AA (texto normal ≥ 4.5:1)**

| Pareja | Ratio | AA |
|---|---|---|
| `--foreground` / `--background` | 19.05:1 | AA ✅ |
| `--brand-contrast` / `--brand` | 6.29:1 | AA ✅ |
| `--foreground` / `--surface` | 16.96:1 | AA ✅ |
| `--foreground` / `--surface-strong` | 14.03:1 | AA ✅ |
| `--ink-muted` / `--background` | 7.77:1 | AA ✅ |
| `--ink-muted` / `--surface` | 6.92:1 | AA ✅ |
| `--brand-warm` / `--background` | 5.29:1 | AA ✅ |

**Observaciones**
- Paleta dual (carmesí `--brand` + esmeralda `--brand-warm`) fuerte, identificable, con peso político discreto (colores típicamente vascos pero no literales). Sin duplicados neutros.
- `--ink-muted` sobre `--background` puede quedar justo en el límite de AA; verificar (ver tabla).
- No hay grises intermedios, así que cualquier "texto de apoyo" cae directamente en `--ink-muted`, sin transición.

### 1.4 Componentes — catalog shallow

**`components/` (nivel raíz)**

| Componente | Qué hace | Usado en | Anima | Nota |
|---|---|---|---|---|
| `action-toast.tsx` | Toast auto-ocultable (success/error) para feedback de acciones. | Las 3 tablas admin `admin-*-actions-table.tsx`. | no | — |
| `admin-billing-actions-table.tsx` | Tabla admin con acciones para facturación. | `admin/billing/page.tsx`. | sí | (ojo) duplicación |
| `admin-groups-actions-table.tsx` | Tabla admin con acciones para grupos. | `admin/groups/page.tsx`. | sí | (ojo) duplicación |
| `admin-students-actions-table.tsx` | Tabla admin con acciones para alumnado (la más extensa). | `admin/students/page.tsx`. | sí | (ojo) duplicación |
| `animated-site-header.tsx` | Header que aparece cuando el loader termina y colapsa al hacer scroll. | `[locale]/layout.tsx`. | sí | — |
| `auth-credentials-form.tsx` | Formulario de login con email+password. | `acceso/page.tsx`. | sí | — |
| `auth-signout-button.tsx` | Botón para cerrar sesión. | `site-header-nav.tsx`. | sí | — |
| `auth-signup-form.tsx` | Formulario de alta de cuenta familia. | `acceso/crear-cuenta/page.tsx`. | sí | — |
| `coach-profile-card.tsx` | Tarjeta de perfil de entrenador/a con foto y disciplinas. | `sedes/[site]/page.tsx`. | sí | — |
| `erropak-gallery.tsx` | Galería pública de apariciones en medios. | `erropak/page.tsx`. | sí | (ojo) duplicación |
| `fototeca-gallery.tsx` | Galería pública de fototeca. | `fototeca/page.tsx`. | sí | (ojo) duplicación |
| `home-hero-scroll-sync.tsx` | Cliente que sincroniza scroll con `HomeHero` (progreso 0-1). | `(public)/page.tsx`. | no | wrapper sin motion propio |
| `home-hero.tsx` | Hero de la home con vanta waves y parallax. | `home-hero-scroll-sync.tsx`. | sí | — |
| `initial-loader.tsx` | Loader inicial (logo con escala + profundidad por scroll/rueda/touch). | `app/layout.tsx`. | sí | loader global |
| `page-transition-shell.tsx` | Envoltura que re-monta por `pathname` para aplicar `kodaore-route-motion`. | `[locale]/layout.tsx`. | sí | — |
| `site-footer.tsx` | Pie de página global. | `[locale]/layout.tsx`. | sí | — |
| `site-header-nav.tsx` | Navegación interna del header (enlaces + auth). | `animated-site-header.tsx`. | sí | — |
| `smart-image.tsx` | `next/image` con fallback + parallax opcional + soporte SVG. | 5 llamadas (sedes, home, galleries, coach). | no | utilidad reutilizada OK |
| `vanta-waves-background.tsx` | Fondo vanta waves animado con color-mix por progreso. | `not-found.tsx`, `home-hero.tsx`. | sí | dependencia pesada (three+vanta) |

**`app/[locale]/(backoffice)/admin/_shared/_components/`**

| Componente | Qué hace | Anima |
|---|---|---|
| `admin-stat-card.tsx` | Tarjeta KPI admin (label + valor, variante warning). | sí (`k-hover-lift`) |

**`app/[locale]/(family-portal)/portal/_components/`**

| Componente | Qué hace | Anima |
|---|---|---|
| `portal-quick-link-card.tsx` | Tarjeta-link de acceso rápido en portal familia. | sí (`k-hover-lift`) |
| `portal-summary-stat-card.tsx` | Tarjeta KPI portal con tono neutral/warning/success. | sí (`k-hover-lift`) |

> Nota: `app/[locale]/(family-portal)/portal/_utils/format.ts` es utilidad (no UI); fuera de scope del catalog.

**Sospechas de duplicación a validar en Fase 2**

- **3 tablas `admin-*-actions-table.tsx`** (billing = 481 líneas, groups = 587, students = 1188).
  - `diff -u billing↔groups` → 876 líneas de diff.
  - `diff -u groups↔students` → 1391 líneas de diff.
  - Aunque el diff es alto en bruto (students duplica tamaño por más columnas/acciones), la estructura (fetch/estado/`ActionToast` + tabla + modales de confirmación) es muy parecida. Probable refactor a 1 componente genérico `AdminActionsTable<T>` + props (`columns`, `actions`, `copy`).
- **2 galleries (`erropak-gallery.tsx` = 425 líneas, `fototeca-gallery.tsx` = 243 líneas)**: diff de 395 líneas. Ambas consumen datasets estáticos y usan `smart-image` con un mismo patrón de grid + lightbox. Plantilla compartida con datos distintos; candidato a `MediaGallery` parametrizable.
- **3 "stat cards"** (`admin-stat-card`, `portal-summary-stat-card`, `portal-quick-link-card` es variante-link): mismas clases (`k-hover-lift rounded-2xl border border-white/10 p-5`), valor grande + label pequeña, diferencias solo en tonos. Candidato a `StatCard` unificado con `tone` + `variant` (card/link).

### 1.5 Inventario de motion

**Tabla completa de motion**

| Nombre | Tipo | Ubicación | Duración | Curva | Trigger | Alcance | reduced-motion | Nota |
|---|---|---|---|---|---|---|---|---|
| `fade-rise` | css-keyframe | `app/globals.css:466` (uso `:101`) | 0.65s | ease | mount | utility global (`.fade-rise`, con delays 100-500ms) | desactivado | Entrada estándar de bloques (translateY 14px -> 0). |
| `fade-reveal-left` | css-keyframe | `app/globals.css:477` (uso `:105`) | 0.65s | ease | mount | utility global (`.fade-reveal-left`) | desactivado | Entrada lateral desde la izquierda (translateX -18px -> 0). |
| `kodaore-route-motion` | css-keyframe reuse | `app/globals.css:109` -> `fade-rise` | 0.5s | ease | route-change | wrapper `PageTransitionShell` | desactivado | Transición entre rutas; envuelve hijos dentro de `.kodaore-route-motion` y **cancela** `.fade-rise` / `.fade-reveal-left` anidados (`globals.css:113-118`). |
| `k-skip-link` | css-transition | `app/globals.css:92` | 180ms | ease | focus-visible | skip-link global | desactivado | Translate desde fuera del viewport al enfocar con teclado. |
| `k-hover-lift` | css-transition + `::before` gradient | `app/globals.css:146-183` | 260ms | cubic-bezier(0.22,0.61,0.36,1) | hover | utility reusable (stat cards, coach cards, tiles) | desactivado (y sin translate en `hover:none`) | Elevación `translateY(-3px)` + sombra + gradiente brand->warm por pseudo. |
| `k-hover-soft` | css-transition + `::before` gradient | `app/globals.css:185-219` | 220ms | ease | hover | utility reusable | desactivado | Variante sin translate, solo tono + gradiente. |
| `k-hover-action` | css-transition | `app/globals.css:221-233` | 180-220ms | ease | hover | botones de acción | desactivado | Microlift `translateY(-1px)` + box-shadow. |
| `k-row-hover` | css-transition | `app/globals.css:240-246` | 220ms | ease | hover | filas de tabla | desactivado | Background fade. |
| `kodaore-loader` (fade-out) | css-transition | `app/globals.css:258` | 0.56s | ease | state `.is-exit` | `InitialLoader` | desactivado | Fade del contenedor completo cuando termina. |
| `kodaore-loader-backdrop` (fade+scale) | css-transition | `app/globals.css:272-280` | 0.5s | ease | state `.is-exit` | `InitialLoader` | desactivado | Backdrop radial hace fade + `scale(1.06)` al salir. |
| `kodaore-loader-logo-wrap` (scroll-driven 3D) | js-driven (`requestAnimationFrame` + `translate3d` + `scale`) + css-transition | `components/initial-loader.tsx:78-278`, css `app/globals.css:291-314` | 0.18s transform / 0.36s opacity; exit 0.46-0.56s cubic-bezier(0.22,0.84,0.2,1) | cubic-bezier(0.22,0.61,0.36,1) | scroll wheel/touch (depth 0 -> ~1500) + timeout exit | layout global (montado en `app/layout.tsx`) | parcial (solo lee `matchMedia` para skipear inicialmente; exit sigue animándose) | **Intercepta scroll inicial** hasta completar progreso; su exit tapa la medida real de LCP. |
| `loader-word-rise` | css-keyframe | `app/globals.css:497` (uso `:327`) | 0.65s | ease | mount | `.kodaore-loader-word` (wordmark "KODAORE") | desactivado | Entrada del wordmark. |
| `loader-wave-sweep` | css-keyframe | `app/globals.css:508` (uso `:364`) | 1.25s | ease-in-out | idle-**infinite** | `.kodaore-loader-wave::after` | desactivado | Infinito mientras el loader está visible. |
| `loader-hint-bob` | css-keyframe | `app/globals.css:517` (uso `:382`) | 1.2s | ease-in-out | idle-**infinite** | `.kodaore-loader-hint.is-visible` | desactivado | Infinito mientras el hint está visible. |
| `footer-line-shift` | css-keyframe | `app/globals.css:488` (uso `:396`) | 7s | linear | idle-**infinite** | `.kodaore-footer-top-line` (footer global) | desactivado | **Infinito global**: se repinta cada 7s en todas las páginas. |
| `kodaore-social-icon` | css-transition + `::after` glow | `app/globals.css:410-438` | 250ms | ease | hover | footer social links | desactivado | `translateY(-2px) scale(1.03)` + glow brand/warm alternado. |
| `k-back-top` show/hide | css-transition | `app/globals.css:441-460` | 260ms | ease | state `.is-hidden`/`.is-visible` | botón back-to-top | desactivado | Fade + `translateY(10px) scale(0.95)`. |
| `back-top-bob` | css-keyframe | `app/globals.css:527` (uso `:463`) | 1.8s | ease-in-out | idle-**infinite** | `.k-back-top-label` | desactivado | Infinito mientras el botón está visible. |
| `SiteFooter` social icons enter | css (Tailwind) | `components/site-footer.tsx:156` | 300ms (transform) + `fade-rise` 0.65s | ease | IntersectionObserver `revealed` | footer global | desactivado (fade-rise globalmente cancelado por reduced-motion) | `transition-transform hover:scale-110` y class reveal entre `opacity-0 translate-y-6` y `fade-rise`. |
| `AnimatedSiteHeader` compact + deep | js-state + css-transition (Tailwind) | `components/animated-site-header.tsx:67-73` | 450-700ms | default | scroll (> 28 y > 50 px) | header global | no respetado explícitamente (Tailwind `transition-all`) | Cambia `py-3` <-> `py-1.5`, añade/quita `backdrop-blur-xl` a 50px y translada header fuera (`-translate-y-5`) al ocultar. **Potencial fuente de layout/repaint**. |
| `PageTransitionShell` | wrapper que aplica `.kodaore-route-motion` | `components/page-transition-shell.tsx:13` | 0.5s | ease | cambio de `pathname` | layout público | desactivado | Re-monta con key y reaplica keyframe. |
| `VantaWavesBackground` | js-driven (WebGL + Three.js, `setOptions`) | `components/vanta-waves-background.tsx:49,125,167` | continuo | Vanta default | mount + pointermove + scroll | hero `/` | desactivado también por `matchMedia('(prefers-reduced-motion: reduce)')`, <768px y touch | **Coste CPU/GPU alto**; solo desktop. |
| `HomeHeroScrollSync` progress | js-driven (`requestAnimationFrame`) | `components/home-hero-scroll-sync.tsx:42` | continuo | lineal | scroll | home hero | sin fallback explícito | Actualiza CSS custom property por scroll; no es una animación visible pero consume rAF. |
| `SmartImage` parallax | js-driven (`requestAnimationFrame`) + css-transition inline | `components/smart-image.tsx:64,91` | 140ms | linear | scroll + resize | imágenes con prop `parallax` | sin fallback explícito (el prop opcional) | `translate3d(0, Ypx, 0)` reactivo al centro del viewport. |
| `ErropakGallery` lightbox enter | js-driven (`requestAnimationFrame`) | `components/erropak-gallery.tsx:134` | — | — | abrir lightbox | `/erropak` | — | Encola un rAF tras abrir modal (foco/sync). |
| `CoachProfileCard` expand | js-driven (`requestAnimationFrame`) | `components/coach-profile-card.tsx:119` | — | — | expand/collapse | staff cards | — | rAF para sincronizar altura al expandir. |
| Image hover scale (Tailwind) | css-transition (Tailwind utility) | `app/[locale]/(public)/page.tsx:75,100,152`, `.../sedes/[site]/page.tsx:111`, `.../sedes/page.tsx:74` | 700ms | default | hover | cards de imagen | sin `motion-safe:` | `group-hover:scale-[1.02]/[1.03]/105`. |
| Hover overlay gradient (Tailwind) | css-transition (Tailwind utility) | `app/[locale]/(public)/page.tsx:64,110,159,163-164`, `.../fototeca/page.tsx:55-57`, `.../sedes/*` | 500ms | default | hover group | tarjetas/boxes públicos | sin `motion-safe:` | `opacity-0` -> `opacity-100` con `transition-opacity`/`transition-colors`. |
| Skeletons `animate-pulse` | Tailwind animación infinita | `app/[locale]/(backoffice)/admin/loading.tsx:5-22`, `app/[locale]/(family-portal)/portal/loading.tsx:5-24` | 2s | cubic-bezier | idle-**infinite** | skeletons de `loading.tsx` | Tailwind no desactiva por defecto; depende del `@media` de `globals.css` (no cubre `.animate-pulse`) | **Infinito mientras el skeleton se muestra** — no está cubierto por el media query reduced-motion de `globals.css`. |

**Animaciones infinitas (repintan mientras la página está abierta)**
- `footer-line-shift` (7s, linear) — **global en todas las rutas** (está en `SiteFooter`).
- `loader-wave-sweep` (1.25s) + `loader-hint-bob` (1.2s) — solo mientras el `InitialLoader` está visible.
- `back-top-bob` (1.8s) — mientras el botón back-to-top es visible (scroll > umbral).
- `VantaWavesBackground` (WebGL, continuo) — solo en `/`, solo desktop no-touch y sin reduced-motion.
- `animate-pulse` en `admin/loading.tsx` y `portal/loading.tsx` — mientras el skeleton esté presente y **no cubierto por el media query actual**.

**Animaciones que podrían disparar layout**
- `AnimatedSiteHeader`: cambia `py-3` <-> `py-1.5`, alterna `backdrop-blur-xl` + border tras 50px, y translada fuera de pantalla (`-translate-y-5`) al ocultar. En los traces actuales (Task 14) CLS queda en 0.00-0.01, bajo y no en riesgo hoy.
- `InitialLoader` al salir: transforma `scale` + `translate3d` + `opacity` — vive en su propio layer y el contenido de la página ya está detrás; no genera CLS si no se colapsa el espacio que ocupaba.
- `SiteFooter` social icons enter: anima `translateY`/`scale` al intersectar, pero ocurre dentro de su propio bloque sin desplazar hermanos.
- `SmartImage` parallax: solo transform (no layout), pero fuerza repaint en cada scroll.

**Observaciones**
- `prefers-reduced-motion` está respetado en `app/globals.css:563-595` con `!important` para desactivar animation/transition en loader, footer, social icons, back-to-top, `fade-rise`, `fade-reveal-left` y utilidades `k-hover-*` / `k-row-hover`. **No hay alternativa estática explícita**: las animaciones se eliminan, pero no se sustituyen por un cross-fade o estado neutro. Candidato a mejora en Fase 1.
- El media query **no cubre** `.animate-pulse` de Tailwind ni los `transition-*` utilitarios (image scale 700ms, overlay 500ms). La política de motion es mixta: las piezas de marca están protegidas, las utilidades de shell/listados/públicas no.
- Las animaciones son abundantes y con personalidad (cálidas, jerárquicas), pero no hay una división clara entre "motion primario" (feedback, estado, navegación) y "motion decorativo" (loader 3D, footer line, social glow, bobs infinitos). Todo convive al mismo nivel.
- El `InitialLoader` es la pieza más cara y más expuesta: intercepta scroll hasta ~1500px de depth acumulada, se monta en `app/layout.tsx` (todas las rutas), y su exit animation tapa la medida real de LCP.
- Cinco loops `requestAnimationFrame` activos simultáneamente en home desktop (Vanta, HeroScrollSync, SmartImage parallax, InitialLoader, CoachProfileCard/ErropakGallery cuando aplica) — revisar si se puede consolidar.

### 1.6 Diagnóstico global

Estado actual resumido de forma descriptiva. No son recomendaciones; son observaciones que Fase 1 usará como insumo.

**Lo que hay**
- Sistema de motion abundante y con personalidad: loader 3D scroll-driven, Vanta WebGL en hero, fades de ruta, `k-hover-lift` en cards, line-shift infinito en el footer, glow en iconos sociales. Tono cálido y distintivo.
- Paleta dual carmesí `--brand` + esmeralda `--brand-warm`; identidad vasca discreta pero fuerte. Contraste WCAG AA se cumple en todas las parejas críticas medidas.
- Tokens mínimos (10) bien centralizados en `app/globals.css` y expuestos a Tailwind vía `@theme inline`. Uso intensivo de `color-mix(in srgb, ...)` concentrado en `globals.css`, 0 usos dispersos en componentes.
- Tipografía dual: Manrope (sans) + Space Grotesk (heading), ambas cargadas por `next/font`. Escala efectiva domina `text-sm`/`text-xs`/`font-semibold`.
- `prefers-reduced-motion` está respetado en las animaciones de la casa (`fade-rise`, `k-hover-lift`, loader, Vanta, etc.) con un bloque `!important` en `globals.css`.

**Lo que se acumula**
- 3 capas de fondo permanentes superpuestas a `--background` en toda la aplicación (body gradient + grain SVG + `.kodaore-shell::before` radials).
- Al menos 4 animaciones infinitas activas según la ruta (footer-line-shift global; loader-wave-sweep y loader-hint-bob mientras el loader vive; back-top-bob mientras el botón aparece) + Vanta continuo en desktop. 5 bucles `requestAnimationFrame` concurrentes en desktop home.
- Patrones visuales duplicados (3 stat cards con utilities idénticas `k-hover-lift rounded-2xl border border-white/10 p-5`), y 2 galleries con estructura paralela (erropak, fototeca) aunque con diferencias de datos. Las 3 admin tables, pese a nombres gemelos, divergen mucho (diff 876–1391 líneas): no son tan clones como parecen.

**Lo que falta**
- Tokens semánticos `success`, `warning`, `info`. Escala de grises intermedia entre `foreground` y `ink-muted`. Niveles intermedios de surface (`surface-subtle`, `surface-elevated`). Tokens nombrados para `radius`, `shadow`, `spacing`.
- Alternativa explícita en `prefers-reduced-motion`: hoy las animaciones se desactivan, no se sustituyen por un cross-fade mínimo u otro estado neutro.
- Jerarquía declarada de motion: no hay distinción en el código entre motion primario (feedback de interacción, cambio de estado) y motion decorativo (loader, footer line, Vanta). Todo convive al mismo nivel.
- Cobertura uniforme de reduced-motion: las `animate-pulse` de los loading skeletons de `/admin/loading.tsx` y `/portal/loading.tsx`, y varias transiciones de utilities Tailwind (image scale en hover, fade de overlays) **no** están dentro del `@media (prefers-reduced-motion: reduce)` actual.
- Responsive tipográfico coherente: `clamp()` aparece en hero y loader, pero el resto del sitio usa tamaños fijos. La convivencia es parcial.
- LCP observable: el `InitialLoader` cubre el contenido hasta que el usuario hace scroll, lo que hace que las métricas de Largest Contentful Paint no se estabilicen en los perf traces en modo navegación (CLS sí se mide, y sale muy bajo 0.00–0.01).

Estas observaciones alimentan Fase 1 sin predecirla. Las decisiones de dirección visual y de motion se toman en esa fase con las tres direcciones y los tokens de motion propuestos en el workflow del proyecto.

## Capa 2 — Route atlas

### / — Home
Audiencia: pública

**Screenshots**
- mobile eu: [top](../.audit/baseline/home/mobile/eu/top.png) · [full](../.audit/baseline/home/mobile/eu/full.png)
- mobile es: [top](../.audit/baseline/home/mobile/es/top.png) · [full](../.audit/baseline/home/mobile/es/full.png)
- desktop eu: [top](../.audit/baseline/home/desktop/eu/top.png) · [full](../.audit/baseline/home/desktop/eu/full.png)
- desktop es: [top](../.audit/baseline/home/desktop/es/top.png) · [full](../.audit/baseline/home/desktop/es/full.png)

**Métricas**
- Lighthouse desktop: A11y 100 / BP 100 / SEO 83.
- Lighthouse mobile: A11y 100 / BP 100 / SEO 83.
- Perf trace desktop: CLS 0.01, LCP no reportado, INP no reportado.
- Perf trace mobile: CLS 0.00, LCP no reportado, INP no reportado.

**Motion en esta ruta**
- → 1.5/InitialLoader (montado vía `app/layout.tsx`, intercepta scroll hasta ~1500px).
- → 1.5/Vanta fog (hero desktop, loop `requestAnimationFrame` continuo).
- → 1.5/HeroScrollSync (sincroniza tagline + heroTitle con scroll).
- → 1.5/fade-rise (secciones sedes, store, final con `fade-rise-delay-200/250/300`).
- → 1.5/fade-reveal-left (subtítulos y párrafos descriptivos).
- → 1.5/k-hover-lift y k-hover-soft (tarjetas de sedes, bloque store, bloque final).
- → 1.5/image scale hover 700ms (SmartImage `group-hover:scale-105` en 3 tarjetas).

**Componentes clave**
- → 1.4/HomeHeroScrollSync (`@/components/home-hero-scroll-sync`).
- → 1.4/SmartImage (`@/components/smart-image`, con `parallax` en tarjetas de sede).
- → 1.4/Layout shell (body gradient + grain SVG + `.kodaore-shell::before` radials).

**Observaciones visuales**
- Estructura de 3 secciones apiladas: hero con tagline + título + scroll sync, grid de 3 sedes y bloque dual store + foto destacada.
- Las 3 tarjetas de sede comparten la misma utility stack (`k-hover-lift rounded-2xl border border-white/10 bg-surface-strong p-5 shadow-[...]`).
- El bloque store utiliza layout `md:grid-cols-[1.2fr_0.9fr]`; el bloque final repite ese mismo patrón.
- Pills de categorías (Sudaderak/Kamisetak/Osagarriak) aparecen en el lateral del bloque store con tracking `0.12em` y borde `white/20`.
- CTA "Erropak ikusi" / "Descubrir" usa `k-focus-ring k-hover-action` con borde `brand/35`.

**Observaciones de motion**
- La ruta concentra al menos 5 bucles `requestAnimationFrame` simultáneos en desktop (Vanta + HeroScrollSync + SmartImage parallax + InitialLoader + footer-line-shift global).
- Los `transition duration-700 group-hover:scale-105` en SmartImage no están cubiertos por el bloque `prefers-reduced-motion` (mixed policy identificada en 1.5).
- `fade-rise-delay-200/250/300` encadena la entrada en cascada de las 3 secciones tras el layout principal.
- Los overlays de gradiente (`from-brand/18 via-transparent to-brand-warm/18`) son `opacity-0` → `group-hover:opacity-100` con `duration-500`.

**i18n**
- Longitudes eu/es similares en copy de marca; el tagline y `heroTitle` vienen de `copy.home` y suelen rozar la misma longitud. Las pills "Sudaderak/Kamisetak/Osagarriak" son visiblemente más cortas en eu.

**Riesgos para Fase 4**
- `InitialLoader` global tapa LCP y depende de `app/layout.tsx`: cualquier cambio de hero coordinadamente con él.
- Tres tarjetas con `absolute inset-0` + `SmartImage fill` + `parallax`: reemplazar el componente tiene impacto en 1.4 y en el loop RAF del parallax.
- Copy de pills y CTAs crece en es más que en eu ("Sudaderas" ≈ "Sudaderak"); hay que respetar el `max-w` actual en rediseño.

### /sedes — Sedes (listado)
Audiencia: pública

**Screenshots**
- mobile eu: [top](../.audit/baseline/sedes/mobile/eu/top.png) · [full](../.audit/baseline/sedes/mobile/eu/full.png)
- mobile es: [top](../.audit/baseline/sedes/mobile/es/top.png) · [full](../.audit/baseline/sedes/mobile/es/full.png)
- desktop eu: [top](../.audit/baseline/sedes/desktop/eu/top.png) · [full](../.audit/baseline/sedes/desktop/eu/full.png)
- desktop es: [top](../.audit/baseline/sedes/desktop/es/top.png) · [full](../.audit/baseline/sedes/desktop/es/full.png)

**Métricas**
- No medido en Fase 0 reducida — screenshots disponibles.

**Motion en esta ruta**
- → 1.5/fade-rise (header, grid de sedes, bloque final).
- → 1.5/k-hover-lift (tarjetas de sede en grid).
- → 1.5/k-hover-soft (bloque de texto dentro de tarjeta, bloque final).
- → 1.5/k-hover-action (pills de navegación superior).
- → 1.5/image scale hover 700ms (`SmartImage group-hover:scale-[1.03]`).
- → 1.5/overlay opacity 500ms (gradientes brand/brand-warm en hover de tarjeta).

**Componentes clave**
- → 1.4/SmartImage (`@/components/smart-image`, sin `parallax` aquí).
- → 1.4/Layout shell + global header.

**Observaciones visuales**
- Cabecera con eyebrow "Kodaore", `h1` grande (`text-3xl md:text-4xl`) y descripción ancha (`max-w-2xl`).
- Pills de acceso rápido a cada sede con borde `white/20` y hover `brand/35` (una por sede).
- Grid de 3 tarjetas (`md:grid-cols-3`) con `rounded-[2rem]`, gradiente `bg-gradient-to-b from-surface-strong via-surface-strong to-surface/80` y sombra `0_16px_34px_rgba(15,23,42,0.24)`.
- Cada tarjeta muestra imagen cover (`h-50`), badge "Kodaore" absoluto, título, descripción y lista de entrenadores.
- Sección final en `bg-[#151719]` con bloque de foto destacada que reutiliza `copy.home.photoTitle` y `photoHint`.

**Observaciones de motion**
- `k-hover-lift` y `k-hover-soft` conviven en el mismo árbol (tarjeta + bloque texto interno) creando dos hovers anidados con `group` y `group/text`.
- El gradiente interno (`inset-2 rounded-[1.2rem] bg-gradient-to-br from-brand/10 via-transparent to-brand-warm/10`) suma un layer extra de motion decorativo al hover.
- No hay delays escalonados (`fade-rise-delay-*`) aquí: todo entra con el mismo `fade-rise`.

**i18n**
- Longitudes eu/es similares: nombres de sedes invariables, descripciones y lista de entrenadores comparten plantilla.

**Riesgos para Fase 4**
- 3 tarjetas paralelas con misma utility stack — cualquier rediseño requiere componer un subcomponente reusable y no lo hay hoy.
- `h-50` fija en la imagen cover no es token: si se normalizan alturas de media hay que tocar aquí y en sede dinámica.
- Lista dinámica de entrenadores crece con la plantilla de datos: un diseño con más aire por coach puede romper layout en la tercera tarjeta.

### /sedes/azkoitia — Sede Azkoitia (plantilla dinámica)
Audiencia: pública

**Screenshots**
- mobile eu: [top](../.audit/baseline/sedes__azkoitia/mobile/eu/top.png) · [full](../.audit/baseline/sedes__azkoitia/mobile/eu/full.png)
- mobile es: [top](../.audit/baseline/sedes__azkoitia/mobile/es/top.png) · [full](../.audit/baseline/sedes__azkoitia/mobile/es/full.png)
- desktop eu: [top](../.audit/baseline/sedes__azkoitia/desktop/eu/top.png) · [full](../.audit/baseline/sedes__azkoitia/desktop/eu/full.png)
- desktop es: [top](../.audit/baseline/sedes__azkoitia/desktop/es/top.png) · [full](../.audit/baseline/sedes__azkoitia/desktop/es/full.png)

**Métricas**
- No medido en Fase 0 reducida — screenshots disponibles.

**Motion en esta ruta**
- → 1.5/fade-rise (ambos `panelSectionClass`).
- → 1.5/k-hover-lift (article de cover image).
- → 1.5/k-hover-soft (bloque de texto introductorio).
- → 1.5/k-hover-action (pills de tabs de sedes).
- → 1.5/CoachProfileCard interno (3 cards, cada una con su propio motion interno).
- → 1.5/image scale hover 700ms (cover image, 280→420px min-height).

**Componentes clave**
- → 1.4/CoachProfileCard (`@/components/coach-profile-card`).
- → 1.4/SmartImage (cover con `priority`, sin parallax).
- → 1.4/buildSiteStructuredData (JSON-LD LocalBusiness inyectado).

**Observaciones visuales**
- Plantilla reusa datos de la sede seleccionada (`copy.home.sites.find`); Azkoitia/Azpeitia/Zumaia comparten layout.
- Barra superior de tabs con estado activo `border-brand bg-brand text-brand-contrast` y resto `border-white/20 bg-surface-strong`.
- Cover image priorizada con `min-h-[280px] md:min-h-[420px]` — pieza visual más pesada de la ruta.
- Sección "Coaches" en grid de 3 (`md:grid-cols-3`) con `CoachProfileCard` que extiende funcionalidad (disciplinas, bio extendida según commits recientes).
- Inyecta `script type="application/ld+json"` con datos estructurados si `structuredData` se construye.

**Observaciones de motion**
- `CoachProfileCard` añade su propio bucle RAF si hay flip/hover animado (según 1.5 apparece entre los 5 bucles simultáneos en determinadas rutas).
- Dos niveles de hover anidado: `group/text` en el bloque intro + `group` en el cover image, más `group` interno por coach card.
- `priority` en la cover image desactiva lazy-loading y adelanta el LCP real; puede chocar con `InitialLoader`.

**i18n**
- Descripciones de sede largas en ambos idiomas; `selectedSite.description` es una frase corporativa con longitudes equilibradas. Título `h1` invariable (nombre de sede).

**Riesgos para Fase 4**
- `CoachProfileCard` es un black-box para esta página: cualquier rediseño de tarjeta de entrenador impacta directamente aquí sin tocar el page.
- `getSiteMedia(site)` y galería fallback: cambios en estructura de media afectan a las 3 sedes simultáneamente.
- JSON-LD inline dentro del árbol React: si se mueve a `generateMetadata` hay que revisar SEO baseline.

### /fototeca — Fototeca
Audiencia: pública

**Screenshots**
- mobile eu: [top](../.audit/baseline/fototeca/mobile/eu/top.png) · [full](../.audit/baseline/fototeca/mobile/eu/full.png)
- mobile es: [top](../.audit/baseline/fototeca/mobile/es/top.png) · [full](../.audit/baseline/fototeca/mobile/es/full.png)
- desktop eu: [top](../.audit/baseline/fototeca/desktop/eu/top.png) · [full](../.audit/baseline/fototeca/desktop/eu/full.png)
- desktop es: [top](../.audit/baseline/fototeca/desktop/es/top.png) · [full](../.audit/baseline/fototeca/desktop/es/full.png)

**Métricas**
- No medido en Fase 0 reducida — screenshots disponibles.

**Motion en esta ruta**
- → 1.5/fade-rise (header panel + final panel).
- → 1.5/k-hover-soft (chip-logo Kodaore del header, bloque final).
- → 1.5/FototecaGallery interno (client component con grid interactivo).
- → 1.5/overlay opacity 500ms (gradientes brand en bloque final).

**Componentes clave**
- → 1.4/FototecaGallery (`@/components/fototeca-gallery`, client).
- → 1.4/getFototecaItems (`@/lib/fototeca`, resolver de items en server).
- → 1.4/Image de `next/image` (solo el logo del eyebrow).

**Observaciones visuales**
- Header minimalista: chip con logo Kodaore (tipografía partida en tres colores `Ko`-`dao`-`re`), título `h1 text-3xl md:text-4xl` y descripción.
- Cuerpo dominado por `FototecaGallery`: el page sólo pasa `items`, `brand` y `locale`, toda la densidad visual vive en ese componente.
- Sección final replica el patrón de "photo hint" ya visto en home y sedes (bloque en `bg-[#151719]`).

**Observaciones de motion**
- Toda la interacción de la galería queda encapsulada en `FototecaGallery` (client) — el server page no añade motion propio más allá de los `fade-rise`.
- El chip del logo tiene `k-hover-soft` aunque no es interactivo: motion decorativo menor.

**i18n**
- Pocas strings en el page; ambos idiomas usan `copy.ctas.gallery` y `copy.home.photoDescription`. Longitudes similares.

**Riesgos para Fase 4**
- La densidad visual y el grid fototeca vive al 100% en `FototecaGallery`; cualquier rediseño de la página se traduce en reescribir ese componente.
- Carga de `getFototecaItems` (async server) se ejecuta antes del render: si crece el dataset hay que paginar y eso rompe el layout actual de galería "full".

### /erropak — Erropak (catálogo de ropa)
Audiencia: pública

**Screenshots**
- mobile eu: [top](../.audit/baseline/erropak/mobile/eu/top.png) · [full](../.audit/baseline/erropak/mobile/eu/full.png)
- mobile es: [top](../.audit/baseline/erropak/mobile/es/top.png) · [full](../.audit/baseline/erropak/mobile/es/full.png)
- desktop eu: [top](../.audit/baseline/erropak/desktop/eu/top.png) · [full](../.audit/baseline/erropak/desktop/eu/full.png)
- desktop es: [top](../.audit/baseline/erropak/desktop/es/top.png) · [full](../.audit/baseline/erropak/desktop/es/full.png)

**Métricas**
- No medido en Fase 0 reducida — screenshots disponibles.

**Motion en esta ruta**
- → 1.5/fade-rise (hero, grid highlights).
- → 1.5/k-hover-soft (bloque "Cómo funciona", highlights grid, gallery items).
- → 1.5/k-hover-action (CTA "Informazioa eskatu / Solicitar informacion").
- → 1.5/overlay opacity 500ms (gradientes brand/brand-warm en hover de cards y bloques).
- → 1.5/ErropakGallery interno (zoom/ampliación de prendas).

**Componentes clave**
- → 1.4/ErropakGallery (`@/components/erropak-gallery`, client con ampliar/filtrar).
- → 1.4/Link de `next/link` hacia `/acceso` (CTA de conversión).

**Observaciones visuales**
- Hero dividido 1.25fr / 0.95fr: article con tag + h1 + descripción + pills de categoría, y article "Nola funtzionatzen du" con 3 pasos numerados.
- Dataset `clothingItems` hardcodeado en el page (6 prendas con `categoryKey`, nombre eu/es, categoría eu/es e imágenes del mismo pool que home).
- Grid de 3 highlights con utility stack idéntica (`k-hover-soft rounded-2xl border border-white/10 bg-surface-strong/70 p-4`).
- La galería `ErropakGallery` recibe el array completo y maneja filtros + ampliación en cliente.

**Observaciones de motion**
- Patrón duplicado con fototeca: 2 galleries con estructura paralela aunque con datos y filtros distintos (identificado en 1.6).
- El hero tiene un hover compuesto: `group/how` en el bloque de pasos activa gradiente `brand/brand-warm` con `duration-500`.

**i18n**
- "Kodaore Erropak" es invariable; las pills (`Sudaderak/Kamisetak/Osagarriak`) son más cortas en eu que en es. Descripciones de highlights también algo más cortas en eu.

**Riesgos para Fase 4**
- Catálogo hardcodeado en el componente servidor: si se promueve a CMS/DB, hay que refactorizar también el tipado `ErropakGalleryItem`.
- `ErropakGallery` es el componente más denso de la ruta: cualquier cambio de estética (grid masonry, carrusel, detalle) impacta ese componente aislado.
- CTA apunta a `/acceso`; cualquier cambio de flujo de captura de interés (formulario embed vs redirect) rompe este patrón.

### /acceso — Acceso (login)
Audiencia: pública

**Screenshots**
- mobile eu: [top](../.audit/baseline/acceso/mobile/eu/top.png) · [full](../.audit/baseline/acceso/mobile/eu/full.png)
- mobile es: [top](../.audit/baseline/acceso/mobile/es/top.png) · [full](../.audit/baseline/acceso/mobile/es/full.png)
- desktop eu: [top](../.audit/baseline/acceso/desktop/eu/top.png) · [full](../.audit/baseline/acceso/desktop/eu/full.png)
- desktop es: [top](../.audit/baseline/acceso/desktop/es/top.png) · [full](../.audit/baseline/acceso/desktop/es/full.png)

**Métricas**
- Lighthouse desktop: A11y 100 / BP 100 / SEO 83.
- Lighthouse mobile: A11y 100 / BP 100 / SEO 83.
- Perf trace desktop: CLS 0.00, LCP no reportado, INP no reportado.
- Perf trace mobile: CLS 0.00, LCP no reportado, INP no reportado.

**Motion en esta ruta**
- → 1.5/fade-rise (panel único centrado `max-w-lg`).
- → 1.5/k-focus-ring (foco visible en inputs del formulario).
- → 1.5/k-hover-action (CTA "Crear cuenta de familia").
- → 1.5/AuthCredentialsForm interno (validación + feedback en cliente).

**Componentes clave**
- → 1.4/AuthCredentialsForm (`@/components/auth-credentials-form`, client con react-hook-form + zod).
- → 1.4/getAuthSession (`@/lib/auth`) + redirect server-side si ya hay sesión.

**Observaciones visuales**
- Layout simple: un único panel centrado (`mx-auto max-w-lg rounded-3xl border border-white/10 bg-surface p-6 md:p-8`).
- Eyebrow "Sarbidea / Acceso" en `uppercase tracking-[0.2em] text-brand-emphasis`, `h1` con `font-heading`.
- Bloque secundario "Nuevos clientes / Bezero berriak" con borde suave y CTA a `/acceso/crear-cuenta` usando `bg-[color:var(--brand)]/85` sólido (único CTA brand-filled de la ruta).
- El page hace redirect si hay sesión (admin → `/admin`, resto → `/portal`); usuarios sin sesión llegan al render.

**Observaciones de motion**
- Motion mínimo: sólo `fade-rise` del panel + animaciones internas del formulario al validar.
- Sin hover-lift, sin parallax, sin overlays de gradiente: ruta deliberadamente calmada.

**i18n**
- "Saioa hasi" (eu, 10c) vs "Iniciar sesion" (es, 14c): títulos de longitud parecida. El CTA "Familia kontua sortu" (eu) vs "Crear cuenta de familia" (es) son muy similares en longitud; ambos caben en una línea en desktop.

**Riesgos para Fase 4**
- El formulario completo vive en `AuthCredentialsForm`: cambios de estética de inputs/feedback tocan ese client component.
- Lógica de redirect por roles (`ADMIN_ROLE_CODES`) está en el page: cualquier rediseño que quiera teasar roles antes de login debe respetar esta rama.

### /acceso/crear-cuenta — Alta de familia
Audiencia: pública

**Screenshots**
- mobile eu: [top](../.audit/baseline/acceso__crear-cuenta/mobile/eu/top.png) · [full](../.audit/baseline/acceso__crear-cuenta/mobile/eu/full.png)
- mobile es: [top](../.audit/baseline/acceso__crear-cuenta/mobile/es/top.png) · [full](../.audit/baseline/acceso__crear-cuenta/mobile/es/full.png)
- desktop eu: [top](../.audit/baseline/acceso__crear-cuenta/desktop/eu/top.png) · [full](../.audit/baseline/acceso__crear-cuenta/desktop/eu/full.png)
- desktop es: [top](../.audit/baseline/acceso__crear-cuenta/desktop/es/top.png) · [full](../.audit/baseline/acceso__crear-cuenta/desktop/es/full.png)

**Métricas**
- No medido en Fase 0 reducida — screenshots disponibles.

**Motion en esta ruta**
- → 1.5/fade-rise (panel único centrado `max-w-xl`).
- → 1.5/k-focus-ring (foco visible en inputs del AuthSignupForm).
- → 1.5/AuthSignupForm interno (validación en cliente, estados por campo).

**Componentes clave**
- → 1.4/AuthSignupForm (`@/components/auth-signup-form`, client con react-hook-form + zod).

**Observaciones visuales**
- Panel más ancho que el de login (`max-w-xl` vs `max-w-lg`) para acomodar formulario de alta con más campos.
- Misma cabecera tipográfica que `/acceso`: eyebrow "Alta berria / Nueva alta", `h1` con `font-heading`, párrafo corto descriptivo.
- Toda la densidad del page es el `AuthSignupForm`: inputs, validación, error states, submit y redirect post-alta.

**Observaciones de motion**
- Ruta con el perfil de motion más tranquilo del grupo público (igual que `/acceso`): `fade-rise` de panel + motion interno del form.
- No hay decoraciones de fondo ni hover interactivo sobre elementos no-form.

**i18n**
- "Familia kontua sortu" (eu) vs "Crear cuenta de familia" (es): casi idéntica longitud. Textos de copy son explicativos cortos y se mantienen balanceados.

**Riesgos para Fase 4**
- Form enteramente en `AuthSignupForm`: rediseño (multi-step, wizard, stepper) no se ve reflejado en el page y requiere rearquitectura del componente.
- El flujo de redirect tras alta vive dentro del client component; cualquier cambio de UX post-signup (modal de bienvenida, onboarding) se decide ahí.

### /sedes/azpeitia — Sede Azpeitia (plantilla dinámica)
Audiencia: pública

**Screenshot**: [desktop eu top](../.audit/baseline/sedes__azpeitia/desktop/eu/top.png)

Comparte la plantilla `sedes/[site]/page.tsx` con Azkoitia — cambian copy (progresión hasta nivel aurreratua), foto de portada y lista de coaches. Mismo perfil de motion y componentes (`CoachProfileCard`, `k-hover-lift`).

### /sedes/zumaia — Sede Zumaia (plantilla dinámica)
Audiencia: pública

**Screenshot**: [desktop eu top](../.audit/baseline/sedes__zumaia/desktop/eu/top.png)

Comparte la plantilla con las otras sedes — cambian copy y fotografía. Mismo perfil de motion y componentes.

### /legal/terms — Términos y condiciones
Audiencia: pública

**Screenshot**: [desktop eu top](../.audit/baseline/legal__terms/desktop/eu/top.png)

Placeholder legal estático (hero + 5 secciones numeradas: uso aceptable, seguridad de cuenta, disponibilidad, propiedad intelectual, ley aplicable) en tarjetas `rounded-3xl/2xl` sobre `bg-surface`, tipografía `font-heading` densa y único motion `fade-rise` al entrar.

### /legal/privacy — Política de privacidad
Audiencia: pública

**Screenshot**: [desktop eu top](../.audit/baseline/legal__privacy/desktop/eu/top.png)

Mismo layout que terms (hero + 5 secciones: responsable, finalidad, plazos, derechos, contacto con email) con copy placeholder; tarjetas sobre `bg-surface`, motion `fade-rise` único.
