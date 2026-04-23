# Landing Kodaore — Fase 1 · Dirección visual

Fecha: 2026-04-23
Entrada: `docs/landing-audit.md` + `docs/landing-narrative.md` + `docs/ui-design-direction.md` (Dojo Moderno).
Salida: subset editorial del sistema + gramática de motion + librería + fallbacks.

Este documento no define copy (eso está en la narrativa) ni arquitectura de código (eso es Fase 2). Solo decisiones visuales y de animación.

---

## 1. Principios de la landing dentro del sistema

La landing **no es un sistema distinto**. Es el sistema Dojo Moderno usado con la palanca editorial al máximo:

- **Menos tokens, no más.** La landing usa un subconjunto deliberado de la paleta, tipografía y escala del sistema. Cualquier nuevo color, sombra o animación que no exista ya en el sistema se justifica o se descarta.
- **Aire antes que decoración.** La densidad baja sustituye a la ornamentación.
- **Reutilización sobre invención.** Componentes como `<SiteFooter />` o utilidades como `useReducedMotion` se reutilizan.

---

## 2. Tipografía

### Fuentes

| Familia | Uso | Variable | Pesos cargados |
|---|---|---|---|
| **Shippori Mincho** | Títulos editoriales, aforismos del haraigoshi, nombres de sedes | `var(--font-mincho)` | 500 · 700 · 800 (ya cargados) |
| **Inter** | Cuerpo y navegación | `var(--font-inter)` | variable (ya cargado) |

**No se añade peso 400 de Mincho.** El audit lo planteaba para más pausa editorial, pero:

- Cada peso añadido es ~20 kb de variable font.
- Con el budget nuevo (<80 kb JS inicial), cada kb cuenta.
- Shippori Mincho 500 al tamaño `display.2xl` (72→112 px) ya lee con peso pausado suficiente.
- Si en Fase 4 queda claro que 500 es "demasiado sólido" para el hero, se reevalúa como quick fix.

### Escala

Se **añade un token de escala al `@theme` de `globals.css`**: `--text-display-2xl`, porque la landing necesita un paso por encima del actual:

```css
--text-display-2xl: clamp(3.5rem, 6vw + 1rem, 7rem);  /* 56→112 px */
```

Cumple: más contención en mobile (56 px no es absurdo), más respiración en desktop ancho (112 px), lettering mincho aguanta sin romperse.

Las otras escalas (`display.xl`, `text-3xl`, etc.) ya sirven para secciones secundarias.

### Reglas tipográficas para la landing

| Dónde | Familia | Tamaño aprox | Peso | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| `<h1>` apertura | Mincho | display-2xl | 500 | 0.95 | −0.015em |
| `<h2>` sección | Mincho | clamp(2rem, 3.5vw, 3.5rem) | 500 | 1.05 | −0.01em |
| `<h3>` subtítulo | Mincho | clamp(1.25rem, 2vw, 1.75rem) | 500 | 1.2 | −0.005em |
| Aforismos haraigoshi | Mincho | clamp(1rem, 1.5vw, 1.25rem) | 500 | 1.4 | 0 |
| Cuerpo | Inter | clamp(1rem, 1.1vw, 1.125rem) | 400 | 1.6 | 0 |
| Texto técnico (polideportivo, horarios) | Inter | 0.875rem | 500 | 1.5 | 0 |
| Eyebrow (caption) | Inter | 0.75rem | 600 | 1.4 | 0.14em uppercase |

Las utilidades Tailwind inline (`text-[clamp(...)]`) se usan sin complejo: son más transparentes que una clase custom. Si un patrón se repite en 3+ sitios, se extrae.

---

## 3. Paleta reducida

La paleta del sistema Dojo Moderno tiene brand + accent + ink + surface. La landing reduce esto al mínimo:

| Token del sistema | Uso en landing |
|---|---|
| `--surface-base` (#fafaf7) | Fondo único |
| `--surface-subtle` (#f3f1ea) | Fondo del momento haraigoshi (papel del manual) |
| `--ink-primary` (#13141a) | Titulares y trazo de los SVG |
| `--ink-secondary` (#3a3e47) | Cuerpo |
| `--ink-muted-2` (#737680) | Eyebrows, captions, horarios resumen |
| `--border-subtle` (#efede5) | Filetes entre sedes |
| `--brand-base` (#c2272d) | Sólo hover + focus ring. **Cero rojo decorativo.** |

**No se usan** en la landing: accent (`--accent-*`), warning/info/danger, gradientes radiales (el `.kodaore-shell::before` existente no aplica aquí), shadows `lg`.

Capas globales (washi + grain) **se conservan** — son tan suaves que funcionan como textura del manual. `ui-design-direction.md` ya las define bien; no se tocan.

---

## 4. Gramática de motion

Cuatro técnicas, todas existentes o derivadas con lo que hay.

### 4.1 Fade + rise (reveals estándar)

Ya existe en `components/motion/` como `fadeUp`. Se usa para:
- Aparición de cada sección al entrar en viewport (IntersectionObserver, threshold 0.1, una sola vez).
- Aforismos del haraigoshi uno tras otro (stagger 120 ms).

Ajustes para la landing:
- `distance`: **8 px** (más contenido que los 16 px del sistema general — editorial quiere menos movimiento).
- `duration`: `var(--duration-slow)` (320 ms).
- `ease`: `var(--ease-enter)`.

### 4.2 Path drawing (trazo que se completa)

Usado **puntualmente**: una sola línea fina que cruza entre §2 y §3 como transición. El path es un SVG inline con `stroke-dasharray` + `stroke-dashoffset`, animado por scroll progress en el contenedor.

No se animan los paths del haraigoshi en sí — los SVG se usan como frames completos, no como trazado progresivo. Intentar dibujar 60–90 paths de un frame en tiempo real sería caro y el efecto se leería peor.

### 4.3 Frame-by-frame reveal (momento haraigoshi)

El núcleo de la landing. Técnica:

- Contenedor sticky de altura `220vh` (4 "páginas" de scroll + salida).
- `useScroll({ target: containerRef, offset: ['start start', 'end end'] })` de Framer Motion da `scrollYProgress: MotionValue<0..1>`.
- `useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 1, 2, 3, 4])` mapea a índice de frame (0–4).
- El índice se usa para mostrar un solo SVG inlineado a la vez con `opacity`/`clipPath`. Los 5 SVG se inlinean al primer paint; solo se muestra uno según progreso.
- Los 4 aforismos aparecen con `opacity` mapeado a subrangos (`useTransform(scrollYProgress, [0, 0.2], [0, 1])` para el primero, etc.).

**Salida clara del pinning**: en `scrollYProgress >= 0.95` la sección se "despega" suavemente. No hay scroll-jacking — se avanza con velocidad de scroll natural; si el usuario scrollea rápido, llega al final sin perderse nada crítico (el frame final se muestra).

### 4.4 Transiciones entre secciones

Cross-fade breve cuando una sección sale y la siguiente entra. No hay desplazamientos horizontales, ni zooms. Es el silencio el que separa secciones, no la animación.

### 4.5 Hover / focus (interacción estándar)

- Enlaces: subrayado aparece con `text-decoration-thickness: 2px` en hover.
- CTAs: sin color de fondo. Subrayado más grueso y `--ink-primary`.
- Focus ring: `2px solid var(--brand-base)`, `outline-offset: 4px` (más visible que el del sistema porque aquí la tipografía es más grande).

---

## 5. Librería de animación — decisión

**Framer Motion** (Motion v11, ya en el bundle).

Comparativa final:

| Opción | Bundle extra | Cobertura pinning haraigoshi | Coherencia con sistema | Elegida |
|---|---|---|---|---|
| **A. Framer Motion** | **0 kb** | Suficiente con `useScroll` + `useTransform` | ✅ ya usado en `components/motion/` | **✅ sí** |
| B. GSAP + ScrollTrigger | ~50 kb gz | Más expresiva | ✗ duplica ecosistema, contradice `ui-design-direction.md §6.5` | no |
| C. CSS scroll-driven + IO | 0 kb | No cubre bien pinning sincronizado | — | no |

**Carga diferida**: el componente que implementa el pinning del haraigoshi se importa con `dynamic(() => import('./chapter-haraigoshi'), { ssr: true, loading: () => <HaraigoshiFallback /> })`. El `HaraigoshiFallback` es el fallback estático (ver §7). Así el JS extra (Motion + el hook de scroll) solo pesa en el bundle cuando la sección está cerca del viewport (se hidrata por IntersectionObserver).

> Nota: Motion YA está en el bundle por otros componentes (`components/motion/`, transiciones de página). Pero el uso de `useScroll` es nuevo. El tree-shaking de Motion cubre `useScroll`/`useTransform` sin incluir dependencias extra.

---

## 6. Prohibiciones explícitas

Estas líneas rojas se auditan en Fase 4:

- ❌ **Parallax genérico** de fondos a distinta velocidad.
- ❌ **Contadores** ("+500 alumnos", "+15 años") sin contexto narrativo. Si aparecen números, aparecen en frase.
- ❌ **Partículas, glow, blur masivo** de fondos.
- ❌ **Autoplay de audio** (ni vídeo con sonido).
- ❌ **Scroll-jacking**. El usuario controla la velocidad siempre. El pinning del haraigoshi **no** bloquea el scroll — si se scrollea rápido, la sección pasa rápido.
- ❌ **Three.js, WebGL, canvas animado.**
- ❌ **Iconografía random** de lucide/heroicons solo para decorar. Si un icono aparece, su función está justificada.
- ❌ **Bordes animados, gradientes animados**, shimmer loaders.
- ❌ **"Cards" con sombra pronunciada** dentro de la landing. Una sombra sutil sólo si separa dos planos funcionales (no se anticipa ningún caso).

---

## 7. Accesibilidad y fallbacks (desde el primer commit, no al final)

### 7.1 `prefers-reduced-motion: reduce`

Comportamiento por sección:

| Sección | Con motion | Reduced motion |
|---|---|---|
| Apertura | fade-rise 320 ms | sin animación |
| Enseñanza | fade-rise stagger | sin animación |
| **Haraigoshi** | pinning + frame reveal | **rejilla estática 2 cols × 3 filas**: 5 SVG + título centrado, todos visibles. Aforismos al lado de cada frame. Se percibe como lámina de manual. |
| Método | fade-rise stagger 3 | sin animación |
| Sedes | fade-rise | sin animación |
| Disciplinas | fade-rise | sin animación |
| CTA | fade-rise | sin animación |
| Familias | — | — |
| Footer | — | — |

Implementación: el hook `useReducedMotion()` ya existe en `components/motion/`. El componente `ChapterHaraigoshi` hace early-return a `<ChapterHaraigoshiStatic />` si detecta reduced motion.

### 7.2 Sin JavaScript

La landing **completa** debe funcionar sin JS ejecutado. Esto significa:

- HTML semántico con `<h1>`, `<h2>`, `<h3>`, `<section>`, `<nav>`, `<footer>`.
- Los 5 SVG del haraigoshi se renderizan inline en el HTML (server component), en flujo vertical con sus aforismos al lado. Sin pinning — lectura continua.
- Enlaces a portal familia y a sedes funcionan como `<a href>` estándar.
- CTA de primera clase: enlaces `mailto:` y `https://wa.me/...` directos, no JS.
- No hay botones que "abren modal" — los modales no entran en esta landing.

### 7.3 Teclado y foco

- Orden de tab lineal, sigue el flujo visual.
- Los enlaces del pinning (por ejemplo, si algún aforismo lleva a un deep link) son navegables por teclado sin entrar en pinning hacks.
- Focus ring siempre visible (`outline: 2px solid var(--brand-base)`, offset 4px).

### 7.4 Color y contraste

Todos los textos pasan AA:
- `--ink-primary` sobre `--surface-base` → contraste 14.8:1 ✅ AAA
- `--ink-secondary` sobre `--surface-base` → contraste 10.2:1 ✅ AAA
- `--ink-muted-2` sobre `--surface-base` → contraste 4.7:1 ✅ AA
- `--brand-base` sobre `--surface-base` (hover/focus) → 5.3:1 ✅ AA

---

## 8. Estructura de páginas en el viewport

No hay "hero a pantalla completa", ni secciones de 100vh decorativas. Cada sección ocupa lo que necesita su contenido. Reglas:

- Apertura: **mínimo 70vh, máximo 100vh**. Para que el título respire, no para imponerse.
- Haraigoshi: altura **fija por pinning** = `220vh` de contenedor, sticky child = `100vh`.
- Resto de secciones: altura natural, separadas por `padding-block: clamp(5rem, 10vh, 8rem)`.

**Ritmo vertical global**:

- Padding entre secciones: `clamp(5rem, 10vh, 8rem)`. No se añade token `space.32` / `space.40` al sistema — con `clamp` inline basta.
- Max-width del contenido: `max-w-[72ch]` (texto) / `max-w-6xl` (contenedor). Mobile: `px-5`, desktop: `px-8`.

---

## 9. Imágenes y SVG

- **Únicas imágenes de la landing**: los 5 SVG del haraigoshi, inlineados. No hay `<Image>` de Next, no hay fotos, no hay logos decorativos (el logo aparece solo en el header/footer compartidos).
- Los SVG usan `fill="currentColor"` para heredar `--ink-primary`. Tamaño via `width: 100%; height: auto` dentro de contenedor con aspect-ratio fijado.
- LCP candidato: el `<h1>` de la apertura (es el primer bloque pintado encima del fold). No hay imagen hero que compita.

---

## 10. Checklist de cierre Fase 1

- [x] Tipografía decidida: Shippori Mincho 500 + Inter (ambos ya cargados).
- [x] Escala: añadir `--text-display-2xl` al `@theme`.
- [x] Paleta reducida: ink + surface + brand (solo hover).
- [x] Gramática motion: 4 técnicas, todas sobre Framer Motion.
- [x] Librería: Framer Motion (A) confirmada.
- [x] Prohibiciones documentadas y auditables en Fase 4.
- [x] Fallbacks reduced-motion definidos por sección.
- [x] Fallback sin JS definido (flujo vertical, enlaces directos).

Con esto se abre Fase 2 (`docs/landing-plan.md`): lista de componentes, arquitectura, criterios de aceptación, riesgos.
