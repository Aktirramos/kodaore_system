# UI Rework — Plan 4: Migración admin + portal + retiro total de k-hover-*

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completar la migración del rediseño Dojo Moderno eliminando las últimas 27 ocurrencias de `k-hover-*` en los 14 ficheros pendientes de admin y portal, y retirando por completo las 4 utilities (`.k-hover-lift`, `.k-hover-soft`, `.k-hover-action`, `.k-row-hover`) de `app/globals.css`.

**Architecture:** Migración mecánica. Mismo patrón de reemplazo que Plan 3: en componentes con semántica clara (admin-stat-card, portal-quick-link-card) adoptar primitiva `Card`; en layouts con styling bespoke (pages con grids, gradients custom) inlinear el patrón transition+hover+focus-visible sin forzar primitivas. Tras completar las 14 migraciones, retirar las utilities de `globals.css`. Nada más — Plan 4 cierra la Fase de migración; polish visual y primitivas adicionales (Input, Table, Dialog, Dropdown, Tabs, Tooltip) se harán en planes posteriores cuando las verticales las necesiten de verdad.

**Tech stack:** Next.js 15, Tailwind v4, primitivas `Button/Card/Badge/Skeleton` (ya en `components/ui/`). Sin nuevas dependencias.

**Spec:** `docs/ui-design-direction.md`. Plan 3 aplicado en commit `4da4ec4`.

**Plan de planes:**
- Plan 1 (merged): fundación aditiva — tokens + Inter + motion wrapper.
- Plan 2 (merged): flip cromático + retiradas Vanta/Loader.
- Plan 3 (merged): primitivas core + migración público.
- **Plan 4 (este):** admin + portal + retiro total de utilities. Cierra la fase de migración.

## Limitación conocida

El entorno local de auth sigue roto (mismatch DB schema postgres vs `.env` mysql, NEXTAUTH_URL remoto). Las rutas admin/portal redirigen a `/acceso` sin credenciales, así que:

- **No se valida visualmente admin ni portal** en este plan. Los cambios se validan estáticamente (lint, tsc, smoke e2e de redirects).
- **Los tests auth-gated** de `tests/e2e/smoke.spec.ts` siguen skipped (pre-existente).
- Cuando se arregle el entorno (fuera del scope de este workflow), se hará la validación visual de admin+portal como ejercicio aparte.

Este plan no puede confirmar que admin/portal rendericen correctamente tras la migración. Confía en que los cambios son mecánicos, consistentes con Plan 3, y que tsc detecta problemas de sintaxis.

## Scope

**En scope:**
- Migrar `k-hover-*` en los 14 ficheros listados abajo (27 ocurrencias totales).
- Retirar las 4 utilities CSS de `app/globals.css`.
- Actualizar el bloque `@media (prefers-reduced-motion: reduce)` eliminando referencias a las utilities retiradas.
- Validación estática (lint + tsc + unit tests + e2e smoke de redirects públicos).

**Fuera de scope:**
- Nuevas primitivas (Input, Table, Dialog, Dropdown, Tabs, Tooltip, Select, Checkbox).
- Rebuild estructural de admin o portal (p. ej. nueva layout, nuevo dashboard). Polish visual viene después en planes posteriores.
- Fix del entorno de auth (tarea tuya).
- Validación visual de admin/portal.
- Capas bloqueadas de CLAUDE.md.

## Ficheros afectados (14)

**Admin (7 ficheros, 14 ocurrencias):**
- `components/admin-billing-actions-table.tsx` (1)
- `components/admin-groups-actions-table.tsx` (1)
- `components/admin-students-actions-table.tsx` (1)
- `app/[locale]/(backoffice)/admin/_shared/_components/admin-stat-card.tsx` (1)
- `app/[locale]/(backoffice)/admin/error.tsx` (2)
- `app/[locale]/(backoffice)/admin/page.tsx` (2)
- `app/[locale]/(backoffice)/admin/students/[studentId]/page.tsx` (6)

**Portal (7 ficheros, 13 ocurrencias):**
- `app/[locale]/(family-portal)/portal/_components/portal-quick-link-card.tsx` (1)
- `app/[locale]/(family-portal)/portal/_components/portal-summary-stat-card.tsx` (1)
- `app/[locale]/(family-portal)/portal/error.tsx` (2)
- `app/[locale]/(family-portal)/portal/page.tsx` (3)
- `app/[locale]/(family-portal)/portal/messages/page.tsx` (1)
- `app/[locale]/(family-portal)/portal/payments/page.tsx` (2)
- `app/[locale]/(family-portal)/portal/profile/page.tsx` (3)

**CSS (1 fichero):**
- `app/globals.css`

## Reglas de mapeo (mismas que Plan 3, repetidas verbatim)

| Uso actual | Reemplazo |
|---|---|
| `className="k-hover-lift border border-border-subtle bg-surface-elevated ..."` en `<div>` | `<Card interactive className="...">` |
| `className="k-hover-lift ..."` en `<Link>`/`<a>`/`<button>` con semántica propia | `className={getCardClasses({ interactive: true, className: "..." })}` |
| `className="k-hover-soft border ..."` en `<div>` | `<Card variant="subtle" className="...">` O inline `transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-surface-subtle/60` si no es card |
| `className="k-hover-action ..."` en `<button>` primario | `<Button variant="primary">` |
| `className="k-hover-action ..."` en `<button>` bordered | `<Button variant="secondary">` |
| `className="k-hover-action ..."` en `<button>` transparente | `<Button variant="ghost">` |
| `className="k-row-hover ..."` en `<tr>` de tabla | Inline: `transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-surface-subtle` |
| `k-focus-ring` adyacente | Remover — la primitiva / clase inline incluyen `focus-visible:outline-brand-base` |
| `duration-[260ms]` o `duration-300` junto a `k-hover-*` | Remover — el reemplazo ya usa `duration-[var(--duration-base)]` (200ms) |

**Criterio bespoke vs primitiva (aprendizaje de Plan 3):** si el elemento ya tiene radius, padding o background custom que chocan con los defaults de las primitivas (`Card`: `rounded-lg p-4`, `Button`: `h-10 px-4 rounded-pill`), inlinear el patrón en vez de forzar override en la primitiva. Preservar paridad visual es prioridad.

**Preservar `k-row-hover`:** esa utility se usa en las tablas admin. Su reemplazo inline es `transition-colors duration-[var(--duration-base)] hover:bg-surface-subtle` directamente en la `<tr>`. Tras migrar todas las ocurrencias, la utility se retira de `globals.css`.

---

### Task 1: Preflight + worktree

- [ ] **Step 1: Verificar main**

Run:
```bash
git -C /home/avanzosc/kodaore_system log --oneline -2
```
Expected: top commit `4da4ec4 feat(ui): primitivas core`.

- [ ] **Step 2: Crear worktree**

```bash
git -C /home/avanzosc/kodaore_system worktree add -b ui-rework-04-admin-portal /home/avanzosc/kodaore_system.ui-rework-04-admin-portal main
```

- [ ] **Step 3: Symlinks**

```bash
ln -s /home/avanzosc/kodaore_system/node_modules /home/avanzosc/kodaore_system.ui-rework-04-admin-portal/node_modules
ln -s /home/avanzosc/kodaore_system/.env /home/avanzosc/kodaore_system.ui-rework-04-admin-portal/.env
ls -la /home/avanzosc/kodaore_system.ui-rework-04-admin-portal/node_modules /home/avanzosc/kodaore_system.ui-rework-04-admin-portal/.env | head -3
```

---

### Task 2: Migrar admin components

**Files:**
- Modify: `components/admin-billing-actions-table.tsx`
- Modify: `components/admin-groups-actions-table.tsx`
- Modify: `components/admin-students-actions-table.tsx`
- Modify: `app/[locale]/(backoffice)/admin/_shared/_components/admin-stat-card.tsx`

Total: 4 ficheros, ~4 ocurrencias.

- [ ] **Step 1: Grep por fichero**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-04-admin-portal
for f in components/admin-billing-actions-table.tsx components/admin-groups-actions-table.tsx components/admin-students-actions-table.tsx 'app/[locale]/(backoffice)/admin/_shared/_components/admin-stat-card.tsx'; do
  echo "=== $f ==="
  grep -nE "k-hover-lift|k-hover-soft|k-hover-action|k-row-hover|k-focus-ring" "$f"
done
```

- [ ] **Step 2: Migrar las 3 `admin-*-actions-table.tsx`**

Las tres tablas probablemente usan `k-row-hover` en `<tr>` y/o `k-hover-action` en botones de fila. Aplicar reglas:
- `k-row-hover` en `<tr>` → `transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-surface-subtle`
- `k-hover-action` en `<button>` → `<Button variant="ghost" size="sm">` o `<Button variant="secondary" size="sm">` según color actual. Importar desde `@/components/ui`.

**Importante:** estas tablas son densas; admin pide densidad. NO añadir padding extra. Si el botón de acción es pequeño (tipo icon + label corto), `size="sm"` es la opción correcta.

- [ ] **Step 3: Migrar `admin-stat-card.tsx`**

Este es un componente de card con stats (ver comentario en Plan 2 Task 19: "3 stat cards con utilities idénticas"). Muy probable que use `k-hover-lift` en un `<div>` raíz con `rounded-2xl border border-border-subtle`.

Si es un `<div>` raíz con borde+bg estándar, reemplazar por:
```tsx
<Card interactive className="rounded-2xl ...">
```
(La `className` override de `rounded-2xl` prevalece sobre el `rounded-lg` default de Card, porque Tailwind toma el último utility aplicable.)

Si tiene layout custom que choca, inlinear el patrón.

- [ ] **Step 4: Verificar**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-04-admin-portal
for f in components/admin-billing-actions-table.tsx components/admin-groups-actions-table.tsx components/admin-students-actions-table.tsx 'app/[locale]/(backoffice)/admin/_shared/_components/admin-stat-card.tsx'; do
  n=$(grep -cE "k-hover-lift|k-hover-soft|k-hover-action|k-row-hover" "$f")
  echo "$f: $n"
done
npx tsc --noEmit 2>&1 | tail -5
```

Expected: cada fichero en `: 0`, tsc limpio.

No commit.

---

### Task 3: Migrar admin pages

**Files:**
- Modify: `app/[locale]/(backoffice)/admin/error.tsx`
- Modify: `app/[locale]/(backoffice)/admin/page.tsx`
- Modify: `app/[locale]/(backoffice)/admin/students/[studentId]/page.tsx`

Total: 3 ficheros, 10 ocurrencias.

- [ ] **Step 1: Grep**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-04-admin-portal
for f in 'app/[locale]/(backoffice)/admin/error.tsx' 'app/[locale]/(backoffice)/admin/page.tsx' 'app/[locale]/(backoffice)/admin/students/[studentId]/page.tsx'; do
  echo "=== $f ==="
  grep -nE "k-hover-lift|k-hover-soft|k-hover-action|k-row-hover|k-focus-ring" "$f"
done
```

- [ ] **Step 2: Migrar**

Aplicar reglas por ocurrencia. Los `error.tsx` probablemente tienen 2 botones (retry + back to admin) — ambos `<Button variant="secondary">`. Las pages (dashboard admin + detalle de alumno) tienen cards de métricas, enlaces de navegación y acciones; mezcla de `<Card interactive>` para enlaces-card, y inline para layouts bespoke.

**students/[studentId]/page.tsx** tiene 6 ocurrencias — es la página con más variedad. Lee el fichero completo antes de editar.

- [ ] **Step 3: Verificar**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-04-admin-portal
grep -rcE "k-hover-lift|k-hover-soft|k-hover-action|k-row-hover" 'app/[locale]/(backoffice)/' 2>/dev/null | grep -v ":0$"
npx tsc --noEmit 2>&1 | tail -5
```

Expected: sin matches, tsc limpio.

No commit.

---

### Task 4: Migrar portal components

**Files:**
- Modify: `app/[locale]/(family-portal)/portal/_components/portal-quick-link-card.tsx`
- Modify: `app/[locale]/(family-portal)/portal/_components/portal-summary-stat-card.tsx`

Total: 2 ficheros, 2 ocurrencias.

- [ ] **Step 1: Grep**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-04-admin-portal
for f in 'app/[locale]/(family-portal)/portal/_components/portal-quick-link-card.tsx' 'app/[locale]/(family-portal)/portal/_components/portal-summary-stat-card.tsx'; do
  echo "=== $f ==="
  grep -nE "k-hover-lift|k-hover-soft|k-hover-action|k-row-hover|k-focus-ring" "$f"
done
```

- [ ] **Step 2: Migrar**

Ambos componentes son cards. `portal-quick-link-card` es un Link clickable con card styling → candidato claro para `getCardClasses({ interactive: true, ... })` manteniendo el `<Link>`. `portal-summary-stat-card` es display-only → puede ser `<Card>` simple (no interactive).

- [ ] **Step 3: Verificar**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-04-admin-portal
grep -rcE "k-hover-lift|k-hover-soft|k-hover-action" 'app/[locale]/(family-portal)/portal/_components/' 2>/dev/null | grep -v ":0$"
npx tsc --noEmit 2>&1 | tail -5
```

No commit.

---

### Task 5: Migrar portal pages

**Files:**
- Modify: `app/[locale]/(family-portal)/portal/error.tsx`
- Modify: `app/[locale]/(family-portal)/portal/page.tsx`
- Modify: `app/[locale]/(family-portal)/portal/messages/page.tsx`
- Modify: `app/[locale]/(family-portal)/portal/payments/page.tsx`
- Modify: `app/[locale]/(family-portal)/portal/profile/page.tsx`

Total: 5 ficheros, 11 ocurrencias.

- [ ] **Step 1: Grep**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-04-admin-portal
for f in 'app/[locale]/(family-portal)/portal/error.tsx' 'app/[locale]/(family-portal)/portal/page.tsx' 'app/[locale]/(family-portal)/portal/messages/page.tsx' 'app/[locale]/(family-portal)/portal/payments/page.tsx' 'app/[locale]/(family-portal)/portal/profile/page.tsx'; do
  echo "=== $f ==="
  grep -nE "k-hover-lift|k-hover-soft|k-hover-action|k-row-hover|k-focus-ring" "$f"
done
```

- [ ] **Step 2: Migrar**

Aplicar reglas. Las páginas portal son dashboards con cards de resumen, enlaces rápidos, y acciones. Mezcla de `Card interactive` y botones primitivos.

- [ ] **Step 3: Verificar**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-04-admin-portal
grep -rcE "k-hover-lift|k-hover-soft|k-hover-action|k-row-hover" 'app/[locale]/(family-portal)/portal/' 2>/dev/null | grep -v ":0$"
npx tsc --noEmit 2>&1 | tail -5
```

Expected: 0 matches totales, tsc limpio.

No commit.

---

### Task 6: Retirar utilities de `globals.css`

**Files:**
- Modify: `app/globals.css`

Tras Tasks 2–5 ningún fichero del proyecto usa `k-hover-lift`, `k-hover-soft`, `k-hover-action` ni `k-row-hover`. Las utilities pueden retirarse.

- [ ] **Step 1: Confirmar 0 usos**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-04-admin-portal
grep -rcE "k-hover-lift|k-hover-soft|k-hover-action|k-row-hover" app/ components/ --include='*.tsx' --include='*.ts' 2>/dev/null | grep -v ":0$"
```
Expected: sin output (ningún fichero con >0 matches).

Si aparece algún fichero, volver al task correspondiente y completar.

- [ ] **Step 2: Retirar los 4 bloques de utility**

En `app/globals.css`, localizar y eliminar los bloques completos:

**Bloque 1: `.k-hover-lift` + `::before` + `:hover` + `:hover::before`** (entre líneas ~146 y ~184 del fichero, aproximadamente; buscar por `.k-hover-lift {`).

**Bloque 2: `.k-hover-soft` + `::before` + `:hover` + `:hover::before`** (buscar por `.k-hover-soft {`).

**Bloque 3: `.k-hover-action` + `:hover`** (buscar por `.k-hover-action {`).

**Bloque 4: `.k-row-hover` + `:hover`** (buscar por `.k-row-hover {`).

Las referencias a estas clases en el bloque `@media (hover: none)` también:

```css
@media (hover: none) {
  .k-hover-lift,
  .k-hover-action,
  .kodaore-social-icon {
    ...
  }

  .k-hover-lift:hover,
  .k-hover-action:hover,
  ...
}
```

Reemplazar las referencias a `.k-hover-lift` y `.k-hover-action` (quitarlas de las listas de selectores). Si tras quitar esas referencias el bloque queda con `.kodaore-social-icon` solamente, mantener el bloque con ese único selector.

- [ ] **Step 3: Retirar del `@media (prefers-reduced-motion: reduce)`**

Localizar el bloque:

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
  ...
}
```

Eliminar las 4 referencias del selector del primer bloque y el segundo bloque completo (`.k-hover-lift:hover, .k-hover-action:hover { ... }`). Lo que queda:

```css
@media (prefers-reduced-motion: reduce) {
  .kodaore-social-icon,
  .fade-rise,
  .fade-reveal-left {
    animation: none !important;
    transition: none !important;
  }

  body::after {
    opacity: 0.025;
  }
}
```

- [ ] **Step 4: Verificar**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-04-admin-portal
grep -c "k-hover-lift\|k-hover-soft\|k-hover-action\|k-row-hover" app/globals.css
```
Expected: `0`.

```bash
wc -l app/globals.css
```
Expected: baja unos ~100 líneas respecto al estado previo (~453 → ~350).

```bash
npx tsc --noEmit 2>&1 | tail -5
```

No commit.

---

### Task 7: Validación + commit final

- [ ] **Step 1: Lint**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-04-admin-portal && npm run lint 2>&1 | tail -15
```

- [ ] **Step 2: Unit tests**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-04-admin-portal && npm run test:unit 2>&1 | tail -15
```
Expected: 59 tests passing (sin tests nuevos en este plan; la regresión sería nueva).

- [ ] **Step 3: TSC final**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-04-admin-portal && npx tsc --noEmit 2>&1 | tail -10
```

- [ ] **Step 4: E2E smoke (contra :3101, PM2 en :3000 tiene código viejo)**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-04-admin-portal && npx next dev --port 3101 > /tmp/plan4-dev.log 2>&1 &
DEV_PID=$!
sleep 10
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3101 npx playwright test --project=chromium 2>&1 | tail -20
kill $DEV_PID 2>/dev/null
wait 2>/dev/null
```
Expected: smoke público pasa. Los tests auth-gated siguen skipped (entorno de auth roto pre-existente; no se puede resolver en este plan).

- [ ] **Step 5: Verificación cruzada**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-04-admin-portal
echo "Uses in code:"
grep -rcE "k-hover-lift|k-hover-soft|k-hover-action|k-row-hover" app/ components/ --include='*.tsx' --include='*.ts' 2>/dev/null | grep -v ":0$" | head -5
echo "Definitions in CSS:"
grep -c "k-hover-lift\|k-hover-soft\|k-hover-action\|k-row-hover" app/globals.css
```
Expected: primer comando sin output; segundo comando `0`.

- [ ] **Step 6: `git status --short`**

Confirmar qué se está commiteando. Debe incluir:
- 14 ficheros de admin/portal modificados.
- `app/globals.css` modificado.
- NADA más (no nuevos ficheros, no package.json, no tests nuevos, no components/ui/*).

- [ ] **Step 7: Commit**

```bash
cd /home/avanzosc/kodaore_system.ui-rework-04-admin-portal && git add -A && git commit -m "$(cat <<'EOF'
feat(ui): migrar k-hover-* en admin + portal y retirar utilities

Cierra la fase de migración cromática del rediseño Dojo Moderno.
Plan 4 (final).

Migracion:
- 7 ficheros admin: tres admin-*-actions-table, admin-stat-card,
  admin/error, admin/page, admin/students/[studentId]/page.
- 7 ficheros portal: dos _components (quick-link-card y
  summary-stat-card), portal/error, portal/page, portal/messages,
  portal/payments, portal/profile.
- 27 ocurrencias de k-hover-lift/k-hover-soft/k-hover-action/
  k-row-hover reemplazadas con primitivas Card/Button o inline
  transition+hover+focus-visible (mismo patrón que Plan 3).

Retiradas de globals.css:
- .k-hover-lift, .k-hover-soft, .k-hover-action, .k-row-hover
  (bloques principales + :hover + ::before/::after).
- Referencias en @media (hover: none) y @media (prefers-
  reduced-motion: reduce).

globals.css baja ~100 lineas adicionales.

Limitacion pendiente: admin y portal no se pueden validar
visualmente en local hasta que se arregle el desalineamiento
DB/env (schema Postgres vs .env MySQL, NEXTAUTH_URL remoto).
Cambios validados estaticamente (lint, tsc, unit tests, e2e
smoke de redirects publicos).

Con este plan queda cerrada la migracion cromatica y de motion
system del rediseño. Ajustes visuales adicionales y nuevas
primitivas (Input, Dialog, DropdownMenu, Tabs, Tooltip, Select,
Checkbox, Table) se haran en planes posteriores cuando las
verticales los necesiten.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 8: Log final**

```bash
git -C /home/avanzosc/kodaore_system.ui-rework-04-admin-portal log --oneline -5
```
Expected top: nuevo commit de migración admin/portal.

---

## Criterios finales de "done"

1. `npx tsc --noEmit` clean.
2. `npm run lint` clean.
3. `npm run test:unit` — 59 tests passing.
4. `npx playwright test --project=chromium` (contra :3101) — smoke público + dev-theme passing (auth-gated skipped pre-existente).
5. `grep -rcE "k-hover-lift|k-hover-soft|k-hover-action|k-row-hover" app/ components/ --include='*.tsx' --include='*.ts'` — 0 matches en todos los ficheros.
6. `grep -c "k-hover-lift\|k-hover-soft\|k-hover-action\|k-row-hover" app/globals.css` = 0.
7. `globals.css` reduce ~100 líneas respecto a pre-plan.
8. Un único commit atómico en rama `ui-rework-04-admin-portal`.

## Parada

**Al terminar Task 7: parada dura.** Merge a main sólo tras revisión humana. Tras merge, la rama `main` queda en estado "Fase de migración completa" — dirección Dojo Moderno aplicada transversalmente. Próximos trabajos (futuros planes, no este workflow):

- Arreglar entorno de auth para validar admin/portal visualmente.
- Completar Fase 0.b pendiente (screenshots admin+portal + 3 vídeos diferidos).
- Fase 5 del workflow original: visual diff contra baseline, Lighthouse, perf traces, QA a11y.
- Nuevas primitivas cuando surjan necesidades concretas.
- Polish visual por vertical (rebuild de dashboards admin/portal con criterio estético, no solo migración mecánica).
