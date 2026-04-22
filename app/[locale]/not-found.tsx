"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const knownLocales = ["eu", "es"] as const;

type SupportedLocale = (typeof knownLocales)[number];

function resolveLocale(pathname: string): SupportedLocale {
  const segment = pathname.split("/").filter(Boolean)[0];
  return knownLocales.includes(segment as SupportedLocale) ? (segment as SupportedLocale) : "eu";
}

export default function LocaleNotFound() {
  const pathname = usePathname();
  const locale = resolveLocale(pathname);
  const isEu = locale === "eu";

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-border-subtle bg-surface-strong p-6 md:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_14%_8%,rgba(190,18,60,0.22)_0%,rgba(190,18,60,0)_58%),radial-gradient(95%_85%_at_90%_12%,rgba(5,150,105,0.2)_0%,rgba(5,150,105,0)_62%),linear-gradient(180deg,rgba(8,9,10,0.28)_0%,rgba(8,9,10,0.84)_100%)]" />

      <section className="relative mx-auto max-w-3xl rounded-3xl border border-border-subtle bg-surface-elevated p-6 shadow-sm backdrop-blur-md md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">Error 404</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink-primary md:text-5xl">
          {isEu ? "Ez dugu orri hori aurkitu" : "No hemos encontrado esa pagina"}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-secondary md:text-base">
          {isEu
            ? "Begiratzen ari zaren helbidea ez da existitzen edo mugitu egin da. Hasi berriro hasieratik eta aukeratu egoitza, fototeka edo familien ataria."
            : "La direccion que estas buscando no existe o se ha movido. Puedes volver al inicio y acceder a sedes, fototeca o al area de familias."}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/${locale}`}
            className="rounded-full border border-brand/45 bg-brand px-4 py-2 text-sm font-semibold text-brand-contrast transition-[transform,background-color,border-color,box-shadow,color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:hover:translate-y-0"
          >
            {isEu ? "Hasiera itzuli" : "Volver al inicio"}
          </Link>
          <Link
            href={`/${locale}/sedes`}
            className="rounded-full border border-border-default bg-surface-subtle px-4 py-2 text-sm font-semibold text-ink-primary transition-[transform,background-color,border-color,box-shadow,color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:hover:translate-y-0"
          >
            {isEu ? "Egoitzak ikusi" : "Ver sedes"}
          </Link>
          <Link
            href={`/${locale}/acceso`}
            className="rounded-full border border-border-subtle bg-surface-subtle px-4 py-2 text-sm font-semibold text-ink-secondary transition-[transform,background-color,border-color,box-shadow,color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:hover:translate-y-0"
          >
            {isEu ? "Familien sarbidea" : "Acceso familias"}
          </Link>
        </div>
      </section>
    </div>
  );
}
