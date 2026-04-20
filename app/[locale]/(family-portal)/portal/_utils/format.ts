import "server-only";
import type { LocaleCode } from "@/lib/i18n";

export function formatPortalCurrency(amountCents: number, locale: LocaleCode) {
  return new Intl.NumberFormat(locale === "eu" ? "eu-ES" : "es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);
}

export function formatPortalDate(value: Date, locale: LocaleCode) {
  return new Intl.DateTimeFormat(locale === "eu" ? "eu-ES" : "es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}
