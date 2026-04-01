import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

type AccessPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AccessPage({ params }: AccessPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <div className="fade-rise mx-auto max-w-lg rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">Acceso</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground">Login V1</h1>
      <p className="mt-3 text-sm text-ink-muted">
        Pantalla reservada para integrar autenticacion con familias, profesorado y administracion.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/${locale}/admin`}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-contrast"
        >
          Ir a admin
        </Link>
        <Link
          href={`/${locale}/portal`}
          className="rounded-full border border-brand/35 px-5 py-2.5 text-sm font-semibold text-brand-emphasis"
        >
          Ir a portal
        </Link>
      </div>
    </div>
  );
}
