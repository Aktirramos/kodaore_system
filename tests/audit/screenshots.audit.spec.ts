import fs from "node:fs";
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
const ADMIN_STATE = ".audit/state/admin.json";
const FAMILIA_STATE = ".audit/state/familia.json";

function viewportKind() {
  const n = test.info().project.name;
  if (n === "chromium-desktop") return "desktop";
  if (n === "chromium-mobile") return "mobile";
  throw new Error(`Unexpected project: ${n}`);
}

async function gotoAndSettle(page: Page, url: string) {
  await page.goto(url, { waitUntil: "networkidle" });
  await dismissInitialLoader(page);
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
  test.skip(() => !fs.existsSync(ADMIN_STATE), `falta ${ADMIN_STATE} (Fase 0.b)`);
  test.use({ storageState: ADMIN_STATE });
  for (const spec of ADMIN_PRINCIPALS) {
    for (const locale of LOCALES) {
      test(`${spec.slug} · ${locale}`, async ({ page }) => {
        await capture(page, spec, locale, true);
      });
    }
  }
});

test.describe.serial("principales familia", () => {
  test.skip(() => !fs.existsSync(FAMILIA_STATE), `falta ${FAMILIA_STATE} (Fase 0.b)`);
  test.use({ storageState: FAMILIA_STATE });
  for (const spec of FAMILIA_PRINCIPALS) {
    for (const locale of LOCALES) {
      test(`${spec.slug} · ${locale}`, async ({ page }) => {
        await capture(page, spec, locale, true);
      });
    }
  }
});

test.describe.serial("secundarios", () => {
  for (const spec of SECONDARY) {
    test(`${spec.slug} · eu`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "chromium-desktop", "solo desktop");
      await capture(page, spec, "eu", false);
    });
  }
});
