import fs from "node:fs";
import path from "node:path";
import { test } from "@playwright/test";
import { dismissInitialLoader } from "./_setup/auth-helpers";

test.use({ video: { mode: "on", size: { width: 1440, height: 900 } } });

test("flujo 4 · submit con validacion (desktop es)", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-desktop", "flujo 4 solo en desktop");
  await page.goto("/es/acceso/crear-cuenta");
  await dismissInitialLoader(page);
  await page.waitForTimeout(600);

  // Selectors derived from components/auth-signup-form.tsx. Inputs have no
  // name attribute so we key on the autocomplete hint, which is unique per
  // field. The submit button's visible text in es is "Crear cuenta".
  const firstName = page.locator('input[autocomplete="given-name"]');
  const lastName = page.locator('input[autocomplete="family-name"]');
  const email = page.locator('input[autocomplete="email"]');
  const phone = page.locator('input[autocomplete="tel"]');
  const password = page.locator('input[autocomplete="new-password"]').first();
  const confirmPassword = page.locator('input[autocomplete="new-password"]').nth(1);
  const termsCheckbox = page.locator('input[type="checkbox"]').first();
  const privacyCheckbox = page.locator('input[type="checkbox"]').nth(1);
  const submit = page.getByRole("button", { name: /crear cuenta/i });

  // Paso 1: completar todos los campos, pero con valores invalidos en email
  // y contrasena (y contrasenas que no coinciden) para disparar validacion.
  await firstName.type("Audit", { delay: 20 });
  await lastName.type("Familia", { delay: 20 });
  await email.type("no-es-un-email", { delay: 20 });
  await phone.type("600111222", { delay: 20 });
  await password.type("123", { delay: 20 });
  await confirmPassword.type("456", { delay: 20 });
  await termsCheckbox.check();
  await privacyCheckbox.check();
  await page.waitForTimeout(400);

  // Intento de submit: el navegador bloqueara por type="email" y minLength=10,
  // o el handler mostrara error "Las contrasenas no coinciden".
  await submit.click();
  await page.waitForTimeout(1800);

  // Paso 2: corregir los valores a datos validos. No hacemos submit de nuevo
  // — solo mostramos el estado de correccion para el video.
  await email.fill("");
  await email.type("nuevo.familia+audit@ejemplo.test", { delay: 30 });
  await password.fill("");
  await password.type("Kodaore2026!", { delay: 30 });
  await confirmPassword.fill("");
  await confirmPassword.type("Kodaore2026!", { delay: 30 });
  await page.waitForTimeout(1000);
  // No submit on purpose — evitamos crear una cuenta real en la BD.
});

test.afterAll(async () => {
  const videosDir = path.join(".audit/baseline/videos");
  if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });
});
