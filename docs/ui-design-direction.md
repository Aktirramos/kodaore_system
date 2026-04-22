# Dirección de diseño — Fase 1 de Kodaore

Fecha: 2026-04-22
Contexto: salida de Fase 0 (`docs/ui-audit.md`) → entrada a Fase 3 (plan de ejecución).
Worktree de diseño: `ui-direction-fase-1` (basado en `main` post-audit).

Documento único: tokens, tipografía, motion y reglas de aplicación. Fuente de verdad para Fase 2 y 4.

## 1. Dirección visual elegida: **Dojo Moderno**

Escuela contemporánea con alma. Rigor institucional + calidez mínima. Un sistema que funciona igual de bien para las familias en portal/landing que para admins en backoffice, sin partirse en dos universos.

**Justificación:**
- **El logo manda.** Círculo blanco, trazo a pincel, red+green (ikurriña-adjacent), kanji 柔道, montañas de Gipuzkoa. Es cálido, orgánico, vive en blanco. Dojo Moderno recoge esa cualidad sin copiarla literalmente.
- **Escala cross-audiencia.** Admin densa no rompe con landing cálida: mismo sistema, diferentes densidades. Una tutora que entra al admin ocasionalmente no cambia de idioma visual.
- **Evita dos trampas concretas:** "restaurante sushi elegante" (riesgo de una dirección `Washi & Sumi`) y "turismo rural" (riesgo de una dirección `Oinarri`). El pincel del logo aparece como acento puntual (hero, página de sede, loader de sección), no como tema omnipresente.
- **Identidad vasca discreta** vía la pareja carmesí+esmeralda y el logo; sin decorativismo vasco literal (nada de lauburu, nada de banderas, nada de euskera ornamental).
- **Alineación con mission:** calidez para familias, densidad/velocidad para admin, mobile-first, estructuras respetuosas con strings largos en euskera.

**Direcciones descartadas y por qué:**
- *Washi & Sumi* (papel japonés + tinta, serif humanista, motion "ink reveal"): queda ceremonial y cerrado; difícil escalar a admin; lectura estética "boutique de diseñador" en vez de "club de judo del barrio".
- *Oinarri* (vasco rural, serif con carácter, motion físico): queda "turismo rural" o "casa rural"; demasiado cálido y poco institucional para `/admin/billing`.

## 2. Chroma base

- **Light first.** Fondo `surface.base` = `#fafaf7` (papel cálido neutro). Admin sobre el mismo sistema, con matices más fríos en superficies.
- **Dark mode vía `@media (prefers-color-scheme: dark)`.** Automático, no hay toggle en UI. Los tokens se definen semánticamente (`surface`, `ink`, `border`…), y la capa dark se superpone con los mismos nombres pero valores invertidos.
- **No hay UI de cambio de tema en Fase 1.** Justificación: cero coste operativo si los tokens están bien, respeta la preferencia del sistema operativo del usuario, y evita un componente de UI que tutoras tendrían que descubrir.

El estado actual del sitio (100% dark + Vanta + grain global) es herencia técnica — Vanta se implementó fácil en dark, pero el logo pide light. Fase 1 corrige ese desalineamiento.

## 3. Tokens de color

Todos los valores hex están en formato exacto para copiar a Tailwind `@theme`. Los tokens son semánticos, no literales.

### 3.1 Surface — superficies

| Token | Light | Dark | Uso |
|---|---|---|---|
| `surface.base` | `#fafaf7` | `#0f1013` | Fondo global página (95% de los casos). |
| `surface.subtle` | `#f3f1ea` | `#1a1c21` | Cards normales, grupos de info, sidebars. |
| `surface.elevated` | `#ffffff` | `#24272e` | Modales, dropdowns, toasts, tooltips. |
| `surface.inverse` | `#13141a` | `#fafaf7` | Cintas ocasionales (hero stripe, footer alternativo). |

### 3.2 Ink — tipografía e iconografía

| Token | Light | Dark | Ratio de contraste sobre `surface.base` | Uso |
|---|---|---|---|---|
| `ink.primary` | `#13141a` | `#fafaf7` | ≥16:1 / ≥16:1 | Titulares, texto principal. |
| `ink.secondary` | `#3a3e47` | `#c9cdd4` | ≥9:1 / ≥9:1 | Descripciones, párrafos, labels. |
| `ink.muted` | `#737680` | `#8a8e96` | ≥4.8:1 / ≥4.5:1 | Metadata, captions, placeholder. |
| `ink.inverse` | `#fafaf7` | `#13141a` | — | Sobre `surface.inverse` o sobre brand/accent sólidos. |

### 3.3 Border — separadores

| Token | Light | Dark | Uso |
|---|---|---|---|
| `border.subtle` | `#efede5` | `#24272e` | Líneas de separación muy tenues dentro de una card. |
| `border.default` | `#d6d2c6` | `#33363d` | Bordes de card, inputs, tabla. |
| `border.strong` | `#13141a` | `#fafaf7` | Divisores estructurales de layout. |
| `border.focus` | `#c2272d` | `#d8603d` | Outline de focus. Sólo para estados `:focus-visible`. |

### 3.4 Brand — primario

| Token | Light | Dark | Uso |
|---|---|---|---|
| `brand.base` | `#c2272d` | `#d8603d` | CTAs primarios, links activos, estado seleccionado. |
| `brand.emphasis` | `#9a1e25` | `#b3472a` | Hover y focus de elementos brand. |
| `brand.subtle` | `#fde8e8` | `#2e1416` | Background para badges, highlights, banners de marca. |
| `brand.contrast` | `#ffffff` | `#ffffff` | Texto sobre brand sólido. |

Justificación de `#c2272d`: coincide con el rojo del wordmark del logo Kodaore, ligeramente más vivo que el `#be123c` actual (carmesí muy oscuro, casi vino); se lee mejor sobre fondo cálido.

### 3.5 Accent — secundario

| Token | Light | Dark | Uso |
|---|---|---|---|
| `accent.base` | `#1fa35c` | `#2cbe76` | Highlights secundarios, chips de categoría, segundo tier de CTA. Alias de `success.base`. |
| `accent.emphasis` | `#167d47` | `#1ea05d` | Hover / focus del accent. |
| `accent.subtle` | `#e2f1ea` | `#10241b` | Background de badges accent, banners success. |

### 3.6 Estados — semánticos

| Token | Light | Dark | Uso |
|---|---|---|---|
| `success.base` | `#1fa35c` | `#2cbe76` | Alias de `accent.base`. |
| `warning.base` | `#b8851f` | `#e0a83b` | Amarillo ocre. Contenido a revisar. No para estados críticos. |
| `info.base` | `#2d7a85` | `#4a9fab` | Teal muted. Avisos neutros, deliberadamente lejos de brand. |
| `danger.base` | `#8a1f22` | `#b03030` | Rojo más oscuro y apagado que brand. Reservado a error states y acciones destructivas. |

### 3.7 Convivencia brand vs danger

Brand (`#c2272d`) y danger (`#8a1f22`) son dos rojos cercanos. Regla de uso para evitar confusión:
- **Brand** = acciones positivas, CTAs, links. Se usa en contextos donde el rojo es identidad.
- **Danger** = error states, acciones destructivas. Más oscuro, menos saturado. Se usa con icono de alerta explícito y/o con texto descriptivo, nunca sólo por color.

## 4. Tipografía

### 4.1 Familia única: **Inter**

- **Inter** (variable, axes: weight 100–900, optical size): body, UI, tablas, formularios.
- **Inter Display** (variante optical size de Inter): headings ≥20px.

Retira del bundle: Manrope y Space Grotesk. Motivo: un solo payload HTTP, menor CLS, coherencia.

Licencia: OFL (libre). Soporte: euskera completo (ñ, acentos, signos).

### 4.2 Escala

Escala modular ratio 1.2 con `clamp()` responsive. Valores min→max.

| Token | Tamaño | Peso | Line-height | Letter-spacing | Uso |
|---|---|---|---|---|---|
| `display.xl` | 56→72px | 600 | 0.95 | −0.025em | Hero principal (máx 1 por página). |
| `display.lg` | 40→56px | 600 | 1.00 | −0.02em | Hero secundario. |
| `heading.xl` | 30→36px | 600 | 1.10 | −0.015em | Título de sección principal. |
| `heading.lg` | 24→28px | 600 | 1.20 | −0.01em | Título de sección. |
| `heading.md` | 20→22px | 600 | 1.30 | −0.005em | Subtítulo de bloque. |
| `heading.sm` | 16→18px | 600 | 1.35 | 0 | Título de card, cabecera de tabla. |
| `body.lg` | 16→18px | 400 | 1.55 | 0 | Intro de página pública. |
| `body.md` | 14→15px | 400 | 1.55 | 0 | Body default. |
| `body.sm` | 13→14px | 400 | 1.55 | 0 | Formularios, densidad admin, captions largos. |
| `caption` | 11→12px | 500 | 1.40 | 0.08em | Eyebrows, labels, tags con tracking. |
| `mono` | 13px | 400 | 1.55 | 0 | IDs, importes, fechas, código. Familia: `ui-monospace`. |

Display tokens usan Inter Display; el resto usa Inter normal. La variante Inter Display se activa vía `font-family` alternativo o via CSS `font-variation-settings` si se usa un solo archivo variable.

## 5. Spacing · radius · shadow · border-width

### 5.1 Spacing

Base 4px. Escala armónica usada por Tailwind. Tokens nombrados en `@theme`:

```
space.0   0
space.1   4px
space.2   8px
space.3   12px
space.4   16px
space.5   20px
space.6   24px
space.8   32px
space.10  40px
space.12  48px
space.16  64px
space.20  80px
space.24  96px
```

Guía de uso:
- `space.1–3` (4–12): gap interno en inputs, líneas adyacentes, badges.
- `space.4–6` (16–24): padding de cards, gap entre elementos de formulario.
- `space.8–12` (32–48): gap entre secciones dentro de un bloque.
- `space.16–24` (64–96): separación entre secciones de página / ritmo vertical de landing.

### 5.2 Radius

| Token | Valor | Uso |
|---|---|---|
| `radius.sm` | 4px | Inputs, celdas de tabla, pildoritas pequeñas. |
| `radius.md` | 8px | Botones secundarios, dropdowns, toasts. |
| `radius.lg` | 12px | Cards default, chips. |
| `radius.xl` | 18px | Cards grandes, hero cards, modales. |
| `radius.2xl` | 24px | Hero containers, bloques destacados. |
| `radius.pill` | 999px | Botones primarios, badges de marca, skip-link. |

### 5.3 Shadow

Tres niveles estrictos. La sombra indica elevación funcional, no decoración.

| Token | Valor (light) | Valor (dark) | Uso |
|---|---|---|---|
| `shadow.sm` | `0 1px 2px rgba(19,20,26,.06), 0 0 0 1px rgba(19,20,26,.04)` | `0 1px 2px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.05)` | Focus, tooltip, input activo. |
| `shadow.md` | `0 4px 10px -2px rgba(19,20,26,.08), 0 2px 4px -1px rgba(19,20,26,.04)` | `0 4px 10px -2px rgba(0,0,0,.5), 0 2px 4px -1px rgba(0,0,0,.4)` | Cards con elevación, dropdowns, toasts. |
| `shadow.lg` | `0 16px 28px -12px rgba(19,20,26,.18), 0 6px 10px -4px rgba(19,20,26,.08)` | `0 16px 28px -12px rgba(0,0,0,.6), 0 6px 10px -4px rgba(0,0,0,.4)` | Modales, hover-lift suave. |

Prohibido: `shadow.xl`, neumorfismo, sombras que se usen como "glow de marca".

### 5.4 Border width

`border.width.sm` = 1px · `border.width.md` = 2px · `border.width.lg` = 3px. La mayoría del sistema usa 1px.

## 6. Sistema de motion

### 6.1 Principios

1. **Motion es señal, no adorno.** Sólo se anima para comunicar cambio de estado, jerarquía, continuidad o feedback. Si un elemento no gana claridad al animarse, no se anima.
2. **Corto y decidido.** Default 200ms. Superar 320ms exige justificación. Nada anima más de 600ms salvo el hero.
3. **Origen contextual.** Los elementos entran desde su origen real (un modal escala desde el botón que lo dispara, no desde el borde de pantalla).
4. **Admin respira poco, público respira más.** `/admin` = animación mínima funcional. `/portal` y público tienen más permiso (hero, transiciones de ruta, stagger corto). Tablas densas nunca.

### 6.2 Tokens de motion

#### Duraciones

| Token | Valor | Uso |
|---|---|---|
| `motion.duration.instant` | 0ms | Respuesta inmediata; reduced-motion y cambios críticos. |
| `motion.duration.fast` | 120ms | Micro-feedback: focus ring, button press, check de radio. |
| `motion.duration.base` | 200ms | Default de transitions (hover, tabs, dropdown). |
| `motion.duration.slow` | 320ms | Reveals, modal enter, drawers. |
| `motion.duration.hero` | 600ms | Hero load, page transition en landing pública. |

#### Curvas (easing)

| Token | Valor | Uso |
|---|---|---|
| `motion.ease.standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default simétrico. |
| `motion.ease.enter` | `cubic-bezier(0, 0, 0.2, 1)` | Ease-out. Entrada de elementos. |
| `motion.ease.exit` | `cubic-bezier(0.4, 0, 1, 1)` | Ease-in. Salida de elementos. |
| `motion.ease.emphasis` | `cubic-bezier(0.3, 1.4, 0.4, 0.95)` | Overshoot suave para CTAs primarios y confirmaciones. |
| `motion.spring.gentle` | `{ mass: 1, stiffness: 240, damping: 30 }` | Spring config de Motion para interacciones físicas. |

#### Distancias de desplazamiento

| Token | Valor | Uso |
|---|---|---|
| `motion.distance.sm` | 4px | Hover-lift de row, focus outline shift. |
| `motion.distance.md` | 8px | Toast enter, dropdown open. |
| `motion.distance.lg` | 16px | Modal enter, reveal de sección. |

### 6.3 Jerarquía

| Nivel | Elementos | Política |
|---|---|---|
| **Primario** | Cambio de ruta · modal · drawer · toast · validación de form · loading → ready · focus | Anima con intención. 200–320ms. Comunicación explícita del cambio de estado. |
| **Secundario** | Hover de card · tooltip · dropdown open · stagger de listas cortas (<6) | Anima con discreción. 120–200ms. Fade simple o lift pequeño. |
| **Cero** | Filas de tablas admin · datos monetarios · inputs durante tecleo · contadores · scroll reveal en admin/portal | No anima nunca. Evita fatiga cognitiva y lecturas confusas. |

### 6.4 Inventario por tipo

Tabla completa: qué hay hoy, qué queda en Fase 1, qué se retira. Esta tabla es la espina dorsal para Fase 2 y 4.

| Categoría | Fase 0 (estado actual) | Fase 1 (propuesta) |
|---|---|---|
| **Page transition** | `kodaore-route-motion` (fade-rise 500ms global) | Fade+rise 4px enter 200ms `ease.enter`, fade exit 160ms `ease.exit`. Implementación en App Router vía `template.tsx`. **Sin animación de ruta en `/admin/*`.** |
| **Modal / Drawer** | — | Scale 0.96→1 + opacity 0→1 en 240ms `ease.enter`. Backdrop opacity 0→0.4 en 240ms. Exit reverse 180ms `ease.exit`. Drawer: slide desde borde en 280ms. |
| **Toast** | `action-toast` ad-hoc | Slide-up 8px + fade 240ms `ease.enter`. Stack máximo 3. Exit fade 160ms. |
| **Dropdown / Popover / Tooltip** | — | Scale 0.96→1 + fade 180ms `ease.enter`. Exit fade 120ms. |
| **Tabs** | — | Indicator con `transform: translateX` 220ms `ease.standard`. |
| **Button / Input feedback** | `k-hover-lift` / `-soft` / `-action` (260ms) | Unificados: hover 200ms `ease.enter` (background, border, color). Focus ring 120ms. Button press `scale(0.98)` en 80ms `mousedown`. |
| **Form validation** | — | Error field: shake ±2px ×3 (300ms). Success: checkmark reveal 200ms + outline verde fade 200ms. `aria-live="polite"` anuncia el cambio. |
| **List entry stagger** | `fade-rise-delay-{100..500}` en loader y cards | Stagger sólo primeros 6 items, 30ms cada uno, fade+rise 4px en 220ms. Después del 6, todos a la vez. **Nunca stagger en tablas admin.** |
| **Scroll reveal** | — | Sólo en landing pública. IntersectionObserver, threshold 0.15. Fade+rise 4px en 280ms. **Sin parallax.** Desactivado en portal y admin. |
| **Hero background** | `VantaWavesBackground` (WebGL, 5 rAF simultáneos, scroll-synced, ~120KB bundle) | **Vanta retirado.** Reemplazo: fotografía real + grain estático. Fondo estático. |
| **Loader inicial** | `InitialLoader` 3D scroll-driven (intercepta scroll, bloquea LCP) | **Retirado por completo.** Reemplazo: skeleton loading por componente. LCP real observable. |
| **Footer line-shift** | `footer-line-shift` infinito 7s global | **Retirado.** Separador estático con gradient quieto. |
| **Back-to-top bob** | `back-top-bob` infinito 1.8s mientras visible | Bob retirado. Botón sólido con hover simple 120ms. |
| **Social icons glow** | Glow pseudo-elemento en hover | Color shift 150ms + border-color. Sin glow. |
| **Header compact on scroll** | Doble transition (py + background-blur) 450/700ms | Simplificado: una sola transition 200ms del padding. Blur estático siempre que el usuario haga scroll > 50px (sin dos umbrales). |
| **Image hover scale** | `scale(1.03–1.05)` en 700ms | `scale(1.02)` en 300ms `ease.enter`. Sólo en cards de landing, nunca en admin. |

### 6.5 Librería

Mix deliberado, no una sola herramienta.

| Uso | Herramienta | Por qué |
|---|---|---|
| Hover, focus, transitions de estado | Tailwind v4 `@theme` + CSS | Zero bundle. Directo del sistema de tokens. |
| Page transitions · modales · drawers · stagger | **Motion** (ex-Framer Motion, v12+) | API declarativa, variants, orchestration, `AnimatePresence`. ~12KB gz. |
| Form feedback complejo · timing concurrente | **Motion** + hook `useReducedMotion` | Integra accesibilidad sin duplicar `@media` por componente. |
| Scroll-driven (sólo landing, sin parallax) | IntersectionObserver nativo + CSS `@starting-style` | Sin JS en scroll. View Transitions API se deja para una fase posterior (soporte Firefox aún parcial). |

**Wrapper propio** en `components/motion/` con variants reutilizables:
- `fadeUp` — fade+rise estándar.
- `staggerChildren` — orquestación de stagger con límite de 6.
- `modalIn` — enter/exit del modal.
- `toastIn` — enter/exit del toast.
- `routeTransition` — wrap para `template.tsx`.

El wrapper expone un hook `useReducedMotion()` y aplica la alternativa estática automáticamente (ver 6.7).

### 6.6 Presupuesto de performance

| Métrica | Regla |
|---|---|
| Frame budget | ≤16ms por frame en interacción; ≤8ms en scroll pasivo. Si supera, se corta el scope. |
| CLS | 0.00 en interacción. Baseline Fase 0 = 0.00–0.01; mantener. |
| LCP | Objetivo: LCP observable real. Tras retirar `InitialLoader`, medir y acordar target (<2.5s desktop, <4s mobile). |
| INP | <200ms siempre; <100ms en acciones críticas (login, submit). |
| Animaciones sólo `transform` y `opacity` | Obligatorio. Nunca animar `width`, `height`, `top`, `left`, `margin`. |
| Animaciones infinitas | Prohibidas por defecto. Excepción: loading indicator dentro de su componente, pausado fuera de viewport vía IntersectionObserver. |
| rAF concurrentes | Máximo 1 por ruta. Fase 0 tenía 5 en desktop home — Fase 1 retira 4. |

### 6.7 Accesibilidad de motion

`prefers-reduced-motion: reduce` tiene alternativa estática explícita, no sólo "off":

| Categoría de motion | Alternativa reduced-motion |
|---|---|
| Transitions (hover, focus) | `duration: instant` — sin animación. |
| Entradas fade+rise | Cross-fade 120ms sin translate. El elemento aparece, no desaparece bruscamente. |
| Stagger | 0ms — todos los elementos a la vez (siguen siendo visibles). |
| Scroll reveals | Desactivado — el elemento está siempre presente. |
| Parallax y scroll-sync | Desactivado. |
| Infinite y Vanta | Retirado del sistema, no aplica. |

Reglas adicionales:
- **Focus visible durante transiciones.** El focus ring (120ms) nunca desaparece durante la transición del elemento padre. `outline` siempre en capa encima del `transform`.
- **Anuncio ARIA en cambios de estado.** Toast, form feedback, loading → ready: `aria-live` y `role="status"` correctos. No depender sólo de motion/color para comunicar estado.
- **Cobertura uniforme.** Bug detectado en Fase 0: `animate-pulse` de loading skeletons no está cubierto por el `@media reduced-motion` actual. Fix obligatorio en Fase 2.

## 7. Tabla resumen — qué se anima, qué no, por qué

| Elemento | ¿Anima? | Regla |
|---|---|---|
| Cambio de ruta (público/portal) | Sí | Fade+rise 4px 200ms `ease.enter`. Comunica transición. |
| Cambio de ruta (admin) | **No** | La densidad admin prima. El cambio es instantáneo. |
| Apertura de modal | Sí | Scale 0.96→1 + opacity en 240ms. Origen contextual implícito en shadow. |
| Toast | Sí | Slide-up 8px + fade 240ms. Comunica nueva información. |
| Hover en card (landing) | Sí | Lift 4px + shadow 200ms. Invitación a click. |
| Hover en row de tabla admin | **No** | Columna densa; sólo cambio de background 150ms sin movimiento. |
| Focus ring | Sí | Outline expand 120ms. Es feedback de teclado crítico. |
| Button press | Sí | `scale(0.98)` 80ms. Feedback táctil. |
| Checkbox / radio check | Sí | Icono fade+scale 120ms. Confirma el cambio. |
| Stagger de cards (landing, <6) | Sí | 30ms entre elementos, 220ms cada uno. Comunica orden de entrada. |
| Stagger de cards (admin o portal) | **No** | Cansa y no aporta. Todos a la vez. |
| Scroll reveal (landing) | Sí | Fade+rise una vez, 280ms, `IntersectionObserver` threshold 0.15. |
| Scroll reveal (admin o portal) | **No** | Interfiere con lectura. |
| Parallax | **No** | Nunca, en ninguna ruta. Rompe la previsibilidad del scroll. |
| Header compact on scroll | Sí | Una transition 200ms del padding. Sin doble blur/bg. |
| Imagen en hover (cards de landing) | Sí | `scale(1.02)` 300ms. Sutil. |
| Imagen en hover (tabla admin) | **No** | Las imágenes en tabla no se redimensionan. |
| Datos numéricos (importes, contadores) | **No** | Cambiar números con animación confunde la lectura. Salto instantáneo. |
| Background global (body) | **No** | Grain estático; sin gradient animado, sin Vanta. |
| Loader inicial | **No existe** | Reemplazado por skeleton loading por componente. |
| Footer | **No** | Sin line-shift infinito. Separador estático. |

## 8. Qué se retira explícitamente del sistema

Son cambios visibles. Es importante que queden nombrados para que Fase 2 los trate como borrado, no como migración.

1. **`components/vanta-waves-background.tsx` + dependencia `vanta`.** Retirar del bundle. Se borra el componente y se elimina de `package.json`.
2. **`components/initial-loader.tsx`.** Retirar. El efecto 3D scroll-driven era el mayor coste de atención y de LCP del sistema. Reemplazo: skeleton loading por componente en `loading.tsx` de cada ruta.
3. **`components/home-hero-scroll-sync.tsx` y su rAF.** Retirar — ya no hay Vanta al que sincronizar.
4. **Keyframes retiradas de `app/globals.css`:** `loader-word-rise`, `loader-wave-sweep`, `loader-hint-bob`, `back-top-bob`, `footer-line-shift`.
5. **Clases utility retiradas:** `k-hover-lift`, `k-hover-soft`, `k-hover-action`, `k-row-hover` — unificadas en un solo pattern via componente `Card` / `Button` / `Row` con tokens de motion.
6. **Capas de fondo global** (body gradient + grain SVG + `.kodaore-shell::before` radials): se simplifican a dos — grain estático + un único gradient radial muy tenue si se quiere (o ninguno; la decisión queda abierta para Fase 2 al construir el hero).
7. **`package.json`:** `three` y `vanta` retirados.

Total estimado de reducción: 4 rAF concurrentes, 4 animaciones infinitas, ~120KB de JS bundle, ~800 líneas de CSS decorativo, 3 componentes grandes.

## 9. Implementación — guía de alto nivel para Fase 3 (writing-plans)

Orden sugerido de ejecución, sin detallar tareas (eso es Fase 3):

1. **Tokens de color en `@theme`** (Tailwind v4) con variables CSS para dark mode via `@media (prefers-color-scheme: dark)`.
2. **Tipografía:** retirar Manrope y Space Grotesk, cargar Inter variable vía `next/font`, aplicar `font-family` en `app/layout.tsx`.
3. **Spacing, radius, shadow** expuestos como tokens nombrados en `@theme`.
4. **Retirada:** borrar `vanta-waves-background.tsx`, `initial-loader.tsx`, `home-hero-scroll-sync.tsx`, quitar keyframes y utilities obsoletas, limpiar `package.json`.
5. **Wrapper de motion:** `components/motion/` con variants `fadeUp`, `staggerChildren`, `modalIn`, `toastIn`, `routeTransition` + hook `useReducedMotion`.
6. **Primitivas:** reconstrucción de `Button`, `Input`, `Card`, `Dialog`, `DropdownMenu`, `Tabs`, `Toast`, `Tooltip`, `Skeleton`, `EmptyState`, `Badge`, `Table`, `Checkbox`, `Select` sobre shadcn-ui customizado con los tokens nuevos. Cada primitiva con su animación integrada.
7. **Adaptación por vertical:** landing pública → portal → admin → acceso. En ese orden, una vertical por commit.
8. **Hero:** se rediseña desde cero (fotografía + tipografía fuerte; sin Vanta; sin loader 3D).

El plan detallado de ejecución se escribe en Fase 3 con la skill `writing-plans` sobre este documento.

## 10. Checkpoint

Este documento cierra Fase 1. El workflow marca **parada dura** antes de Fase 2. La siguiente acción autorizada es redactar el plan de ejecución (Fase 3 del workflow, que convierte esta dirección en tareas), no ejecutar código.

**Pendiente explícito para ti antes de continuar:**
- Validar la dirección (Dojo Moderno).
- Validar que `vanta` + `InitialLoader` + 3 componentes más se retiran. Son pérdidas visibles; quiero tu confirmación.
- Validar la migración tipográfica (fuera Manrope y Space Grotesk, dentro Inter).

Cuando lo validas, se invoca `superpowers:writing-plans` sobre este spec para redactar `docs/superpowers/plans/2026-04-22-ui-direction-fase-1.md`.
