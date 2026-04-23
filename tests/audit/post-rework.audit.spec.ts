import path from "node:path";
import { test, type Page } from "@playwright/test";

type RouteSpec = { slug: string; path: string };

const PUBLIC_ROUTES: RouteSpec[] = [
  { slug: "home", path: "/" },
  { slug: "sedes", path: "/sedes" },
  { slug: "sedes__azkoitia", path: "/sedes/azkoitia" },
  { slug: "fototeca", path: "/fototeca" },
  { slug: "erropak", path: "/erropak" },
  { slug: "acceso", path: "/acceso" },
  { slug: "legal__terms", path: "/legal/terms" },
  { slug: "legal__privacy", path: "/legal/privacy" },
];

const LOCALES = ["eu", "es"] as const;
const THEMES = ["light", "dark"] as const;

function viewportKind() {
  const n = test.info().project.name;
  if (n === "chromium-desktop") return "desktop";
  if (n === "chromium-mobile") return "mobile";
  throw new Error(`Unexpected project: ${n}`);
}

async function setTheme(page: Page, theme: (typeof THEMES)[number]) {
  // Pre-carga de un html minimo para tener localStorage del origen antes del navigate real.
  await page.addInitScript((t) => {
    try {
      window.localStorage.setItem("kodaore-theme", t);
    } catch {
      /* ignore */
    }
  }, theme);
}

async function gotoAndSettle(page: Page, url: string) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
}

async function capture(
  page: Page,
  spec: RouteSpec,
  locale: (typeof LOCALES)[number],
  theme: (typeof THEMES)[number],
) {
  const url = `/${locale}${spec.path === "/" ? "" : spec.path}`;
  const destDir = path.join(
    ".audit/post-rework",
    spec.slug,
    viewportKind(),
    theme,
    locale,
  );
  await setTheme(page, theme);
  await gotoAndSettle(page, url);
  await page.screenshot({ path: path.join(destDir, "top.png"), fullPage: false });
  await page.screenshot({ path: path.join(destDir, "full.png"), fullPage: true });
}

test.describe.serial("post-rework rutas publicas", () => {
  for (const spec of PUBLIC_ROUTES) {
    for (const locale of LOCALES) {
      for (const theme of THEMES) {
        test(`${spec.slug} · ${locale} · ${theme}`, async ({ page }) => {
          await capture(page, spec, locale, theme);
        });
      }
    }
  }
});
