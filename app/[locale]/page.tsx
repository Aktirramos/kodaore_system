import Link from "next/link";
import { notFound } from "next/navigation";
import { HomeHero } from "@/components/home-hero";
import { SmartImage } from "@/components/smart-image";
import { getCopy, isLocale, type LocaleCode } from "@/lib/i18n";

type LocaleHomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleHome({ params }: LocaleHomeProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCopy(locale as LocaleCode);

  return (
    <div className="space-y-6 md:space-y-8">
      <HomeHero tagline={copy.tagline} heroTitle={copy.home.heroTitle} />

      <section className="fade-rise fade-rise-delay-200 rounded-3xl border border-black/10 bg-surface p-5 md:p-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {copy.home.sitesTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">{copy.home.sitesDescription}</p>
          </div>
          <Link
            href={`/${locale}/sedes`}
            className="inline-flex w-fit rounded-full border border-brand/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand transition hover:border-brand/55"
          >
            {copy.ctas.discover}
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {copy.home.sites.map((site) => (
            <Link
              key={site.slug}
              href={`/${locale}/sedes/${site.slug}`}
              className="rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-0.5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Kodaore</p>
              <h3 className="mt-1 font-heading text-2xl font-semibold text-foreground">{site.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="fade-rise fade-rise-delay-300 relative overflow-hidden rounded-3xl border border-black/15 bg-[#101214] p-4 md:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(227,30,36,0.24),transparent_38%),radial-gradient(circle_at_85%_85%,rgba(11,158,74,0.28),transparent_45%)]" />
        <div className="relative grid items-end gap-6 md:grid-cols-[1.2fr_0.9fr]">
          <article className="group relative min-h-[230px] overflow-hidden rounded-2xl border border-white/20 md:min-h-[280px]">
            <SmartImage
              src="/media/hero-3.jpg"
              fallbackSrc="/media/photo-fallback-3.svg"
              alt="Kodaore photography highlight"
              fill
              className="object-cover transition duration-700 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/20" />
          </article>

          <div className="space-y-3 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {copy.home.photoTitle}
            </h2>
            <p className="text-sm leading-relaxed text-white/85 md:text-base">{copy.home.photoDescription}</p>
            <p className="rounded-xl bg-black/25 px-3 py-2 text-xs tracking-[0.05em] text-white/90">{copy.home.photoHint}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
