# UI Rework — Plan 3: Primitivas core + migración de k-hover-* en público

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir las 4 primitivas de UI mínimas necesarias ahora (`Button`, `Card`, `Badge`, `Skeleton`) con sus animaciones integradas, y migrar los 17 ficheros públicos que aún usan las utilities `.k-hover-*`. Deja admin/portal para Plan 4 (siguen con utilities viejas mientras el entorno de auth esté roto).

**Architecture:** Primitivas en `components/ui/` como funciones puras sin dependencias extra (usa `clsx` ya instalado). Variantes vía objetos literales (no CVA todavía — ~1KB ahorro). Cada primitiva expone un generador de clases (`getButtonClasses`) + componente React que lo usa; los tests atacan el generador directamente para evitar añadir `@testing-library/react` como dependencia. Skeleton incluye fix del bug detectado en audit: `animate-pulse` debe caer bajo `prefers-reduced-motion`.

**Tech stack:** Next.js 15, Tailwind v4 (tokens ya definidos en Plan 1 + 2), `clsx`, Motion (para interacciones de botón donde se quiera spring feel). Sin nuevas dependencias.

**Spec:** `docs/ui-design-direction.md`. Plan 2 aplicado en commit `f6e0dda`.

**Plan de planes:**
- Plan 1 (merged): fundación aditiva.
- Plan 2 (merged): flip cromático + retiradas Vanta/Loader.
- **Plan 3 (este):** primitivas core + retiro `k-hover-*` en públicos.
- Plan 4 (siguiente): migración admin + portal, retirada completa de `k-hover-*` de globals.css, primitivas adicionales (Dialog, Dropdown, Tabs, Tooltip, Input, Select, Checkbox, Table) cuando se necesiten.

## Scope

**En scope:**
- 4 primitivas: `Button`, `Card`, `Badge`, `Skeleton`.
- Retiro de `.k-hover-lift`, `.k-hover-soft`, `.k-hover-action` en **sólo ficheros públicos**: los 17 identificados por grep (`components/*` + `app/[locale]/(public)/**` + `app/[locale]/(auth)/**` + `app/[locale]/not-found.tsx`).
- Unit tests sobre los generadores de clases.
- Demo en `/dev-theme`.

**Fuera de scope (Plan 4):**
- `app/[locale]/(backoffice)/admin/**` (6 ficheros con `k-hover-*`).
- `app/[locale]/(family-portal)/portal/**` (5 ficheros con `k-hover-*`).
- `components/admin-*-actions-table.tsx` (3 ficheros).
- Retirar `.k-hover-lift`, `.k-hover-soft`, `.k-hover-action`, `.k-row-hover` de `globals.css` — esperan a que admin/portal migren (Plan 4). Este plan no toca globals.css.
- Primitivas adicionales: Dialog, DropdownMenu, Tabs, Tooltip, Input, Select, Checkbox, Table — se construyen cuando una vertical las necesite.

## File structure

**Crear:**
- `components/ui/button.tsx` — primitiva Button + `getButtonClasses`.
- `components/ui/card.tsx` — primitiva Card + `getCardClasses`.
- `components/ui/badge.tsx` — primitiva Badge + `getBadgeClasses`.
- `components/ui/skeleton.tsx` — primitiva Skeleton (con reduced-motion fix).
- `components/ui/index.ts` — barrel export.
- `tests/unit/ui-button.test.ts` — tests del generator.
- `tests/unit/ui-card.test.ts`
- `tests/unit/ui-badge.test.ts`
- `tests/unit/ui-skeleton.test.ts`

**Modificar:**
- `app/[locale]/(public)/dev-theme/page.tsx` — añadir demos de las 4 primitivas.
- Ficheros que usan `k-hover-*` (17):
  - `components/site-footer.tsx`
  - `components/coach-profile-card.tsx`
  - `components/auth-credentials-form.tsx`
  - `components/auth-signup-form.tsx`
  - `components/auth-signout-button.tsx`
  - `components/erropak-gallery.tsx`
  - `components/fototeca-gallery.tsx`
  - `app/[locale]/(public)/page.tsx`
  - `app/[locale]/(public)/sedes/page.tsx`
  - `app/[locale]/(public)/sedes/[site]/page.tsx`
  - `app/[locale]/(public)/fototeca/page.tsx`
  - `app/[locale]/(public)/erropak/page.tsx`
  - `app/[locale]/(auth)/acceso/page.tsx`
  - `app/[locale]/(auth)/acceso/crear-cuenta/page.tsx` (probablemente)
  - `app/[locale]/not-found.tsx`

**No tocar:**
- `app/globals.css` (las utilities se quedan hasta Plan 4).
- Cualquier fichero de admin/portal/_shared/_components.
- Capas bloqueadas: `lib/auth`, `middleware.ts`, `prisma/*`, `app/api/**`.

## Regla de mapeo: de `k-hover-*` a primitivas

Cada uso de `k-hover-*` se sustituye según el contexto:

| Uso actual | Reemplazo |
|---|---|
| `<div className="k-hover-lift border ...">` (card de navegación) | `<Card interactive ...>` |
| `<div className="k-hover-soft border ...">` (card estática con hover suave) | `<Card ...>` con `transition-colors hover:bg-surface-subtle/60 duration-200` inline, o `<Card variant="subtle">` si es visual subtle. |
| `<button className="k-hover-action ...">` (CTA con micro-lift) | `<Button variant="primary \| secondary \| ghost">` |
| `<a className="k-hover-lift ...">` (card como enlace) | `<Card as={Link} href=... interactive>` (el componente acepta `as` polimorfico) |
| `<li className="k-row-hover ...">` (fila de tabla admin) | **No tocar en Plan 3**. Plan 4. |

**Ajustes secundarios que a veces aparecen junto a `k-hover-*`:**
- `k-focus-ring` sobre elementos interactivos: dejar intacto. Las primitivas ya usan `focus-visible:outline-*` equivalente internamente, pero si un fichero mezcla la primitiva con `k-focus-ring` encima, se deja (redundante pero no rompe).
- Duraciones de transición dispersas (`duration-[260ms]`): las primitivas ya exponen la duración correcta (`motion.duration.base`); quitar la duración manual.

---

### Task 1: Preflight + worktree

- [ ] **Step 1: Verificar main**

Run:
```bash
git -C /home/avanzosc/kodaore_system log --oneline -2
```
Expected: top commit `f6e0dda feat(ui): migracion cromatica a Dojo Moderno`.

- [ ] **Step 2: Crear worktree**

```bash
git -C /home/avanzosc/kodaore_system worktree add -b ui-rework-03-primitivas /home/avanzosc/kodaore_system.ui-rework-03-primitivas main
```

- [ ] **Step 3: Symlinks node_modules y .env**

```bash
ln -s /home/avanzosc/kodaore_system/node_modules /home/avanzosc/kodaore_system.ui-rework-03-primitivas/node_modules
ln -s /home/avanzosc/kodaore_system/.env /home/avanzosc/kodaore_system.ui-rework-03-primitivas/.env
ls -la /home/avanzosc/kodaore_system.ui-rework-03-primitivas/node_modules /home/avanzosc/kodaore_system.ui-rework-03-primitivas/.env | head -3
```

---

### Task 2: Primitiva `Button`

**Files:**
- Create: `components/ui/button.tsx`

- [ ] **Step 1: Escribir la primitiva**

Create `components/ui/button.tsx`:

```tsx
import clsx from "clsx";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-brand-base text-brand-contrast-2 hover:bg-brand-emphasis-2 active:bg-brand-emphasis-2",
  secondary:
    "border border-border-default bg-surface-elevated text-ink-primary hover:bg-surface-subtle active:bg-surface-subtle",
  ghost:
    "text-ink-primary hover:bg-surface-subtle active:bg-surface-subtle",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold tracking-[0.02em] " +
  "transition-[background-color,color,border-color,transform] duration-[var(--duration-base)] ease-[var(--ease-enter)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base " +
  "active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:opacity-50";

export type ButtonVariants = {
  variant?: Variant;
  size?: Size;
};

export type ButtonProps = ButtonVariants & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Devuelve el string de clases resuelto para un Button.
 * Exportado para ser testeado sin RTL.
 */
export function getButtonClasses({
  variant = "primary",
  size = "md",
  className,
}: ButtonVariants & { className?: string }): string {
  return clsx(BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={getButtonClasses({ variant, size, className })}
      {...props}
    />
  );
});
```

- [ ] **Step 2: Verificar TS**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas && npx tsc --noEmit 2>&1 | tail -5
```
Expected: limpio.

No commit.

---

### Task 3: Primitiva `Card`

**Files:**
- Create: `components/ui/card.tsx`

- [ ] **Step 1: Escribir la primitiva**

Create `components/ui/card.tsx`:

```tsx
import clsx from "clsx";
import { forwardRef, type HTMLAttributes } from "react";

type Variant = "default" | "subtle" | "elevated";

const VARIANT_CLASSES: Record<Variant, string> = {
  default: "bg-surface-elevated border border-border-subtle",
  subtle: "bg-surface-subtle border border-border-subtle",
  elevated: "bg-surface-elevated border border-border-subtle shadow-md",
};

const INTERACTIVE_CLASSES =
  "transition-[transform,box-shadow,border-color,background-color] duration-[var(--duration-base)] ease-[var(--ease-enter)] " +
  "hover:-translate-y-[var(--distance-sm)] hover:shadow-md hover:border-border-default " +
  "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-base " +
  "motion-reduce:transform-none motion-reduce:transition-[box-shadow,border-color,background-color]";

const BASE_CLASSES = "relative rounded-lg p-4";

export type CardVariants = {
  variant?: Variant;
  interactive?: boolean;
};

export type CardProps = CardVariants & HTMLAttributes<HTMLDivElement>;

/**
 * Devuelve el string de clases resuelto para una Card.
 */
export function getCardClasses({
  variant = "default",
  interactive = false,
  className,
}: CardVariants & { className?: string }): string {
  return clsx(
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    interactive && INTERACTIVE_CLASSES,
    className,
  );
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "default", interactive = false, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={getCardClasses({ variant, interactive, className })}
      {...props}
    />
  );
});
```

- [ ] **Step 2: Verificar TS**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas && npx tsc --noEmit 2>&1 | tail -5
```

No commit.

---

### Task 4: Primitiva `Badge`

**Files:**
- Create: `components/ui/badge.tsx`

- [ ] **Step 1: Escribir la primitiva**

Create `components/ui/badge.tsx`:

```tsx
import clsx from "clsx";
import { forwardRef, type HTMLAttributes } from "react";

type Tone = "brand" | "accent" | "neutral" | "success" | "warning" | "info" | "danger";

const TONE_CLASSES: Record<Tone, string> = {
  brand: "bg-brand-subtle text-brand-emphasis-2 border border-brand-base/20",
  accent: "bg-accent-subtle text-accent-emphasis border border-accent-base/20",
  neutral: "bg-surface-subtle text-ink-secondary border border-border-subtle",
  success: "bg-accent-subtle text-accent-emphasis border border-accent-base/20",
  warning: "bg-warning-base/12 text-warning-base border border-warning-base/25",
  info: "bg-info-base/10 text-info-base border border-info-base/25",
  danger: "bg-danger-base/10 text-danger-base border border-danger-base/25",
};

const BASE_CLASSES =
  "inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-xs font-semibold tracking-[0.04em]";

export type BadgeVariants = {
  tone?: Tone;
};

export type BadgeProps = BadgeVariants & HTMLAttributes<HTMLSpanElement>;

export function getBadgeClasses({
  tone = "neutral",
  className,
}: BadgeVariants & { className?: string }): string {
  return clsx(BASE_CLASSES, TONE_CLASSES[tone], className);
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = "neutral", className, ...props },
  ref,
) {
  return <span ref={ref} className={getBadgeClasses({ tone, className })} {...props} />;
});
```

- [ ] **Step 2: Verificar TS**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas && npx tsc --noEmit 2>&1 | tail -5
```

No commit.

---

### Task 5: Primitiva `Skeleton` (con fix reduced-motion)

**Files:**
- Create: `components/ui/skeleton.tsx`

Bug del audit: `animate-pulse` de skeletons NO está bajo `prefers-reduced-motion`. Esta primitiva lo arregla incluyendo `motion-reduce:animate-none` explícito.

- [ ] **Step 1: Escribir la primitiva**

Create `components/ui/skeleton.tsx`:

```tsx
import clsx from "clsx";
import { forwardRef, type HTMLAttributes } from "react";

const BASE_CLASSES =
  "rounded-md bg-surface-subtle animate-pulse motion-reduce:animate-none";

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

/**
 * Devuelve el string de clases para un Skeleton loading indicator.
 * Incluye `motion-reduce:animate-none` para respetar `prefers-reduced-motion`.
 * Reemplazo de los `animate-pulse rounded bg-white/10` dispersos en loading.tsx.
 */
export function getSkeletonClasses({ className }: { className?: string } = {}): string {
  return clsx(BASE_CLASSES, className);
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={getSkeletonClasses({ className })}
      {...props}
    />
  );
});
```

- [ ] **Step 2: Verificar TS**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas && npx tsc --noEmit 2>&1 | tail -5
```

No commit.

---

### Task 6: Barrel export

**Files:**
- Create: `components/ui/index.ts`

- [ ] **Step 1: Escribir el barrel**

Create `components/ui/index.ts`:

```ts
export { Button, getButtonClasses } from "./button";
export type { ButtonProps, ButtonVariants } from "./button";

export { Card, getCardClasses } from "./card";
export type { CardProps, CardVariants } from "./card";

export { Badge, getBadgeClasses } from "./badge";
export type { BadgeProps, BadgeVariants } from "./badge";

export { Skeleton, getSkeletonClasses } from "./skeleton";
export type { SkeletonProps } from "./skeleton";
```

- [ ] **Step 2: Verificar**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas && npx tsc --noEmit 2>&1 | tail -5
```

No commit.

---

### Task 7: Unit tests

**Files:**
- Create: `tests/unit/ui-button.test.ts`
- Create: `tests/unit/ui-card.test.ts`
- Create: `tests/unit/ui-badge.test.ts`
- Create: `tests/unit/ui-skeleton.test.ts`

Los tests atacan los generadores de clases directamente. No requieren RTL.

- [ ] **Step 1: Crear `ui-button.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { getButtonClasses } from "../../components/ui/button";

describe("Button classes", () => {
  it("default produce variant primary + size md", () => {
    const result = getButtonClasses({});
    expect(result).toContain("bg-brand-base");
    expect(result).toContain("h-10");
    expect(result).toContain("px-4");
  });

  it("variant secondary aplica border + bg-surface-elevated", () => {
    const result = getButtonClasses({ variant: "secondary" });
    expect(result).toContain("border-border-default");
    expect(result).toContain("bg-surface-elevated");
  });

  it("variant ghost no tiene background sólido", () => {
    const result = getButtonClasses({ variant: "ghost" });
    expect(result).not.toContain("bg-brand-base");
    expect(result).not.toContain("bg-surface-elevated");
    expect(result).toContain("text-ink-primary");
  });

  it("size sm reduce altura y padding", () => {
    const result = getButtonClasses({ size: "sm" });
    expect(result).toContain("h-8");
    expect(result).toContain("px-3");
  });

  it("size lg aumenta altura y padding", () => {
    const result = getButtonClasses({ size: "lg" });
    expect(result).toContain("h-12");
    expect(result).toContain("px-6");
    expect(result).toContain("text-base");
  });

  it("acepta className adicional", () => {
    const result = getButtonClasses({ className: "mx-auto" });
    expect(result).toContain("mx-auto");
  });

  it("incluye focus ring y disabled", () => {
    const result = getButtonClasses({});
    expect(result).toContain("focus-visible:outline-brand-base");
    expect(result).toContain("disabled:opacity-50");
  });
});
```

- [ ] **Step 2: Crear `ui-card.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { getCardClasses } from "../../components/ui/card";

describe("Card classes", () => {
  it("default aplica surface-elevated + border subtle", () => {
    const result = getCardClasses({});
    expect(result).toContain("bg-surface-elevated");
    expect(result).toContain("border-border-subtle");
  });

  it("variant subtle usa bg-surface-subtle", () => {
    const result = getCardClasses({ variant: "subtle" });
    expect(result).toContain("bg-surface-subtle");
  });

  it("variant elevated incluye shadow-md", () => {
    const result = getCardClasses({ variant: "elevated" });
    expect(result).toContain("shadow-md");
  });

  it("interactive=true añade hover lift + motion-reduce fallback", () => {
    const result = getCardClasses({ interactive: true });
    expect(result).toContain("hover:-translate-y-[var(--distance-sm)]");
    expect(result).toContain("hover:shadow-md");
    expect(result).toContain("motion-reduce:transform-none");
  });

  it("interactive=false NO añade hover lift", () => {
    const result = getCardClasses({ interactive: false });
    expect(result).not.toContain("hover:-translate-y-[var(--distance-sm)]");
  });

  it("acepta className adicional", () => {
    const result = getCardClasses({ className: "mt-4" });
    expect(result).toContain("mt-4");
  });

  it("siempre incluye padding y rounded", () => {
    const result = getCardClasses({});
    expect(result).toContain("p-4");
    expect(result).toContain("rounded-lg");
  });
});
```

- [ ] **Step 3: Crear `ui-badge.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { getBadgeClasses } from "../../components/ui/badge";

describe("Badge classes", () => {
  it("default tone neutral", () => {
    const result = getBadgeClasses({});
    expect(result).toContain("bg-surface-subtle");
    expect(result).toContain("text-ink-secondary");
  });

  it("tone brand usa brand-subtle + brand-emphasis-2", () => {
    const result = getBadgeClasses({ tone: "brand" });
    expect(result).toContain("bg-brand-subtle");
    expect(result).toContain("text-brand-emphasis-2");
  });

  it("tone accent usa accent-subtle + accent-emphasis", () => {
    const result = getBadgeClasses({ tone: "accent" });
    expect(result).toContain("bg-accent-subtle");
    expect(result).toContain("text-accent-emphasis");
  });

  it("tone success es alias visual de accent", () => {
    const success = getBadgeClasses({ tone: "success" });
    const accent = getBadgeClasses({ tone: "accent" });
    // success y accent comparten tratamiento (alias semántico)
    expect(success).toBe(accent);
  });

  it("tone warning usa warning-base", () => {
    const result = getBadgeClasses({ tone: "warning" });
    expect(result).toContain("text-warning-base");
  });

  it("tone danger usa danger-base", () => {
    const result = getBadgeClasses({ tone: "danger" });
    expect(result).toContain("text-danger-base");
  });

  it("siempre rounded-pill + text-xs", () => {
    const result = getBadgeClasses({});
    expect(result).toContain("rounded-pill");
    expect(result).toContain("text-xs");
  });
});
```

- [ ] **Step 4: Crear `ui-skeleton.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { getSkeletonClasses } from "../../components/ui/skeleton";

describe("Skeleton classes", () => {
  it("incluye animate-pulse", () => {
    const result = getSkeletonClasses();
    expect(result).toContain("animate-pulse");
  });

  it("respeta prefers-reduced-motion con motion-reduce:animate-none", () => {
    const result = getSkeletonClasses();
    expect(result).toContain("motion-reduce:animate-none");
  });

  it("usa surface-subtle como background", () => {
    const result = getSkeletonClasses();
    expect(result).toContain("bg-surface-subtle");
  });

  it("acepta className adicional", () => {
    const result = getSkeletonClasses({ className: "h-32 w-full" });
    expect(result).toContain("h-32");
    expect(result).toContain("w-full");
  });

  it("siempre rounded-md", () => {
    const result = getSkeletonClasses();
    expect(result).toContain("rounded-md");
  });
});
```

- [ ] **Step 5: Ejecutar tests**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas && npx vitest run tests/unit/ui-*.test.ts 2>&1 | tail -20
```
Expected: todos pasan. 4 test files, ~25 tests.

No commit.

---

### Task 8: Demo en `/dev-theme`

**Files:**
- Modify: `app/[locale]/(public)/dev-theme/page.tsx`

Añadir secciones nuevas tras el motion demo que ya existe.

- [ ] **Step 1: Añadir imports**

En `dev-theme/page.tsx`, añadir al final de los imports:

```tsx
import { Button, Card, Badge, Skeleton } from "@/components/ui";
```

- [ ] **Step 2: Añadir secciones de demo**

Antes del `</div>` que cierra el `maxWidth: 960` container, insertar:

```tsx
<section style={{ marginBottom: 32 }}>
  <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Primitiva — Button</h2>
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
    <Button>Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button size="sm">sm</Button>
    <Button size="md">md</Button>
    <Button size="lg">lg</Button>
    <Button disabled>Disabled</Button>
  </div>
</section>

<section style={{ marginBottom: 32 }}>
  <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Primitiva — Card</h2>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
    <Card>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Default</div>
      <div style={{ fontSize: 13, color: "var(--color-ink-secondary)" }}>surface-elevated + border subtle.</div>
    </Card>
    <Card variant="subtle">
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Subtle</div>
      <div style={{ fontSize: 13, color: "var(--color-ink-secondary)" }}>surface-subtle. Bloque interior sin peso.</div>
    </Card>
    <Card interactive>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Interactive</div>
      <div style={{ fontSize: 13, color: "var(--color-ink-secondary)" }}>Hover me: lift + shadow.</div>
    </Card>
  </div>
</section>

<section style={{ marginBottom: 32 }}>
  <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Primitiva — Badge</h2>
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    <Badge tone="brand">brand</Badge>
    <Badge tone="accent">accent</Badge>
    <Badge tone="neutral">neutral</Badge>
    <Badge tone="success">success</Badge>
    <Badge tone="warning">warning</Badge>
    <Badge tone="info">info</Badge>
    <Badge tone="danger">danger</Badge>
  </div>
</section>

<section style={{ marginBottom: 32 }}>
  <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Primitiva — Skeleton</h2>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
    <Skeleton style={{ height: 120, width: "100%" }} />
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Skeleton style={{ height: 20, width: "70%" }} />
      <Skeleton style={{ height: 16, width: "100%" }} />
      <Skeleton style={{ height: 16, width: "90%" }} />
      <Skeleton style={{ height: 16, width: "60%" }} />
    </div>
  </div>
  <p style={{ fontSize: 12, color: "var(--color-ink-muted-2)", marginTop: 8 }}>
    Con `prefers-reduced-motion: reduce` activado, el pulse se detiene.
  </p>
</section>
```

- [ ] **Step 3: Verificar TS**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas && npx tsc --noEmit 2>&1 | tail -5
```

- [ ] **Step 4: Smoke de la página**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas && npx next dev --port 3101 > /tmp/plan3-dev.log 2>&1 &
DEV_PID=$!
sleep 10
curl -sS -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3101/eu/dev-theme
kill $DEV_PID 2>/dev/null
wait 2>/dev/null
```
Expected: `HTTP 200`.

No commit.

---

### Task 9: Migrar `k-hover-*` en componentes (batch A)

**Files:**
- Modify: `components/site-footer.tsx`
- Modify: `components/coach-profile-card.tsx`
- Modify: `components/erropak-gallery.tsx`
- Modify: `components/fototeca-gallery.tsx`
- Modify: `components/auth-credentials-form.tsx`
- Modify: `components/auth-signup-form.tsx`
- Modify: `components/auth-signout-button.tsx`

- [ ] **Step 1: Grep por fichero**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas
for f in components/site-footer.tsx components/coach-profile-card.tsx components/erropak-gallery.tsx components/fototeca-gallery.tsx components/auth-credentials-form.tsx components/auth-signup-form.tsx components/auth-signout-button.tsx; do
  echo "=== $f ==="
  grep -nE "k-hover-lift|k-hover-soft|k-hover-action|k-focus-ring" "$f"
done
```

- [ ] **Step 2: Reemplazar uno a uno**

Para cada ocurrencia, aplicar la regla de mapeo (ver sección "Regla de mapeo" arriba). En concreto:

- `className="... k-hover-lift border border-white/5 ..."` → sustituir el elemento por `<Card interactive className="... border-white-ya-migrado-en-plan-2 ...">` o, si el elemento es simple `<div>` sin semántica adicional, importar `{ Card }` y envolver/sustituir.
- `<a className="k-hover-lift ...">` → puede quedar como `<Link className={getCardClasses({ interactive: true, className: "..." })} ...>` si el elemento debe ser un link y no queremos cambiar su tag.
- `<button className="... k-hover-action ...">` → `<Button variant="primary">` si es brand-filled; `<Button variant="secondary">` si es border+bg; `<Button variant="ghost">` si es transparente con hover.

**Patrón de reemplazo recomendado para `k-hover-lift` cuando NO quieres cambiar el tag**:

Antes:
```tsx
<Link href={...} className="k-hover-lift k-focus-ring border border-border-subtle bg-surface-elevated ...">
```

Después:
```tsx
<Link href={...} className={getCardClasses({ interactive: true, className: "k-focus-ring ..." })}>
```

Importar `getCardClasses` desde `@/components/ui`. Quita la clase `k-hover-lift` y el border/bg si ya los añade `getCardClasses` (default variant). `k-focus-ring` puedes dejarla si estaba, o quitarla (la Card interactive ya tiene `focus-within:outline-brand-base`).

Patrón para `k-hover-soft`: en la mayoría de casos lo usa un `<div>` decorativo simple. Reemplazar por `className="transition-colors duration-[var(--duration-base)] hover:bg-surface-subtle/60"` inline o, si aplica, `<Card variant="subtle">`.

Patrón para `k-hover-action` en botones: `<Button variant=...>` con el mapeo que corresponda.

- [ ] **Step 3: Verificar**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas
grep -cE "k-hover-lift|k-hover-soft|k-hover-action" components/site-footer.tsx components/coach-profile-card.tsx components/erropak-gallery.tsx components/fototeca-gallery.tsx components/auth-credentials-form.tsx components/auth-signup-form.tsx components/auth-signout-button.tsx
```
Expected: 0.

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas && npx tsc --noEmit 2>&1 | tail -5
```
Expected: limpio.

No commit.

---

### Task 10: Migrar `k-hover-*` en páginas públicas (batch B)

**Files:**
- Modify: `app/[locale]/(public)/page.tsx`
- Modify: `app/[locale]/(public)/sedes/page.tsx`
- Modify: `app/[locale]/(public)/sedes/[site]/page.tsx`
- Modify: `app/[locale]/(public)/fototeca/page.tsx`
- Modify: `app/[locale]/(public)/erropak/page.tsx`
- Modify: `app/[locale]/(auth)/acceso/page.tsx`
- Modify: `app/[locale]/(auth)/acceso/crear-cuenta/page.tsx`
- Modify: `app/[locale]/not-found.tsx`

- [ ] **Step 1: Grep por fichero**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas
for f in app/\[locale\]/\(public\)/page.tsx app/\[locale\]/\(public\)/sedes/page.tsx app/\[locale\]/\(public\)/sedes/\[site\]/page.tsx app/\[locale\]/\(public\)/fototeca/page.tsx app/\[locale\]/\(public\)/erropak/page.tsx app/\[locale\]/\(auth\)/acceso/page.tsx app/\[locale\]/\(auth\)/acceso/crear-cuenta/page.tsx app/\[locale\]/not-found.tsx; do
  echo "=== $f ==="
  grep -nE "k-hover-lift|k-hover-soft|k-hover-action|k-focus-ring" "$f"
done
```

- [ ] **Step 2: Aplicar reemplazo con las mismas reglas del Task 9**

- [ ] **Step 3: Verificar**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas
grep -cE "k-hover-lift|k-hover-soft|k-hover-action" app/\[locale\]/\(public\)/**/page.tsx app/\[locale\]/\(public\)/*/page.tsx app/\[locale\]/\(auth\)/**/page.tsx app/\[locale\]/not-found.tsx 2>/dev/null
```
Expected: 0.

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas && npx tsc --noEmit 2>&1 | tail -5
```

No commit.

---

### Task 11: Lint + tests + commit final

- [ ] **Step 1: Lint**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas && npm run lint 2>&1 | tail -15
```

- [ ] **Step 2: Unit tests**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas && npm run test:unit 2>&1 | tail -20
```
Expected: 33 (Plan 2 baseline) + ~25 (nuevos de primitivas) = ~58 tests passing.

- [ ] **Step 3: E2E contra dev server :3101**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas && npx next dev --port 3101 > /tmp/plan3-dev.log 2>&1 &
DEV_PID=$!
sleep 10
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3101 npx playwright test --project=chromium 2>&1 | tail -30
kill $DEV_PID 2>/dev/null
wait 2>/dev/null
```
Expected: smoke + dev-theme pasan. 4 auth-gated skipped (pre-existente).

- [ ] **Step 4: Confirmar que admin/portal siguen intactos**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas
# Fuera de scope: k-hover-* sigue vivo en globals.css
grep -c "k-hover-lift\|k-hover-soft\|k-hover-action\|k-row-hover" app/globals.css
# Fuera de scope: admin/portal siguen usando utilities
grep -rln "k-hover-lift\|k-hover-soft\|k-hover-action" app/\[locale\]/\(backoffice\)/ app/\[locale\]/\(family-portal\)/ components/admin-*-actions-table.tsx 2>/dev/null | wc -l
```
Expected: utility count en globals.css > 0 (siguen vivas para admin/portal). Ficheros admin/portal con utilities > 0 (también intactos).

- [ ] **Step 5: `git status --short`**

Revisar qué va al commit. Debe incluir:
- 4 ficheros nuevos en `components/ui/`
- 1 barrel `components/ui/index.ts`
- 4 ficheros nuevos en `tests/unit/ui-*.test.ts`
- `app/[locale]/(public)/dev-theme/page.tsx` modificado
- ~15 ficheros públicos modificados (migración k-hover-*)
- NO debe aparecer `app/globals.css`.
- NO debe aparecer nada bajo admin/portal/_shared/_components/admin-*-actions-table.

- [ ] **Step 6: Commit**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-03-primitivas && git add -A && git commit -m "$(cat <<'EOF'
feat(ui): primitivas core (Button, Card, Badge, Skeleton) + migra k-hover-* en publico

Primitivas mínimas construidas para reemplazar utilities .k-hover-*
en la capa pública. Admin y portal quedan para Plan 4 (auth-gated).

Nuevas primitivas en components/ui/:
- Button: variants primary/secondary/ghost, sizes sm/md/lg, press
  animation scale-[0.98], focus ring con brand-base, disabled state.
- Card: variants default/subtle/elevated, prop interactive que añade
  hover lift con motion-reduce fallback a transform-none.
- Badge: 7 tones (brand, accent, neutral, success, warning, info,
  danger). Success es alias visual de accent para economizar colores.
- Skeleton: con fix del bug detectado en audit Fase 0 — ahora incluye
  motion-reduce:animate-none para respetar prefers-reduced-motion.

Migración en públicos (17 ficheros, 28 ocurrencias):
- components/root: site-footer, coach-profile-card, erropak-gallery,
  fototeca-gallery, auth-credentials-form, auth-signup-form,
  auth-signout-button.
- app/(public): page, sedes, sedes/[site], fototeca, erropak.
- app/(auth): acceso, acceso/crear-cuenta.
- app/not-found.

Reglas de mapeo aplicadas:
- k-hover-lift + border/bg → Card interactive (o getCardClasses si
  hay que preservar el tag original como Link).
- k-hover-soft → transition-colors hover:bg-surface-subtle inline, o
  Card variant=subtle cuando aplica.
- k-hover-action en botón → Button con variant según estilo actual.

Tests: 4 test files nuevos (~25 tests). Atacan los generadores
getButtonClasses/getCardClasses/getBadgeClasses/getSkeletonClasses
directamente (sin @testing-library/react, ningún dep nuevo).

Utilities .k-hover-lift/.k-hover-soft/.k-hover-action/.k-row-hover
SIGUEN en globals.css porque admin/portal todavía las usan.
Plan 4 los retira.

Validacion: lint clean, ~58 unit tests passing, e2e smoke + dev-theme
passing, tsc --noEmit clean.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 7: Verificar historial**

```bash
git -C /home/avanzosc/kodaore_system.ui-rework-03-primitivas log --oneline -4
```

## Criterios finales de "done"

1. `npx tsc --noEmit` clean.
2. `npm run lint` clean.
3. `npm run test:unit` — tests nuevos y viejos pasan.
4. `npx playwright test --project=chromium` (contra :3101) pasa smoke + dev-theme.
5. `grep -cE "k-hover-lift|k-hover-soft|k-hover-action" app/\[locale\]/\(public\)/ app/\[locale\]/\(auth\)/ components/` para ficheros tocados = 0.
6. `app/globals.css` **NO modificado** (utilities siguen para Plan 4).
7. Admin/portal **NO modificados**.
8. `/eu/dev-theme` muestra las 4 primitivas con sus variantes.
9. Un único commit atómico en la rama `ui-rework-03-primitivas`.

## Parada

**Al terminar Task 11: parada dura.** Merge sólo tras revisión visual manual en `/eu/dev-theme`. Después, escribir Plan 4 (admin + portal + retiro completo de k-hover-* + primitivas adicionales según necesidad).
