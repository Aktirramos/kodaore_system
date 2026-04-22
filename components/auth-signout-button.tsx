"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui";
import type { LocaleCode } from "@/lib/i18n";

type AuthSignOutButtonProps = {
  locale: LocaleCode;
  className?: string;
};

export function AuthSignOutButton({ locale, className }: AuthSignOutButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => signOut({ callbackUrl: `/${locale}` })}
      className={className}
    >
      {locale === "eu" ? "Saioa itxi" : "Cerrar sesion"}
    </Button>
  );
}
