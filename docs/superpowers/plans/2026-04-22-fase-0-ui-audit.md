# Fase 0 — UI Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capturar baseline completo de UI y motion de Kodaore (screenshots, vídeos, Lighthouse, perf traces) y redactar `docs/ui-audit.md` en dos capas (foundations + route atlas) sin introducir ningún cambio de diseño.

**Architecture:** Captura automatizada con Playwright contra PM2 en `:3000`. Config y tests de captura aislados en `tests/audit/` y `playwright.audit.config.ts`. Métricas via `chrome-devtools` MCP (Lighthouse + perf traces). Artefactos bajo `.audit/baseline/...` (gitignored). Documento `docs/ui-audit.md` escrito a mano a partir de los artefactos.

**Tech Stack:** Playwright 1.59, Next.js 15 (App Router), PM2, `chrome-devtools` MCP, bash/node para orquestación.

**Spec:** `docs/superpowers/specs/2026-04-22-ui-audit-design.md`.

---

## File Structure

**Crear (commit 1 — scaffolding):**
- `playwright.audit.config.ts` — config Playwright independiente del de e2e, proyectos desktop y mobile, apunta a PM2.
- `tests/audit/_setup/login-admin.setup.ts` — genera `.audit/state/admin.json` con sesión de `admin.global`.
- `tests/audit/_setup/login-familia.setup.ts` — genera `.audit/state/familia.json` con sesión de familia.
- `tests/audit/_setup/auth-helpers.ts` — helpers compartidos (dismissInitialLoader, login).
- `tests/audit/screenshots.audit.spec.ts` — bucle de capturas principales y secundarias.
- `tests/audit/videos-flow-1-login-familia.audit.spec.ts` — flujo 1.
- `tests/audit/videos-flow-2-admin-nav.audit.spec.ts` — flujo 2.
- `tests/audit/videos-flow-3-modales.audit.spec.ts` — flujo 3.
- `tests/audit/videos-flow-4-form-validation.audit.spec.ts` — flujo 4.
- `scripts/run-audit-baseline.mjs` — orquestador: ejecuta Playwright, reorganiza artefactos en el layout final.
- `scripts/collect-build-info.mjs` — recopila `git rev-parse HEAD`, versiones de Next/React/Tailwind, fecha.

**Modificar (commit 1):**
- `.gitignore` — añadir `/.audit/` y `/playwright-audit-report/`.

**Crear (commit 2 — documento):**
- `docs/ui-audit.md` — documento final con capa 1 y capa 2.

**No se toca:** `prisma/schema.prisma`, `middleware.ts`, `lib/auth/*`, `lib/observability/*`, `lib/audit/*`, `lib/security/*`, `app/api/**`, envío de mail, `app/globals.css`, componentes existentes.

---

### Task 1: Preflight

Verifica que PM2 está up, que la password `Kodaore2026!` funciona, y que no hay login en proceso que bloquee la captura.

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Verificar que PM2 responde**

Run: `curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/eu`
Expected: `200`

- [ ] **Step 2: Verificar que NextAuth vive y que la página de login renderiza**

Run:
```bash
curl -sS http://127.0.0.1:3000/api/auth/csrf | head -c 200
echo
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/eu/acceso
```
Expected: el primer comando imprime un JSON con `csrfToken`, el segundo imprime `200`.

Nota: la verificación real del login con password se hace en Task 3 vía Playwright (genera el storageState). Si Task 3 falla con 401, inspeccionar `pm2 env 0 | grep SEED_DEFAULT_PASSWORD` por si hay override.

- [ ] **Step 3: Actualizar `.gitignore`**

Append al final:
```
# audit artifacts (Fase 0 UI rework)
/.audit/
/playwright-audit-report/
```

- [ ] **Step 4: Verificar que `.audit/` se ignora**

Run:
```bash
mkdir -p .audit/baseline && touch .audit/baseline/test.png && git check-ignore -v .audit/baseline/test.png && rm -rf .audit
```
Expected: output que muestra la regla que lo ignora.

- [ ] **Step 5: Commit parcial del `.gitignore`**

```bash
git add .gitignore
git commit -m "chore: ignorar artefactos del audit Fase 0"
```

---

### Task 2: Playwright audit config

Config independiente del de e2e, dos proyectos (mobile y desktop), apunta al PM2 existente.

**Files:**
- Create: `playwright.audit.config.ts`

- [ ] **Step 1: Crear el config**

Create `playwright.audit.config.ts`:
```ts
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.AUDIT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/audit",
  testMatch: /.*\.audit\.spec\.ts$/,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-audit-report" }]],
  outputDir: ".audit/raw",
  use: {
    baseURL,
    screenshot: "off",
    video: "off",
    trace: "off",
  },
  projects: [
    {
      name: "setup-admin",
      testMatch: /_setup\/login-admin\.setup\.ts/,
    },
    {
      name: "setup-familia",
      testMatch: /_setup\/login-familia\.setup\.ts/,
    },
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
      dependencies: ["setup-admin", "setup-familia"],
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["iPhone 14 Pro"],
      },
      dependencies: ["setup-admin", "setup-familia"],
    },
  ],
  webServer: {
    command: "echo 'using running PM2 on :3000'",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 5_000,
  },
});
```

- [ ] **Step 2: Verificar que Playwright parsea el config**

Run: `npx playwright test --config=playwright.audit.config.ts --list`
Expected: error esperado porque todavía no hay tests — debe decir "No tests found" o equivalente sin errores de TypeScript.

---

### Task 3: Auth helpers

Setup Playwright tests que producen `storageState` admin y familia en `.audit/state/`.

**Files:**
- Create: `tests/audit/_setup/auth-helpers.ts`
- Create: `tests/audit/_setup/login-admin.setup.ts`
- Create: `tests/audit/_setup/login-familia.setup.ts`

- [ ] **Step 1: Crear helpers compartidos**

Create `tests/audit/_setup/auth-helpers.ts`:
```ts
import { expect, type Page } from "@playwright/test";

export const AUDIT_PASSWORD = process.env.AUDIT_PASSWORD ?? "Kodaore2026!";

export async function dismissInitialLoader(page: Page) {
  const loader = page.locator(".kodaore-loader");
  if ((await loader.count()) === 0) return;
  await page.mouse.wheel(0, 2000);
  await page.mouse.wheel(0, 2000);
  await expect(loader).toHaveCount(0, { timeout: 10_000 });
}

export async function login(page: Page, identifier: string, password: string) {
  await page.goto("/eu/acceso");
  await dismissInitialLoader(page);
  await page.locator('input[autocomplete="username"]').fill(identifier);
  await page.locator('input[autocomplete="current-password"]').fill(password);
  await page.getByRole("button", { name: /sartu|entrar/i }).click();
}
```

- [ ] **Step 2: Crear login-admin.setup.ts**

Create `tests/audit/_setup/login-admin.setup.ts`:
```ts
import { expect, test as setup } from "@playwright/test";
import { AUDIT_PASSWORD, login } from "./auth-helpers";

const ADMIN_STATE = ".audit/state/admin.json";

setup("autenticar como admin.global", async ({ page }) => {
  await login(page, "admin.global", AUDIT_PASSWORD);
  await expect(page).toHaveURL(/\/eu\/admin$/, { timeout: 15_000 });
  await page.context().storageState({ path: ADMIN_STATE });
});
```

- [ ] **Step 3: Crear login-familia.setup.ts**

Create `tests/audit/_setup/login-familia.setup.ts`:
```ts
import { expect, test as setup } from "@playwright/test";
import { AUDIT_PASSWORD, login } from "./auth-helpers";

const FAMILIA_STATE = ".audit/state/familia.json";

setup("autenticar como familia tutora", async ({ page }) => {
  await login(page, "familia@kodaore.eus", AUDIT_PASSWORD);
  await expect(page).toHaveURL(/\/eu\/portal$/, { timeout: 15_000 });
  await page.context().storageState({ path: FAMILIA_STATE });
});
```

- [ ] **Step 4: Crear el directorio de state y ejecutar los setups**

Run:
```bash
mkdir -p .audit/state
npx playwright test --config=playwright.audit.config.ts --project=setup-admin --project=setup-familia
```
Expected: 2 passed. Verifica output:
```bash
ls -la .audit/state/
```
Expected: `admin.json` y `familia.json` existen, pesan >500 bytes cada uno.

- [ ] **Step 5: No commit todavía** (commit conjunto al final del scaffolding, Task 11)

---

### Task 4: Screenshot capture — principales

Bucle que visita las 15 rutas principales en cada proyecto (mobile+desktop) y cada locale (eu+es), tomando screenshot top + full.

**Files:**
- Create: `tests/audit/screenshots.audit.spec.ts`

- [ ] **Step 1: Crear la spec de screenshots**

Create `tests/audit/screenshots.audit.spec.ts`:
```ts
import path from "node:path";
import { test, type Page } from "@playwright/test";
import { dismissInitialLoader } from "./_setup/auth-helpers";

type RouteSpec = { slug: string; path: string };

const PUBLIC_PRINCIPALS: RouteSpec[] = [
  { slug: "home", path: "/" },
  { slug: "sedes", path: "/sedes" },
  { slug: "sedes__azkoitia", path: "/sedes/azkoitia" },
  { slug: "fototeca", path: "/fototeca" },
  { slug: "erropak", path: "/erropak" },
  { slug: "acceso", path: "/acceso" },
  { slug: "acceso__crear-cuenta", path: "/acceso/crear-cuenta" },
];
const ADMIN_PRINCIPALS: RouteSpec[] = [
  { slug: "admin", path: "/admin" },
  { slug: "admin__students", path: "/admin/students" },
  { slug: "admin__groups", path: "/admin/groups" },
  { slug: "admin__billing", path: "/admin/billing" },
];
const FAMILIA_PRINCIPALS: RouteSpec[] = [
  { slug: "portal", path: "/portal" },
  { slug: "portal__profile", path: "/portal/profile" },
  { slug: "portal__payments", path: "/portal/payments" },
  { slug: "portal__messages", path: "/portal/messages" },
];
const SECONDARY: RouteSpec[] = [
  { slug: "sedes__azpeitia", path: "/sedes/azpeitia" },
  { slug: "sedes__zumaia", path: "/sedes/zumaia" },
  { slug: "legal__terms", path: "/legal/terms" },
  { slug: "legal__privacy", path: "/legal/privacy" },
];

const LOCALES = ["eu", "es"] as const;

function viewportKind() {
  const n = test.info().project.name;
  if (n === "chromium-desktop") return "desktop";
  if (n === "chromium-mobile") return "mobile";
  throw new Error(`Unexpected project: ${n}`);
}

async function gotoAndSettle(page: Page, url: string) {
  await page.goto(url, { waitUntil: "networkidle" });
  await dismissInitialLoader(page);
  // Deja que fade-rise/fade-reveal-left terminen (0.65s + delays hasta 500ms).
  await page.waitForTimeout(1500);
}

async function capture(page: Page, spec: RouteSpec, locale: (typeof LOCALES)[number], full: boolean) {
  const url = `/${locale}${spec.path === "/" ? "" : spec.path}`;
  const destDir = path.join(".audit/baseline", spec.slug, viewportKind(), locale);
  await gotoAndSettle(page, url);
  await page.screenshot({ path: path.join(destDir, "top.png"), fullPage: false });
  if (full) {
    await page.screenshot({ path: path.join(destDir, "full.png"), fullPage: true });
  }
}

test.describe.serial("principales públicas", () => {
  for (const spec of PUBLIC_PRINCIPALS) {
    for (const locale of LOCALES) {
      test(`${spec.slug} · ${locale}`, async ({ page }) => {
        await capture(page, spec, locale, true);
      });
    }
  }
});

test.describe.serial("principales admin", () => {
  test.use({ storageState: ".audit/state/admin.json" });
  for (const spec of ADMIN_PRINCIPALS) {
    for (const locale of LOCALES) {
      test(`${spec.slug} · ${locale}`, async ({ page }) => {
        await capture(page, spec, locale, true);
      });
    }
  }
});

test.describe.serial("principales familia", () => {
  test.use({ storageState: ".audit/state/familia.json" });
  for (const spec of FAMILIA_PRINCIPALS) {
    for (const locale of LOCALES) {
      test(`${spec.slug} · ${locale}`, async ({ page }) => {
        await capture(page, spec, locale, true);
      });
    }
  }
});

test.describe.serial("secundarios", () => {
  test.skip(({}, info) => info.project.name !== "chromium-desktop", "solo desktop");
  for (const spec of SECONDARY) {
    test(`${spec.slug} · eu`, async ({ page }) => {
      await capture(page, spec, "eu", false);
    });
  }
});
```

- [ ] **Step 2: Ejecutar solo el bloque de públicas en desktop para verificar flujo**

Run:
```bash
npx playwright test --config=playwright.audit.config.ts --project=chromium-desktop \
  -g "home · eu|acceso · eu|fototeca · eu" 2>&1 | tail -30
```
Expected: 3 tests pasan. Verifica:
```bash
ls .audit/baseline/home/desktop/eu/
```
Expected: `top.png` y `full.png`.

- [ ] **Step 3: Si funciona, ejecutar la suite completa**

Run:
```bash
npx playwright test --config=playwright.audit.config.ts --project=chromium-desktop --project=chromium-mobile
```
Expected: `setup-admin` + `setup-familia` + (15 principales × 2 locales × 2 proyectos) + (4 secundarios × 1 proyecto) = 2 + 60 + 4 = **66 tests pasados**.

Tiempo esperado: 8–15 min.

- [ ] **Step 4: Verificar conteo de screenshots producidos**

Run: `find .audit/baseline -name "*.png" | wc -l`
Expected: `124` (120 principales + 4 secundarios).

- [ ] **Step 5: Sin commit todavía** (comparte commit con Task 11).

---

### Task 5: Video — flujo 1 (login familia, mobile, eu)

**Files:**
- Create: `tests/audit/videos-flow-1-login-familia.audit.spec.ts`

- [ ] **Step 1: Crear la spec**

Create `tests/audit/videos-flow-1-login-familia.audit.spec.ts`:
```ts
import path from "node:path";
import fs from "node:fs/promises";
import { test, expect } from "@playwright/test";
import { AUDIT_PASSWORD, dismissInitialLoader } from "./_setup/auth-helpers";

test.use({ video: { mode: "on", size: { width: 390, height: 844 } } });

test.skip(({}, info) => info.project.name !== "chromium-mobile", "flujo 1 solo en mobile");

test("flujo 1 · login familia (mobile eu)", async ({ page }) => {
  await page.goto("/eu/acceso");
  await dismissInitialLoader(page);
  await page.locator('input[autocomplete="username"]').fill("familia@kodaore.eus");
  await page.locator('input[autocomplete="current-password"]').fill(AUDIT_PASSWORD);
  await Promise.all([
    page.waitForURL(/\/eu\/portal$/, { timeout: 15_000 }),
    page.getByRole("button", { name: /sartu|entrar/i }).click(),
  ]);
  await expect(page.getByRole("heading", { name: /familia eta ikasleen ataria|portal de familias/i })).toBeVisible();
  // Allow route-motion + portal first paint to finish on camera.
  await page.waitForTimeout(1500);
});

test.afterAll(async () => {
  const raw = ".audit/raw";
  const dest = ".audit/baseline/videos/flujo-1-login-familia.webm";
  await fs.mkdir(path.dirname(dest), { recursive: true });
  const walk = async (dir: string): Promise<string[]> => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const out: string[] = [];
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) out.push(...(await walk(full)));
      else if (e.name.endsWith(".webm")) out.push(full);
    }
    return out;
  };
  const webms = await walk(raw).catch(() => []);
  if (webms.length === 0) throw new Error("No se encontró vídeo en .audit/raw");
  // El orquestador (scripts/run-audit-baseline.mjs) se encarga del renombrado global;
  // aquí solo copiamos el más reciente como seguro.
  const latest = webms.sort().at(-1)!;
  await fs.copyFile(latest, dest);
});
```

- [ ] **Step 2: Ejecutar**

Run:
```bash
npx playwright test --config=playwright.audit.config.ts --project=chromium-mobile videos-flow-1-login-familia
```
Expected: 1 pasado. Verifica: `ls .audit/baseline/videos/flujo-1-login-familia.webm`.

---

### Task 6: Video — flujo 2 (navegación admin, desktop, eu)

**Files:**
- Create: `tests/audit/videos-flow-2-admin-nav.audit.spec.ts`

- [ ] **Step 1: Crear la spec**

Create `tests/audit/videos-flow-2-admin-nav.audit.spec.ts`:
```ts
import path from "node:path";
import fs from "node:fs/promises";
import { test, expect } from "@playwright/test";
import { dismissInitialLoader } from "./_setup/auth-helpers";

test.use({
  video: { mode: "on", size: { width: 1440, height: 900 } },
  storageState: ".audit/state/admin.json",
});

test.skip(({}, info) => info.project.name !== "chromium-desktop", "flujo 2 solo en desktop");

test("flujo 2 · navegación admin (desktop eu)", async ({ page }) => {
  await page.goto("/eu/admin");
  await dismissInitialLoader(page);
  await expect(page.getByRole("heading", { name: /kodaore backoffice/i })).toBeVisible();
  await page.waitForTimeout(800);

  await page.goto("/eu/admin/students");
  await expect(page.getByRole("heading", { name: /ikasleen administrazioa/i })).toBeVisible();
  await page.waitForTimeout(800);

  // hover sobre una fila si existe
  const firstRow = page.locator("tbody tr").first();
  if (await firstRow.count()) {
    await firstRow.hover();
    await page.waitForTimeout(600);
  }

  await page.goto("/eu/admin");
  await expect(page.getByRole("heading", { name: /kodaore backoffice/i })).toBeVisible();
  await page.waitForTimeout(500);

  await page.goto("/eu/admin/groups");
  await expect(page.getByRole("heading", { name: /taldeen administrazioa/i })).toBeVisible();
  await page.waitForTimeout(800);

  await page.goto("/eu/admin/billing");
  await expect(page.getByRole("heading", { name: /kobrantzen administrazioa/i })).toBeVisible();
  await page.waitForTimeout(1200);
});

test.afterAll(async () => {
  const dest = ".audit/baseline/videos/flujo-2-admin-nav.webm";
  await fs.mkdir(path.dirname(dest), { recursive: true });
});
```

- [ ] **Step 2: Ejecutar**

Run:
```bash
npx playwright test --config=playwright.audit.config.ts --project=chromium-desktop videos-flow-2-admin-nav
```
Expected: 1 pasado.

---

### Task 7: Video — flujo 3 (modales admin, desktop, eu)

Antes de grabar, identifica qué modales reales existen en admin.

**Files:**
- Create: `tests/audit/videos-flow-3-modales.audit.spec.ts`

- [ ] **Step 1: Identificar modales reales**

Run:
```bash
grep -rEn "role=\"dialog\"|Dialog\b|Modal\b|aria-modal" /home/avanzosc/kodaore_system/app /home/avanzosc/kodaore_system/components 2>/dev/null | head -30
```
Apunta los resultados. Si no hay dialogs/modales propios, usa el primer botón de acción que abra un formulario en overlay. Si tampoco existe, graba la apertura de un `<details>`, un dropdown del header o la acción "exportar" de una tabla — y anótalo en el audit como "no hay modales nativos, se graba el overlay más cercano".

- [ ] **Step 2: Crear la spec (plantilla — ajustar el selector del paso 3 según hallazgo del Step 1)**

Create `tests/audit/videos-flow-3-modales.audit.spec.ts`:
```ts
import fs from "node:fs/promises";
import { test, expect } from "@playwright/test";
import { dismissInitialLoader } from "./_setup/auth-helpers";

test.use({
  video: { mode: "on", size: { width: 1440, height: 900 } },
  storageState: ".audit/state/admin.json",
});

test.skip(({}, info) => info.project.name !== "chromium-desktop", "flujo 3 solo en desktop");

test("flujo 3 · apertura de overlays admin", async ({ page }) => {
  await page.goto("/eu/admin/students");
  await dismissInitialLoader(page);
  await expect(page.getByRole("heading", { name: /ikasleen administrazioa/i })).toBeVisible();
  await page.waitForTimeout(500);

  // AJUSTAR tras Step 1: selector del trigger del primer overlay/modal/dropdown.
  // Ejemplo si es un botón de acción en la primera fila:
  const trigger = page.locator("tbody tr").first().getByRole("button").first();
  if (await trigger.count()) {
    await trigger.hover();
    await page.waitForTimeout(400);
    await trigger.click();
    await page.waitForTimeout(1200);
    // Cierre con Escape — funciona para dialog y dropdowns.
    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);
  } else {
    // Fallback: grabar el menú de locale del header.
    const localeSwitcher = page.getByRole("button", { name: /es|eu/i }).first();
    if (await localeSwitcher.count()) {
      await localeSwitcher.click();
      await page.waitForTimeout(800);
      await page.keyboard.press("Escape");
    }
  }
});

test.afterAll(async () => {
  await fs.mkdir(".audit/baseline/videos", { recursive: true });
});
```

- [ ] **Step 3: Ejecutar**

Run:
```bash
npx playwright test --config=playwright.audit.config.ts --project=chromium-desktop videos-flow-3-modales
```
Expected: 1 pasado. Anota en un post-it mental (para el audit) si se usó el path principal o el fallback.

---

### Task 8: Video — flujo 4 (submit de form con validación, desktop, es)

**Files:**
- Create: `tests/audit/videos-flow-4-form-validation.audit.spec.ts`

- [ ] **Step 1: Inspeccionar el form de crear-cuenta**

Run:
```bash
grep -n "autocomplete\|name=\|zod\|errors" /home/avanzosc/kodaore_system/components/auth-signup-form.tsx | head -30
```
Apunta los nombres de campos y el selector del botón de submit.

- [ ] **Step 2: Crear la spec (ajustar selectores según Step 1)**

Create `tests/audit/videos-flow-4-form-validation.audit.spec.ts`:
```ts
import fs from "node:fs/promises";
import { test, expect } from "@playwright/test";
import { dismissInitialLoader } from "./_setup/auth-helpers";

test.use({ video: { mode: "on", size: { width: 1440, height: 900 } } });

test.skip(({}, info) => info.project.name !== "chromium-desktop", "flujo 4 solo en desktop");

test("flujo 4 · submit con validación (desktop es)", async ({ page }) => {
  await page.goto("/es/acceso/crear-cuenta");
  await dismissInitialLoader(page);
  await page.waitForTimeout(600);

  // Primer intento: campos inválidos (email mal formado, password corta)
  const email = page.locator('input[type="email"]').first();
  const password = page.locator('input[type="password"]').first();
  const submit = page.getByRole("button", { name: /crear|sortu|registrar/i }).first();

  await email.fill("no-es-un-email");
  await password.fill("123");
  await submit.click();
  // Observar la animación/feedback de error
  await page.waitForTimeout(1800);

  // Corrección: email válido, password razonable
  await email.fill("");
  await email.type("nuevo.familia+audit@ejemplo.test", { delay: 30 });
  await password.fill("");
  await password.type("Kodaore2026!", { delay: 30 });
  await page.waitForTimeout(800);

  // NO clicamos submit para no crear cuenta real en la DB; paramos aquí.
  // El vídeo cubre el ciclo error → corrección, que es lo que importa del motion.
});

test.afterAll(async () => {
  await fs.mkdir(".audit/baseline/videos", { recursive: true });
});
```

- [ ] **Step 3: Ejecutar**

Run:
```bash
npx playwright test --config=playwright.audit.config.ts --project=chromium-desktop videos-flow-4-form-validation
```
Expected: 1 pasado.

---

### Task 9: Orquestador `run-audit-baseline.mjs`

Reorganiza los `.webm` dispersos en `.audit/raw/**` al layout canónico `.audit/baseline/videos/flujo-N-*.webm` y ejecuta todas las specs en orden.

**Files:**
- Create: `scripts/run-audit-baseline.mjs`

- [ ] **Step 1: Crear el script**

Create `scripts/run-audit-baseline.mjs`:
```js
#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const log = (msg) => console.log(`[audit] ${msg}`);

async function rimraf(p) {
  await fs.rm(p, { recursive: true, force: true });
}

async function walk(dir, match) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full, match)));
    else if (match(full)) out.push(full);
  }
  return out;
}

async function reorganizeVideos() {
  const raw = ".audit/raw";
  const webms = await walk(raw, (p) => p.endsWith(".webm"));
  const mapping = [
    { needle: "flujo-1-login-familia", dest: ".audit/baseline/videos/flujo-1-login-familia.webm" },
    { needle: "flujo-2-admin-nav", dest: ".audit/baseline/videos/flujo-2-admin-nav.webm" },
    { needle: "flujo-3-modales", dest: ".audit/baseline/videos/flujo-3-modales.webm" },
    { needle: "flujo-4-form-validation", dest: ".audit/baseline/videos/flujo-4-form-validation.webm" },
  ];
  await fs.mkdir(".audit/baseline/videos", { recursive: true });
  for (const m of mapping) {
    const match = webms.find((w) => w.includes(m.needle));
    if (match) {
      await fs.copyFile(match, m.dest);
      log(`video ${path.basename(m.dest)} OK`);
    } else {
      log(`AVISO: no hay vídeo para ${m.needle}`);
    }
  }
}

async function main() {
  log("limpieza previa");
  await rimraf(".audit/raw");
  await rimraf("playwright-audit-report");

  log("setups de auth");
  execSync(
    "npx playwright test --config=playwright.audit.config.ts --project=setup-admin --project=setup-familia",
    { stdio: "inherit" },
  );

  log("screenshots (desktop + mobile)");
  execSync(
    "npx playwright test --config=playwright.audit.config.ts --project=chromium-desktop --project=chromium-mobile screenshots",
    { stdio: "inherit" },
  );

  log("vídeos — flujo 1 (mobile)");
  execSync(
    "npx playwright test --config=playwright.audit.config.ts --project=chromium-mobile videos-flow-1-login-familia",
    { stdio: "inherit" },
  );
  log("vídeos — flujo 2 (desktop)");
  execSync(
    "npx playwright test --config=playwright.audit.config.ts --project=chromium-desktop videos-flow-2-admin-nav",
    { stdio: "inherit" },
  );
  log("vídeos — flujo 3 (desktop)");
  execSync(
    "npx playwright test --config=playwright.audit.config.ts --project=chromium-desktop videos-flow-3-modales",
    { stdio: "inherit" },
  );
  log("vídeos — flujo 4 (desktop)");
  execSync(
    "npx playwright test --config=playwright.audit.config.ts --project=chromium-desktop videos-flow-4-form-validation",
    { stdio: "inherit" },
  );

  log("reorganización de vídeos");
  await reorganizeVideos();

  log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Añadir npm script**

Edit `package.json` `scripts` section, add:
```json
"audit:baseline": "node scripts/run-audit-baseline.mjs"
```

- [ ] **Step 3: Ejecutar end-to-end**

Run: `npm run audit:baseline 2>&1 | tee /tmp/audit-run.log`
Expected: 2 setups + 66 screenshots + 4 videos, sin fallos. Tiempo 15–25 min.

- [ ] **Step 4: Verificar inventario final de artefactos**

Run:
```bash
find .audit/baseline -name "*.png" | wc -l
find .audit/baseline -name "*.webm" | wc -l
ls .audit/baseline/videos/
```
Expected: `124` png, `4` webm, los cuatro ficheros `flujo-N-*.webm` existen.

---

### Task 10: Build info

**Files:**
- Create: `scripts/collect-build-info.mjs`

- [ ] **Step 1: Crear el script**

Create `scripts/collect-build-info.mjs`:
```js
#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const pkg = JSON.parse(await fs.readFile("package.json", "utf8"));
const headSha = execSync("git rev-parse HEAD").toString().trim();
const headDate = execSync("git log -1 --format=%cI HEAD").toString().trim();
const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

const info = {
  capturedAt: new Date().toISOString(),
  git: { sha: headSha, branch, lastCommitAt: headDate },
  runtime: {
    next: pkg.dependencies.next,
    react: pkg.dependencies.react,
    tailwindcss: pkg.devDependencies.tailwindcss,
    playwright: pkg.devDependencies["@playwright/test"],
  },
};

await fs.mkdir(".audit/baseline", { recursive: true });
await fs.writeFile(path.join(".audit/baseline/build-info.json"), JSON.stringify(info, null, 2));
console.log(info);
```

- [ ] **Step 2: Añadir npm script**

Edit `package.json` `scripts`, add:
```json
"audit:build-info": "node scripts/collect-build-info.mjs"
```

- [ ] **Step 3: Ejecutar**

Run: `npm run audit:build-info`
Expected: print del JSON + fichero `.audit/baseline/build-info.json`.

---

### Task 11: Commit de scaffolding + artefactos iniciales

Los artefactos NO se commitean (están en `.gitignore`). Solo el código.

- [ ] **Step 1: Revisar qué va al commit**

Run:
```bash
git status --short
git diff --stat
```
Verifica que NO aparecen `.audit/`, `playwright-audit-report/`, ni los `storageState`. Solo aparecen los ficheros creados en Tasks 2–10 y la modificación de `package.json`.

- [ ] **Step 2: Commit**

```bash
git add playwright.audit.config.ts tests/audit scripts/run-audit-baseline.mjs scripts/collect-build-info.mjs package.json
git commit -m "$(cat <<'EOF'
feat(audit): scaffold de captura para Fase 0

Playwright config independiente, login helpers de admin y familia vía
storageState, bucle de screenshots (15 principales + 4 secundarias) y
4 flujos grabados en vídeo. Orquestador npm run audit:baseline. No
cambia código de producción.
EOF
)"
```

- [ ] **Step 3: Verificar**

Run: `git log --oneline -3`
Expected: top commit es el nuevo; el anterior es el commit del spec; el de más abajo es el `.gitignore`.

---

### Task 12: Lighthouse — rutas públicas

Lighthouse desktop + mobile sobre las rutas públicas, via `chrome-devtools:lighthouse_audit` MCP.

- [ ] **Step 1: Preparar directorio**

Run: `mkdir -p .audit/baseline/lighthouse`

- [ ] **Step 2: Ejecutar Lighthouse en `/eu` desktop**

Call MCP: `mcp__chrome-devtools__lighthouse_audit` con:
```json
{
  "url": "http://127.0.0.1:3000/eu",
  "device": "desktop",
  "categories": ["performance", "accessibility", "best-practices", "seo"]
}
```
Guardar el JSON devuelto a `.audit/baseline/lighthouse/home/desktop.json` y el HTML a `.audit/baseline/lighthouse/home/desktop.html`.

- [ ] **Step 3: Repetir para las otras 5 rutas públicas × 2 viewports**

Rutas: `/eu`, `/eu/acceso`, `/eu/admin/students`, `/eu/admin/billing`, `/eu/portal/profile`, `/eu/portal/payments`.
Viewports: `desktop`, `mobile`.

Para las rutas autenticadas (admin/portal) seguir a Task 13 si el MCP no acepta cookies. Solo las dos públicas de esta lista (`/eu`, `/eu/acceso`) se completan en este task.

Estructura de salida (por ruta autenticada pendiente):
```
.audit/baseline/lighthouse/home/{desktop,mobile}.{json,html}
.audit/baseline/lighthouse/acceso/{desktop,mobile}.{json,html}
```

- [ ] **Step 4: Verificar scores principales**

Run:
```bash
for f in .audit/baseline/lighthouse/*/desktop.json; do
  node -e "const d=require('./$f'); const cats=d.categories; console.log('$f', 'perf='+Math.round(cats.performance.score*100), 'a11y='+Math.round(cats.accessibility.score*100), 'bp='+Math.round(cats['best-practices'].score*100), 'seo='+Math.round(cats.seo.score*100))"
done
```
Expected: una línea por ruta con los 4 scores.

---

### Task 13: Lighthouse — rutas autenticadas (con fallback)

- [ ] **Step 1: Probar Lighthouse MCP con cookies exportadas**

Exporta cookies de `admin.global` a un JSON que el MCP pueda leer. Si el MCP `lighthouse_audit` acepta un parámetro `extraHeaders` o `cookies`, pasárselas.

Run para generar header:
```bash
node -e '
const s = require("./.audit/state/admin.json");
const cookies = s.cookies.filter(c => c.domain.includes("127.0.0.1") || c.domain.includes("localhost"));
const header = cookies.map(c => `${c.name}=${c.value}`).join("; ");
console.log(header);
'
```

Si el MCP acepta cookie header: repetir el protocolo de Task 12 Steps 2–3 para `/eu/admin/students`, `/eu/admin/billing`, `/eu/portal/profile`, `/eu/portal/payments` × `desktop` + `mobile` con la cabecera `Cookie` adjunta.

- [ ] **Step 2: Si el MCP no acepta cookies, fallback explícito**

Anotar en el audit: "Lighthouse autenticado no se pudo ejecutar; LCP/CLS/INP de admin y portal se miden vía perf trace (ver 3.4 del spec)". Saltar directamente a Task 14.

- [ ] **Step 3: Verificar**

Run:
```bash
ls .audit/baseline/lighthouse/
```
Expected: si funcionó la autenticada, 6 subdirectorios (home, acceso, admin__students, admin__billing, portal__profile, portal__payments), cada uno con 2 ficheros JSON + 2 HTML. Si no, solo `home` y `acceso`.

---

### Task 14: Perf traces — 4 rutas × 2 viewports

Traces CDP via `chrome-devtools:performance_start_trace` + `performance_stop_trace` + `performance_analyze_insight`.

Rutas: `/eu` (home), `/eu/acceso`, `/eu/admin/students` (storageState admin), `/eu/portal/payments` (storageState familia).

- [ ] **Step 1: Preparar directorio**

Run: `mkdir -p .audit/baseline/perf`

- [ ] **Step 2: Trace `/eu` desktop (incluye warmup)**

Protocolo por trace (spec §5.5 — primera visita warmup, segunda visita la que mide):
1. `mcp__chrome-devtools__new_page` con viewport 1440×900.
2. **Warmup**: `mcp__chrome-devtools__navigate_page` a `http://127.0.0.1:3000/eu` + esperar `networkidle` + `wait_for` 1.5s para que cachee SSR, Prisma y chunks de Next.
3. `mcp__chrome-devtools__performance_start_trace`.
4. `mcp__chrome-devtools__navigate_page` otra vez a la misma URL (segunda visita, medida). En Next, esta carga usa chunks ya en caché pero ejecuta server render; es la que refleja el estado real tras idle.
5. Esperar carga + scrollear al final + hacer un hover sobre un card con `.k-hover-lift`.
6. `mcp__chrome-devtools__performance_stop_trace` → guardar en `.audit/baseline/perf/home-desktop.json`.
7. `mcp__chrome-devtools__performance_analyze_insight` para extraer: LCP (ms), INP (ms), CLS, long tasks (count, total ms), frames dropped (%).
8. Guardar el resumen numérico en `.audit/baseline/perf/home-desktop.summary.json`.
9. `mcp__chrome-devtools__close_page`.

- [ ] **Step 3: Repetir el protocolo en las otras 7 combinaciones**

`home-mobile` (390×844), `acceso-desktop`, `acceso-mobile`, `admin-students-desktop` (con cookies admin), `admin-students-mobile`, `portal-payments-desktop` (con cookies familia), `portal-payments-mobile`.

Para rutas autenticadas: setear las cookies del storageState correspondiente vía `mcp__chrome-devtools__evaluate_script` antes del `navigate_page` (inyección de `document.cookie`), o si el MCP expone un parámetro de contexto, usarlo.

- [ ] **Step 4: Verificar output**

Run: `ls .audit/baseline/perf/ | wc -l`
Expected: `16` (8 traces + 8 summaries).

Run: `find .audit/baseline/perf -name "*.summary.json" -exec cat {} +`
Expected: 8 JSON con las métricas LCP, INP, CLS, longTasks, framesDropped.

---

### Task 15: Scaffold del documento `docs/ui-audit.md`

Crear el esqueleto con todas las secciones vacías para que las tasks siguientes las rellenen en orden.

**Files:**
- Create: `docs/ui-audit.md`

- [ ] **Step 1: Crear el esqueleto**

Create `docs/ui-audit.md`:
```markdown
# Audit UI y motion — Fase 0

<!-- Rellenar tras Task 10: build-info.json -->
- Commit capturado: `<sha>` (`<branch>`)
- Fecha: `<ISO>`
- Runtime: Next `<v>`, React `<v>`, Tailwind `<v>`, Playwright `<v>`
- Servidor medido: PM2 en `:3000` (build producción).

> Documento descriptivo, no prescriptivo. Las decisiones de rediseño están en Fase 1.

## Capa 1 — Foundations as-is

### 1.1 Tokens

<!-- Task 16 -->

### 1.2 Tipografía

<!-- Task 17 -->

### 1.3 Paleta efectiva

<!-- Task 18 -->

### 1.4 Componentes — catalog shallow

<!-- Task 19 -->

### 1.5 Inventario de motion

<!-- Task 20 -->

### 1.6 Diagnóstico global

<!-- Task 21 -->

## Capa 2 — Route atlas

<!-- Task 22: 15 principales -->
<!-- Task 23: 4 secundarias -->
```

- [ ] **Step 2: Rellenar el bloque de cabecera con datos reales de `build-info.json`**

Sustituir placeholders `<sha>`, `<branch>`, `<ISO>`, `<v>` con los valores de `.audit/baseline/build-info.json`.

---

### Task 16: Capa 1.1 — Tokens

- [ ] **Step 1: Recolectar tokens**

Run:
```bash
grep -E "^\s*--[a-z]" /home/avanzosc/kodaore_system/app/globals.css | sort -u
```
Apunta los 10 tokens definidos en `:root`.

- [ ] **Step 2: Recolectar uso real por token**

Para cada token, run:
```bash
grep -rn "bg-brand\|text-brand\|border-brand" /home/avanzosc/kodaore_system/app /home/avanzosc/kodaore_system/components | wc -l
```
Repetir con cada nombre (`surface`, `surface-strong`, `foreground`, `ink-muted`, `background`, `brand-emphasis`, `brand-contrast`, `brand-warm`, `danger`). Apunta el conteo.

- [ ] **Step 3: Escribir la sección**

Sustituir el placeholder de 1.1 por una tabla:

```markdown
### 1.1 Tokens

Tokens declarados en `app/globals.css` y expuestos a Tailwind vía `@theme inline`.

| Token | Valor | Usos (grep) | Rol observado | Huecos detectados |
|---|---|---|---|---|
| `--background` | `#08090a` | N | Fondo global único | — |
| `--foreground` | `#f8fafc` | N | Texto principal | — |
| `--ink-muted` | `#94a3b8` | N | Texto secundario | Sin escala intermedia |
| `--surface` | `#111827` | N | Tarjetas | Sin `surface-subtle` ni `surface-elevated` |
| `--surface-strong` | `#1f2937` | N | Superficies con peso | — |
| `--brand` | `#be123c` | N | Acciones primarias | — |
| `--brand-emphasis` | `#f43f5e` | N | Hover/focus brand | — |
| `--brand-contrast` | `#ffffff` | N | Texto sobre brand | — |
| `--brand-warm` | `#059669` | N | Acento secundario | Único color "warm" |
| `--danger` | `#8a2020` | N | Error | Sin success / warning / info |

**Huecos globales:**
- No hay tokens para `success`, `warning`, `info`.
- No hay escala de grises más allá de `ink-muted`.
- No hay tokens de `radius`, `shadow` ni `spacing` nombrados; se usan valores ad-hoc.
- No hay niveles de superficie intermedios (`surface-subtle`, `surface-elevated`).
```

---

### Task 17: Capa 1.2 — Tipografía

- [ ] **Step 1: Localizar configuración de fuentes**

Run:
```bash
grep -n "font-sans\|font-heading\|Manrope\|Space_Grotesk\|next/font" /home/avanzosc/kodaore_system/app/layout.tsx /home/avanzosc/kodaore_system/app/globals.css
```
Apunta cómo se cargan.

- [ ] **Step 2: Recolectar uso de clases de texto**

Run:
```bash
grep -rEho "text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|\[[^]]+\])" /home/avanzosc/kodaore_system/app /home/avanzosc/kodaore_system/components | sort | uniq -c | sort -rn
```
Apunta top 15.

Run:
```bash
grep -rEho "font-(normal|medium|semibold|bold|heading|sans)" /home/avanzosc/kodaore_system/app /home/avanzosc/kodaore_system/components | sort | uniq -c | sort -rn
```
Apunta top 10.

- [ ] **Step 3: Recolectar longitudes eu vs es de claves i18n**

Run:
```bash
ls /home/avanzosc/kodaore_system/docs/ | grep i18n
```
Si existe `docs/textos-ui-inventario.md` o `docs/textos-ui-traduccion-*.md`, leerlo y extraer 6–8 pares (título/CTA) con longitud de caracteres y ratio eu/es.

- [ ] **Step 4: Escribir la sección**

```markdown
### 1.2 Tipografía

**Familias**
- Sans: Manrope (`--font-manrope`), cargada por `next/font` en `app/layout.tsx`.
- Heading: Space Grotesk (`--font-space-grotesk`), cargada por `next/font` en `app/layout.tsx`.

**Escala efectiva (top 15 tamaños usados, conteo de apariciones):**
| Clase | Apariciones |
|---|---|
| `text-sm` | N |
| `text-xs` | N |
| … |

**Pesos efectivos:**
| Clase | Apariciones |
|---|---|
| `font-semibold` | N |
| … |

**Observaciones:**
- Mezcla de escala fija (`text-xl`) con `clamp(...)` manual en loader/hero → inconsistencia de responsive.
- No hay tokens semánticos (`--text-display`, `--text-body`, `--text-caption`); todo es utility-class.

**Longitudes eu vs es (componentes críticos)**
| Componente | Clave | eu (chars) | es (chars) | ratio eu/es |
|---|---|---|---|---|
| … | … | N | N | N.NNx |
```

---

### Task 18: Capa 1.3 — Paleta efectiva

- [ ] **Step 1: Listar capas de fondo global**

Run:
```bash
grep -n "radial-gradient\|linear-gradient\|color-mix\|grain\|feTurbulence" /home/avanzosc/kodaore_system/app/globals.css | head -30
```
Apunta las 3 capas: `body background-image`, `body::after` (grain SVG), `.kodaore-shell::before` (radial).

- [ ] **Step 2: Extraer colores reales tras `color-mix`**

Para los 4 color-mix más usados, calcular el hex resultante a mano o con un snippet:
```bash
node -e '
const mix = (c1, c2, p) => {
  const parse = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  const [r1,g1,b1]=parse(c1), [r2,g2,b2]=parse(c2);
  const r=Math.round(r1*p+r2*(1-p)), g=Math.round(g1*p+g2*(1-p)), b=Math.round(b1*p+b2*(1-p));
  return "#"+[r,g,b].map(x=>x.toString(16).padStart(2,"0")).join("");
};
console.log("brand 18% over background:", mix("#be123c","#08090a",0.18));
console.log("brand-warm 18% over background:", mix("#059669","#08090a",0.18));
console.log("brand-emphasis 75% over white 25%:", mix("#f43f5e","#ffffff",0.75));
'
```
Apunta valores efectivos.

- [ ] **Step 3: Contraste WCAG AA por pareja crítica**

Para cada pareja `{foreground, background}`, `{brand-contrast, brand}`, `{foreground, surface}`, `{foreground, surface-strong}`, `{ink-muted, background}`, calcular ratio. Usar una calculadora conocida (webaim) o:
```bash
node -e '
const L = h => {
  const v = [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)]
    .map(x => x/255).map(x => x<=0.03928 ? x/12.92 : Math.pow((x+0.055)/1.055, 2.4));
  return 0.2126*v[0]+0.7152*v[1]+0.0722*v[2];
};
const ratio = (a,b) => { const L1=L(a), L2=L(b); return ((Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05)).toFixed(2); };
console.log("foreground/background:", ratio("#f8fafc","#08090a"));
console.log("brand-contrast/brand:", ratio("#ffffff","#be123c"));
console.log("foreground/surface:", ratio("#f8fafc","#111827"));
console.log("ink-muted/background:", ratio("#94a3b8","#08090a"));
'
```
Apunta los valores.

- [ ] **Step 4: Escribir la sección**

```markdown
### 1.3 Paleta efectiva

**Capas de fondo global (superpuestas sobre todo el sitio)**
1. `body background-image`: gradiente lineal carmesí → gris → esmeralda (tenues).
2. `body::after`: SVG grain (fractalNoise) opacidad 0.04, mix-blend soft-light.
3. `.kodaore-shell::before`: dos radial-gradients de brand y brand-warm en esquinas superiores.

Se acumulan tres capas de fondo permanentes además del fondo plano `--background`. Coste de repaint no medido (candidato a anotación en 1.6).

**Uso de `color-mix(in srgb, ...)`**: N ocurrencias en `globals.css` y N en componentes. Hace que el color final dependa del navegador (ligeras diferencias Chromium vs Firefox en interpolación srgb).

**Paleta efectiva (tras color-mix, los colores que se pintan en pantalla)**
| Composición | Valor efectivo |
|---|---|
| brand 18% over background | `#…` |
| brand-warm 18% over background | `#…` |
| brand-emphasis 75% over white 25% | `#…` |
| … | `#…` |

**Contraste WCAG AA (texto normal ≥ 4.5:1)**
| Pareja | Ratio | AA |
|---|---|---|
| foreground / background | N.NN:1 | ✅/❌ |
| brand-contrast / brand | N.NN:1 | ✅/❌ |
| foreground / surface | N.NN:1 | ✅/❌ |
| foreground / surface-strong | N.NN:1 | ✅/❌ |
| ink-muted / background | N.NN:1 | ✅/❌ |
```

---

### Task 19: Capa 1.4 — Componentes (catalog shallow)

- [ ] **Step 1: Listar carpetas relevantes**

Run:
```bash
ls /home/avanzosc/kodaore_system/components
find /home/avanzosc/kodaore_system/app/\[locale\] -type d -name "_shared" -o -name "_components" -o -name "_utils"
```

- [ ] **Step 2: Por cada componente de `components/`, extraer propósito y usuarios**

Para cada fichero `.tsx` en `components/`, anotar:
- Nombre
- Export principal
- Descripción en 1 línea (leer los primeros 30–50 líneas del fichero)
- Dónde se importa: `grep -rl "from \"@/components/<nombre>\"" app components`
- Tiene animación sí/no: `grep -l "fade-rise\|k-hover\|animate-\|transition-\|motion" <fichero>`

Mismo ejercicio para `app/[locale]/(backoffice)/admin/_shared/*.tsx` y `app/[locale]/(family-portal)/portal/_components/*.tsx`.

- [ ] **Step 3: Identificar sospechas de duplicación**

Comparar shallow los 3 `admin-*-actions-table.tsx`:
```bash
wc -l /home/avanzosc/kodaore_system/components/admin-*-actions-table.tsx
diff /home/avanzosc/kodaore_system/components/admin-billing-actions-table.tsx /home/avanzosc/kodaore_system/components/admin-groups-actions-table.tsx | wc -l
diff /home/avanzosc/kodaore_system/components/admin-groups-actions-table.tsx /home/avanzosc/kodaore_system/components/admin-students-actions-table.tsx | wc -l
```
Apunta líneas iguales/distintas. Sospechas adicionales: `*-gallery.tsx` (erropak/fototeca), cualquier otra pareja con nombre simétrico.

- [ ] **Step 4: Escribir la sección**

```markdown
### 1.4 Componentes — catalog shallow

**`components/` (raíz)**
| Componente | Qué hace | Usado en | Anima | Sospecha |
|---|---|---|---|---|
| `animated-site-header` | Header sticky que compacta al scroll | `app/[locale]/layout.tsx` | sí | — |
| `home-hero` | Hero de portada con Vanta | `app/[locale]/(public)/page.tsx` | sí | — |
| `initial-loader` | Pantalla de carga 3D scroll-driven | `app/[locale]/layout.tsx` | sí | — |
| `vanta-waves-background` | WebGL waves | `home-hero` | sí (infinito) | — |
| `page-transition-shell` | Fade-rise al cambiar ruta | `app/[locale]/layout.tsx` | sí | — |
| `admin-billing-actions-table` | Tabla de acciones de cobros | `app/[locale]/(backoffice)/admin/billing` | no | ⚠️ gemelo de `students`/`groups` |
| `admin-groups-actions-table` | Tabla de acciones de grupos | `app/[locale]/(backoffice)/admin/groups` | no | ⚠️ gemelo |
| `admin-students-actions-table` | Tabla de acciones de alumnos | `app/[locale]/(backoffice)/admin/students` | no | ⚠️ gemelo |
| `erropak-gallery` | Galería fotográfica | `app/[locale]/(public)/erropak` | hover img | ⚠️ cercano a `fototeca-gallery` |
| `fototeca-gallery` | Galería fotográfica | `app/[locale]/(public)/fototeca` | hover img | ⚠️ |
| `smart-image` | Image con fallback | varios | no | — |
| `site-footer` | Footer | layout | línea animada infinita | — |
| `site-header-nav` | Nav del header | `animated-site-header` | hover | — |
| `home-hero-scroll-sync` | Acopla scroll al hero/Vanta | home | sí | — |
| `coach-profile-card` | Ficha de entrenador | coaches | hover | — |
| `auth-credentials-form` | Form de login | `/acceso` | validation states | — |
| `auth-signup-form` | Form de alta | `/acceso/crear-cuenta` | validation states | — |
| `auth-signout-button` | Botón de cerrar sesión | layout auth | hover | — |
| `action-toast` | Toast de acciones | varios | entrada/salida | — |

**`app/[locale]/(backoffice)/admin/_shared/`**
| Componente | Qué hace | Anima |
|---|---|---|
| … | … | … |

**`app/[locale]/(family-portal)/portal/_components/`**
| Componente | Qué hace | Anima |
|---|---|---|
| … | … | … |

**Sospechas de duplicación (⚠️) a validar en Fase 2:**
- 3 tablas `admin-*-actions-table.tsx` con N líneas comunes / N diferentes. Probable refactor a 1 componente + props.
- 2 galleries (`erropak-gallery`, `fototeca-gallery`) con diferencias de datos, estructura similar.
```

---

### Task 20: Capa 1.5 — Inventario de motion

- [ ] **Step 1: Extraer `@keyframes` de globals.css**

Run:
```bash
grep -n "@keyframes" /home/avanzosc/kodaore_system/app/globals.css
```
Apunta cada nombre y línea.

- [ ] **Step 2: Extraer clases con `animation:`**

Run:
```bash
grep -n "animation:" /home/avanzosc/kodaore_system/app/globals.css | head -30
```
Apunta cada uso, con duración y curva.

- [ ] **Step 3: Extraer clases con `transition:` no triviales**

Run:
```bash
grep -nE "transition:\s*[a-z-]+ [0-9]" /home/avanzosc/kodaore_system/app/globals.css
```

- [ ] **Step 4: Extraer usos de `transition-` y `animate-` en componentes**

Run:
```bash
grep -rEn "transition-(all|colors|opacity|transform|shadow)|duration-(100|150|200|300|500|700|1000)|animate-(pulse|spin|bounce|ping)" /home/avanzosc/kodaore_system/app /home/avanzosc/kodaore_system/components | head -60
```

- [ ] **Step 5: Buscar animaciones JS-driven**

Run:
```bash
grep -rEn "requestAnimationFrame|setOptions\(|framer|motion|useMotion" /home/avanzosc/kodaore_system/app /home/avanzosc/kodaore_system/components | head -30
```
Debe salir Vanta (`setOptions`) en `vanta-waves-background.tsx`, el loader 3D en `initial-loader.tsx`, y el header en `animated-site-header.tsx`.

- [ ] **Step 6: Escribir la sección con tabla cerrada**

```markdown
### 1.5 Inventario de motion

**Tabla completa**

| Nombre | Tipo | Ubicación | Duración | Curva | Trigger | Alcance | reduced-motion | Problema |
|---|---|---|---|---|---|---|---|---|
| `fade-rise` | css-keyframe | `globals.css:466` | 0.65s | ease | mount | global | sí (desactiva) | — |
| `fade-reveal-left` | css-keyframe | `globals.css:477` | 0.65s | ease | mount | global | sí | — |
| `kodaore-route-motion` | css-keyframe | `globals.css:109`→`fade-rise` | 0.5s | ease | route-change | global | sí | — |
| `k-hover-lift` | css-transition | `globals.css:146` | 260ms | cubic-bezier(0.22,0.61,0.36,1) | hover | utility | sí | — |
| `k-hover-soft` | css-transition | `globals.css:185` | 220ms | ease | hover | utility | sí | — |
| `k-hover-action` | css-transition | `globals.css:221` | 180ms | ease | hover | utility | sí | — |
| `k-row-hover` | css-transition | `globals.css:240` | 220ms | ease | hover | tablas admin | sí | — |
| `kodaore-loader-logo-wrap` | js-driven + css | `initial-loader.tsx` | 0.18s/0.56s | cubic-bezier | scroll (depth 0–1500) | loader | sí (corto: 160ms exit) | **intercepta scroll inicial — candidato a TTI penalty** |
| `loader-word-rise` | css-keyframe | `globals.css:497` | 0.65s | ease | mount | loader | sí | — |
| `loader-wave-sweep` | css-keyframe | `globals.css:508` | 1.25s | ease-in-out | idle-infinite | loader | sí | **infinito** |
| `loader-hint-bob` | css-keyframe | `globals.css:517` | 1.2s | ease-in-out | idle-infinite | loader | sí | **infinito** |
| `back-top-bob` | css-keyframe | `globals.css:527` | 1.8s | ease-in-out | idle-infinite | botón "volver arriba" | sí | **infinito** |
| `footer-line-shift` | css-keyframe | `globals.css:488` | 7s | linear | idle-infinite | footer global | sí | **infinito, global** |
| `kodaore-social-icon::after` | css-transition | `globals.css:410` | 0.25s | ease | hover | footer | sí | — |
| `AnimatedSiteHeader compact` | css-transition | `animated-site-header.tsx:67–73` | 450–700ms | default | scroll | header global | parcial (clsx condicional) | **dispara layout (padding/backdrop-blur)** |
| `VantaWavesBackground` | js-driven (WebGL) | `vanta-waves-background.tsx` | continuo | Vanta default | mount + mousemove + scroll | hero home | sí (desactiva en reduced-motion y mobile) | **coste CPU/GPU alto** |
| Image hover scale | css-transition (Tailwind) | varios `transition duration-700 group-hover:scale-*` | 700ms | default | hover | cards imagen | parcial (no hay `motion-safe`) | — |

**Sub-tabla: animaciones infinitas (mientras la página esté abierta, se repintan)**
- `loader-wave-sweep`, `loader-hint-bob`, `back-top-bob`, `footer-line-shift` (7s, global), `VantaWavesBackground` (continuo, desktop).

**Sub-tabla: animaciones que disparan layout (sospechosas de CLS)**
- `AnimatedSiteHeader compact`: cambia `py-3` ↔ `py-1.5` y añade `backdrop-blur-xl` tras 50px de scroll.
- `InitialLoader` al salir: transforma con `translate3d` + scale; layout-safe en teoría pero hay `is-exit` que cambia opacity del backdrop.
```

---

### Task 21: Capa 1.6 — Diagnóstico global

- [ ] **Step 1: Escribir un párrafo neutro**

Sustituir el placeholder de 1.6 por:

```markdown
### 1.6 Diagnóstico global

Estado actual resumido, sin prescripciones.

**Lo que hay:**
- Sistema de motion abundante y con personalidad: loader 3D con scroll-driven, Vanta en hero, fades de ruta, hover-lift en cards. Tono cálido.
- Paleta dual carmesí/esmeralda (identidad vasca discreta pero de fuerte contraste). Fondo siempre oscuro con tres capas superpuestas (gradient + grain + radial).
- Tokens mínimos (10 variables) expuestos vía `@theme inline`. Uso intensivo de `color-mix()`.
- Tipografía dual: Manrope (sans) + Space Grotesk (heading).
- `prefers-reduced-motion` respetado en globals.css con `!important` que desactiva animaciones sin sustituirlas.

**Lo que se acumula:**
- N animaciones infinitas globales (footer-line-shift y Vanta continuo), coste de repaint recurrente.
- Tres capas de fondo permanentes sobre todo el árbol.
- 3 tablas admin con estructura casi idéntica (candidatas a consolidación).
- 2 galleries con solapamiento.

**Lo que falta:**
- Tokens semánticos `success`/`warning`/`info`, escala de grises intermedia, niveles de superficie (`subtle`/`elevated`), tokens de `radius`/`shadow`/`spacing`.
- Alternativa estática explícita para `prefers-reduced-motion` (hoy es solo "desactivar").
- Jerarquía de motion (qué es primario vs decorativo): todo anima al mismo nivel.
- Responsive tipográfico coherente: mezcla `clamp()` manual con `text-xl` fijo.

Estas observaciones alimentan Fase 1 pero no la predicen.
```

---

### Task 22: Capa 2 — Route atlas (15 principales)

Plantilla aplicada a cada ruta. Tarea larga; se ejecuta ruta por ruta, commit único al final junto con Task 23 y 24.

- [ ] **Step 1: Para cada una de las 15 rutas, rellenar la plantilla**

Orden sugerido (más fáciles primero):
1. `/` (home)
2. `/sedes`
3. `/sedes/azkoitia`
4. `/fototeca`
5. `/erropak`
6. `/acceso`
7. `/acceso/crear-cuenta`
8. `/admin`
9. `/admin/students`
10. `/admin/groups`
11. `/admin/billing`
12. `/portal`
13. `/portal/profile`
14. `/portal/payments`
15. `/portal/messages`

Plantilla por ruta:

```markdown
### /ruta — Nombre humano
Audiencia: pública | auth familia | auth admin

**Screenshots**
- mobile eu: [top](../.audit/baseline/<slug>/mobile/eu/top.png) · [full](../.audit/baseline/<slug>/mobile/eu/full.png)
- mobile es: [top](../.audit/baseline/<slug>/mobile/es/top.png) · [full](../.audit/baseline/<slug>/mobile/es/full.png)
- desktop eu: [top](../.audit/baseline/<slug>/desktop/eu/top.png) · [full](../.audit/baseline/<slug>/desktop/eu/full.png)
- desktop es: [top](../.audit/baseline/<slug>/desktop/es/top.png) · [full](../.audit/baseline/<slug>/desktop/es/full.png)

**Métricas** (si se midieron)
- Lighthouse desktop: Perf NN / A11y NN / BP NN / SEO NN
- Lighthouse mobile:  Perf NN / A11y NN / BP NN / SEO NN
- Perf trace: LCP Nms, INP Nms, CLS N.NN, long tasks N, frames dropped N%

**Motion en esta ruta**
- → 1.5/fade-rise, → 1.5/VantaWavesBackground, etc.

**Componentes clave**
- → 1.4/home-hero, → 1.4/animated-site-header, etc.

**Observaciones visuales**
- 2–5 bullets neutros (ej. "hero ocupa 74svh en mobile", "tabla desborda en 390px requiriendo scroll horizontal").

**Observaciones de motion**
- 2–5 bullets (ej. "Vanta se desactiva bajo 768px, el hero pasa a gradient estático").

**i18n**
- Longitudes eu vs es en títulos/CTAs (chars).

**Riesgos para Fase 4**
- 1–3 bullets concretos.
```

Fuentes de datos por ruta:
- Screenshots: las rutas relativas a `.audit/baseline/…`.
- Métricas Lighthouse: `.audit/baseline/lighthouse/<slug>/{desktop,mobile}.json` (si existe).
- Métricas perf trace: `.audit/baseline/perf/<slug>-<viewport>.summary.json` (si está en las 4 trazadas).
- Componentes: abrir el `page.tsx` de la ruta y ver imports (`grep "from \"@/components\"" <page>`).
- Motion: cruzar los componentes con la tabla 1.5.
- i18n: abrir los dos screenshots (eu/es) y anotar diferencias de longitud en títulos/CTAs clave.

---

### Task 23: Capa 2 — Route atlas (4 secundarias)

Forma compacta, solo desktop eu.

- [ ] **Step 1: Para cada ruta secundaria, un bloque breve**

```markdown
### /sedes/azpeitia — Sede Azpeitia
Audiencia: pública

**Screenshot**: [top](../.audit/baseline/sedes__azpeitia/desktop/eu/top.png)
**Observaciones**: variante de plantilla de sede. Misma estructura que azkoitia, cambia copy y foto. No se esperan diferencias de motion.
```

Repetir para `/sedes/zumaia`, `/legal/terms`, `/legal/privacy`.

---

### Task 24: Self-review y commit final

- [ ] **Step 1: Verificar enlaces relativos**

Run:
```bash
grep -oE "\.\./\.audit/[^)]+" /home/avanzosc/kodaore_system/docs/ui-audit.md | sort -u | while read p; do
  real="/home/avanzosc/kodaore_system/docs/$p"
  [ -f "$real" ] || echo "ROTO: $p"
done
```
Expected: sin output (no hay enlaces rotos).

- [ ] **Step 2: Verificar que están todas las animaciones**

Run:
```bash
grep -c "^| " /home/avanzosc/kodaore_system/docs/ui-audit.md # conteo de filas de tabla
```
Confirmar que la tabla de 1.5 incluye al menos las 17 entradas listadas en Task 20 Step 6.

- [ ] **Step 3: Verificar que todas las 15 + 4 rutas están en el atlas**

Run:
```bash
grep -cE "^### /" /home/avanzosc/kodaore_system/docs/ui-audit.md
```
Expected: `19`.

- [ ] **Step 4: Lint rápido del markdown**

Run: `npx markdownlint-cli docs/ui-audit.md 2>&1 | head -20` (si markdownlint está disponible; si no, saltar).

- [ ] **Step 5: Commit**

```bash
git add docs/ui-audit.md
git commit -m "$(cat <<'EOF'
docs(ui): audit de Fase 0 (foundations + route atlas)

Capa 1: tokens, tipografía, paleta efectiva, componentes shallow,
inventario de motion y diagnóstico. Capa 2: atlas de 15 rutas
principales y 4 secundarias con screenshots, métricas Lighthouse
(públicas) y perf traces (4 rutas). Artefactos bajo .audit/ no
commiteados.
EOF
)"
```

- [ ] **Step 6: Verificar historial final**

Run: `git log --oneline -5`
Expected (desde el más reciente):
1. `docs(ui): audit de Fase 0 …`
2. `feat(audit): scaffold de captura para Fase 0`
3. `docs: diseño de Fase 0 del rediseño UI …` (ya existe)
4. `chore: ignorar artefactos del audit Fase 0`
5. `refactor: reorganizar app router …` (previo al trabajo)

---

## Criterios finales de "done"

Copiados del spec (7.2) para referencia rápida:

1. ✅ `docs/ui-audit.md` renderiza sin enlaces rotos a `.audit/` (Task 24 Step 1).
2. ✅ Las 15 rutas principales tienen 8 screenshots (Task 9 Step 4: 120 png).
3. ✅ Las 4 rutas secundarias tienen screenshot mínimo (Task 9 Step 4: 4 png).
4. ✅ 4 vídeos `.webm` reproducibles (Task 9 Step 4: 4 webm).
5. ✅ 2 rutas con Lighthouse desktop + mobile (Task 12 Step 4) + hasta 4 autenticadas si Task 13 lo permite.
6. ✅ 4 rutas × 2 viewports con perf trace + summary (Task 14 Step 4: 16 JSON).
7. ✅ Inventario de motion exhaustivo (Task 20 + Task 24 Step 2).
8. ✅ Dos commits atómicos (Task 11 + Task 24 Step 5) + el commit previo del `.gitignore` (Task 1 Step 5).

## Parada

**Al terminar Task 24: PARAR.** No avanzar a Fase 1 sin checkpoint humano.
