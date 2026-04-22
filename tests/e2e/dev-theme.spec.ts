import { expect, test } from "@playwright/test";

test("dev-theme renderiza swatches y motion samples", async ({ page }) => {
  await page.goto("/eu/dev-theme");

  await expect(page.getByRole("heading", { name: /Tokens Fase 1 — Dojo Moderno/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Abrir modal/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Mostrar toast/ })).toBeVisible();

  // Al menos un swatch por cada grupo (verifica que los tokens se resuelven en CSS).
  const surfaceSwatch = page.locator("div").filter({ hasText: /^surface-base$/ });
  await expect(surfaceSwatch).toBeVisible();

  // Modal abre y cierra.
  await page.getByRole("button", { name: /Abrir modal/ }).click();
  await expect(page.getByRole("dialog", { name: /Modal de demo/i })).toBeVisible();
  await page.getByRole("button", { name: /Cerrar/ }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
