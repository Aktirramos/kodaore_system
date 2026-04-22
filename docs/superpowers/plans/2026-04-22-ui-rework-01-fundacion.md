# UI Rework — Plan 1: Fundación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introducir el sistema de tokens de diseño (color/tipografía/spacing/radius/shadow/motion) del spec `docs/ui-design-direction.md` y el wrapper de motion con variants + hook `useReducedMotion`, sin cambiar visualmente nada del sitio en producción.

**Architecture:** Aditivo. El `@theme inline` de Tailwind v4 se extiende con tokens nuevos con prefijos semánticos (`--color-surface-base`, `--color-ink-primary`, etc.) sin tocar los antiguos (`--color-brand`, `--color-foreground`). Se añade Inter vía `next/font` coexistiendo con Manrope/Space Grotesk. Se crea `components/motion/` con variants y hook reutilizables. Una página `/dev-theme` (pública, sin auth) actúa como harness visual: muestra swatches y demos de motion.

**Tech stack:** Next.js 15 (App Router), Tailwind v4, Motion (ex-Framer Motion) v11+, Inter vía `next/font/google`, Vitest para unit tests, Playwright para e2e visual smoke.

**Spec:** `docs/ui-design-direction.md` (commit `8afcd9c` en main).

**Plan de planes:**
- **Este (Plan 1):** Fundación. Aditivo. Zero visible change.
- **Plan 2:** Migración de color + retiradas (flip dark→light, retirar Vanta/Loader).
- **Plan 3:** Primitivas (Button, Input, Card, Dialog, ... sobre shadcn-ui).
- **Plan 4:** Adaptación por vertical (landing → portal → admin → acceso).

---

## File Structure

**Crear (todos en worktree `ui-rework-01-fundacion`):**
- `components/motion/use-reduced-motion.ts` — hook SSR-safe que envuelve `useReducedMotion` de Motion.
- `components/motion/variants.ts` — objetos variants exportados: `fadeUp`, `staggerChildren`, `modalIn`, `toastIn`, `routeTransition`.
- `components/motion/index.ts` — barrel export.
- `app/[locale]/(public)/dev-theme/page.tsx` — página de validación visual con swatches + motion samples. Pública, no requiere auth.
- `tests/unit/motion-variants.test.ts` — unit tests sobre la forma de los variants.
- `tests/e2e/dev-theme.spec.ts` — smoke e2e: visita la página y verifica elementos clave.

**Modificar:**
- `package.json` — añadir dependencia `motion`.
- `app/layout.tsx` — añadir carga de Inter vía `next/font`, exponer `--font-inter`.
- `app/globals.css` — extender `@theme inline` con tokens nuevos + añadir bloque `@media (prefers-color-scheme: dark)` para los tokens nuevos.

**No tocar en este plan (defer a Plan 2+):**
- `components/vanta-waves-background.tsx`, `components/initial-loader.tsx`, `components/home-hero-scroll-sync.tsx` (retiradas en Plan 2).
- Utilities CSS existentes (`.k-hover-lift`, `.fade-rise`, `.kodaore-loader-*`, etc.).
- Cualquier componente de UI existente.
- Capas bloqueadas del CLAUDE.md: `prisma/schema.prisma`, `middleware.ts`, `lib/auth`, `lib/observability`, `lib/audit`, `lib/security`, `app/api/**`, envío de mail.

---

### Task 1: Preflight y setup de worktree

Confirma entorno y crea worktree específico para este plan.

- [ ] **Step 1: Verificar PM2 y branch main actualizada**

Run:
```bash
curl -sS -o /dev/null -w "PM2: %{http_code}\n" http://127.0.0.1:3000/eu
git -C /home/avanzosc/kodaore_system log --oneline -3
```
Expected: PM2 responde `200`. Top commit es `8afcd9c docs: direccion de diseño Fase 1`.

- [ ] **Step 2: Crear worktree del plan**

Run:
```bash
git -C /home/avanzosc/kodaore_system worktree add -b ui-rework-01-fundacion /home/avanzosc/kodaore_system.ui-rework-01-fundacion main
```
Expected: el worktree se crea sobre el HEAD de main. El resto del plan se ejecuta desde esa ruta.

- [ ] **Step 3: Enlazar node_modules del worktree principal**

Para evitar `npm install` en el worktree, crear symlink al `node_modules` del main. Mismo lockfile, misma versión:
```bash
ln -s /home/avanzosc/kodaore_system/node_modules /home/avanzosc/kodaore_system.ui-rework-01-fundacion/node_modules
ls -la /home/avanzosc/kodaore_system.ui-rework-01-fundacion/node_modules | head -3
```
Expected: symlink visible.

---

### Task 2: Instalar la dependencia `motion`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Añadir `motion` a dependencies**

Run desde el worktree:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion
npm install motion@^11 --save --no-audit
```
Expected: `package.json` actualizado con `"motion": "^11...."`. `package-lock.json` actualizado.

- [ ] **Step 2: Verificar importación**

Run:
```bash
node -e "const m = require('motion'); console.log(typeof m.motion, typeof m.AnimatePresence);"
```
Expected: `function function` o `object function` — ambos son válidos (Motion exporta esos símbolos).

- [ ] **Step 3: Verificar que el build de Next sigue OK**

Run:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion
npx next build 2>&1 | tail -20
```
Expected: build completa. Ningún error por la instalación de `motion`.

Si el build falla por cualquier cosa previa (p. ej. nextauth/prisma), parar y reportar — no es scope de Plan 1.

---

### Task 3: Cargar Inter vía `next/font`

Añade Inter al layout sin retirar Manrope/Space Grotesk. Ambos sistemas coexisten.

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Añadir import de Inter**

Edit `app/layout.tsx`. En la línea de import de `next/font/google`, añadir `Inter`:

```ts
import { Inter, Manrope, Space_Grotesk } from "next/font/google";
```

- [ ] **Step 2: Configurar la instancia**

Debajo de `spaceGrotesk`, añadir:

```ts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
```

- [ ] **Step 3: Añadir `inter.variable` al className del `<html>`**

Modificar el JSX del `<html>`:

```tsx
<html
  lang="eu"
  className={`${manrope.variable} ${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
>
```

- [ ] **Step 4: Verificar renderizado**

Run:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion && npx next build 2>&1 | tail -10
```
Expected: build completa, sin warnings sobre Inter.

Verificar también manualmente: en el navegador, con DevTools abierto, inspeccionar `<html>` en la página servida y confirmar que tiene las 3 variables (`--font-manrope`, `--font-space-grotesk`, `--font-inter`).

---

### Task 4: Añadir tokens de color nuevos al `@theme`

Extiende el bloque `@theme inline` de `app/globals.css` con los tokens del spec. No toca los tokens antiguos.

**Files:**
- Modify: `app/globals.css`

El patrón de Tailwind v4 exige DOS nombres por token: un "raw" en `:root` (reasignable por `@media`) y un alias con prefijo `--color-*` en `@theme inline`. Si ambos tienen el mismo nombre provocan auto-referencia. Por eso los tokens "raw" usan prefijo semántico sin `--color-`, y el alias Tailwind sí lleva `--color-`.

- [ ] **Step 1: Añadir variables CSS "raw" en `:root`**

En `app/globals.css`, localizar la línea `--danger: #8a2020;` dentro del `:root { ... }` existente y añadir debajo, antes del `}`:

```css
  /* --- Design direction Fase 1 (additive, Dojo Moderno) --- */
  --surface-base: #fafaf7;
  --surface-subtle: #f3f1ea;
  --surface-elevated: #ffffff;
  --surface-inverse: #13141a;

  --ink-primary: #13141a;
  --ink-secondary: #3a3e47;
  --ink-muted-2: #737680;
  --ink-inverse: #fafaf7;

  --border-subtle: #efede5;
  --border-default: #d6d2c6;
  --border-strong: #13141a;
  --border-focus: #c2272d;

  --brand-base: #c2272d;
  --brand-emphasis-2: #9a1e25;
  --brand-subtle: #fde8e8;
  --brand-contrast-2: #ffffff;

  --accent-base: #1fa35c;
  --accent-emphasis: #167d47;
  --accent-subtle: #e2f1ea;

  --success-base: #1fa35c;
  --warning-base: #b8851f;
  --info-base: #2d7a85;
  --danger-base: #8a1f22;
```

Nota: los nombres tienen sufijos `-2`/`-base`/`-primary`/`-muted-2` para evitar colisiones con los tokens viejos que ya viven en `:root` (p. ej. `--brand`, `--brand-emphasis`, `--danger`). Plan 2 unifica retirando los viejos.

- [ ] **Step 2: Exponer los tokens nuevos a Tailwind en `@theme inline`**

Localizar el bloque `@theme inline { ... }` que ya está después del `:root`. Añadir al final del bloque (antes del `}` de cierre):

```css
  --color-surface-base: var(--surface-base);
  --color-surface-subtle: var(--surface-subtle);
  --color-surface-elevated: var(--surface-elevated);
  --color-surface-inverse: var(--surface-inverse);

  --color-ink-primary: var(--ink-primary);
  --color-ink-secondary: var(--ink-secondary);
  --color-ink-muted-2: var(--ink-muted-2);
  --color-ink-inverse: var(--ink-inverse);

  --color-border-subtle: var(--border-subtle);
  --color-border-default: var(--border-default);
  --color-border-strong: var(--border-strong);
  --color-border-focus: var(--border-focus);

  --color-brand-base: var(--brand-base);
  --color-brand-emphasis-2: var(--brand-emphasis-2);
  --color-brand-subtle: var(--brand-subtle);
  --color-brand-contrast-2: var(--brand-contrast-2);

  --color-accent-base: var(--accent-base);
  --color-accent-emphasis: var(--accent-emphasis);
  --color-accent-subtle: var(--accent-subtle);

  --color-success-base: var(--success-base);
  --color-warning-base: var(--warning-base);
  --color-info-base: var(--info-base);
  --color-danger-base: var(--danger-base);

  --font-inter: var(--font-inter);
```

- [ ] **Step 3: Verificar que Tailwind compila los nuevos utilities**

Run:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion && npx next dev --port 3100 &
sleep 4
curl -sS http://localhost:3100/eu | head -c 0
# parar el dev server
kill %1
```

Mejor, un smoke con build:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion && npx next build 2>&1 | grep -E "error|Error|Compiled" | head -10
```
Expected: `Compiled successfully`. Sin errores de CSS.

- [ ] **Step 4: Sin commit todavía** (commit único al final, Task 13).

---

### Task 5: Añadir tokens de spacing, radius, shadow, motion al `@theme`

Extiende `@theme inline` con tokens escalares.

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Añadir radii al `@theme inline`**

Al final del bloque `@theme inline` añadir:

```css
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 18px;
  --radius-2xl: 24px;
  --radius-pill: 999px;
```

(Nota: `--spacing-*` lo gestiona Tailwind v4 por defecto con su escala. No creamos tokens propios de spacing; usamos la escala estándar 0/1/2/3/4/5/6/8/10/12/16/20/24. El spec lo marca como "base 4px escala armónica"; coincide exacto con Tailwind.)

- [ ] **Step 2: Añadir shadows al `@theme inline`**

```css
  --shadow-sm: 0 1px 2px rgba(19,20,26,.06), 0 0 0 1px rgba(19,20,26,.04);
  --shadow-md: 0 4px 10px -2px rgba(19,20,26,.08), 0 2px 4px -1px rgba(19,20,26,.04);
  --shadow-lg: 0 16px 28px -12px rgba(19,20,26,.18), 0 6px 10px -4px rgba(19,20,26,.08);
```

- [ ] **Step 3: Añadir tokens de motion**

```css
  --duration-instant: 0ms;
  --duration-fast: 120ms;
  --duration-base: 200ms;
  --duration-slow: 320ms;
  --duration-hero: 600ms;

  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0, 0, 0.2, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --ease-emphasis: cubic-bezier(0.3, 1.4, 0.4, 0.95);

  --distance-sm: 4px;
  --distance-md: 8px;
  --distance-lg: 16px;
```

- [ ] **Step 4: Verificar que compila**

Run:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion && npx next build 2>&1 | tail -5
```
Expected: build OK.

---

### Task 6: Bloque dark-mode para tokens nuevos

Redefine los tokens nuevos bajo `@media (prefers-color-scheme: dark)`. Los tokens antiguos siguen como están (Plan 2 los unifica).

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Añadir bloque media dark al final del fichero**

Localizar el final del archivo `app/globals.css` (después del último `@media (prefers-reduced-motion: reduce)` block). Justo antes del final del fichero, añadir:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --surface-base: #0f1013;
    --surface-subtle: #1a1c21;
    --surface-elevated: #24272e;
    --surface-inverse: #fafaf7;

    --ink-primary: #fafaf7;
    --ink-secondary: #c9cdd4;
    --ink-muted-2: #8a8e96;
    --ink-inverse: #13141a;

    --border-subtle: #24272e;
    --border-default: #33363d;
    --border-strong: #fafaf7;
    --border-focus: #d8603d;

    --brand-base: #d8603d;
    --brand-emphasis-2: #b3472a;
    --brand-subtle: #2e1416;

    --accent-base: #2cbe76;
    --accent-emphasis: #1ea05d;
    --accent-subtle: #10241b;

    --success-base: #2cbe76;
    --warning-base: #e0a83b;
    --info-base: #4a9fab;
    --danger-base: #b03030;
  }
}
```

- [ ] **Step 2: Verificar que compila**

Run:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion && npx next build 2>&1 | tail -5
```

- [ ] **Step 3: Verificar manualmente en navegador** (post-Task 9 cuando exista dev-theme)

---

### Task 7: Crear hook `useReducedMotion`

SSR-safe wrapper. Devuelve booleano.

**Files:**
- Create: `components/motion/use-reduced-motion.ts`

- [ ] **Step 1: Escribir el fichero**

Create `components/motion/use-reduced-motion.ts`:

```ts
"use client";

import { useReducedMotion as motionUseReducedMotion } from "motion/react";

/**
 * SSR-safe wrapper sobre useReducedMotion de Motion.
 * Devuelve true si el usuario prefiere reducir animaciones.
 * En SSR, devuelve false (Motion ya lo hace; este fichero existe para
 * centralizar el import y poder añadir overrides locales si es necesario).
 */
export function useReducedMotion(): boolean {
  const reduced = motionUseReducedMotion();
  return reduced === true;
}
```

- [ ] **Step 2: No tests aún** (se añaden al final en Task 11 junto con los variants).

---

### Task 8: Crear variants reutilizables

Objetos variants para Motion. Consumen los tokens de duración/easing del CSS via strings acordados.

**Files:**
- Create: `components/motion/variants.ts`

- [ ] **Step 1: Escribir el fichero**

Create `components/motion/variants.ts`:

```ts
import type { Variants, Transition } from "motion/react";

// Duraciones en segundos (Motion las consume en segundos; nuestro @theme las expresa en ms).
export const MOTION_DURATION = {
  instant: 0,
  fast: 0.12,
  base: 0.2,
  slow: 0.32,
  hero: 0.6,
} as const;

// Curvas compatibles con cubic-bezier del @theme.
export const MOTION_EASE = {
  standard: [0.2, 0, 0, 1] as const,
  enter: [0, 0, 0.2, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
  emphasis: [0.3, 1.4, 0.4, 0.95] as const,
} as const;

// Distancias de desplazamiento en px.
export const MOTION_DISTANCE = {
  sm: 4,
  md: 8,
  lg: 16,
} as const;

/**
 * Fade simple con rise pequeño. Uso: entrada de bloque de contenido.
 * Distancia: sm (4px). Duración: base. Ease: enter.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: MOTION_DISTANCE.sm },
  visible: { opacity: 1, y: 0 },
};

export const fadeUpTransition: Transition = {
  duration: MOTION_DURATION.base,
  ease: MOTION_EASE.enter,
};

/**
 * Stagger de hijos. Máximo 6 items staggerean; del 7 en adelante, todos juntos.
 * El control del límite se hace en la instanciación (slice(0, 6)).
 */
export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

/**
 * Modal: scale 0.96 -> 1 + opacity 0 -> 1 en duración slow.
 * Backdrop se anima por separado con la misma duración.
 */
export const modalIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

export const modalInTransition: Transition = {
  duration: MOTION_DURATION.slow,
  ease: MOTION_EASE.enter,
};

export const modalOutTransition: Transition = {
  duration: 0.18,
  ease: MOTION_EASE.exit,
};

/**
 * Toast: slide-up md (8px) + fade.
 */
export const toastIn: Variants = {
  hidden: { opacity: 0, y: MOTION_DISTANCE.md },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 0 },
};

export const toastInTransition: Transition = {
  duration: MOTION_DURATION.slow,
  ease: MOTION_EASE.enter,
};

export const toastOutTransition: Transition = {
  duration: 0.16,
  ease: MOTION_EASE.exit,
};

/**
 * Page transition: fade+rise sm, para template.tsx del App Router.
 * No aplicar en /admin/*: el template de esas rutas no debe animar.
 */
export const routeTransition: Variants = {
  hidden: { opacity: 0, y: MOTION_DISTANCE.sm },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 0 },
};

export const routeInTransition: Transition = {
  duration: MOTION_DURATION.base,
  ease: MOTION_EASE.enter,
};

export const routeOutTransition: Transition = {
  duration: 0.16,
  ease: MOTION_EASE.exit,
};
```

- [ ] **Step 2: Comprobar que TypeScript compila el módulo**

Run:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion && npx tsc --noEmit components/motion/variants.ts 2>&1 | head -10
```
Expected: sin errores.

---

### Task 9: Barrel export

**Files:**
- Create: `components/motion/index.ts`

- [ ] **Step 1: Escribir barrel**

Create `components/motion/index.ts`:

```ts
export { useReducedMotion } from "./use-reduced-motion";
export {
  fadeUp,
  fadeUpTransition,
  staggerChildren,
  modalIn,
  modalInTransition,
  modalOutTransition,
  toastIn,
  toastInTransition,
  toastOutTransition,
  routeTransition,
  routeInTransition,
  routeOutTransition,
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_DISTANCE,
} from "./variants";
```

- [ ] **Step 2: Comprobar compilación**

Run:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion && npx tsc --noEmit 2>&1 | tail -10
```
Expected: sin nuevos errores derivados del barrel.

---

### Task 10: Página harness `/dev-theme`

Página pública no enlazada desde la navegación. Renderiza swatches de tokens + demos de motion. Sirve para validación visual manual y para un smoke e2e.

**Files:**
- Create: `app/[locale]/(public)/dev-theme/page.tsx`

- [ ] **Step 1: Escribir la página**

Create `app/[locale]/(public)/dev-theme/page.tsx`:

```tsx
"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  fadeUp,
  fadeUpTransition,
  staggerChildren,
  modalIn,
  modalInTransition,
  modalOutTransition,
  toastIn,
  toastInTransition,
  MOTION_DURATION,
  useReducedMotion,
} from "@/components/motion";

const COLOR_TOKENS = [
  { group: "Surface", tokens: ["surface-base", "surface-subtle", "surface-elevated", "surface-inverse"] },
  { group: "Ink", tokens: ["ink-primary", "ink-secondary", "ink-muted-2", "ink-inverse"] },
  { group: "Border", tokens: ["border-subtle", "border-default", "border-strong", "border-focus"] },
  { group: "Brand", tokens: ["brand-base", "brand-emphasis-2", "brand-subtle", "brand-contrast-2"] },
  { group: "Accent", tokens: ["accent-base", "accent-emphasis", "accent-subtle"] },
  { group: "Estados", tokens: ["success-base", "warning-base", "info-base", "danger-base"] },
];

const RADIUS_TOKENS = ["sm", "md", "lg", "xl", "2xl", "pill"];
const SHADOW_TOKENS = ["sm", "md", "lg"];

export default function DevThemePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const reduced = useReducedMotion();

  return (
    <main style={{ background: "var(--color-surface-base)", color: "var(--color-ink-primary)", minHeight: "100vh", padding: "48px 24px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <header style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: 0 }}>Dev harness</p>
          <h1 style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 600, letterSpacing: "-0.02em", margin: "8px 0 8px" }}>Tokens Fase 1 — Dojo Moderno</h1>
          <p style={{ fontSize: 15, color: "var(--color-ink-secondary)", margin: 0 }}>
            Página de validación visual. No enlazada desde navegación. Reduced motion detectado: <b>{reduced ? "sí" : "no"}</b>.
          </p>
        </header>

        {COLOR_TOKENS.map((g) => (
          <section key={g.group} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>{g.group}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {g.tokens.map((t) => (
                <div key={t} style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border-default)", overflow: "hidden", background: "var(--color-surface-elevated)" }}>
                  <div style={{ height: 72, background: `var(--color-${t})` }} />
                  <div style={{ padding: "10px 12px", fontSize: 12 }}>
                    <div style={{ fontWeight: 600 }}>{t}</div>
                    <div style={{ color: "var(--color-ink-muted-2)", fontFamily: "ui-monospace, monospace", marginTop: 2 }}>
                      var(--color-{t})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Radius</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {RADIUS_TOKENS.map((r) => (
              <div key={r} style={{ width: 80, height: 80, background: "var(--color-brand-base)", color: "var(--color-brand-contrast-2)", borderRadius: `var(--radius-${r})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>
                {r}
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Shadow</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {SHADOW_TOKENS.map((s) => (
              <div key={s} style={{ padding: 20, background: "var(--color-surface-elevated)", borderRadius: "var(--radius-lg)", boxShadow: `var(--shadow-${s})`, textAlign: "center", fontSize: 12 }}>
                shadow.{s}
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Motion — fadeUp</h2>
          <motion.div
            key={Math.random()}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={fadeUpTransition}
            style={{ padding: 18, background: "var(--color-surface-subtle)", borderRadius: "var(--radius-lg)", fontSize: 14 }}
          >
            Este bloque entra con fadeUp (opacity + y {4}px, 200ms ease.enter).
          </motion.div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Motion — stagger (6 items)</h2>
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.li
                key={i}
                variants={fadeUp}
                transition={fadeUpTransition}
                style={{ padding: "14px 12px", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-md)", fontSize: 13 }}
              >
                Item {i + 1}
              </motion.li>
            ))}
          </motion.ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Motion — modal y toast</h2>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setModalOpen(true)}
              style={{ padding: "10px 16px", background: "var(--color-brand-base)", color: "var(--color-brand-contrast-2)", border: 0, borderRadius: "var(--radius-pill)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
            >
              Abrir modal
            </button>
            <button
              onClick={() => {
                setToastVisible(true);
                window.setTimeout(() => setToastVisible(false), 2400);
              }}
              style={{ padding: "10px 16px", background: "var(--color-surface-elevated)", color: "var(--color-ink-primary)", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-pill)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
            >
              Mostrar toast
            </button>
          </div>
        </section>

        <AnimatePresence>
          {modalOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: MOTION_DURATION.slow }}
              style={{ position: "fixed", inset: 0, background: "#000", zIndex: 50 }}
              onClick={() => setModalOpen(false)}
            />
          )}
          {modalOpen && (
            <motion.div
              key="modal"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalIn}
              transition={modalInTransition}
              style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "var(--color-surface-elevated)", padding: 24, borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)", zIndex: 51, maxWidth: 420 }}
              role="dialog"
              aria-modal="true"
              aria-label="Modal de demo"
            >
              <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 600 }}>Modal de demo</h3>
              <p style={{ margin: "0 0 14px", fontSize: 14, color: "var(--color-ink-secondary)" }}>
                Entra con scale 0.96→1 + opacity en duración slow.
              </p>
              <button
                onClick={() => setModalOpen(false)}
                style={{ padding: "8px 14px", background: "var(--color-brand-base)", color: "var(--color-brand-contrast-2)", border: 0, borderRadius: "var(--radius-pill)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
              >
                Cerrar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toastVisible && (
            <motion.div
              key="toast"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={toastIn}
              transition={toastInTransition}
              style={{ position: "fixed", bottom: 24, right: 24, background: "var(--color-surface-inverse)", color: "var(--color-ink-inverse)", padding: "12px 18px", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)", zIndex: 60, fontSize: 13, fontWeight: 500 }}
              role="status"
              aria-live="polite"
            >
              Toast de demo — entra con slide-up + fade.
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verificar build**

Run:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion && npx next build 2>&1 | tail -10
```
Expected: build successful. La ruta `/[locale]/(public)/dev-theme` aparece en el listado de rutas.

- [ ] **Step 3: Validación manual rápida**

Arrancar dev:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion && npx next dev --port 3100 &
sleep 6
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3100/eu/dev-theme
kill %1
```
Expected: 200. Si da error, revisar logs de dev y arreglar antes de seguir.

---

### Task 11: Unit tests sobre variants

**Files:**
- Create: `tests/unit/motion-variants.test.ts`

- [ ] **Step 1: Escribir test**

Create `tests/unit/motion-variants.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  fadeUp,
  fadeUpTransition,
  staggerChildren,
  modalIn,
  modalInTransition,
  modalOutTransition,
  toastIn,
  toastInTransition,
  routeTransition,
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_DISTANCE,
} from "@/components/motion";

describe("motion tokens", () => {
  it("expone las 5 duraciones en segundos", () => {
    expect(MOTION_DURATION.instant).toBe(0);
    expect(MOTION_DURATION.fast).toBe(0.12);
    expect(MOTION_DURATION.base).toBe(0.2);
    expect(MOTION_DURATION.slow).toBe(0.32);
    expect(MOTION_DURATION.hero).toBe(0.6);
  });

  it("expone las 4 curvas como tuplas de 4 números", () => {
    expect(MOTION_EASE.standard).toHaveLength(4);
    expect(MOTION_EASE.enter).toHaveLength(4);
    expect(MOTION_EASE.exit).toHaveLength(4);
    expect(MOTION_EASE.emphasis).toHaveLength(4);
  });

  it("expone las 3 distancias en px", () => {
    expect(MOTION_DISTANCE.sm).toBe(4);
    expect(MOTION_DISTANCE.md).toBe(8);
    expect(MOTION_DISTANCE.lg).toBe(16);
  });
});

describe("fadeUp", () => {
  it("hidden comienza con opacity 0 y rise de distance.sm", () => {
    expect(fadeUp.hidden).toEqual({ opacity: 0, y: MOTION_DISTANCE.sm });
  });
  it("visible termina con opacity 1 y y 0", () => {
    expect(fadeUp.visible).toEqual({ opacity: 1, y: 0 });
  });
  it("transition usa duration.base y ease.enter", () => {
    expect(fadeUpTransition.duration).toBe(MOTION_DURATION.base);
    expect(fadeUpTransition.ease).toEqual(MOTION_EASE.enter);
  });
});

describe("staggerChildren", () => {
  it("visible dispara stagger de 30ms entre hijos", () => {
    const visible = staggerChildren.visible as { transition?: { staggerChildren?: number } };
    expect(visible.transition?.staggerChildren).toBe(0.03);
  });
});

describe("modalIn", () => {
  it("hidden scale 0.96 + opacity 0", () => {
    expect(modalIn.hidden).toEqual({ opacity: 0, scale: 0.96 });
  });
  it("visible scale 1 + opacity 1", () => {
    expect(modalIn.visible).toEqual({ opacity: 1, scale: 1 });
  });
  it("in transition usa duration.slow y ease.enter", () => {
    expect(modalInTransition.duration).toBe(MOTION_DURATION.slow);
    expect(modalInTransition.ease).toEqual(MOTION_EASE.enter);
  });
  it("out transition es más corta y usa ease.exit", () => {
    expect(modalOutTransition.duration).toBe(0.18);
    expect(modalOutTransition.ease).toEqual(MOTION_EASE.exit);
  });
});

describe("toastIn", () => {
  it("hidden y de distance.md (slide-up)", () => {
    expect(toastIn.hidden).toEqual({ opacity: 0, y: MOTION_DISTANCE.md });
  });
  it("transition usa duration.slow", () => {
    expect(toastInTransition.duration).toBe(MOTION_DURATION.slow);
  });
});

describe("routeTransition", () => {
  it("hidden y de distance.sm", () => {
    expect(routeTransition.hidden).toEqual({ opacity: 0, y: MOTION_DISTANCE.sm });
  });
});
```

- [ ] **Step 2: Ejecutar el test**

Run:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion && npx vitest run tests/unit/motion-variants.test.ts 2>&1 | tail -30
```
Expected: todos los tests pasan. Si Vitest está mal configurado para resolver `@/components/motion`, verificar `vitest.config` y corregir el alias.

---

### Task 12: E2E smoke de `/dev-theme`

**Files:**
- Create: `tests/e2e/dev-theme.spec.ts`

- [ ] **Step 1: Escribir test**

Create `tests/e2e/dev-theme.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("dev-theme renderiza swatches y motion samples", async ({ page }) => {
  await page.goto("/eu/dev-theme");

  await expect(page.getByRole("heading", { name: /Tokens Fase 1 — Dojo Moderno/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Abrir modal/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Mostrar toast/ })).toBeVisible();

  // Al menos un swatch por cada grupo (verifica que los tokens se resuelven en CSS).
  // Asumimos que los divs con background var(--color-surface-base) están presentes.
  const surfaceSwatch = page.locator("div").filter({ hasText: /^surface-base$/ });
  await expect(surfaceSwatch).toBeVisible();

  // Modal abre y cierra.
  await page.getByRole("button", { name: /Abrir modal/ }).click();
  await expect(page.getByRole("dialog", { name: /Modal de demo/i })).toBeVisible();
  await page.getByRole("button", { name: /Cerrar/ }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
```

- [ ] **Step 2: Ejecutar el test**

Run:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion && npx playwright test tests/e2e/dev-theme.spec.ts 2>&1 | tail -20
```
Expected: 1 passed. Si falla, revisar el DOM vía snapshot y ajustar selectores.

---

### Task 13: Lint + test suite completa + commit

**Files:** (finaliza commit del plan)

- [ ] **Step 1: Lint**

Run:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion && npm run lint 2>&1 | tail -10
```
Expected: sin errores. Warnings existentes pre-plan son OK (no regresiones nuevas).

- [ ] **Step 2: Test unit completo**

Run:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion && npm run test:unit 2>&1 | tail -20
```
Expected: todos pasan.

- [ ] **Step 3: Smoke e2e de la suite existente**

Run:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion && npx playwright test tests/e2e/smoke.spec.ts 2>&1 | tail -20
```
Expected: los tests públicos pasan. (Los tests auth-gated están `test.skip` salvo E2E_AUTH_ENABLED=true.)

- [ ] **Step 4: Revisar qué va al commit**

Run:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion && git status --short
```
Debe aparecer:
- `M package.json`, `M package-lock.json`
- `M app/layout.tsx`
- `M app/globals.css`
- `?? app/[locale]/(public)/dev-theme/`
- `?? components/motion/`
- `?? tests/unit/motion-variants.test.ts`
- `?? tests/e2e/dev-theme.spec.ts`

No debe aparecer: nada bajo `lib/auth`, `prisma/`, `middleware.ts`, `lib/security`, `app/api/`.

- [ ] **Step 5: Commit**

Run:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-01-fundacion && \
  git add package.json package-lock.json app/layout.tsx app/globals.css \
          app/\[locale\]/\(public\)/dev-theme components/motion \
          tests/unit/motion-variants.test.ts tests/e2e/dev-theme.spec.ts && \
  git commit -m "$(cat <<'EOF'
feat(ui): fundacion de Fase 1 (tokens Dojo Moderno + Inter + motion wrapper)

Aditivo: no cambia nada visible del sitio en produccion. Sumado:

- Tokens nuevos de color (surface, ink, border, brand, accent, estados)
  en @theme, con sufijos -2/-base/-primary para evitar colisiones con
  los viejos. Plan 2 unifica.
- Bloque @media (prefers-color-scheme: dark) para los tokens nuevos.
- Tokens de radius, shadow, duration, ease, distance.
- Inter cargada via next/font (coexistiendo con Manrope y Space Grotesk).
- components/motion/ con variants fadeUp, staggerChildren, modalIn,
  toastIn, routeTransition + hook useReducedMotion + constantes.
- Pagina harness /dev-theme (publica) para validacion visual.
- Unit tests para variants, smoke e2e para la pagina harness.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 6: Verificar historial**

Run:
```bash
git -C /home/avanzosc/kodaore_system.ui-rework-01-fundacion log --oneline -3
```
Expected (desde el más reciente):
1. `feat(ui): fundacion de Fase 1 (tokens Dojo Moderno + Inter + motion wrapper)`
2. `docs: direccion de diseño Fase 1 (Dojo Moderno + sistema de motion)`
3. `docs(ui): audit de Fase 0 (scope reducido, solo rutas publicas)`

---

## Criterios finales de "done"

1. `npx next build` completa sin errores en la rama del plan.
2. `npm run lint` sin errores nuevos.
3. `npm run test:unit` todos pasan (al menos los 9 tests nuevos de motion variants).
4. `npx playwright test smoke.spec.ts dev-theme.spec.ts` pasa.
5. Lighthouse sobre `/eu` (sin el loader cambiado) NO regresiona respecto al baseline Fase 0 (A11y 100 / BP 100 / SEO 83).
6. `/eu/dev-theme` renderiza swatches + modal + toast correctamente en light y en dark (testear manualmente con DevTools Rendering > Emulate CSS media feature > prefers-color-scheme).
7. Un commit único en la rama `ui-rework-01-fundacion`.

## Siguiente paso

Al terminar este plan: **parada dura**. Merge de `ui-rework-01-fundacion` → `main` sólo tras revisión humana. Después, escribir Plan 2 (migración de color + retiradas) con la misma skill `writing-plans` sobre el mismo spec.

No avanzar a Plan 2 sin validación humana del resultado de Plan 1.
