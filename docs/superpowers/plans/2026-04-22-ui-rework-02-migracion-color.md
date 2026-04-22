# UI Rework — Plan 2: Migración de color + retiradas

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Flip el sitio de dark→light usando los valores Dojo Moderno, retirar Vanta + InitialLoader + HomeHeroScrollSync + 5 animaciones infinitas, limpiar paquetes `three` y `vanta`, y reemplazar los patrones hardcoded `bg-white/X` / `text-white/X` / `border-white/X` en 23 ficheros públicos. Primer plan con cambios visibles para el usuario final.

**Architecture:** Dos frentes simultáneos: (a) limpieza (retiradas + keyframes muertos) y (b) migración cromática (flip de valores en globals.css + reemplazo de patrones hardcoded). Los tokens nuevos introducidos en Plan 1 ya existen; Plan 2 los "conecta" cambiando los valores de los tokens viejos para que apunten a los mismos colores, y reemplazando clases hardcoded que asumían fondo oscuro. Admin y portal quedan para Plan 3 (primitivas) porque requieren rediseño más profundo.

**Tech stack:** Next.js 15, Tailwind v4, TypeScript, Playwright (visual diff), Motion (ya instalado en Plan 1).

**Spec:** `docs/ui-design-direction.md`. Plan 1 aplicado en commit `60c4bfb`.

**Plan de planes:**
- Plan 1 (merged): fundación aditiva.
- **Plan 2 (este):** migración de color + retiradas. **Primer cambio visible.**
- Plan 3 (después): primitivas (Button, Input, Card, Dialog... sobre tokens nuevos) + refactor admin/portal.
- Plan 4 (después): adaptación final por vertical (polish).

---

## File Structure

**Retirar (borrar completamente):**
- `components/vanta-waves-background.tsx`
- `components/initial-loader.tsx`
- `components/home-hero-scroll-sync.tsx`

**Retirar de `package.json` (dependencies):**
- `three`
- `vanta`
- `@types/three` (devDependencies — inútil sin three)

**Modificar (limpieza + flip):**
- `app/layout.tsx` — quitar import y uso de `InitialLoader`.
- `app/globals.css` — flip valores de tokens viejos, añadir bloque dark para ellos, retirar keyframes obsoletos y clases `.kodaore-loader-*`, `.kodaore-footer-top-line`, `.k-back-top*`, simplificar `body` background + `.kodaore-shell::before`, simplificar `.kodaore-social-icon`.
- `components/home-hero.tsx` — quitar import y uso de `VantaWavesBackground` y `home-hero-scroll-sync`, reemplazar por gradient estático.

**Modificar (reemplazar patterns hardcoded):**
- `components/animated-site-header.tsx`
- `components/site-header-nav.tsx`
- `components/site-footer.tsx`
- `components/home-hero.tsx` (ya toca en retirada; mismo task)
- `components/auth-credentials-form.tsx`
- `components/auth-signup-form.tsx`
- `components/auth-signout-button.tsx`
- `components/coach-profile-card.tsx`
- `components/erropak-gallery.tsx`
- `components/fototeca-gallery.tsx`
- `components/smart-image.tsx`
- `components/action-toast.tsx`
- `components/page-transition-shell.tsx` (si hay hardcoded)
- `app/[locale]/(public)/page.tsx`
- `app/[locale]/(public)/sedes/page.tsx`
- `app/[locale]/(public)/sedes/[site]/page.tsx`
- `app/[locale]/(public)/fototeca/page.tsx`
- `app/[locale]/(public)/erropak/page.tsx`
- `app/[locale]/(public)/legal/terms/page.tsx`
- `app/[locale]/(public)/legal/privacy/page.tsx`
- `app/[locale]/(auth)/acceso/page.tsx`
- `app/[locale]/(auth)/acceso/crear-cuenta/page.tsx`
- `app/[locale]/not-found.tsx`

**No tocar en este plan (scope Plan 3):**
- `app/[locale]/(backoffice)/admin/**` — reescritura con primitivas.
- `app/[locale]/(family-portal)/portal/**` — idem.
- `components/admin-*-actions-table.tsx` (3 ficheros) — refactor con primitiva Table.
- `app/[locale]/(backoffice)/admin/_shared/**` — idem.
- `app/[locale]/(family-portal)/portal/_components/**` — idem.

**No tocar nunca (capas bloqueadas por CLAUDE.md):**
- `prisma/schema.prisma`, `middleware.ts`, `lib/auth/*`, `lib/observability/*`, `lib/audit/*`, `lib/security/*`, `app/api/**`, envío de mail.

---

## Reglas de mapeo para los patterns hardcoded

Cuando un fichero tenga estas clases, aplicar el mapeo según contexto. No es sed mecánico — depende de dónde está el elemento.

| Hardcoded actual | Reemplazo recomendado | Notas |
|---|---|---|
| `bg-white/5` | `bg-surface-subtle` | Fondo muy sutil sobre surface-base. |
| `bg-white/10` | `bg-surface-subtle` | Lo mismo; el sutil queda bien. |
| `bg-white/15`, `bg-white/20` | `bg-surface-subtle` + `border border-border-default` | Si era para destacar sobre oscuro, ahora borde + fondo sutil. |
| `bg-white/30+` | `bg-surface-elevated` + `shadow-sm` | Elementos que flotan. |
| `bg-black/5`, `bg-black/10` | `bg-surface-subtle` o `bg-black/5` sin cambiar | Gradient overlay: mantener si el oscurecimiento es intencional (ej. cubrir esquina de imagen). |
| `bg-black/25+` | `bg-black/25` sin cambiar | Cubrir imagen en hero: correcto, sigue funcionando en light. |
| `text-white/50`, `text-white/60`, `text-white/70` | `text-ink-muted-2` | Texto discreto sobre fondo claro. |
| `text-white/80`, `text-white/85`, `text-white/90` | `text-ink-secondary` | Texto de lectura normal sobre fondo claro. |
| `text-white/95`, `text-white` | `text-ink-primary` | Texto principal / títulos. |
| `text-white` sobre elemento con `bg-brand-base` (CTA) | `text-brand-contrast-2` (= blanco) | Mantener blanco sobre CTA. |
| `border-white/10`, `border-white/12` | `border-border-subtle` | Bordes tenues. |
| `border-white/20`, `border-white/25` | `border-border-default` | Bordes estándar. |
| `border-white/35+` | `border-border-default` + (opcional) `border-2` | Bordes fuertes. |
| `bg-gradient-to-*` con `from-brand/X` a `to-brand-warm/X` | `bg-gradient-to-*` con `from-brand-subtle` `to-accent-subtle` | Los subtle ya son pastel, lectura más suave en light. |
| `bg-brand/16` / `bg-brand-warm/16` | `bg-brand-subtle` / `bg-accent-subtle` | Background tinte para hover. |
| `text-ink-muted` (token viejo) | `text-ink-muted-2` (token nuevo) | Ambos apuntan al mismo color tras el flip, pero consolidar el nuevo. |

**Regla de oro:** si `text-white/X` está en elemento con background sólido oscuro (ej. `bg-brand-base`, `bg-surface-inverse`), mantener texto claro. En caso de duda, preferir `text-ink-secondary` sobre `text-ink-muted-2`.

**Sombras drop-shadow-*:** los `drop-shadow-[0_12px_24px_rgba(17,17,17,0.2)]` hardcoded siguen funcionando sobre light. Cambiar sólo si el alfa es muy alto (>0.4) y oscurece la imagen.

---

### Task 1: Preflight + worktree

- [ ] **Step 1: Verificar branch main actualizada con Plan 1**

Run:
```bash
git -C /home/avanzosc/kodaore_system log --oneline -2
```
Expected: top commit es `60c4bfb feat(ui): fundacion de Fase 1`.

- [ ] **Step 2: Crear worktree del plan**

```bash
git -C /home/avanzosc/kodaore_system worktree add -b ui-rework-02-migracion /home/avanzosc/kodaore_system.ui-rework-02-migracion main
```

- [ ] **Step 3: Symlinkar node_modules y .env**

```bash
ln -s /home/avanzosc/kodaore_system/node_modules /home/avanzosc/kodaore_system.ui-rework-02-migracion/node_modules
ln -s /home/avanzosc/kodaore_system/.env /home/avanzosc/kodaore_system.ui-rework-02-migracion/.env
ls -la /home/avanzosc/kodaore_system.ui-rework-02-migracion/node_modules /home/avanzosc/kodaore_system.ui-rework-02-migracion/.env | head -4
```
Expected: ambos symlinks visibles.

---

### Task 2: Retirar Vanta

**Files:**
- Delete: `components/vanta-waves-background.tsx`
- Modify: `components/home-hero.tsx` (quitar import y uso, insertar fondo estático)

- [ ] **Step 1: Eliminar el componente**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && rm components/vanta-waves-background.tsx
```

- [ ] **Step 2: Quitar import de `VantaWavesBackground` en `home-hero.tsx`**

Localizar la línea `import { VantaWavesBackground } from "@/components/vanta-waves-background";` y eliminarla.

- [ ] **Step 3: Reemplazar el uso del componente en el hero**

Localizar en `components/home-hero.tsx` esta sección:

```tsx
<VantaWavesBackground className="pointer-events-none absolute inset-0" scrollProgress={scrollProgress} />
<div className="pointer-events-none absolute inset-0 bg-surface/35" />
```

Reemplazar por:

```tsx
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0"
  style={{
    background: "radial-gradient(120% 80% at 15% 10%, color-mix(in srgb, var(--brand-base) 18%, transparent) 0%, transparent 55%), radial-gradient(120% 90% at 85% 15%, color-mix(in srgb, var(--accent-base) 14%, transparent) 0%, transparent 60%), linear-gradient(180deg, var(--surface-base) 0%, var(--surface-subtle) 100%)",
  }}
/>
<div className="pointer-events-none absolute inset-0 bg-black/10" />
```

(Si `home-hero.tsx` aún tiene el prop `scrollProgress` en su signature, mantenerlo: los cambios de signature son para Task 4. Aquí solo sustituimos el fondo.)

- [ ] **Step 4: Verificar que TypeScript compila**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npx tsc --noEmit 2>&1 | tail -5
```
Expected: sin errores. Si `VantaWavesBackground` se importaba en algún otro sitio (no debería), el error lo mostrará y habrá que limpiar.

No commit.

---

### Task 3: Retirar InitialLoader

**Files:**
- Delete: `components/initial-loader.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Eliminar el componente**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && rm components/initial-loader.tsx
```

- [ ] **Step 2: Quitar import y uso en `app/layout.tsx`**

En `app/layout.tsx`, localizar:

```ts
import { InitialLoader } from "@/components/initial-loader";
```

Eliminar esa línea.

En el JSX del `<body>`, localizar:

```tsx
<body className="min-h-full flex flex-col">
  <InitialLoader />
  {children}
</body>
```

Reemplazar por:

```tsx
<body className="min-h-full flex flex-col">
  {children}
</body>
```

- [ ] **Step 3: Buscar otras referencias al loader phase o `kodaore-loader`**

Varios componentes del site (ej. `animated-site-header`, `home-hero`) observan el atributo `data-loader-phase` en `<html>` para saber cuándo aparecer. Como el loader ya no existe, esos componentes pueden aparecer de inmediato.

Run:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && grep -rn "data-loader-phase\|kodaore-loader" --include='*.tsx' --include='*.ts' app/ components/
```
Expected: referencias en `components/animated-site-header.tsx` y `components/home-hero.tsx`.

- [ ] **Step 4: Simplificar `animated-site-header.tsx` para que no dependa del loader**

Abrir `components/animated-site-header.tsx`. Localizar el efecto que observa `data-loader-phase`:

```tsx
useEffect(() => {
  const html = document.documentElement;

  const syncPhase = () => {
    const phase = html.getAttribute("data-loader-phase");
    setShow(phase === "hidden");
  };

  syncPhase();

  const observer = new MutationObserver(syncPhase);
  observer.observe(html, {
    attributes: true,
    attributeFilter: ["data-loader-phase"],
  });

  return () => {
    observer.disconnect();
  };
}, []);
```

Reemplazar todo ese `useEffect` por:

```tsx
useEffect(() => {
  setShow(true);
}, []);
```

El header aparece inmediatamente al montar. Sin loader que esperar.

- [ ] **Step 5: Simplificar `home-hero.tsx` para que no dependa del loader**

Abrir `components/home-hero.tsx`. Localizar la función `getInitialReadyState` y el `useEffect` que observa `data-loader-phase`. Sustituir:

```tsx
function getInitialReadyState() {
  if (typeof document === "undefined") {
    return false;
  }

  const phase = document.documentElement.getAttribute("data-loader-phase");
  const loaderElement = document.querySelector(".kodaore-loader");
  return phase === "exit" || phase === "hidden" || (phase === null && !loaderElement);
}
```

Por:

```tsx
function getInitialReadyState() {
  return typeof document !== "undefined";
}
```

Y localizar:

```tsx
useEffect(() => {
  const html = document.documentElement;

  const syncPhase = () => {
    const phase = html.getAttribute("data-loader-phase");
    const loaderElement = document.querySelector(".kodaore-loader");
    setReady(phase === "exit" || phase === "hidden" || (phase === null && !loaderElement));
  };

  syncPhase();

  const observer = new MutationObserver(syncPhase);
  observer.observe(html, {
    attributes: true,
    attributeFilter: ["data-loader-phase"],
  });

  return () => {
    observer.disconnect();
  };
}, []);
```

Sustituir por:

```tsx
useEffect(() => {
  setReady(true);
}, []);
```

- [ ] **Step 6: Verificar TS**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npx tsc --noEmit 2>&1 | tail -5
```
Expected: sin errores.

No commit.

---

### Task 4: Retirar HomeHeroScrollSync

**Files:**
- Delete: `components/home-hero-scroll-sync.tsx`
- Modify: `app/[locale]/(public)/page.tsx` (o dondequiera que se use)

- [ ] **Step 1: Buscar donde se usa**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && grep -rln "home-hero-scroll-sync\|HomeHeroScrollSync" --include='*.tsx' --include='*.ts' app/ components/
```
Expected: referencia en `components/home-hero-scroll-sync.tsx` (propio fichero) y en `app/[locale]/(public)/page.tsx` (posiblemente).

- [ ] **Step 2: Eliminar el componente**

```bash
rm components/home-hero-scroll-sync.tsx
```

- [ ] **Step 3: Limpiar import y uso**

En el fichero donde se use (probablemente `app/[locale]/(public)/page.tsx`), quitar el import y la llamada al componente. Si el componente pasaba `scrollProgress` al `HomeHero`, también hay que simplificar eso.

Si `home-hero.tsx` aún tiene `scrollProgress` en su props, y ya no viene de ningún lado, reducir su signature:

Antes:
```tsx
type HomeHeroProps = {
  tagline: string;
  heroTitle: string;
  scrollProgress: number;
  heroId: string;
};
```

Después:
```tsx
type HomeHeroProps = {
  tagline: string;
  heroTitle: string;
  heroId: string;
};
```

Y en el cuerpo eliminar toda referencia a `scrollProgress` (parámetro, uso, prop destructuring).

- [ ] **Step 4: Verificar TS**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npx tsc --noEmit 2>&1 | tail -10
```
Expected: sin errores.

No commit.

---

### Task 5: Retirar paquetes `three` y `vanta`

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json` (automático via npm)

- [ ] **Step 1: Desinstalar**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npm uninstall three vanta @types/three --no-audit
```
Expected: `package.json` pierde las 3 entradas. `package-lock.json` se regenera.

- [ ] **Step 2: Verificar que el build sigue OK**

(Recordatorio: `next build` falla por `/api/health` DATABASE_URL; usar tsc + grep de referencias.)

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npx tsc --noEmit 2>&1 | tail -5
grep -rn "from \"three\"\|from \"vanta\"" --include='*.tsx' --include='*.ts' app/ components/ lib/ 2>/dev/null || echo "no leftover imports"
```
Expected: tsc limpio, "no leftover imports".

- [ ] **Step 3: `git diff package.json` para confirmar**

```bash
git -C /home/avanzosc/kodaore_system.ui-rework-02-migracion diff package.json | head -30
```
Expected: tres dependencias eliminadas (`three`, `vanta`, `@types/three`).

No commit.

---

### Task 6: Retirar keyframes y clases CSS obsoletas

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Retirar @keyframes obsoletos**

Eliminar estos bloques de `app/globals.css`:

- `@keyframes loader-word-rise` (líneas ~497–506)
- `@keyframes loader-wave-sweep` (líneas ~508–515)
- `@keyframes loader-hint-bob` (líneas ~517–525)
- `@keyframes back-top-bob` (líneas ~527–535)
- `@keyframes footer-line-shift` (líneas ~488–495)

Las líneas son aproximadas — localízalas por nombre de keyframe.

- [ ] **Step 2: Retirar clases de loader**

Eliminar todos los selectores `.kodaore-loader*`, concretamente:

- `.kodaore-loader` (bloque que inicia con `position: fixed; inset: 0; z-index: 120;`)
- `.kodaore-loader.is-exit`
- `.kodaore-loader-backdrop`
- `.kodaore-loader.is-exit .kodaore-loader-backdrop`
- `.kodaore-loader-content`
- `.kodaore-loader-logo-wrap`
- `.kodaore-loader.is-exit .kodaore-loader-logo-wrap`
- `.kodaore-loader-logo-wrap.is-exit`
- `.kodaore-loader-logo-glow`
- `.kodaore-loader-word`
- `.kodaore-loader-ko`
- `.kodaore-loader-re`
- `.kodaore-loader-wave`
- `.kodaore-loader-wave::after`
- `.kodaore-loader-hint`
- `.kodaore-loader-hint.is-visible`

- [ ] **Step 3: Retirar clases del footer line shift y back-top**

- `.kodaore-footer-top-line`
- `.k-back-top`
- `.k-back-top.is-hidden`
- `.k-back-top.is-visible`
- `.k-back-top-label`

- [ ] **Step 4: Simplificar `.kodaore-social-icon` (quitar glow, mantener hover simple)**

Reemplazar todo el bloque `.kodaore-social-icon` + `::after` + `:nth-child` + `:hover` + `:hover::after` por:

```css
.kodaore-social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 999px;
  border: 1px solid var(--border-default);
  background: var(--surface-elevated);
  color: var(--ink-primary);
  transition: border-color 150ms var(--ease-enter), background 150ms var(--ease-enter);
}

.kodaore-social-icon:hover {
  border-color: var(--brand-base);
  background: var(--brand-subtle);
}
```

- [ ] **Step 5: Retirar referencias en `@media (prefers-reduced-motion: reduce)`**

En el bloque `@media (prefers-reduced-motion: reduce) { ... }`, quitar de la lista de selectores los que ya no existen: `.kodaore-loader`, `.kodaore-loader-backdrop`, `.kodaore-loader-content`, `.kodaore-loader-word`, `.kodaore-loader-hint`, `.kodaore-loader-wave::after`, `.kodaore-loader-logo-wrap`, `.kodaore-footer-top-line`, `.k-back-top`, `.k-back-top-label`.

Lo que queda tras la limpieza:
```css
@media (prefers-reduced-motion: reduce) {
  .kodaore-social-icon,
  .fade-rise,
  .fade-reveal-left,
  .k-hover-lift,
  .k-hover-soft,
  .k-hover-action,
  .k-row-hover {
    animation: none !important;
    transition: none !important;
  }

  .k-hover-lift:hover,
  .k-hover-action:hover {
    transform: none !important;
    box-shadow: none !important;
  }

  body::after {
    opacity: 0.025;
  }
}
```

- [ ] **Step 6: Verificar**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion
grep -c "@keyframes\|kodaore-loader\|kodaore-footer-top-line\|k-back-top\|back-top-bob\|loader-word-rise\|loader-wave-sweep\|loader-hint-bob\|footer-line-shift" app/globals.css
wc -l app/globals.css
```
Expected: conteo muy bajo (sólo los `@keyframes fade-rise`, `fade-reveal-left` que seguimos usando — 2 matches). Tamaño del fichero debería bajar de ~595 líneas a ~350-400.

No commit.

---

### Task 7: Flip de valores de tokens viejos en `:root`

**Files:**
- Modify: `app/globals.css`

Plan 1 añadió tokens nuevos. Los viejos (`--brand`, `--background`, etc.) siguen con sus valores dark. Este task cambia sus valores para que apunten a los de Dojo Moderno. Componentes que usan `bg-brand`, `text-foreground`, etc. automáticamente se adaptan.

- [ ] **Step 1: Cambiar valores en el `:root` base (modo light)**

Localizar en `app/globals.css` el bloque `:root { ... }` al inicio y cambiar las líneas:

```css
  --background: #08090a;       → --background: #fafaf7;
  --foreground: #f8fafc;       → --foreground: #13141a;
  --ink-muted: #94a3b8;        → --ink-muted: #737680;
  --surface: #111827;          → --surface: #f3f1ea;
  --surface-strong: #1f2937;   → --surface-strong: #ffffff;
  --brand: #be123c;            → --brand: #c2272d;
  --brand-emphasis: #f43f5e;   → --brand-emphasis: #9a1e25;
  --brand-contrast: #ffffff;   → --brand-contrast: #ffffff;  (igual, sin cambio)
  --brand-warm: #059669;       → --brand-warm: #1fa35c;
  --danger: #8a2020;           → --danger: #8a1f22;
```

- [ ] **Step 2: Añadir los tokens viejos al bloque `@media (prefers-color-scheme: dark)`**

El bloque dark actual sólo redefine los tokens nuevos. Añadir redefinición para los viejos también (los viejos tokens quedan como alias semánticos de los nuevos durante la transición). Localizar `@media (prefers-color-scheme: dark) { :root {` y añadir DENTRO, al final (antes del `}` de `:root`):

```css
    --background: #0f1013;
    --foreground: #fafaf7;
    --ink-muted: #8a8e96;
    --surface: #1a1c21;
    --surface-strong: #24272e;
    --brand: #d8603d;
    --brand-emphasis: #b3472a;
    --brand-warm: #2cbe76;
    --danger: #b03030;
```

(`--brand-contrast` se queda en `#ffffff` en ambos modos.)

- [ ] **Step 3: Verificar**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npx tsc --noEmit 2>&1 | tail -5
grep -A3 "^:root {" app/globals.css | head -20
```
Expected: `:root` muestra los valores light. TSC limpio.

No commit.

---

### Task 8: Simplificar fondos globales

**Files:**
- Modify: `app/globals.css`

Tres capas actuales (body gradient + grain SVG + kodaore-shell radials) son chirriantes en light. Reducir a sólo el grain.

- [ ] **Step 1: Simplificar `body`**

Localizar el bloque `body { ... }` en `globals.css`. El actual tiene:

```css
body {
  position: relative;
  background-color: var(--background);
  background-image: linear-gradient(
    90deg,
    color-mix(in srgb, var(--brand) 18%, transparent) 0%,
    color-mix(in srgb, var(--background) 86%, #0f172a 14%) 36%,
    color-mix(in srgb, var(--background) 86%, #0f172a 14%) 64%,
    color-mix(in srgb, var(--brand-warm) 18%, transparent) 100%
  );
  color: var(--foreground);
  font-family: var(--font-manrope), sans-serif;
  overflow-x: hidden;
  min-height: 100dvh;
}
```

Reemplazar por:

```css
body {
  position: relative;
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-inter), var(--font-manrope), sans-serif;
  overflow-x: hidden;
  min-height: 100dvh;
}
```

Cambios: retira el `background-image` (gradient molesto en light); cambia `font-family` a Inter primero (la fuente del nuevo sistema) con Manrope como fallback.

- [ ] **Step 2: Mantener `body::after` (grain sutil funciona bien en ambos modos)**

Dejar como está. El grain SVG es cromáticamente neutral.

- [ ] **Step 3: Simplificar `.kodaore-shell::before`**

Localizar el bloque `.kodaore-shell::before { ... }` y reemplazar:

Antes:
```css
.kodaore-shell::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(120% 90% at 8% 0%, color-mix(in srgb, var(--brand) 18%, transparent) 0, transparent 52%),
    radial-gradient(120% 90% at 92% 0%, color-mix(in srgb, var(--brand-warm) 18%, transparent) 0, transparent 52%);
  opacity: 0.9;
  pointer-events: none;
}
```

Después:
```css
.kodaore-shell::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(120% 90% at 8% 0%, color-mix(in srgb, var(--brand) 8%, transparent) 0, transparent 52%),
    radial-gradient(120% 90% at 92% 0%, color-mix(in srgb, var(--brand-warm) 7%, transparent) 0, transparent 52%);
  opacity: 0.7;
  pointer-events: none;
}
```

Cambios: intensidad de tinte bajada de 18% → 7-8% para no gritar sobre el papel cálido. Opacidad de 0.9 → 0.7.

- [ ] **Step 4: Verificar build**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npx tsc --noEmit 2>&1 | tail -5
```

No commit.

---

### Task 9: Reemplazo hardcoded en components de layout global

**Files:**
- Modify: `components/animated-site-header.tsx`
- Modify: `components/site-header-nav.tsx`
- Modify: `components/site-footer.tsx`
- Modify: `components/page-transition-shell.tsx` (si tiene hardcoded)

Aplicar las reglas de mapeo declaradas al inicio del plan.

- [ ] **Step 1: `animated-site-header.tsx`**

Localizar el JSX. Las clases actuales (post-Task 3):

```tsx
"kodaore-site-header sticky top-0 z-40 border-b transition-all duration-700",
deepScrolled ? "border-white/10 bg-surface/60 backdrop-blur-xl" : "border-transparent bg-surface/70 backdrop-blur-sm",
show ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-5 opacity-0",
```

Reemplazar por:

```tsx
"kodaore-site-header sticky top-0 z-40 border-b transition-all duration-200",
deepScrolled ? "border-border-subtle bg-surface-elevated/85 backdrop-blur-md" : "border-transparent bg-surface-elevated/50 backdrop-blur-sm",
show ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-5 opacity-0",
```

Cambios: `duration-700` → `duration-200` (nuestro motion token base). `border-white/10` → `border-border-subtle`. `bg-surface/60` → `bg-surface-elevated/85`. Blur más suave (xl → md).

También simplificar el `compactByScroll`/`deepScrolled` de doble threshold a uno solo. Eliminar el segundo `scrollY > 50` threshold:

Buscar:
```tsx
const onScroll = () => {
  const scrollY = window.scrollY;
  setCompactByScroll(scrollY > 28);
  setDeepScrolled(scrollY > 50);
};
```

Sustituir por:
```tsx
const onScroll = () => {
  const scrollY = window.scrollY;
  setCompactByScroll(scrollY > 28);
  setDeepScrolled(scrollY > 28); // un solo umbral
};
```

- [ ] **Step 2: `site-header-nav.tsx`**

Grep para ver las clases hardcoded:
```bash
grep -nE "white/[0-9]|black/[0-9]" components/site-header-nav.tsx
```

Aplicar reglas de mapeo fichero a fichero. Los patrones típicos:

- `text-white/75` o similar → `text-ink-secondary`
- `text-white/90` → `text-ink-primary` o mantener dependiendo del contexto
- `border-white/15` → `border-border-subtle`
- `bg-white/5` → `bg-surface-subtle`
- Elemento de locale actual activo (normalmente con fondo oscuro): si tiene `bg-white/10` → `bg-surface-subtle`; si tiene texto `text-white` → `text-ink-primary`.

- [ ] **Step 3: `site-footer.tsx`**

Similar proceso. Los footer típicamente tienen `text-white/70` para enlaces secundarios y `text-white/90` para títulos. Mapear a `text-ink-secondary` y `text-ink-primary` respectivamente.

- [ ] **Step 4: `page-transition-shell.tsx`**

Grep primero:
```bash
grep -nE "white/[0-9]|black/[0-9]" components/page-transition-shell.tsx
```

Si no hay resultados, dejar intacto. Si hay, aplicar reglas.

- [ ] **Step 5: Verificar**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npx tsc --noEmit 2>&1 | tail -5
```

No commit.

---

### Task 10: Reemplazo hardcoded en hero + galleries + auth forms

**Files:**
- Modify: `components/home-hero.tsx`
- Modify: `components/erropak-gallery.tsx`
- Modify: `components/fototeca-gallery.tsx`
- Modify: `components/auth-credentials-form.tsx`
- Modify: `components/auth-signup-form.tsx`
- Modify: `components/auth-signout-button.tsx`

- [ ] **Step 1: `home-hero.tsx`**

Grep actual:
```bash
grep -nE "white/[0-9]|black/[0-9]" components/home-hero.tsx
```

Patrones habituales y mapeo:
- `border-white/10` → `border-border-subtle`
- `bg-black/15`, `bg-black/20`, `bg-black/25` en overlays de imagen → mantener (oscurecimiento sobre imagen sigue necesario).
- `bg-black/45` o más en gradient overlay → mantener.
- `from-black/45` → mantener.
- `bg-surface/35` en overlay sobre Vanta (si aún está post-Task 2) → ya sustituido en Task 2; no aparece aquí.

Ajustar también:
- `transition duration-700 group-hover:scale-[1.03]` (o `scale-105`) → `transition duration-300 group-hover:scale-[1.02]` (ver regla de image hover del spec).

- [ ] **Step 2: `erropak-gallery.tsx`**

Grep + reemplazo. Patrones típicos:
- `bg-black/20` en overlay → mantener.
- `text-white/85`, `text-white/90` en labels sobre imagen → mantener si están sobre imagen (texto claro sobre oscuro sigue OK).
- Si aparecen `bg-white/X` como chip/badge sobre light → cambiar a `bg-surface-subtle` + `text-ink-primary`.

- [ ] **Step 3: `fototeca-gallery.tsx`**

Mismo proceso.

- [ ] **Step 4: `auth-credentials-form.tsx`**

Patrones típicos en forms:
- `border-white/15` en inputs → `border-border-default`
- `bg-white/5` en input background → `bg-surface-subtle` o `bg-surface-elevated`
- `text-white/80` en labels → `text-ink-secondary`
- `text-white/60` en helper text → `text-ink-muted-2`
- Botón primario con `bg-brand` y `text-white` → `bg-brand text-brand-contrast` (ya lo era, sin cambio)

- [ ] **Step 5: `auth-signup-form.tsx`**

Mismo proceso. Este fichero es largo (identified por la Task 8 del Plan 0 tenía ~7 fields).

- [ ] **Step 6: `auth-signout-button.tsx`**

Simple. Probablemente pocos patrones.

- [ ] **Step 7: Verificar**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npx tsc --noEmit 2>&1 | tail -5
```

No commit.

---

### Task 11: Reemplazo hardcoded en components misceláneos

**Files:**
- Modify: `components/coach-profile-card.tsx`
- Modify: `components/smart-image.tsx`
- Modify: `components/action-toast.tsx`

- [ ] **Step 1: `coach-profile-card.tsx`**

Grep + reemplazo. Probables:
- `bg-white/10` en card → `bg-surface-subtle`
- `border-white/10` → `border-border-subtle`
- `text-white/80`, `text-white/90` → `text-ink-secondary` / `text-ink-primary`

- [ ] **Step 2: `smart-image.tsx`**

Grep primero:
```bash
grep -nE "white/[0-9]|black/[0-9]" components/smart-image.tsx
```

Si no tiene hardcoded (probable — es un wrapper), saltar.

- [ ] **Step 3: `action-toast.tsx`**

Patrones típicos en toasts:
- `bg-white/15` para toast success → `bg-surface-elevated` + `shadow-md`
- `bg-black/80` para toast error → mantener (oscuro intencional) O cambiar a `bg-danger text-brand-contrast`

Criterio: preferir tokens semánticos (danger, success). Los toast de diferentes estados pueden usar:
- success: `bg-surface-elevated border-l-4 border-accent-base text-ink-primary`
- error: `bg-surface-elevated border-l-4 border-danger text-ink-primary`
- neutral: `bg-surface-inverse text-ink-inverse`

Si el diseño actual usa un color sólido para el toast entero, mantener pero con tokens: `bg-surface-inverse text-ink-inverse` para fondo oscuro + texto claro, consistente con el spec.

- [ ] **Step 4: Verificar**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npx tsc --noEmit 2>&1 | tail -5
```

No commit.

---

### Task 12: Reemplazo hardcoded en `app/[locale]/(public)/` (landing pages)

**Files:**
- Modify: `app/[locale]/(public)/page.tsx` (home)
- Modify: `app/[locale]/(public)/sedes/page.tsx`
- Modify: `app/[locale]/(public)/sedes/[site]/page.tsx`
- Modify: `app/[locale]/(public)/fototeca/page.tsx`
- Modify: `app/[locale]/(public)/erropak/page.tsx`
- Modify: `app/[locale]/(public)/legal/terms/page.tsx`
- Modify: `app/[locale]/(public)/legal/privacy/page.tsx`

- [ ] **Step 1: Grep survey**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion
for f in app/\[locale\]/\(public\)/**/page.tsx app/\[locale\]/\(public\)/*/page.tsx; do
  echo "=== $f ==="
  grep -cE "white/[0-9]|black/[0-9]" "$f" 2>/dev/null || echo 0
done
```

- [ ] **Step 2: Reemplazo fichero a fichero**

Para cada `page.tsx` aplicar las reglas. Los landing pages tienen muchos overlays de imagen (típicos `bg-black/25` o `from-black/45`) — esos se mantienen porque siguen siendo oscurecimiento sobre imagen.

Los textos y bordes hardcoded sí cambian:
- `text-white` sobre fondo normal (no imagen) → `text-ink-primary`
- `text-white/80` → `text-ink-secondary`
- `border-white/10` → `border-border-subtle`
- `bg-white/10` → `bg-surface-subtle`
- Gradients `from-brand/X via-transparent to-brand-warm/Y` (hover overlays en cards) → `from-brand-subtle via-transparent to-accent-subtle`

Image hover `scale(1.03)` / `scale(1.05)` / `scale(1.02)` con `duration-700` → `scale(1.02)` con `duration-300`.

- [ ] **Step 3: Verificar**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npx tsc --noEmit 2>&1 | tail -5
# Confirmar que el grep de patterns bajó en los 7 ficheros
grep -rcE "white/[0-9]|black/[0-9]" app/\[locale\]/\(public\)/ --include='*.tsx'
```

No commit.

---

### Task 13: Reemplazo hardcoded en `app/[locale]/(auth)/` y `not-found.tsx`

**Files:**
- Modify: `app/[locale]/(auth)/acceso/page.tsx`
- Modify: `app/[locale]/(auth)/acceso/crear-cuenta/page.tsx`
- Modify: `app/[locale]/not-found.tsx`

- [ ] **Step 1: Acceso pages**

Las páginas de auth son más simples (form wrappers). Patterns típicos:
- `bg-surface/95` → `bg-surface-elevated`
- `border-white/10` → `border-border-subtle`
- `text-white/90` → `text-ink-primary`
- Link `text-brand-emphasis hover:text-white` → `text-brand-base hover:text-brand-emphasis-2`

- [ ] **Step 2: `not-found.tsx`**

Grep + reemplazo. Suele tener estilo simple.

- [ ] **Step 3: Verificar**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npx tsc --noEmit 2>&1 | tail -5
```

No commit.

---

### Task 14: Validación end-to-end + visual sanity check

**Files:** (sin cambios de código)

- [ ] **Step 1: Lint**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npm run lint 2>&1 | tail -20
```
Expected: sin errores nuevos.

- [ ] **Step 2: Unit tests**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npm run test:unit 2>&1 | tail -20
```
Expected: todos pasan (incluyendo los 14 de motion-variants).

- [ ] **Step 3: TypeScript check estricto**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npx tsc --noEmit 2>&1 | tail -10
```
Expected: sin errores.

- [ ] **Step 4: Playwright e2e suite pública**

Arrancar dev contra el worktree en :3101 (PM2 sigue en :3000 con código viejo):

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npx next dev --port 3101 &
DEV_PID=$!
sleep 8
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3101 npx playwright test --project=chromium 2>&1 | tail -30
kill $DEV_PID 2>/dev/null
wait 2>/dev/null
```
Expected: `smoke.spec.ts` tests públicos pasan. `dev-theme.spec.ts` pasa. Los auth-gated siguen skipped.

- [ ] **Step 5: Sanity visual manual**

Iniciar dev en :3101 y abrir en navegador:
```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && npx next dev --port 3101
```

Abrir:
- `http://localhost:3101/eu` — home en light, sin Vanta, sin loader inicial, texto oscuro legible.
- `http://localhost:3101/eu/sedes` — listado en light.
- `http://localhost:3101/eu/sedes/azkoitia` — plantilla sede.
- `http://localhost:3101/eu/acceso` — form de login en light.
- `http://localhost:3101/eu/dev-theme` — harness: swatches de tokens NUEVOS, demos de motion.

Verificar con DevTools → Rendering → Emulate CSS media feature → prefers-color-scheme → dark que dark mode funciona para las páginas cambiadas.

Parar dev tras verificación manual.

- [ ] **Step 6: `git status --short`**

Confirmar qué archivos se han tocado. No debe haber cambios en `lib/auth`, `prisma`, `middleware`, `app/api`, admin, portal, admin/_shared, portal/_components.

```bash
git -C /home/avanzosc/kodaore_system.ui-rework-02-migracion status --short | head -40
```

---

### Task 15: Commit final

- [ ] **Step 1: Stage + commit**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-02-migracion && git add -A && git commit -m "$(cat <<'EOF'
feat(ui): migracion cromatica a Dojo Moderno + retiradas Fase 1 plan 2

Primer cambio visible del rediseño. El sitio pasa de dark a light
papel cálido.

Retiradas:
- components/vanta-waves-background.tsx (+ dependencia three/vanta).
- components/initial-loader.tsx (+ referencias desde layout).
- components/home-hero-scroll-sync.tsx (+ referencias).
- Paquetes three, vanta, @types/three del package.json.
- Keyframes y clases CSS obsoletas de globals.css: loader-*,
  footer-line-shift, back-top-bob, .kodaore-loader-*,
  .kodaore-footer-top-line, .k-back-top*, glow de .kodaore-social-icon.

Migración cromática:
- Valores de tokens viejos (--background, --foreground, --brand,
  --surface, --brand-warm, --danger, etc.) flipeados a light
  Dojo Moderno. Convive con los tokens nuevos de Plan 1 (apuntan
  al mismo color desde nombres distintos; Plan 3 consolida).
- Nuevo bloque en @media (prefers-color-scheme: dark) redefine los
  tokens viejos (antes sólo los nuevos).
- body background simplificado a surface plano + font-family Inter.
- .kodaore-shell::before con tinte carmesí/esmeralda bajado de 18%
  a 7-8% sobre opacidad 0.7.
- 23 ficheros (13 components/root + 7 public page.tsx + 2 auth +
  not-found) migrados: bg-white/text-white/border-white/bg-black
  hardcoded reemplazados por tokens semánticos según reglas de
  mapeo documentadas en el plan.
- Animated site header simplificado: un único umbral de scroll,
  duración 200ms, blur md en vez de xl.
- Image hover: scale 1.02 / duration 300ms (antes 1.03-1.05 / 700ms).

Admin y portal NO migrados en este plan (scope Plan 3: primitivas).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 2: Verificar historial**

```bash
git -C /home/avanzosc/kodaore_system.ui-rework-02-migracion log --oneline -4
```
Expected (más reciente primero):
1. `feat(ui): migracion cromatica a Dojo Moderno + retiradas Fase 1 plan 2`
2. `feat(ui): fundacion de Fase 1 (tokens Dojo Moderno + Inter + motion wrapper)` (Plan 1, ya en main)
3. `docs: plan de implementacion Fase 1 plan-1 ...`
4. `docs: direccion de diseño Fase 1 ...`

---

## Criterios finales de "done"

1. `npx tsc --noEmit` clean.
2. `npm run lint` clean.
3. `npm run test:unit` todos pasan.
4. `npx playwright test --project=chromium` (contra :3101) pasa para smoke + dev-theme.
5. El binding `three`, `vanta`, `@types/three` NO están en `package.json`.
6. Ficheros `components/vanta-waves-background.tsx`, `components/initial-loader.tsx`, `components/home-hero-scroll-sync.tsx` NO existen.
7. `grep -rE "bg-white/[0-9]|text-white/[0-9]|border-white/[0-9]" components/` y equivalente sobre `app/[locale]/(public)/`, `app/[locale]/(auth)/`, `app/[locale]/not-found.tsx` devuelven 0 matches (o sólo patterns sobre imagen que se mantuvieron intencionalmente — los `bg-black/X` sobre overlays de imagen).
8. `/eu/dev-theme` sigue renderizando correctamente.
9. `/eu`, `/eu/sedes`, `/eu/acceso` renderizan en light sin loader, sin Vanta, sin glitches obvios.
10. Dark mode (via DevTools) funciona en todas las rutas públicas.
11. Un único commit atómico en la rama `ui-rework-02-migracion`.

## Parada

**Al terminar Task 15: parada dura.** Merge a main sólo tras revisión humana y validación visual en `/eu` y `/eu/dev-theme`. Después, escribir Plan 3 (primitivas) con `writing-plans`.

No avanzar a Plan 3 sin validación visual del Plan 2.
