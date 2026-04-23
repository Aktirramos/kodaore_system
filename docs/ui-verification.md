# Verificación post-rework UI — Fase 5

Fecha inicial: 2026-04-23 (pase reducido, solo rutas públicas).
Ampliada: 2026-04-23 (cobertura completa tras desbloquear auth dev).

## 1. Captura de estado actual

Script: `POST_REWORK_BASE_URL=http://localhost:3001 npx playwright test --config=playwright.post-rework.config.ts`.
Spec: `tests/audit/post-rework.audit.spec.ts`.
Salida: `.audit/post-rework/<slug>/<viewport>/<theme>/<locale>/{top,full}.png`.

### Dimensiones cubiertas

- **16 rutas**:
  - **8 públicas**: `home`, `sedes`, `sedes/azkoitia`, `fototeca`,
    `erropak`, `acceso`, `legal/terms`, `legal/privacy`.
  - **4 admin** (tras auth via `.audit/state/admin.json`): `admin`,
    `admin/students`, `admin/groups`, `admin/billing`.
  - **4 familia** (tras auth via `.audit/state/familia.json`): `portal`,
    `portal/profile`, `portal/payments`, `portal/messages`.
- **2 locales**: `eu`, `es`.
- **2 temas**: `light`, `dark` (aplicados vía
  `localStorage.kodaore-theme` con `page.addInitScript()` antes de
  cada navegación).
- **2 viewports**: `chromium-desktop` (1440×900), `chromium-mobile`
  (iPhone 14 Pro).

Total: **128 tests** capturando **256 PNGs** (`top.png` + `full.png`).
Ejecución: 12.2 minutos. 128/128 en verde.

### Setup del entorno dev (necesario para auth)

Bloqueante inicial (Fase 0): `schema.prisma` declara `postgresql` pero
el `.env` apuntaba a un `mysql://` local y `NEXTAUTH_URL` a staging.
Esto impedía iniciar sesión local y por tanto capturar rutas privadas.

Solución aplicada (sin tocar capas bloqueadas):

1. **Postgres local** (ya corriendo en `:5432`):
   ```bash
   sudo -u postgres psql -c "CREATE USER kodaore_dev WITH PASSWORD '<pass>';"
   sudo -u postgres psql -c "CREATE DATABASE kodaore_system OWNER kodaore_dev;"
   sudo -u postgres psql -d kodaore_system -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public AUTHORIZATION kodaore_dev; GRANT ALL ON SCHEMA public TO kodaore_dev;"
   ```
2. **`.env.local`** (gitignored, sobreescribe a `.env` solo en
   `next dev`): `DATABASE_URL` a Postgres local, `NEXTAUTH_URL` a
   `http://localhost:3001`, secrets reutilizados. Plantilla versionada
   en `.env.local.example`.
3. **Migraciones**: `DATABASE_URL=... npx prisma migrate deploy` (6/6
   aplicadas).
4. **Seed**: `DATABASE_URL=... SEED_DEFAULT_PASSWORD=Kodaore2026! npx prisma db seed`.
   Usuarios creados: `admin.global` (rol `ADMIN_GLOBAL`), `developer`,
   `familia@kodaore.eus`.
5. **Setups de auth**: `AUDIT_BASE_URL=http://localhost:3001 npx playwright test --config=playwright.audit.config.ts --project=setup-admin --project=setup-familia` genera `.audit/state/{admin,familia}.json`.

No se tocó `schema.prisma`, `middleware.ts`, `lib/auth`, ni `.env`.

## 2. Checklist de entrega

Verificado visualmente contra `docs/ui-design-direction.md`:

| Item | Estado | Evidencia |
|---|---|---|
| Fondo `surface.base` claro `#fafaf7` en light | ✅ | Capturas `*/light/*/top.png` uniformes en crema cálido. |
| Dark mode automático y manual | ✅ | Toggle binario light↔dark (commit `5a0ffd1`). Capturas `*/dark/*` reflejan tokens oscuros en las 16 rutas. |
| Wordmark Kodaore con "Ko" brand + "re" brand-warm | ✅ | Visible en header de todas las rutas. |
| Titulares en serif mincho editorial solo en público | ✅ | H1/H2/H3 de rutas públicas en Shippori Mincho (commit `9e7b9ca`). Admin y portal mantienen sans (scope `[data-area="public"]`). |
| Body + nav en Inter | ✅ | Se mantiene legibilidad a tamaños pequeños. |
| Washi (textura papel) en fondo + cards públicas | ✅ | `public/patterns/washi-{light,dark}.svg` con `background-blend-mode`. Admin/portal sin washi. |
| Sin purple/pink gradients | ✅ | Paleta Dojo Moderno (brand `#c2272d`, accent `#1fa35c`). |
| Sin Vanta/three.js ni loader agresivo | ✅ | Retirados en Plan 2 (commit `f6e0dda`). |
| Focus visible en teclado | ✅ | Utility `k-focus-ring` conservada. |
| `prefers-reduced-motion` respetado | ✅ | `.fade-rise` / `.fade-reveal-left` con regla de anulación; primitivas con `motion-reduce:transform-none`. |
| Hero sin hydration mismatch | ✅ | Fix en `home-hero.tsx` (commit `5a0ffd1`). |
| Navegación fluida (sin bucle HMR) | ✅ | `next.config.ts` ignora scratch dirs (commit `86ab183`). |
| Admin dashboard renderiza con datos seed | ✅ | `admin/desktop/light/eu/top.png` muestra stats cards (1 alumno, 1 grupo, 1 recibo) y tabla por sedes. |
| Portal familia renderiza con datos seed | ✅ | `portal/desktop/{light,dark}/{eu,es}/top.png` muestra resumen, pagos, comunicaciones. |
| Tests unit verdes | ✅ | 67/67 (Vitest). |

## 3. Observaciones

- **Tipografía mincho**: Shippori Mincho (subset `latin`) añade ~40 KB
  a la primera visita pública. Admin y portal no lo cargan (scope CSS
  por `[data-area="public"]`) — preserva la velocidad/densidad del
  backoffice.
- **Washi en dark**: blend-mode `screen` da efecto más sutil que
  `multiply` en light. Intencional: el papel oscuro no destaca grana
  con la misma fuerza.
- **Admin/portal visualmente**: conservan el tono Dojo Moderno puro
  (sin acentos japoneses). Coherente con el objetivo de *dos
  audiencias*: densidad en `/admin`, calidez en `/eu`.
- **Descartados en la iteración**: componentes decorativos dibujados a
  mano (pinceladas sumi SVG, sello hanko, divisor tatami). El resultado
  era *AI-generic*. Se conserva solo lo que pasa una auditoría honesta:
  washi (textura real `<feTurbulence>`) y tipografía mincho (foundry).

## 4. Baseline futura

Este pase actúa como **baseline post-rework** para futuros pases de
drift. La baseline `.audit/baseline/` original de Fase 0 no se
conservó.

Trabajo futuro recomendado:
1. Añadir `expect(page).toHaveScreenshot()` contra
   `.audit/post-rework/` para pases de regresión automatizados.
2. Medir Lighthouse + Core Web Vitals (LCP home con foto hero) para
   baseline de performance.
3. Flows dinámicos (el scaffold incluye
   `videos-flow-4-form-validation.audit.spec.ts`; no ejecutado en
   este pase).

## 5. Commits cubiertos en esta Fase 5

- `60c4bfb` feat(ui): fundación Fase 1 (tokens + Inter + motion)
- `f6e0dda` feat(ui): migración cromática + retiradas (Vanta/Manrope/…)
- `4da4ec4` feat(ui): primitivas core + migra k-hover-* público
- `0e97502` feat(ui): migra admin + portal + retira k-hover-*
- `5a0ffd1` feat(ui): toggle theme + fix hero invisible
- `86ab183` fix(dev): excluir scratch dirs del watcher HMR
- `547dec0` refactor(ui): retirar sumi y tatami, conservar solo washi
- `9e7b9ca` feat(ui): Shippori Mincho para headings públicos

## 6. Cierre

Fase 5 queda cerrada con cobertura completa (16 rutas × 2 locales ×
2 temas × 2 viewports = 128 capturas en verde). El ciclo UI-rework
Fases 1-5 queda entregado. Pendiente solo el seguimiento voluntario
de §4 (regresión + performance).
