# Landing Kodaore — Fase 0 · Reconocimiento

Fecha: 2026-04-23
Alcance: landing pública narrativa en `/[locale]` (ruta raíz eu/es).
Entrada: brief del usuario · `docs/ui-design-direction.md` (Dojo Moderno) · estado post UI-rework.
Salida: plan de assets, checklist de tokens a añadir, decisiones pendientes antes de Fase 1 (guion).

> **Parada dura tras este documento y `docs/landing-narrative.md`.** Se espera feedback del usuario antes de abrir Fase 1 (dirección visual) y Fase 2 (plan de ejecución).

---

## 0. Addendum · brief revisado (mismo día, más tarde)

Tras el primer audit el usuario ha reforzado el brief con reglas más estrictas que **sobrescriben varias de las decisiones recomendadas aquí**. Se listan antes del cuerpo original para que quien lea el documento lea primero lo vigente.

### Reglas nuevas, no negociables

- **Dirección de arte**: manual técnico de judo, atemporal. No retro-hipster, no japonismo decorativo.
- **Sin terminología japonesa** en la narrativa. Las fases del movimiento se nombran en eu + es con lenguaje natural del club:
  - `oreka hautsi` / `romper el equilibrio`
  - `sartu` / `entrar`
  - `bota` / `proyectar`
  - `ondo erori` / `caer bien`
  - Es decisión editorial del cliente → **no se cuestiona, no se matiza, no se devuelve a debate**.
- **Respeto a la disciplina**: un judoka debe leer la landing y sentir que quien la ha hecho entiende lo que muestra.
- **Performance como identidad**: la landing no es "rápida a pesar de ser bonita", es "rápida porque es bonita". SVG + HTML semántico + JS al mínimo.
- **Sin three.js, sin WebGL, sin partículas, sin parallax genérico, sin números aislados ("+500 alumnos"), sin música autoplay, sin scroll-jacking.**
- **Fallbacks desde el primer commit**: `prefers-reduced-motion` y versión sin JS plenamente funcionales.

### Presupuestos endurecidos (reemplazan los de §7)

| Métrica | Audit anterior | Brief revisado |
|---|---|---|
| Lighthouse Performance desktop | ≥ 90 | **≥ 95** |
| Lighthouse Performance mobile | ≥ 80 | **≥ 90** |
| Lighthouse A11y / BP / SEO | ≥ 95 / ≥ 95 / 100 | **≥ 95 / ≥ 95 / ≥ 95** |
| LCP desktop | < 2.0 s | **< 1.5 s** |
| LCP mobile 4G | < 2.5 s | < 2.5 s |
| CLS | 0 | **0 absoluto** |
| INP | < 200 ms | **< 150 ms** |
| JS inicial landing (gz) | < 180 kb | **< 80 kb** |

El salto de 180 kb → 80 kb es el cambio más exigente. Implica:
- Framer Motion + `useScroll` **sólo cargado en la sección haraigoshi** vía `dynamic({ ssr: false })` dentro de `IntersectionObserver`.
- Toda la landing renderizada como RSC salvo las islas de animación.
- Fonts: `Shippori Mincho` reducido a pesos estrictamente necesarios (500 + un peso más), subset `latin`. Reevaluar peso 400 en Fase 4 si peta bundle.

### Decisiones del audit anterior que quedan RESUELTAS por el brief nuevo

- **DECIDIR #2 (japonés)** → resuelto: **2c variante euskera+castellano**. Cero japonés en narrativa. Solo "haraigoshi" aparece una vez en el pie de la sección (título del movimiento), sin caption japonés de las fases.
- **DECIDIR #4 (fotografía)** → resuelto: **4a confirmado** (cero fotos en la landing). Las fotos de sedes viven en `/sedes/[slug]` y se reservan para esa ruta.
- **DECIDIR #6 (ruta)** → resuelto: **6a confirmado** (reemplaza home pública, ruta raíz `/[locale]`).

### Decisiones que **siguen abiertas** tras el brief revisado

- **DECIDIR #1 (librería)** — el brief pide "evaluar en este orden: Framer Motion + `useScroll` → GSAP + ScrollTrigger → CSS scroll-driven + IO". **Recomendación mantenida: Framer Motion** (opción A del audit). Motivos: ya está en bundle (coste marginal 0 kb), cubre pinning + sync con 5 frames sin problemas, respeta `ui-design-direction.md §6.5`, y encaja con el presupuesto endurecido de <80 kb. Espero confirmación explícita.
- **DECIDIR #3 (excepción pinning)** — sigue aplicando. Documentar como excepción al "no parallax/pinning" de `ui-design-direction.md §6.4`, limitada a la sección haraigoshi.
- **DECIDIR #5 (capas washi)** — sigue aplicando. Mantener tal cual; no usar `bg-surface*` en los containers de la landing para evitar washi sobre washi.
- **Frames como SVG vs. WebP** — resuelto por brief: **SVG vectorizado**, para poder animar paths con CSS/JS (path drawing, frame-by-frame reveal). El audit original proponía WebP, queda descartado (un WebP no se anima sin sustituir el elemento). Resultados de la prueba de vectorización → §10.

---

## Alineación con `docs/ui-design-direction.md`

Este brief amplifica los principios de "Dojo Moderno", no los reinventa. Las reglas del sistema siguen vigentes: tipografía Inter + Shippori Mincho, paleta Dojo, tokens de motion existentes, `useReducedMotion` como ya se usa en `components/motion/`. La landing se permite licencia editorial (tipografía más grande, más aire) pero sin romper el sistema.

## 1. Estado actual relevante

### 1.1 Ruta y shell públicos

- Landing actual: `app/[locale]/(public)/page.tsx`. Es una página ya compuesta (hero a tres tarjetas + sedes grid + store card + photo card). La narrativa nueva la sustituye completa.
- El route group `(public)` aplica `data-area="public"` vía `layout.tsx`. Esto activa Shippori Mincho en `h1/h2/h3/.font-heading` y el patrón washi de fondo.
- Otras rutas del grupo público (`sedes`, `erropak`, `fototeca`, `legal`, `tienda`, `dev-theme`) permanecen intactas y no se tocan.

### 1.2 Tipografía

- `Shippori_Mincho` cargado vía `next/font/google`, pesos **500 / 700 / 800**, variable `--font-mincho`. Ya scoped a público (no contamina admin/portal).
- `Inter` variable para body. Cubre eu (ñ, tildes, etc.) en `latin + latin-ext`.
- Legacy: `Manrope` y `Space_Grotesk` todavía cargados en `app/layout.tsx` pese a que `docs/ui-design-direction.md §8` los marca como retirables. No es bloqueante para la landing; se anota como deuda en el plan de Fase 3 si procede.
- Body font stack aplicado: `var(--font-inter), var(--font-manrope), sans-serif`.

### 1.3 Tokens ya en `app/globals.css`

Cobertura del sistema Dojo Moderno para lo que la landing necesita:

| Grupo | Tokens existentes | Estado |
|---|---|---|
| Surface | `surface-base`, `surface-subtle`, `surface-elevated`, `surface-inverse` | ✅ suficiente |
| Ink | `ink-primary`, `ink-secondary`, `ink-muted-2`, `ink-inverse` | ✅ suficiente |
| Border | `border-subtle`, `border-default`, `border-strong`, `border-focus` | ✅ suficiente |
| Brand | `brand-base`, `brand-emphasis-2`, `brand-subtle` | ✅ suficiente (uso muy moderado) |
| Accent | `accent-base`, `accent-emphasis`, `accent-subtle` | ⚠️ posiblemente no se usa en landing (ver DECIDIR #3) |
| Radius | `sm → 2xl`, `pill` | ✅ suficiente (radius mínimo en landing editorial) |
| Shadow | `sm`, `md`, `lg` | ✅ (uso mínimo) |
| Motion | `duration-*`, `ease-*`, `distance-*` | ✅ suficiente |
| Display scale | `display.xl`… | ⚠️ **falta `display.2xl`** — ver §4 |

### 1.4 Wrapper de motion existente

- `components/motion/` expone `fadeUp`, `staggerChildren`, `modalIn`, `toastIn`, `routeTransition` + `useReducedMotion`. Todas sobre **Motion** (Framer Motion v11, ~12 kb gz, ya en bundle).
- No hay nada específico para scroll narrativo con pinning. Motion tiene `useScroll` + `useTransform` nativos; se puede construir el pinning/sincronía sin añadir librería.

### 1.5 Capas visuales globales sobre `[data-area="public"]`

- Patrón **washi** aplicado como `background-image` al body Y a cualquier `.bg-surface*`. Escala 320×320, blend-multiply en light y screen en dark.
- Grain estático global (`body::after`, opacity 0.04, mix-blend-mode soft-light) activo en TODA la app, no sólo en público.
- `.kodaore-shell::before` dibuja dos gradientes radiales muy tenues brand + accent sobre la página.

→ La landing editorial-manual probablemente quiera ajustar estas capas (ver DECIDIR #5).

## 2. Assets disponibles

### 2.1 `haraigoshi.GIF` — existe

- Ubicación real: `public/media/haraigoshi.GIF` (mayúsculas, y en `/media/` — el brief decía `public/assets/haraigoshi.gif`).
- Dimensiones: **472 × 580** px.
- **5 frames** exactos, delay 50 (= 500 ms por frame, loop 2.5 s).
- Tamaño: **174 kb** (GIF completo).
- Calidad: color indexado 256c, 8-bit sRGB. Lectura visual: recuadro técnico estilo manual, trazo sobre fondo claro, bajo fps — exactamente el lenguaje que pide el brief.

**Implicaciones para el guion:**

- 5 frames son los 5 hitos técnicos del haraigoshi. No hay que interpolar — usar los 5 tal cual.
- Reparto natural: kuzushi = f1+f2, tsukuri = f3+f4, kake = f4+f5 (con f4 como bisagra). El guion de Fase 1 lo cierra.
- No se extraen más frames de los que hay; la trampa sería pedir interpolación y perder la cualidad "documento técnico".

### 2.2 Fotografía real — **existe**, pese a lo que decía el brief

El brief asumía "cero fotografía real". No es cierto. Hay:

- `public/media/hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg` — fotos de judo en acción (horizontales, resolución razonable).
- `public/media/judo-4.jpg`, `judo-5.jpg`, `judo-6.jpg` — adicionales.
- `public/media/sedes/azkoitia-poli.jpg`, `azpeitia-poli.jpg`, `zumaia-poli.jpg` — foto real del polideportivo de cada sede (horizontales).
- `public/media/logo-kodaore.png`, `public/logo-kodaore.png` — logotipo.
- `public/patterns/washi-light.svg`, `washi-dark.svg` — patrón de papel japonés.
- `public/media/profesores/anonimo.png` — placeholder de profesor.
- Fallbacks SVG (`photo-fallback-*.svg`, `logo-fallback.svg`).

→ DECIDIR #4 abajo.

### 2.3 Lo que NO hay

- Iconografía de línea para sedes (mapa, pictogramas de horarios, etc.). Si el guion la pide, se dibuja a mano en SVG o se tira de `lucide-react` (no instalado; habría que añadirlo o generar SVG inline mínimo).
- JSON-LD `Organization` / `LocalBusiness` por sede. `app/layout.tsx` tiene metadata genérica sin structured data. Se diseña en Fase 1 y se implementa en Fase 4.
- Marca `public/assets/` — el brief apuntaba allí pero no existe ese directorio. Los assets actuales están en `public/media/`. Propuesta: mantener la convención existente → frames en `public/media/haraigoshi/`.

## 3. Conflictos entre el brief de la landing y `docs/ui-design-direction.md`

El brief reconoce "licencia creativa que el resto de la app no tiene". Eso cubre scroll narrativo, silencio tipográfico y pausa. Pero hay decisiones técnicas que conviene blindar antes de empezar, porque tocan bundle y coherencia del sistema.

### 3.1 Librería de animación — **DECIDIR #1**

- Brief: "Usa **GSAP + ScrollTrigger** (estándar de la industria… carga sólo en la ruta de landing)".
- `ui-design-direction.md §6.5`: "page transitions, stagger, modales → **Motion**. Scroll-driven → **IntersectionObserver nativo + CSS @starting-style**". Explícitamente: "no hay GSAP".

**Tres opciones:**

| Opción | Bundle extra | Pros | Contras |
|---|---|---|---|
| **A. Motion (ya instalado) + `useScroll`/`useTransform`** | **0 kb** | Cero coste; consistencia con el resto del sistema; `useReducedMotion` ya integrado; suficiente para 5 frames + 3 secciones con pinning. | API menos plug-and-play para pinning complejo. |
| **B. GSAP + ScrollTrigger (sólo en landing, dynamic import)** | ~50 kb gz | Timeline más expresiva, pinning con menos código, mejor perf en scroll continuo largo. | Segunda librería de animación en el repo (duplica ecosistema); rompe la regla de `ui-design-direction.md`; la landing es la única que la usaría; más código a mantener. |
| **C. Híbrido: Motion para reveals + una sola ScrollTrigger embebida** | ~30–35 kb gz | Compromiso. | Peor de ambos mundos: dos APIs para el mismo problema. |

**Mi recomendación: A (Motion).** La narrativa tiene 9 secciones y sólo una (los tres capítulos del haraigoshi) pide pinning + sincronía. Motion's `useScroll({ target, offset })` + `useTransform` con 5 breakpoints cubre exactamente eso. Respeta `ui-design-direction.md` y el presupuesto de bundle (<180 kb gz) queda holgado. Si durante Fase 4 me topo con algún límite técnico real que Motion no pueda resolver, lo escalo como cambio puntual.

Si tú quieres GSAP pese a todo, lo apuntamos y tiramos con B; el plan lo asume.

### 3.2 Estilo visual: "manual Kodokan" vs. iteración reciente — **DECIDIR #2**

Historial de los últimos commits (`git log`):

- `83b203c feat(ui): acentos japoneses aditivos en rutas publicas (washi, sumi, hanko, tatami)`
- `2d85818 refactor(ui): reajuste japones segun feedback (retira hanko, sumi backdrop global, washi y tatami mas visibles)`
- `547dec0 refactor(ui): retirar sumi y tatami, conservar solo washi`

La conclusión de esa iteración fue **reducir** la japonesería: sólo queda washi + Shippori Mincho.

El brief de la landing vuelve a pedir una estética fuertemente japonesa: "lenguaje editorial-técnico inspirado en manuales del Kodokan", "japonés usado con parsimonia" pero tres capítulos etiquetados `kuzushi / tsukuri / kake`.

**Tres calibraciones posibles:**

| Calibración | Descripción |
|---|---|
| **2a. Japonés prominente (brief tal cual)** | Kuzushi / tsukuri / kake grandes, traducción pequeña eu/es, metáfora explícita en toda la sección. |
| **2b. Metáfora con ancla única** | Sólo "haraigoshi" aparece como palabra. Los tres momentos se nombran en eu/es (ej. "desequilibrar / construir / ejecutar") con el término japonés como pie de línea pequeño. |
| **2c. Metáfora silenciosa** | Cero palabras japonesas en la landing. La secuencia visual de haraigoshi habla sola, los tres momentos se viven como scroll, nunca se etiquetan. |

**Mi recomendación: 2b.** Honra la metáfora sin decorativismo, encaja con la línea reciente ("conservar solo washi"), y deja a los términos japoneses su sitio como pieza técnica, no ornamento. Un término por capítulo en caption pequeño es información; tres kanji gigantes es tema.

Si prefieres 2a, el guion se escribe distinto (títulos en japonés de 72px+, texto secundario). Si prefieres 2c, también (los capítulos pasan a llamarse por fase del movimiento en eu/es).

### 3.3 Scroll narrativo con pinning vs. regla "sin parallax" — **DECIDIR #3 (menor)**

- `ui-design-direction.md §6.4`: "Parallax · **No** · Nunca, en ninguna ruta. Rompe la previsibilidad del scroll".
- Brief: "pinning de sección mientras avanzan los primeros frames".

Pinning ≠ parallax. Pinning es fijar la sección mientras el scroll controla una timeline interna; parallax es mover dos capas a velocidades distintas dentro de una sección. Pero conviene dejarlo anotado: **la landing introduce scroll-driven pinning en tres secciones (los tres capítulos), excepción explícita a la regla general, justificada por licencia creativa.** El resto del sistema sigue sin parallax ni pinning.

Confirma y lo apuntamos como excepción documentada.

### 3.4 Fotografía real — **DECIDIR #4**

El brief dice "asume que NO hay fotografía real" y propone resolver con tipografía/ilustración. Pero hay fotos reales de las tres sedes y seis fotos de judo en acción.

**Tres opciones:**

| Opción | Descripción |
|---|---|
| **4a. Cero fotos (brief tal cual)** | La landing es 100% editorial-manual. Sedes se resuelven con tipografía grande + datos + línea. Fotos actuales se usan en `/sedes/[slug]` pero no en landing. |
| **4b. Fotos en un único momento** | Sólo sección 6 (sedes) tiene una foto pequeña de cada polideportivo, tratada en blanco y negro / alto contraste, en grid austero. El resto sin fotos. |
| **4c. Fotos como cierre** | Una fotografía grande (ej. momento de judo en acción) sólo al final, antes del CTA, como "aquí es donde pasa esto". |

**Mi recomendación: 4a.** El lenguaje "manual Kodokan" se sostiene en contención, y las fotos actuales de polideportivos son funcionales (documental de aula) pero no narrativas. Introducirlas bajaría el tono editorial. Si el cliente siente que queda frío sin fotos, 4b es un compromiso digno. 4c rompe el ritmo y lo descarto.

### 3.5 Capas visuales globales — **DECIDIR #5 (menor)**

En `[data-area="public"]` hoy se aplican tres capas superpuestas:

1. Washi pattern en `body` (background-image).
2. Washi pattern con `blend-multiply` en toda `.bg-surface*`.
3. Grain estático (body::after, opacity 0.04).
4. Gradientes radiales tenues en `.kodaore-shell::before`.

Para la landing editorial:

- **Washi en body** encaja como "papel del manual" ✅ mantener.
- **Washi en surfaces** a veces dobla la textura (washi sobre washi). En la landing nueva probablemente no habrá `bg-surface*` aplicado a grandes superficies — el fondo es el propio body — así que no debería aparecer.
- **Grain global** es un overlay de un decimal de opacity, inaudible. Mantener.
- **`.kodaore-shell::before`** puede no aplicarse si no usamos ese envoltorio en la landing; neutro.

Propuesta: **no tocar** las capas globales, simplemente no usar `.bg-surface*` en los containers principales de la landing. Si durante Fase 4 se ve que estorban, se ajusta con scope muy concreto.

## 4. Tokens a añadir o confirmar

Sólo si algo falta de verdad. El sistema Dojo Moderno ya cubre 95%.

### 4.1 Escala display más grande — **propuesto, confirma**

`display.xl` actual = 56→72 px. El brief pide "tipografía como protagonista" y "mucho aire". Para un hero editorial con Shippori Mincho, 72 px se queda corto en desktop ancho.

**Propuesta: añadir `display.2xl` = 72→112 px (clamp responsive)**, peso 500 (no 700 — el mincho queda más noble en peso medio), line-height 0.95, letter-spacing −0.015em. Se añade como token al `@theme` en `globals.css`.

### 4.2 Peso mincho 400 — **propuesto, confirma**

Shippori Mincho está cargado en pesos 500/700/800. Para texto grande con aire (ej. frase hero, apertura narrativa), 500 sigue lyendo "sólido". Un 400 daría más pausa editorial.

**Propuesta: añadir peso 400 a la carga de `Shippori_Mincho` en `app/layout.tsx`.** Coste: +~20 kb del variable font subset. Si el bundle aprieta, se retira. Evaluar en Fase 5.

### 4.3 Rhythm vertical de landing — **propuesto**

El sistema de spacing ya llega a `space.24` (96 px). La landing editorial va a necesitar separaciones mayores entre capítulos en desktop: **128–160 px**. Dos caminos:

- Usar `space.16` + `space.16` (composición), o
- Añadir `space.32` = 128 px y `space.40` = 160 px al `@theme`.

Sin añadir tokens: usamos composición y `clamp()` inline cuando haga falta. No añado tokens todavía.

### 4.4 Nada más

No hace falta añadir colores, shadows, radius ni easings. La landing debería ser **más pobre** en tokens que el resto del sistema, no más rica.

## 5. Arquitectura propuesta de directorios

```
app/[locale]/page.tsx                    ← ruta raíz del locale (ver DECIDIR #6)
components/landing/
  ├─ index.ts
  ├─ landing-root.tsx                    ← shell y orden de secciones
  ├─ sections/
  │   ├─ hero.tsx
  │   ├─ opening.tsx
  │   ├─ chapter-kuzushi.tsx
  │   ├─ chapter-tsukuri.tsx
  │   ├─ chapter-kake.tsx
  │   ├─ sites.tsx
  │   ├─ method.tsx
  │   ├─ cta.tsx
  │   └─ footer-closing.tsx              ← opcional, si el site-footer actual no encaja
  ├─ motion/
  │   ├─ use-haraigoshi-scroll.ts        ← hook que expone progress 0..1 y frame index 0..4
  │   ├─ reveal.tsx                      ← wrapper de reveal una vez (IntersectionObserver)
  │   └─ chapter-pin.tsx                 ← wrapper de pinning por capítulo
  └─ data/
      └─ sites.ts                        ← datos puros (sedes, direcciones, horarios)
public/media/haraigoshi/
  ├─ frame-01.webp .. frame-05.webp      ← extraídos en Fase 2
  └─ (opcional) frame-01.png .. frame-05.png  ← fallback <picture>
scripts/
  └─ extract-haraigoshi-frames.mjs       ← creado en Fase 2, ejecuta y commitea
docs/
  ├─ landing-audit.md                    ← este documento
  ├─ landing-script.md                   ← Fase 1
  ├─ landing-assets.md                   ← Fase 2
  ├─ landing-plan.md                     ← Fase 3
  └─ landing-verification.md             ← Fase 5
```

### 5.1 Ruta raíz `app/[locale]/page.tsx` vs. `(public)/page.tsx` — **DECIDIR #6**

Hoy `app/[locale]/(public)/page.tsx` es la home pública. El brief habla de "landing pública narrativa en `/[locale]` (ruta raíz eu/es)". Dos lecturas:

- **6a. Reemplazar la home pública.** La nueva landing ES la ruta raíz. El `page.tsx` actual se retira. Es lo que entiendo del brief.
- **6b. Añadir una ruta nueva.** La landing vive en otra ruta (`/[locale]/kodaore`, `/[locale]/inicio`…). Improbable pero posible si la home actual tiene tráfico que no quieres perder.

**Mi recomendación: 6a (reemplazar).** El brief dice "ruta raíz". Si el usuario confirma, el commit retira el `(public)/page.tsx` actual y crea `[locale]/page.tsx` nuevo. Los componentes `HomeHero`, etc., actuales se eliminan si no los usa nadie más; lo verifico en Fase 4.

## 6. Estrategia de extracción de frames (Fase 2)

Planteo aquí el script para que en Fase 2 no haya sorpresas.

- Herramienta: `sharp` (ya no está en deps → añadir `sharp` como devDependency; es el estándar de Next.js para imágenes así que no es una libería rara) **o** `ffmpeg` por shell (ya instalado en el sistema).
- Decisión: **ffmpeg shell**. Sin nueva dependencia, determinista, salida controlable.
- Comando base:
  ```
  ffmpeg -i public/media/haraigoshi.GIF -vsync 0 public/media/haraigoshi/frame-%02d.png
  ```
- Postproceso: convertir a WebP con calidad 85, y dejar un PNG fallback sólo si el Lighthouse lo pide. 5 frames × ~20 kb WebP ≈ 100 kb total, muy por debajo del budget de 400 kb.
- Script: `scripts/extract-haraigoshi-frames.mjs` con `child_process.execSync('ffmpeg …')`, hash checks y salida idempotente.
- Commit: frames committeados al repo (no regenerados en build) para LCP determinista.

## 7. Presupuestos de performance — baseline y plan de medición

Ante de añadir nada, referencia:

- **Baseline Lighthouse actual** de `(public)/page.tsx` (home vigente): no medido aún, pendiente de la ejecución. Se captura con `chrome-devtools:lighthouse_audit` al inicio de Fase 4 como punto de comparación.
- **Objetivos fijados por brief** (no negociables): LCP <2.0s desktop / <2.5s mobile 4G · CLS 0 · INP <200 ms · bundle landing <180 kb gz · frames <400 kb combinados · Lighthouse Perf ≥90 desktop / ≥80 mobile · A11y ≥95 · Best Practices ≥95 · SEO 100.
- **Riesgos identificados** ya en esta fase:
  - Grain global (body::after) y washi pattern son SVG + repeat: paint-only, sin coste de layout. Neutros.
  - Shippori Mincho pesa variable. Cargado sólo `latin` (bien), 3 pesos actuales; sumar peso 400 es ~+20 kb. Dentro de budget.
  - Motion ya en bundle. Ningún coste nuevo.
  - Los 5 frames del haraigoshi se cargan con `priority` el primero (LCP si así se decide) y los otros 4 con `<link rel="preload" as="image">` en `<head>` al entrar en la sección, o simplemente todos como `<img loading="eager">` si el peso total lo permite (100 kb cabe).

## 8. Checklist Fase 0 → Fase 1

**Antes de abrir Fase 1 (guion narrativo), el usuario responde a:**

- [ ] **DECIDIR #1** — Librería de animación: A (Motion, recomendado) / B (GSAP) / C (híbrido).
- [ ] **DECIDIR #2** — Calibración japonés: 2a (kanji grande) / 2b (metáfora con ancla, recomendado) / 2c (silencioso).
- [ ] **DECIDIR #3** — Confirmar excepción documentada: scroll-driven pinning permitido sólo en los tres capítulos de landing.
- [ ] **DECIDIR #4** — Fotografía: 4a (cero fotos, recomendado) / 4b (fotos B/N en sedes) / 4c (cierre fotográfico).
- [ ] **DECIDIR #5** — Capas washi/grain: dejar tal cual (recomendado) / ajustar.
- [ ] **DECIDIR #6** — Ruta: 6a (reemplazar home pública, recomendado) / 6b (landing en ruta nueva).
- [ ] Confirmar adición de `display.2xl` y peso mincho 400 (ver §4).
- [ ] Confirmar ruta de frames: `public/media/haraigoshi/frame-0{1..5}.webp`.

Con esto cerrado, abro Fase 1 y redacto `docs/landing-script.md` (texto completo eu/es + asignación frame↔capítulo + sincronía scroll).

## 9. Suposiciones que hago por defecto si no me respondes a algo

Para que no quede todo bloqueado por detalles:

- Ruta: reemplazo home pública.
- Librería: Motion.
- Japonés: calibración 2b.
- Fotos: cero (4a).
- Capas washi: tal cual.
- Frames: `public/media/haraigoshi/frame-0X.webp`.
- Escala: añado `display.2xl`.
- Peso mincho 400: añado.

Si alguna de estas suposiciones choca con lo que tenías en la cabeza, me paras y ajustamos antes de Fase 1.

---

## 10. Resultados de ejecución · Fase 0 ampliada (tras brief revisado)

### 10.1 Frames extraídos del GIF

GIF copiado de `~/Descargas/haraigoshi.GIF` → `public/media/haraigoshi.GIF` (178 kb, 472×580, 5 frames, 89a, sRGB indexado 256c).

Extraídos con `ffmpeg -vsync 0 -i public/media/haraigoshi.GIF public/landing/haraigoshi/frames/frame-%02d.png`.

| Frame | PNG | Colores | Contenido |
|---|---|---|---|
| 01 | 49 kb · 472×580 | 248 | Agarre inicial (kumi-kata). Dos judokas de pie, brazos enlazados, equilibrio simétrico. |
| 02 | 52 kb · 472×580 | 251 | Empujón de desequilibrio. Uno de los dos empieza a perder la vertical. |
| 03 | 54 kb · 472×580 | 254 | Entrada del lanzador bajo el centro de gravedad de uke. |
| 04 | 46 kb · 472×580 | 252 | Barrido + cadera: momento de la proyección, uke despega. |
| 05 | 58 kb · 472×580 | 253 | Recepción en suelo. Uke tumbado, tori de pie al lado. |

Los 5 frames cuentan el movimiento completo: 1–2 desequilibrio, 3 entrada, 4 proyección, 5 caída. Corresponde exactamente con la narrativa eu/es del brief.

### 10.2 Vectorización SVG — dos calibraciones probadas

Herramientas usadas: `potracer` (pure-Python) + post-proceso propio (descartar la primera curva, que potracer emite siempre como boundary del canvas y producía SVGs invertidos en el primer intento).

Script: `scripts/tmp/vectorize-final.py` (provisional, no committeado todavía; se consolidará en Fase 3 como script idempotente).

| Calibración | Threshold | Turdsize | Paths/frame | kb/frame | Total 5f | vs PNG |
|---|---|---|---|---|---|---|
| **A — trazo limpio** | 140 | 8 | 35–67 | 25–33 | **136 kb** | 52% |
| **B — detalle conservado** | 170 | 2 | 46–94 | 28–42 | 168 kb | 64% |

Ambas calibraciones son SVG usables. Diferencia visual:

- **A (recomendada)**: el trazo queda algo más seco, pierde parte del sombreado por tramas. Resultado más editorial/atemporal, sin "nostalgia de fotocopia años 60". Path counts más bajos → animación de path-drawing más fluida.
- **B**: conserva más hatching, lee más como "manual escaneado". Path counts más altos, más pesada en animación.

**Evaluación honesta (checkpoint del brief)**: la calidad es **suficiente para continuar sin plan B**. No salen sucios, no salen inconsistentes entre sí, los 5 frames mantienen la coherencia de línea y pose. No hace falta limpieza manual ni morph interpolado ni ilustrador nuevo. Los SVG pueden inlinearse directamente en el DOM y animarse.

Recomendación: **calibración A**. Guardados en `public/landing/haraigoshi/svg-a-clean/frame-0{1..5}.svg`.

> Muestras visuales renderizadas en `/tmp/haraigoshi-preview/preview-svg-a-clean-0{1..5}.png` (temporal, no committeado). El lector puede generar nuevas desde los SVG con cairosvg o abriéndolos en navegador.

**Archivos actuales** (provisionales, se consolidarán en Fase 3):
```
public/media/haraigoshi.GIF                               (178 kb)
public/landing/haraigoshi/frames/frame-0{1..5}.png        (fuente raster)
public/landing/haraigoshi/svg-a-clean/frame-0{1..5}.svg   (recomendada)
public/landing/haraigoshi/svg-b-detail/frame-0{1..5}.svg  (alternativa)
```

### 10.3 Baseline de la landing vigente

#### Screenshots (Playwright, server local :3001)

```
docs/landing-baseline/screenshots/
  eu-desktop.png   (1440×900 viewport, fullPage)
  eu-mobile.png    (390×844 viewport,  fullPage)
  es-desktop.png   (1440×900 viewport, fullPage)
  es-mobile.png    (390×844 viewport,  fullPage)
```

Observación visual: la home actual compone 5 bloques (hero triple + sedes grid + tienda card + foto card + footer). Funciona, no es editorial. La nueva landing la sustituye.

#### Lighthouse baseline

```
docs/landing-baseline/lighthouse/eu-desktop.{json,html}
```

| Categoría | Score |
|---|---|
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 92 |

SEO penalizado por:
1. `label-content-name-mismatch` — a11y: botones con texto visible distinto del aria-label. Ya está en nuestro radar post-UI-rework, no se aborda aquí.
2. `robots-txt is not valid` — a verificar; `app/robots.txt` existe (visible en `ls app/`) pero la herramienta marca formato inválido. Diagnóstico pendiente; si es un quick win se arregla en Fase 3, si no, queda como nota.

**Limitación honesta**: la auditoría mobile falló con `NO_FCP` ("the page did not paint any content") — es un problema conocido de la MCP de chrome-devtools cuando el navegador no está en foreground. No es fallo de la landing, es fallo del entorno de captura. Se repetirá en Fase 4 con la misma metodología para que la comparación antes/después sea justa. El baseline de Performance (LCP/CLS/INP) **NO está cubierto por `lighthouse_audit`** — por diseño esa tool omite Performance. Para medirlo se usará `performance_start_trace` del mismo MCP en Fase 4, donde también se auditará la nueva landing con el mismo método.

### 10.4 Checklist Fase 0 actualizado (estado)

- [x] Audit escrito y ampliado
- [x] GIF en repo (`public/media/haraigoshi.GIF`)
- [x] Frames extraídos (`public/landing/haraigoshi/frames/`)
- [x] Vectorización SVG probada y validada (A recomendada)
- [x] Screenshots baseline 4/4
- [x] Lighthouse baseline desktop eu (a11y/bp/seo)
- [ ] Lighthouse baseline mobile — bloqueado por NO_FCP en entorno headless, se captura en Fase 4
- [ ] Perf baseline (LCP/CLS/INP) — se captura en Fase 4 con `performance_start_trace`
- [x] `docs/landing-narrative.md` — redactado en paralelo a este doc

### 10.5 Lo que falta para cerrar Fase 0

Lo que necesito del usuario antes de abrir Fase 1:

1. **Confirmar calibración SVG A** (trazo limpio) o cambiar a B (detalle).
2. **Confirmar Motion** como librería de animación (vs. GSAP) → DECIDIR #1.
3. **Confirmar excepción de pinning** documentada (sección haraigoshi solo) → DECIDIR #3.
4. **Revisar `docs/landing-narrative.md`** — arco, copy provisional y posición del momento haraigoshi.
5. **Confirmar presupuestos endurecidos** son realistas con el contenido que aprobemos (si el narrativo requiere más peso, ajustamos ahora, no en Fase 4).

Cuando estas 5 estén confirmadas, abro Fase 1 (dirección visual) con `docs/landing-direction.md`.
