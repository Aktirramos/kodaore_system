"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { reportSegmentClientError } from "@/lib/observability";

type PortalErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function PortalError({ error, unstable_retry }: PortalErrorProps) {
  const pathname = usePathname() ?? "/eu/portal";
  const isEu = pathname.startsWith("/eu");
  const locale = isEu ? "eu" : "es";

  useEffect(() => {
    void reportSegmentClientError({
      source: "portal-segment",
      locale,
      pathname,
      message: error.message,
      digest: error.digest,
    });

    console.error("Portal segment error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error, locale, pathname]);

  return (
    <div className="space-y-6">
      <section className="fade-rise rounded-3xl border border-rose-300/20 bg-rose-500/10 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
          {isEu ? "Errorea" : "Error"}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {isEu ? "Ezin izan dugu ataria kargatu" : "No hemos podido cargar el portal"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-muted md:text-base">
          {isEu
            ? "Aldi baterako arazo bat egon da. Saiatu berriro edo itzuli laburpenera minutu bat barru."
            : "Ha ocurrido un problema temporal. Prueba de nuevo o vuelve al resumen en un minuto."}
        </p>
        {error.digest ? (
          <p className="mt-3 text-xs text-rose-200/80">ID: {error.digest}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-rose-300/40 bg-rose-500/20 px-5 py-2 text-sm font-semibold text-rose-100 transition-[background-color,color,border-color,transform] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-rose-500/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base active:scale-[0.98]"
          >
            {isEu ? "Berriro saiatu" : "Reintentar"}
          </button>
          <Link
            href={`/${locale}/portal`}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-foreground transition-[background-color,color,border-color,transform] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base active:scale-[0.98]"
          >
            {isEu ? "Atarira itzuli" : "Volver al portal"}
          </Link>
        </div>
      </section>
    </div>
  );
}
