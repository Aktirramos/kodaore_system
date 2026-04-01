import { notFound } from "next/navigation";
import { getCopy, isLocale, type LocaleCode } from "@/lib/i18n";

type PortalPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PortalPage({ params }: PortalPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCopy(locale as LocaleCode);

  return (
    <div className="space-y-6">
      <section className="fade-rise rounded-3xl border border-black/10 bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{copy.ctas.access}</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Familia eta ikasleen ataria
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-muted md:text-base">
          Lehen bertsioan datu pertsonalak, komunikazioak eta ordainketen egoera kontsultatzeko prestatuta dago.
          Erreserbak hurrengo fasean gehituko dira.
        </p>
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-3">
        <InfoCard title="Datu pertsonalak" description="Ikasleen fitxa eta kontaktu datuak ikusgai." />
        <InfoCard title="Ordainketak" description="Kuoten egoera, kobratutakoak eta pendienteak." />
        <InfoCard title="Komunikazioak" description="Egoitzako oharrak eta administrazio mezuak." />
      </section>
    </div>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="rounded-2xl border border-black/10 bg-surface p-5">
      <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-ink-muted">{description}</p>
    </article>
  );
}
