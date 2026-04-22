"use client";

import clsx from "clsx";
import { signOut } from "next-auth/react";
import type { LocaleCode } from "@/lib/i18n";

type AuthSignOutButtonProps = {
  locale: LocaleCode;
  className?: string;
};

export function AuthSignOutButton({ locale, className }: AuthSignOutButtonProps) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: `/${locale}` })}
      className={clsx(
        "k-focus-ring k-hover-action inline-flex min-h-11 items-center justify-center rounded-full border border-border-default bg-surface-subtle px-5 py-2 text-sm font-semibold text-ink-secondary hover:border-border-strong hover:bg-surface-elevated",
        className,
      )}
    >
      {locale === "eu" ? "Saioa itxi" : "Cerrar sesion"}
    </button>
  );
}
