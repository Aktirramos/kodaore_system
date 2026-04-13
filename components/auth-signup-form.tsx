"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { type FormEvent, useState } from "react";
import type { LocaleCode } from "@/lib/i18n";

type AuthSignupFormProps = {
  locale: LocaleCode;
};

type RegisterErrorResponse = {
  error?: string;
};

export function AuthSignupForm({ locale }: AuthSignupFormProps) {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedPhone = phone.trim();

    if (!normalizedPhone) {
      setError(locale === "eu" ? "Telefonoa derrigorrezkoa da." : "El telefono es obligatorio.");
      return;
    }

    if (password !== confirmPassword) {
      setError(locale === "eu" ? "Pasahitzak ez datoz bat." : "Las contrasenas no coinciden.");
      return;
    }

    setError(null);
    setIsPending(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone: normalizedPhone,
        password,
        locale,
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as RegisterErrorResponse;
      setError(
        data.error ??
          (locale === "eu"
            ? "Ezin izan da kontua sortu. Saiatu berriro minutu batzuk barru."
            : "No se pudo crear la cuenta. Intentalo de nuevo en unos minutos."),
      );
      setIsPending(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      identifier: email.trim().toLowerCase(),
      password,
      redirect: false,
      callbackUrl: `/${locale}/portal`,
    });

    setIsPending(false);

    if (!signInResult || signInResult.error) {
      router.push(`/${locale}/acceso`);
      router.refresh();
      return;
    }

    router.push(signInResult.url ?? `/${locale}/portal`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-neutral-300">
          <span>{locale === "eu" ? "Izena" : "Nombre"}</span>
          <input
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="k-focus-ring k-hover-soft rounded-2xl border border-white/20 bg-black/35 px-4 py-3 text-neutral-100 outline-none focus:border-[color:var(--brand-emphasis)]"
          />
        </label>

        <label className="grid gap-2 text-sm text-neutral-300">
          <span>{locale === "eu" ? "Abizena" : "Apellidos"}</span>
          <input
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="k-focus-ring k-hover-soft rounded-2xl border border-white/20 bg-black/35 px-4 py-3 text-neutral-100 outline-none focus:border-[color:var(--brand-emphasis)]"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm text-neutral-300">
        <span>Email</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value.toLowerCase())}
          className="k-focus-ring k-hover-soft rounded-2xl border border-white/20 bg-black/35 px-4 py-3 text-neutral-100 outline-none focus:border-[color:var(--brand-emphasis)]"
        />
      </label>

      <label className="grid gap-2 text-sm text-neutral-300">
        <span>{locale === "eu" ? "Telefonoa" : "Telefono"}</span>
        <input
          type="tel"
          autoComplete="tel"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="k-focus-ring k-hover-soft rounded-2xl border border-white/20 bg-black/35 px-4 py-3 text-neutral-100 outline-none focus:border-[color:var(--brand-emphasis)]"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-neutral-300">
          <span>{locale === "eu" ? "Pasahitza" : "Contrasena"}</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="k-focus-ring k-hover-soft rounded-2xl border border-white/20 bg-black/35 px-4 py-3 text-neutral-100 outline-none focus:border-[color:var(--brand-emphasis)]"
          />
        </label>

        <label className="grid gap-2 text-sm text-neutral-300">
          <span>{locale === "eu" ? "Pasahitza berriro" : "Repite contrasena"}</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="k-focus-ring k-hover-soft rounded-2xl border border-white/20 bg-black/35 px-4 py-3 text-neutral-100 outline-none focus:border-[color:var(--brand-emphasis)]"
          />
        </label>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="k-focus-ring k-hover-action inline-flex min-h-11 items-center justify-center rounded-full border border-[color:var(--brand-emphasis)] bg-[color:var(--brand)]/85 px-5 py-2 text-sm font-semibold text-white hover:bg-[color:var(--brand)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending
              ? locale === "eu"
                ? "Kontua sortzen..."
                : "Creando cuenta..."
              : locale === "eu"
                ? "Sortu kontua"
                : "Crear cuenta"}
          </button>

          <Link
            href={`/${locale}/acceso`}
            className="k-focus-ring k-hover-action inline-flex min-h-10 items-center justify-center rounded-full border border-white/20 bg-surface-strong px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted hover:border-white/35 hover:text-foreground"
          >
            {locale === "eu" ? "Saioa hasi" : "Ir a acceso"}
          </Link>
        </div>
    </form>
  );
}
