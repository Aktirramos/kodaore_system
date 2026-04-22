import { expect, test as setup } from "@playwright/test";
import { AUDIT_PASSWORD, login } from "./auth-helpers";

const FAMILIA_STATE = ".audit/state/familia.json";

setup("autenticar como familia tutora", async ({ page }) => {
  await login(page, "familia@kodaore.eus", AUDIT_PASSWORD);
  await expect(page).toHaveURL(/\/eu\/portal$/, { timeout: 15_000 });
  await page.context().storageState({ path: FAMILIA_STATE });
});
