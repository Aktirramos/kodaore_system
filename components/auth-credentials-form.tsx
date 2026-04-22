"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { type FormEvent, useState } from "react";
import type { LocaleCode } from "@/lib/i18n";

type AuthCredentialsFormProps = {
  locale: LocaleCode;
};

export function AuthCredentialsForm({ locale }: AuthCredentialsFormProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const callbackUrl = `/${locale}/acceso`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsPending(true);
    setError(null);

    const result = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsPending(false);

    if (!result || result.error) {
      if (result?.error === "Configuration") {
        setError(
          locale === "eu"
            ? "Saio zerbitzua ez dago erabilgarri une honetan. Jarri harremanetan administrazioarekin."
            : "El servicio de acceso no esta disponible en este momento. Contacta con administracion.",
        );
      } else {
        setError(
          locale === "eu"
            ? "Ezin izan da saioa hasi. Egiaztatu sarbide-datua eta pasahitza."
            : "No se pudo iniciar sesion. Revisa tu dato de acceso y contrasena.",
        );
      }
      return;
    }

    router.push(result.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="grid gap-2 text-sm text-ink-secondary">
        <span>{locale === "eu" ? "Sarbide-identifikatzailea" : "Identificador de acceso"}</span>
        <input
          type="text"
          autoComplete="username"
          required
          placeholder={locale === "eu" ? "Idatzi zure datua" : "Escribe tu dato de acceso"}
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value.toLowerCase())}
          className="k-focus-ring k-hover-soft rounded-2xl border border-border-default bg-surface-elevated px-4 py-3 text-ink-primary outline-none focus:border-[color:var(--brand-emphasis)]"
        />
        <span className="text-xs text-ink-muted">
          {locale === "eu"
            ? "Erabili zure sarbide-datua saioa irekitzeko."
            : "Usa tu dato de acceso para iniciar sesion."}
        </span>
      </label>

      <label className="grid gap-2 text-sm text-ink-secondary">
        <span>{locale === "eu" ? "Pasahitza" : "Contrasena"}</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="k-focus-ring k-hover-soft rounded-2xl border border-border-default bg-surface-elevated px-4 py-3 text-ink-primary outline-none focus:border-[color:var(--brand-emphasis)]"
        />
      </label>

      {error ? (
        <p role="alert" className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="k-focus-ring k-hover-action inline-flex min-h-11 items-center justify-center rounded-full border border-[color:var(--brand-emphasis)] bg-[color:var(--brand)]/80 px-5 py-2 text-sm font-semibold text-white hover:bg-[color:var(--brand)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending
          ? locale === "eu"
            ? "Sartzen..."
            : "Entrando..."
          : locale === "eu"
            ? "Sartu"
            : "Entrar"}
      </button>
    </form>
  );
}
