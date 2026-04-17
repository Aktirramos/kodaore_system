import { expect, test, type Page } from "@playwright/test";

const E2E_AUTH_ENABLED = process.env.E2E_AUTH_ENABLED === "true";
const E2E_FAMILY_IDENTIFIER = process.env.E2E_FAMILY_IDENTIFIER ?? "familia@kodaore.eus";
const E2E_MANAGEMENT_IDENTIFIER = process.env.E2E_MANAGEMENT_IDENTIFIER ?? "developer";
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? process.env.SEED_DEFAULT_PASSWORD ?? "Kodaore2026!";

async function dismissInitialLoader(page: Page) {
  const loader = page.locator(".kodaore-loader");

  if ((await loader.count()) === 0) {
    return;
  }

  // Initial loader advances with user scroll/drag input.
  await page.mouse.wheel(0, 2000);
  await page.mouse.wheel(0, 2000);
  await expect(loader).toHaveCount(0, { timeout: 8_000 });
}

async function login(page: Page, identifier: string, password: string) {
  await page.goto("/eu/acceso");
  await dismissInitialLoader(page);

  await page.locator('input[autocomplete="username"]').fill(identifier);
  await page.locator('input[autocomplete="current-password"]').fill(password);
  await page.getByRole("button", { name: /sartu|entrar/i }).click();
}

test("home loads and renders brand", async ({ page }) => {
  await page.goto("/eu");

  await expect(page).toHaveURL(/\/eu$/);
  await expect(page.getByRole("link", { name: /kodaore/i }).first()).toBeVisible();
});

test("portal redirects to acceso when no session", async ({ page }) => {
  await page.goto("/eu/portal");

  await expect(page).toHaveURL(/\/eu\/acceso$/);
  await expect(page.getByRole("heading", { name: /saioa hasi|iniciar sesion/i })).toBeVisible();
});

test("admin routes redirect to acceso when no session", async ({ page }) => {
  await page.goto("/eu/admin");
  await expect(page).toHaveURL(/\/eu\/acceso$/);

  await page.goto("/eu/admin/students");
  await expect(page).toHaveURL(/\/eu\/acceso$/);

  await page.goto("/eu/admin/groups");
  await expect(page).toHaveURL(/\/eu\/acceso$/);

  await page.goto("/eu/admin/billing");
  await expect(page).toHaveURL(/\/eu\/acceso$/);
});

test("health endpoint returns expected shape", async ({ request }) => {
  const response = await request.get("/api/health");

  expect([200, 503]).toContain(response.status());
  const body = await response.json();

  expect(body).toMatchObject({
    service: "kodaore-system",
  });
  expect(["ok", "degraded"]).toContain(body.status);
  expect(body.timestamp).toBeTruthy();
  expect(typeof body.durationMs).toBe("number");
  expect(body.db).toBeTruthy();
  expect(["ok", "degraded", "error"]).toContain(body.db.status);
});

test.describe("auth smoke", () => {
  test.skip(!E2E_AUTH_ENABLED, "Set E2E_AUTH_ENABLED=true to run auth e2e flows.");

  test("family login redirects to portal", async ({ page }) => {
    await login(page, E2E_FAMILY_IDENTIFIER, E2E_PASSWORD);

    await expect(page).toHaveURL(/\/eu\/portal$/);
    await expect(page.getByRole("heading", { name: /familia eta ikasleen ataria|portal de familias y alumnado/i })).toBeVisible();
  });

  test("management login redirects to admin", async ({ page }) => {
    await login(page, E2E_MANAGEMENT_IDENTIFIER, E2E_PASSWORD);

    await expect(page).toHaveURL(/\/eu\/admin$/);
    await expect(page.getByRole("heading", { name: /kodaore backoffice/i })).toBeVisible();
  });

  test("management user can open admin modules", async ({ page }) => {
    await login(page, E2E_MANAGEMENT_IDENTIFIER, E2E_PASSWORD);
    await expect(page).toHaveURL(/\/eu\/admin$/);

    await page.goto("/eu/admin/students");
    await expect(page.getByRole("heading", { name: /ikasleen administrazioa|administracion de alumnos/i })).toBeVisible();

    await page.goto("/eu/admin/groups");
    await expect(page.getByRole("heading", { name: /taldeen administrazioa|administracion de grupos/i })).toBeVisible();

    await page.goto("/eu/admin/billing");
    await expect(page.getByRole("heading", { name: /kobrantzen administrazioa|administracion de cobros/i })).toBeVisible();
  });

  test("authenticated user can sign out", async ({ page }) => {
    await login(page, E2E_FAMILY_IDENTIFIER, E2E_PASSWORD);
    await expect(page).toHaveURL(/\/eu\/portal$/);

    await page.getByRole("button", { name: /saioa itxi|cerrar sesion/i }).click();
    await expect(page).toHaveURL(/\/eu$/);
  });
});
