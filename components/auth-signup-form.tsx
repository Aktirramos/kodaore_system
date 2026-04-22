"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import type { LocaleCode } from "@/lib/i18n";

type TurnstileRenderOptions = {
  sitekey: string;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  theme?: "auto" | "light" | "dark";
};

type TurnstileApi = {
  render: (element: HTMLElement, options: TurnstileRenderOptions) => string;
  remove?: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let turnstileScriptPromise: Promise<void> | null = null;

function loadTurnstileScript() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.turnstile) {
    return Promise.resolve();
  }

  if (turnstileScriptPromise) {
    return turnstileScriptPromise;
  }

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("TURNSTILE_SCRIPT_LOAD_ERROR")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.turnstile = "true";
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("TURNSTILE_SCRIPT_LOAD_ERROR")), { once: true });
    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
}

type AuthSignupFormProps = {
  locale: LocaleCode;
};

type RegisterErrorResponse = {
  error?: string;
};

export function AuthSignupForm({ locale }: AuthSignupFormProps) {
  const router = useRouter();
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
  const captchaEnabled = turnstileSiteKey.length > 0;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const captchaContainerRef = useRef<HTMLDivElement | null>(null);
  const captchaWidgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!captchaEnabled) {
      return;
    }

    let cancelled = false;

    const renderCaptcha = async () => {
      try {
        await loadTurnstileScript();

        if (cancelled || !captchaContainerRef.current || !window.turnstile || captchaWidgetIdRef.current) {
          return;
        }

        captchaWidgetIdRef.current = window.turnstile.render(captchaContainerRef.current, {
          sitekey: turnstileSiteKey,
          theme: "auto",
          callback: (token) => {
            setCaptchaToken(token);
          },
          "expired-callback": () => {
            setCaptchaToken(null);
          },
          "error-callback": () => {
            setCaptchaToken(null);
          },
        });
      } catch {
        setError(locale === "eu" ? "Captcha ezin izan da kargatu." : "No se pudo cargar el captcha.");
      }
    };

    void renderCaptcha();

    return () => {
      cancelled = true;

      if (captchaWidgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(captchaWidgetIdRef.current);
      }

      captchaWidgetIdRef.current = null;
    };
  }, [captchaEnabled, locale, turnstileSiteKey]);

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

    if (!acceptedTerms || !acceptedPrivacy) {
      setError(
        locale === "eu"
          ? "Jarraitzeko, baldintzak eta pribatutasun politika onartu behar dituzu."
          : "Para continuar debes aceptar los terminos y la politica de privacidad.",
      );
      return;
    }

    if (captchaEnabled && !captchaToken) {
      setError(locale === "eu" ? "Mesedez, osatu captcha." : "Por favor, completa el captcha.");
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
        acceptedTerms,
        acceptedPrivacy,
        locale,
        captchaToken,
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
        <label className="grid gap-2 text-sm text-ink-secondary">
          <span>{locale === "eu" ? "Izena" : "Nombre"}</span>
          <input
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="rounded-2xl border border-border-default bg-surface-elevated px-4 py-3 text-ink-primary outline-none transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:border-border-strong focus:border-[color:var(--brand-emphasis)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base"
          />
        </label>

        <label className="grid gap-2 text-sm text-ink-secondary">
          <span>{locale === "eu" ? "Abizena" : "Apellidos"}</span>
          <input
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="rounded-2xl border border-border-default bg-surface-elevated px-4 py-3 text-ink-primary outline-none transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:border-border-strong focus:border-[color:var(--brand-emphasis)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm text-ink-secondary">
        <span>Email</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value.toLowerCase())}
          className="rounded-2xl border border-border-default bg-surface-elevated px-4 py-3 text-ink-primary outline-none transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:border-border-strong focus:border-[color:var(--brand-emphasis)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base"
        />
      </label>

      <label className="grid gap-2 text-sm text-ink-secondary">
        <span>{locale === "eu" ? "Telefonoa" : "Telefono"}</span>
        <input
          type="tel"
          autoComplete="tel"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="rounded-2xl border border-border-default bg-surface-elevated px-4 py-3 text-ink-primary outline-none transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:border-border-strong focus:border-[color:var(--brand-emphasis)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-ink-secondary">
          <span>{locale === "eu" ? "Pasahitza" : "Contrasena"}</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-2xl border border-border-default bg-surface-elevated px-4 py-3 text-ink-primary outline-none transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:border-border-strong focus:border-[color:var(--brand-emphasis)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base"
          />
        </label>

        <label className="grid gap-2 text-sm text-ink-secondary">
          <span>{locale === "eu" ? "Pasahitza berriro" : "Repite contrasena"}</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="rounded-2xl border border-border-default bg-surface-elevated px-4 py-3 text-ink-primary outline-none transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:border-border-strong focus:border-[color:var(--brand-emphasis)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base"
          />
        </label>
      </div>

      <div className="space-y-3 rounded-2xl border border-border-subtle bg-surface-subtle p-4 text-sm text-ink-secondary">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            required
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border-default bg-surface-elevated"
          />
          <span>
            {locale === "eu" ? "Onartzen ditut " : "Acepto los "}
            <Link href={`/${locale}/legal/terms`} className="underline decoration-brand-emphasis/70 underline-offset-2 hover:text-ink-primary">
              {locale === "eu" ? "zerbitzuen baldintzak" : "terminos del servicio"}
            </Link>
            .
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            required
            checked={acceptedPrivacy}
            onChange={(event) => setAcceptedPrivacy(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border-default bg-surface-elevated"
          />
          <span>
            {locale === "eu" ? "Onartzen dut " : "Acepto la "}
            <Link href={`/${locale}/legal/privacy`} className="underline decoration-brand-emphasis/70 underline-offset-2 hover:text-ink-primary">
              {locale === "eu" ? "pribatutasun politika" : "politica de privacidad"}
            </Link>
            .
          </span>
        </label>
      </div>

      {captchaEnabled ? (
        <div className="rounded-2xl border border-border-subtle bg-surface-subtle p-3">
          <div ref={captchaContainerRef} />
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

        <div className="flex items-center justify-between gap-3">
          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending
              ? locale === "eu"
                ? "Kontua sortzen..."
                : "Creando cuenta..."
              : locale === "eu"
                ? "Sortu kontua"
                : "Crear cuenta"}
          </Button>

          <Link
            href={`/${locale}/acceso`}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-border-default bg-surface-strong px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted transition-[transform,background-color,border-color,box-shadow,color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-border-strong hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:hover:translate-y-0"
          >
            {locale === "eu" ? "Saioa hasi" : "Ir a acceso"}
          </Link>
        </div>
    </form>
  );
}
