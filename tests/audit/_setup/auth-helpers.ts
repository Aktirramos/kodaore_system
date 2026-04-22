import { expect, type Page } from "@playwright/test";

export const AUDIT_PASSWORD = process.env.AUDIT_PASSWORD ?? "Kodaore2026!";

export async function dismissInitialLoader(page: Page) {
  const loader = page.locator(".kodaore-loader");
  if ((await loader.count()) === 0) return;
  // page.mouse.wheel no dispara eventos wheel en emulación mobile; sintetizamos
  // el evento desde la página para que funcione en desktop y en mobile chromium.
  await page.evaluate(() => {
    for (let i = 0; i < 4; i++) {
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: 2000, bubbles: true }));
    }
  });
  await expect(loader).toHaveCount(0, { timeout: 10_000 });
}

export async function login(page: Page, identifier: string, password: string) {
  await page.goto("/eu/acceso");
  await dismissInitialLoader(page);
  await page.locator('input[autocomplete="username"]').fill(identifier);
  await page.locator('input[autocomplete="current-password"]').fill(password);
  await page.getByRole("button", { name: /sartu|entrar/i }).click();
}
