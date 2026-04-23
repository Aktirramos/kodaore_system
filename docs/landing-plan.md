# Landing Kodaore — Fase 2 · Plan de ejecución

Fecha: 2026-04-23
Entrada: `docs/landing-audit.md` + `docs/landing-narrative.md` + `docs/landing-direction.md`.
Salida: plan accionable de Fase 3 (código) + criterios de aceptación de Fase 4.

---

## 1. Ámbito y no-ámbito

**En el ámbito**:
- Sustituir la home pública por una landing narrativa de 9 secciones bajo `app/[locale]/page.tsx`.
- Crear `components/landing/` con componentes específicos.
- Añadir claves i18n `landing.*` en eu/es en `lib/i18n.ts`.
- Añadir token `--text-display-2xl` al `@theme` de `app/globals.css`.
- Commitear los SVG vectorizados del haraigoshi.
- Añadir JSON-LD `Organization` + `LocalBusiness` (x3) en la página.

**Fuera del ámbito** (explícito):
- No se toca `prisma/schema.prisma`, `middleware.ts`, `lib/auth`, `lib/observability`, `lib/audit`, `lib/security`, rutas `api/`, envío de mail, `components/site-header-nav.tsx`, `components/site-footer.tsx`, ninguna ruta del portal familia ni admin.
- No se retira ni modifica la ruta `/[locale]/sedes/*`, `/erropak`, `/fototeca`, `/legal/*`, `/acceso`.
- No se retira Manrope ni Space Grotesk globalmente (deuda marcada en audit §1.2, no se aborda aquí).

---

## 2. Secciones · copy, assets, motion, breakpoints

Referencia de copy: `docs/landing-narrative.md` §1–§9. Aquí solo lo técnico.

### §1 Apertura (`<Opening />`)

- **Copy**: `landing.opening.brand`, `landing.opening.title`, `landing.opening.lede`.
- **Assets**: ninguno.
- **Motion**: fadeUp con delay 0 ms. En reduced-motion: estático.
- **Layout mobile** (<768): `min-height: 70vh`, `py-16`, `text-display-2xl` aún clamp a 56 px. Align left.
- **Layout desktop** (≥768): `min-height: 80vh`, `max-w-4xl`, `pl-8` (no centrado geométrico).
- **Semántica**: `<section aria-labelledby="opening-title">` + `<h1 id="opening-title">`.

### §2 Lo que enseñamos (`<Teaching />`)

- **Copy**: `landing.teaching.title`, `landing.teaching.p1`, `landing.teaching.p2`.
- **Assets**: ninguno.
- **Motion**: fadeUp con stagger 120 ms entre `h2`, `p1`, `p2`. Transición de salida: un SVG `<line>` fino cruza horizontalmente a 40% del viewport — stroke-dashoffset animado por `useScroll` local.
- **Semántica**: `<section aria-labelledby="teaching-title">` + `<h2 id="teaching-title">`.

### §3 Momento haraigoshi (`<ChapterHaraigoshi />`) — **núcleo**

- **Copy**: `landing.haraigoshi.title` ("haraigoshi", minúsculas, sin itálica) + `landing.haraigoshi.moments[0..3]` (4 aforismos eu/es).
- **Assets**: 5 SVG de `public/landing/haraigoshi/svg-a-clean/frame-0{1..5}.svg`, inlineados en un `<defs>` compartido para no duplicar paths.
- **Motion — timing por scrollYProgress**:
  - `[0.00, 0.20]`: frame 01 visible, momento 1 aforismo `opacity 0 → 1`.
  - `[0.20, 0.40]`: frame 01 cross-fade a 02, momento 1 `opacity 1`, momento 2 fade-in.
  - `[0.40, 0.60]`: frame 03 visible, momento 2 `opacity 1`, momento 3 fade-in.
  - `[0.60, 0.80]`: frame 04 visible, momento 3 `opacity 1`, momento 4 fade-in.
  - `[0.80, 1.00]`: frame 05 visible, los 4 aforismos `opacity 1`, "haraigoshi" (title) fade-in.
- **Layout mobile**: frame arriba (aspect-ratio 472/580), aforismos debajo apilados. Container: `min-height: 100vh` pinned, altura total de scroll del wrapper `220vh`.
- **Layout desktop**: frame a la izquierda (`col-span-6`), aforismos a la derecha (`col-span-5 col-start-8`). Wrapper `220vh`, sticky child `h-screen`.
- **Fallback reduced-motion** (`<ChapterHaraigoshiStatic />`): rejilla `grid-cols-2 md:grid-cols-3` con los 5 SVG + título centrado arriba + 4 aforismos pegados al frame correspondiente.
- **Fallback no-JS**: renderiza `<ChapterHaraigoshiStatic />` como RSC por defecto; el componente cliente hidrata encima solo si JS está disponible y no hay reduced motion. Técnica: componente server que renderiza ambos layouts y usa CSS (`@media (prefers-reduced-motion: reduce)`) para mostrar uno u otro — el JS override añade pinning.

### §4 Método (`<Method />`)

- **Copy**: `landing.method.title`, `landing.method.pillars[0..2]` (title + body cada uno).
- **Assets**: ninguno.
- **Motion**: fadeUp en el título + stagger 150 ms entre los 3 pilares.
- **Layout mobile**: 1 columna.
- **Layout desktop**: 3 columnas de `grid-cols-3` con `gap-12`.

### §5 Sedes (`<Sites />`)

- **Copy**: `landing.sites.title`, `landing.sites.items[0..2]` (city, venue, schedule, href).
- **Assets**: ninguno. Enlaces a `/[locale]/sedes/[slug]`.
- **Motion**: fadeUp en el título + stagger 150 ms por sede.
- **Layout mobile**: lista apilada, filetes entre cada item.
- **Layout desktop**: 3 columnas con filete vertical entre ellas.

### §6 Disciplinas (`<Disciplines />`)

- **Copy**: `landing.disciplines.title`, `landing.disciplines.items[0..1]` (name, description).
- **Layout**: 2 columnas desktop, 1 mobile.
- **Motion**: fadeUp simple.

### §7 CTA primera clase (`<Trial />`)

- **Copy**: `landing.trial.title`, `landing.trial.body`, `landing.trial.email`, `landing.trial.whatsapp`.
- **Enlaces**: `mailto:Kodaorejudoelkartea@gmail.com` (provisional, confirmado en i18n actual) + `https://wa.me/{{NUMERO_WHATSAPP}}` (pendiente confirmar, mientras tanto se renderiza el email duplicado y se marca `TODO: wa` en el code review).
- **Motion**: fadeUp + un filete SVG creciendo bajo el título con scroll local.

### §8 Familia ya inscritas (`<FamilyPortalEntry />`)

- **Copy**: `landing.familyPortal.title`, `landing.familyPortal.body`.
- **Enlaces**:
  - eu: `/eu/{FAMILY_PORTAL_ROUTE}` — verificar ruta exacta en `app/[locale]/(family-portal)/` al implementar.
  - es: `/es/{FAMILY_PORTAL_ROUTE}`.
  - Acceso: `/[locale]/acceso` (ya existe).
- **Layout**: una línea discreta, Inter 14 px, color `--ink-muted-2`. Sin box.

### §9 Footer

- Reusar `<SiteFooter />` de `components/site-footer.tsx`. No modificar.

---

## 3. Arquitectura de archivos

```
app/
├─ [locale]/
│  ├─ page.tsx                         ← NUEVO. Landing narrativa.
│  ├─ (public)/
│  │  ├─ page.tsx                      ← SE RETIRA (reemplazada por la anterior)
│  │  └─ layout.tsx                    ← se conserva (aplica data-area="public")
│  └─ ...
│
components/landing/
├─ index.ts                            ← barrel para import limpio
├─ landing-root.tsx                    ← shell server component
├─ sections/
│  ├─ opening.tsx                      ← §1  (server)
│  ├─ teaching.tsx                     ← §2  (client, usa IntersectionObserver)
│  ├─ chapter-haraigoshi.tsx           ← §3  (client, dynamic import)
│  ├─ chapter-haraigoshi-static.tsx    ← §3  (server, fallback)
│  ├─ method.tsx                       ← §4  (client para stagger reveal)
│  ├─ sites.tsx                        ← §5  (client para stagger reveal)
│  ├─ disciplines.tsx                  ← §6  (client para reveal)
│  ├─ trial.tsx                        ← §7  (client para SVG growing rule)
│  └─ family-portal-entry.tsx          ← §8  (server)
├─ motion/
│  ├─ use-haraigoshi-scroll.ts         ← hook wrapper de useScroll/useTransform
│  ├─ reveal-on-view.tsx               ← wrapper de fadeUp con IO (reducedMotion-aware)
│  └─ growing-rule.tsx                 ← línea SVG que crece con scroll local
├─ svg/
│  └─ haraigoshi-frames.tsx            ← componente que expone <Frame idx={0..4} /> con los 5 SVG inline
├─ data/
│  └─ sites.ts                         ← datos puros (slug, ciudad, polideportivo, days, i18n keys)
└─ structured-data.ts                  ← JSON-LD Organization + LocalBusiness x3

lib/
└─ i18n.ts                             ← MODIFICADO: añadir bloque landing.*

app/globals.css                        ← MODIFICADO: añadir --text-display-2xl

public/
└─ landing/haraigoshi/                 ← ya existe, assets listos
   ├─ frames/ (fuente raster, no servido públicamente — o sí, no estorba)
   └─ svg-a-clean/frame-0{1..5}.svg (committeados)
```

---

## 4. Componentes · responsabilidades

### `<LandingRoot />` (server)
Renderiza las 9 secciones en orden. No tiene lógica. Es la "maquetación" del layout vertical.

### `<Opening />` (server → client isla)
La isla que anima el `<h1>` es el único client boundary aquí — casi todo es RSC.

### `<Teaching />` (client)
Usa `<RevealOnView />`. El trazo SVG de transición vive dentro o se extrae a `<GrowingRule />` si se usa también en §7.

### `<ChapterHaraigoshi />` (client, dynamic)
```tsx
// app/[locale]/page.tsx
import dynamic from 'next/dynamic';
import { ChapterHaraigoshiStatic } from '@/components/landing/sections/chapter-haraigoshi-static';

const ChapterHaraigoshi = dynamic(
  () => import('@/components/landing/sections/chapter-haraigoshi'),
  { ssr: true, loading: () => <ChapterHaraigoshiStatic /> }
);
```

Con `ssr: true` el render inicial es el del componente pinned — pero como useScroll/useTransform no hacen nada hasta hidratar, lo que se pinta es el primer frame y los aforismos ocultos. Para garantizar que no hay CLS, el componente reserva la altura `220vh` desde el server.

### `<ChapterHaraigoshiStatic />` (server)
Rejilla con los 5 frames y los aforismos al lado. Se muestra cuando:
1. JS no se ha hidratado aún (loader).
2. `prefers-reduced-motion: reduce` (detectado dentro del componente cliente, que se re-renderiza en Static).
3. No hay JS (nunca se hidrata).

### `<HaraigoshiFrames idx={} />` (client, memo)
Renderiza los 5 SVG inline, cambiando `opacity` según `idx`. Los SVGs se leen en build-time via import:

```tsx
import frame1 from '@/public/landing/haraigoshi/svg-a-clean/frame-01.svg?raw';
// etc.
```

Requiere configurar `next.config.js` para que soporte el loader `?raw`. Si no, se hace lectura `readFileSync` en build de un archivo TS que exporta las 5 strings SVG como constantes (ver "Riesgos" §9).

### `<use-haraigoshi-scroll />` (hook)
```ts
export function useHaraigoshiScroll(ref: React.RefObject<HTMLElement>) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const frameIndex = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 0, 1, 2, 3, 4]);
  const moment1 = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const moment2 = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const moment3 = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const moment4 = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  return { scrollYProgress, frameIndex, moments: [moment1, moment2, moment3, moment4] };
}
```

### `<RevealOnView />` (client)
```tsx
<RevealOnView as="h2" delay={0}>Lo que enseñamos</RevealOnView>
```
Usa IntersectionObserver con `rootMargin: -10%` y `threshold: 0`. Una sola vez (disconnect tras trigger). Respeta `useReducedMotion()`.

### `<GrowingRule />` (client)
```tsx
<GrowingRule length="60%" thickness={1} />
```
SVG `<line>` con `pathLength=1` + `strokeDashoffset` animado entre 1 y 0 según scroll local.

---

## 5. i18n · claves nuevas

Se añaden bajo `copy.{eu|es}.landing.*`. Estructura:

```ts
landing: {
  opening: { brand, title, lede },
  teaching: { title, p1, p2 },
  haraigoshi: { title, moments: [{ eu, es, aforism }, ...] },
  method: { title, pillars: [{ title, body }, ...] },
  sites: { title, items: [{ slug, city, venue, schedule, linkLabel }, ...] },
  disciplines: { title, items: [{ name, description }, ...] },
  trial: { title, body, ctaEmail, ctaWhatsapp },
  familyPortal: { title, linkLedger, linkLogin },
}
```

Los textos literales se copian de `docs/landing-narrative.md` sin modificación.

---

## 6. Metadatos / SEO

- `metadata` export en `app/[locale]/page.tsx` con `title`, `description`, `openGraph`, `twitter`. Valores basados en la apertura + tagline de `lib/i18n.ts`.
- `generateStaticParams` para `eu` + `es`.
- JSON-LD en `<script type="application/ld+json" dangerouslySetInnerHTML>` — no usamos `next/script`, el JSON es estático:
  - 1× `Organization` (nombre Kodaore, logo `/logo-kodaore.png`, sameAs vacío salvo que el cliente dé redes).
  - 3× `LocalBusiness` (uno por sede), con `address`, `geo` si sabemos coordenadas (pendiente cliente), `telephone` (pendiente).
- Si faltan datos (teléfono, coordenadas), se omiten los campos — no se inventan ni se ponen placeholders.

---

## 7. Presupuestos medibles (criterios de aceptación Fase 4)

| Métrica | Umbral | Herramienta |
|---|---|---|
| Lighthouse Performance desktop | ≥ 95 | `chrome-devtools:performance_start_trace` + Lighthouse completo |
| Lighthouse Performance mobile | ≥ 90 | idem mobile |
| Lighthouse A11y | ≥ 95 | `lighthouse_audit` |
| Lighthouse BP | ≥ 95 | `lighthouse_audit` |
| Lighthouse SEO | ≥ 95 | `lighthouse_audit` |
| LCP desktop | < 1.5 s | performance trace |
| LCP mobile 4G | < 2.5 s | performance trace |
| CLS | **0** | performance trace |
| INP | < 150 ms | performance trace |
| JS transferido inicial | < 80 kb gz | Lighthouse audits `total-byte-weight` + filtro JS |
| SVG frames total | < 200 kb | `du -b public/landing/haraigoshi/svg-a-clean` |
| Sin JS: landing navegable | 100% del contenido visible | probar con Chrome `javascript.enabled=false` |
| Reduced motion: fallback estático visible | sin animación | DevTools emulation |
| Visual regression | match pixel baseline `docs/landing-baseline/screenshots/` | Playwright screenshot comparison |

Todos los umbrales son no negociables. Si uno cae, se arregla antes de cerrar Fase 4.

---

## 8. Plan de commits (atómicos)

Un commit por vertical, en este orden:

1. `feat(landing): assets haraigoshi + baseline Fase 0` — SVGs, frames, docs Fase 0.
2. `docs(landing): direction + plan Fase 1 y 2`.
3. `feat(landing): token display-2xl + i18n landing.*`.
4. `feat(landing): estructura components/landing/ + motion helpers`.
5. `feat(landing): secciones §1–§2 (opening + teaching)`.
6. `feat(landing): sección §3 haraigoshi con pinning + fallback estático`.
7. `feat(landing): secciones §4–§6 (method, sites, disciplines)`.
8. `feat(landing): secciones §7–§8 (trial + family portal entry)`.
9. `feat(landing): page.tsx nuevo + retirar home pública + JSON-LD`.
10. `test(landing): e2e Playwright + visual regression`.
11. `chore(landing): verificación Fase 4 + docs/landing-verification.md`.

---

## 9. Riesgos y plan B

### R1 · `?raw` SVG import no funciona en Next 15
Next 15 con App Router puede requerir configuración de Webpack para `?raw`. Plan B: exportar las strings SVG como constantes desde un fichero TS (`components/landing/svg/haraigoshi-data.ts`) generado por un script `scripts/build-haraigoshi-svg-constants.mjs`. Committearlo y regenerarlo si cambian los SVG. Añade ~150 kb al source pero el bundle final extrae los paths igual.

### R2 · Motion `useScroll` no dispara en server-rendered pinning
Si `useScroll` tarda en detectar el container tras la hidratación, el primer scroll ignora el progreso. Plan B: emitir un evento scroll dummy tras mount (`requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')))`).

### R3 · Safari iOS: pinning a tirones con momentum scroll
Síntoma típico: el sticky child "salta" al liberarse. Plan B si aparece: reducir altura del wrapper a `180vh` y bajar frames por pin de 5 a 3 (fusionar 01+02 y 04+05) en mobile. El contenido no se pierde porque la versión estática mostraría los 5 igual.

### R4 · Reduced-motion y no-JS chocan entre sí
Si intentamos que el componente server render el estático y el client lo reemplace, puede haber flash del server content antes del hidrato. Plan B: usar el componente server como "versión canónica" y hacer que el client solo active el pinning cuando:
1. `useReducedMotion() === false`
2. `IntersectionObserver.isIntersecting === true`
De lo contrario, el client no hace nada y el server content se mantiene.

### R5 · Budget <80 kb gz no se cumple
Framer Motion base en el bundle inicial es ~18 kb gz. Si Next + React + theme sobrepasa, aparecen dependencias que no esperábamos. Plan B: mover `<Teaching />`, `<Method />`, `<Sites />` a RSC puros y hacer `<RevealOnView />` una isla mínima; reducir chunks del dynamic del haraigoshi a lazy hard (`ssr: false`) si no se soluciona con RSC.

### R6 · Los SVG se renderizan con artefactos en Safari
Los SVG tienen fill-rule="evenodd". Si algún navegador antiguo no lo resuelve, aparecerían rellenos mal. Plan B: post-procesar los SVG para que cada curva esté en un `<path>` separado con fill nonzero — triplica el markup pero universal.

### R7 · robots.txt inválido penalizando SEO
Ya es baseline (score 92 por esto). Revisar `app/robots.txt` al hacer commit 10 y corregir si es quick win. Si no, nota para otra iteración.

---

## 10. Definition of Done (Fase 4 cerrada)

Checklist que paso antes de commitear el commit 11:

- [ ] Visual baseline Playwright eu/es × mobile/desktop, committeado en `docs/landing-verification/after/`.
- [ ] Vídeo de scroll completo grabado en los 4 casos (mp4 o webm corto).
- [ ] GIF del momento haraigoshi (≤3 s) para el README.
- [ ] Lighthouse Performance desktop ≥ 95 y mobile ≥ 90 (capturados JSON).
- [ ] Lighthouse A11y/BP/SEO ≥ 95.
- [ ] LCP desktop < 1.5 s y mobile < 2.5 s medidos con performance trace.
- [ ] CLS 0, INP < 150 ms.
- [ ] Bundle JS inicial < 80 kb gz, medido con `next build` + gzip.
- [ ] Probado con JS desactivado: landing completa visible, enlaces funcionan.
- [ ] Probado con `prefers-reduced-motion: reduce`: layout estático del haraigoshi se ve intencional.
- [ ] Probado en móvil real iPhone Safari (o emulación cercana).
- [ ] Tests Vitest verdes.
- [ ] Tests Playwright verdes.
- [ ] `npm run lint` sin warnings nuevos.
- [ ] `docs/landing-verification.md` escrito con antes/después y GIF embed.
