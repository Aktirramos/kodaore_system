import { expect, test as setup } from "@playwright/test";
import { AUDIT_PASSWORD, login } from "./auth-helpers";

const ADMIN_STATE = ".audit/state/admin.json";

setup("autenticar como admin.global", async ({ page }) => {
  await login(page, "admin.global", AUDIT_PASSWORD);
  await expect(page).toHaveURL(/\/eu\/admin$/, { timeout: 15_000 });
  await page.context().storageState({ path: ADMIN_STATE });
});
