import { expect, test } from "@playwright/test";

/**
 * Smoke tests de la landing narrativa (version simplificada: 5 secciones).
 * Verifica SSR, enlaces criticos, metadata y el fallback estatico de haraigoshi.
 */

test.describe("landing narrativa", () => {
  test("eu: SSR entrega las 5 secciones y el fallback estatico de haraigoshi", async ({ page }) => {
    await page.goto("/eu");

    // Hero
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Judo kluba");
    await expect(page.getByText("2002tik erakusten")).toBeVisible();

    // Momento haraigoshi: los 4 aforismos deben estar presentes en el DOM
    for (const label of ["oreka hautsi", "sartu", "bota", "ondo erori"]) {
      await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
    }

    // Sedes: las tres ciudades como headings en la lista
    for (const city of ["Azkoitia", "Azpeitia", "Zumaia"]) {
      await expect(page.getByRole("link", { name: new RegExp(city) }).first()).toBeVisible();
    }

    // CTA
    await expect(page.getByRole("heading", { name: "Lehen saioa" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Idatzi Kodaorera/ })).toHaveAttribute(
      "href",
      /^mailto:/,
    );
  });

  test("es: SSR entrega las mismas secciones traducidas", async ({ page }) => {
    await page.goto("/es");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Club de judo");
    await expect(page.getByText("Desde 2002 ensenando")).toBeVisible();

    for (const label of ["romper el equilibrio", "entrar", "proyectar", "caer bien"]) {
      await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
    }

    for (const city of ["Azkoitia", "Azpeitia", "Zumaia"]) {
      await expect(page.getByRole("link", { name: new RegExp(city) }).first()).toBeVisible();
    }

    await expect(page.getByRole("heading", { name: "Primera clase" })).toBeVisible();
  });

  test("enlaces a sedes apuntan a rutas existentes", async ({ page }) => {
    await page.goto("/eu");
    const azkoitiaLink = page.getByRole("link", { name: /Azkoitia/ }).first();
    await expect(azkoitiaLink).toHaveAttribute("href", "/eu/sedes/azkoitia");
  });

  test("enlace de familias ya inscritas apunta al portal", async ({ page }) => {
    await page.goto("/eu");
    const ledger = page.getByRole("link", { name: /Ordainketak eta jakinarazpenak ikusi/ });
    await expect(ledger).toHaveAttribute("href", "/eu/portal");
    const login = page.getByRole("link", { name: /Saio-hasiera/ });
    await expect(login).toHaveAttribute("href", "/eu/acceso");
  });

  test("metadata + JSON-LD estan presentes", async ({ page }) => {
    await page.goto("/eu");

    await expect(page).toHaveTitle(/Kodaore.*Judo kluba/);

    const ldJson = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(ldJson).toBeTruthy();
    const payload = JSON.parse(ldJson ?? "[]") as Array<Record<string, unknown>>;
    expect(Array.isArray(payload)).toBe(true);
    expect(payload.length).toBeGreaterThanOrEqual(4);
    expect(payload[0]["@type"]).toBe("SportsOrganization");
    const locations = payload.filter((p) => p["@type"] === "SportsActivityLocation");
    expect(locations).toHaveLength(3);
  });

  test("prefers-reduced-motion muestra el fallback estatico del haraigoshi", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/eu");
    const figures = page.locator('figure:has(svg[viewBox="0 0 472 580"])');
    await expect(figures).toHaveCount(5);
  });
});
