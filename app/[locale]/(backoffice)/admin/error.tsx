"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { reportSegmentClientError } from "@/lib/observability";

type AdminErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function AdminError({ error, unstable_retry }: AdminErrorProps) {
  const pathname = usePathname() ?? "/eu/admin";
  const isEu = pathname.startsWith("/eu");
  const locale = isEu ? "eu" : "es";

  useEffect(() => {
    void reportSegmentClientError({
      source: "admin-segment",
      locale,
      pathname,
      message: error.message,
      digest: error.digest,
    });

    console.error("Admin segment error", {
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
          {isEu ? "Ezin izan dugu admin panela kargatu" : "No hemos podido cargar el panel de admin"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-muted md:text-base">
          {isEu
            ? "Baliteke datuen sinkronizazioan atzerapena egotea. Saiatu berriro segundu batzuetan."
            : "Puede haber un retraso temporal en la sincronizacion de datos. Intenta de nuevo en unos segundos."}
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
            href={`/${locale}/admin`}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-foreground transition-[background-color,color,border-color,transform] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base active:scale-[0.98]"
          >
            {isEu ? "Adminera itzuli" : "Volver a admin"}
          </Link>
        </div>
      </section>
    </div>
  );
}
