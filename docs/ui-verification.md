# Verificación post-rework UI — Fase 5 (reducida)

Fecha: 2026-04-23.
Scope reducido: solo rutas públicas (admin + portal quedan pendientes
hasta que se resuelva el desajuste de auth/env detectado en Fase 0).

## 1. Captura de estado actual

Script: `npx playwright test --config=playwright.post-rework.config.ts`.
Spec: `tests/audit/post-rework.audit.spec.ts`.
Salida: `.audit/post-rework/<slug>/<viewport>/<theme>/<locale>/{top,full}.png`.

### Dimensiones cubiertas

- **8 rutas públicas**: `home`, `sedes`, `sedes/azkoitia`, `fototeca`,
  `erropak`, `acceso`, `legal/terms`, `legal/privacy`.
- **2 locales**: `eu`, `es`.
- **2 temas**: `light`, `dark` (el toggle manual se aplica vía
  `localStorage.kodaore-theme` antes de navegar).
- **2 viewports**: `chromium-desktop` (1440×900), `chromium-mobile`
  (iPhone 14 Pro).

Total: **64 tests** capturando **128 PNGs** (`top.png` + `full.png` por
combinación). Ejecución: 6 minutos. 64/64 en verde.

### No cubierto en este pase

- `/admin/*` (4 rutas) y `/portal/*` (4 rutas). El scaffold original
  (`tests/audit/screenshots.audit.spec.ts`) sigue marcándolos con
  `test.skip` mientras no exista `.audit/state/{admin,familia}.json`,
  que a su vez depende de que el entorno de auth esté operativo
  (schema.prisma declara postgres, `.env` apunta a mysql, y
  `NEXTAUTH_URL` está configurada para producción). Estos capturas
  son el trabajo pendiente de **Fase 0.b** y bloquean la verificación
  visual de esos grupos hasta que se arreglen.
- Trazas de performance y Lighthouse: no se incluyen en este pase.
  Recomendado como seguimiento separado una vez que Fase 0.b desbloquee
  el ciclo completo.

## 2. Checklist de entrega

Lo que se verifica visualmente contra el objetivo de Fase 1
(`docs/ui-design-direction.md`):

| Item | Estado | Evidencia |
|---|---|---|
| Fondo `surface.base` claro `#fafaf7` en light | ✅ | Todas las capturas `*/light/*/top.png` muestran crema cálido. |
| Dark mode automático y manual | ✅ | Toggle binario light↔dark (commit `5a0ffd1`). `prefers-color-scheme` como default inicial. Capturas `*/dark/*` reflejan tokens oscuros. |
| Wordmark Kodaore con "Ko" brand + "re" brand-warm | ✅ | Visible en `home/desktop/light/eu/top.png` y equivalentes. |
| Titulares en serif mincho editorial (solo público) | ✅ | H1 del hero y H2 de secciones en Shippori Mincho (commit `9e7b9ca`). Admin no afectado por scope `[data-area="public"]`. |
| Body + nav en Inter | ✅ | Se mantiene legibilidad a tamaños pequeños. |
| Washi (textura papel) sutil en fondo + cards | ✅ | `public/patterns/washi-{light,dark}.svg` aplicados con `background-blend-mode: multiply`/`screen` (commit `547dec0`). |
| Sin purple/pink gradients | ✅ | Paleta Dojo Moderno (brand `#c2272d`, accent `#1fa35c`). |
| Sin Vanta/three.js ni loader agresivo | ✅ | Retirados en Plan 2 (commit `f6e0dda`). |
| Focus visible en teclado | ✅ | Utility `k-focus-ring` conservada, outline brand-emphasis. Verificar manualmente con `Tab` cuando la auth esté resuelta. |
| `prefers-reduced-motion` respetado | ✅ | `.fade-rise` / `.fade-reveal-left` tienen regla `@media (prefers-reduced-motion: reduce)` que anula `animation` y `transition`. Primitivas Card/Button incluyen `motion-reduce:transform-none`. |
| Hero sin hydration mismatch | ✅ | Fix en `home-hero.tsx` (commit `5a0ffd1`): retirado `useState(getInitialReadyState)` que causaba opacity-0 persistente. |
| Navegación fluida (sin bucle HMR) | ✅ | `next.config.ts` ignora `.claude/`, `.playwright-mcp/`, `.superpowers/` del watcher (commit `86ab183`). |
| Tests unit verdes | ✅ | 67/67 (Vitest), incluye 8 tests del toggle de tema. |

## 3. Observaciones

- **Tipografía mincho**: Shippori Mincho con subset `latin` carga ~40 KB
  adicionales en la primera visita a rutas públicas. Se considera coste
  aceptable por el diferencial estético. Admin y portal no lo cargan
  nunca (scope CSS por `[data-area="public"]`).
- **Washi en dark mode**: el blend-mode `screen` da un efecto más sutil
  que el `multiply` en light. Es esperado; el papel oscuro no debe
  resaltar la grana con la misma fuerza que el claro.
- **Descartados durante la iteración**: componentes decorativos
  dibujados a mano (pinceladas sumi SVG, sello hanko, divisor tatami).
  El resultado era demasiado "diseñado por IA" y no transmitía la
  esencia deseada. Se conserva solo lo que pasa una auditoría visual
  honesta: washi (textura real via `<feTurbulence>`) y tipografía
  (fuente producida por un foundry real).

## 4. Comparación con baseline de Fase 0

No existe baseline capturado: el directorio `.audit/baseline/` está
vacío en este repo. En Fase 0 el scaffold se validó con las rutas
públicas pero los artefactos se generaban en un worktree y no se
conservaron. Este pase de verificación actúa como **nueva baseline
post-rework** para futuros pases de drift.

Trabajo futuro recomendado:
1. Resolver auth/env bloqueante → permitir capturas admin+portal.
2. Ejecutar de nuevo este spec con cobertura completa (96 tests).
3. Extender con comparación pixel-a-pixel (Playwright `toHaveScreenshot`
   con `.audit/post-rework/` como baseline) para pases de regresión.
4. Medir Core Web Vitals (LCP en la home con la foto hero) y Lighthouse
   para tener el baseline de performance post-rework.

## 5. Commits que cubre esta verificación

- `60c4bfb` feat(ui): fundación Fase 1 (tokens Dojo Moderno + Inter + motion wrapper)
- `f6e0dda` feat(ui): migración cromática a Dojo Moderno + retiradas Fase 1 plan 2
- `4da4ec4` feat(ui): primitivas core + migra k-hover-* en público
- `0e97502` feat(ui): migrar k-hover-* en admin + portal y retirar utilities
- `5a0ffd1` feat(ui): toggle manual de tema (light/dark) + fix hero invisible
- `86ab183` fix(dev): excluir dirs scratch del watcher HMR para evitar bucle
- `547dec0` refactor(ui): retirar sumi y tatami, conservar solo washi
- `9e7b9ca` feat(ui): Shippori Mincho para headings en rutas públicas

## 6. Criterios de cierre

Este pase cierra la verificación **reducida** de Fase 5. El cierre
completo del ciclo UI-rework (Fases 1-5) queda subordinado a que se
resuelva Fase 0.b (auth operativa → capturas admin+portal + trazas
flows) y Fase 5.full (Lighthouse + pixel diff).
