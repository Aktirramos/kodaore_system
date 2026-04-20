import "server-only";
import { ADMIN_ROLE_CODES, requireAuth } from "@/lib/auth";
import type { LocaleCode } from "@/lib/i18n";

export async function requireAdminAuth(locale: LocaleCode) {
  return requireAuth({
    locale,
    allowedRoles: ADMIN_ROLE_CODES,
    forbiddenRedirectTo: `/${locale}/portal`,
  });
}
