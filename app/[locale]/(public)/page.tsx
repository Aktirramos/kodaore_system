import Link from "next/link";
import { notFound } from "next/navigation";
import { HomeHero } from "@/components/home-hero";
import { SmartImage } from "@/components/smart-image";
import { getCopy, isLocale, type LocaleCode } from "@/lib/i18n";
import { getSiteMedia } from "@/lib/site-media";

type LocaleHomeProps = {
  params: Promise<{ locale: string }>;
};

const sitesSectionClass = "fade-rise fade-rise-delay-200 rounded-3xl border border-border-subtle bg-surface p-5 md:p-7";
const siteCardClass = "group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-strong p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)] transition-[transform,box-shadow,border-color,background-color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-border-default hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:transition-[box-shadow,border-color,background-color]";
const storeSectionClass = "fade-rise fade-rise-delay-250 rounded-3xl border border-border-subtle bg-surface p-5 md:p-7";
const finalSectionClass = "fade-rise fade-rise-delay-300 relative overflow-hidden rounded-3xl border border-border-subtle bg-surface-elevated p-4 md:p-6 shadow-sm";
const finalTextBoxClass = "group/final-box relative overflow-hidden space-y-3 rounded-2xl border border-border-default bg-surface-subtle p-5 transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-surface-subtle/60";

export default async function LocaleHome({ params }: LocaleHomeProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCopy(locale as LocaleCode);
  const storeTitle = locale === "eu" ? "Kodaore arropa" : "Ropa Kodaore";
  const storeDescription = locale === "eu"
    ? "Klubeko sudaderak, kamisetak eta osagarriak galeria bisual batean. Ikusi estiloak eta hurrengo bildumen inspirazioa hartu."
    : "Sudaderas, camisetas y accesorios del club en una galeria visual. Mira estilos e inspírate para las proximas colecciones.";
  const storeCta = locale === "eu" ? "Erropak ikusi" : "Ver ropa";
  const storeImageAlt = locale === "eu" ? "Kodaore arropa bildumaren argazkia" : "Fotografia de la coleccion de ropa de Kodaore";
  const finalImageAlt = locale === "eu" ? "Kodaore argazki nabarmendua" : "Destacado fotografico de Kodaore";

  return (
    <div className="space-y-6 md:space-y-8">
      <HomeHero tagline={copy.tagline} heroTitle={copy.home.heroTitle} heroId="kodaore-home-hero" />

      <section className={sitesSectionClass}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {copy.home.sitesTitle}
            </h2>
            <p className="fade-reveal-left mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">{copy.home.sitesDescription}</p>
          </div>
          <Link
            href={`/${locale}/sedes`}
            className="inline-flex w-fit rounded-full border border-brand/35 bg-surface-strong px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-emphasis transition-[transform,background-color,border-color,box-shadow,color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-brand/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:hover:translate-y-0"
          >
            {copy.ctas.discover}
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {copy.home.sites.map((site) => {
            const media = getSiteMedia(site.slug);

            return (
              <Link
                key={site.slug}
                href={`/${locale}/sedes/${site.slug}`}
                className={siteCardClass}
              >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-subtle via-transparent to-accent-subtle" />
              </div>

              <div className="relative h-44 overflow-hidden rounded-xl border border-border-subtle">
                <SmartImage
                  src={media.coverSrc}
                  fallbackSrc={media.fallbackSrc}
                  alt={locale === "eu" ? `${site.name} aurrebista` : `Vista previa de ${site.name}`}
                  fill
                  parallax
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              </div>

              <div className="relative z-10 mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-emphasis">Kodaore</p>
                <h3 className="mt-1 font-heading text-2xl font-semibold text-foreground">{site.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{site.description}</p>
              </div>
              </Link>
            );
          })}
        </div>
      </section>

<section className={storeSectionClass}>
        <div className="grid gap-4 md:grid-cols-[1.2fr_0.9fr]">
          <article className="group relative min-h-[220px] overflow-hidden rounded-2xl border border-border-subtle transition-[transform,box-shadow,border-color,background-color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-border-default hover:shadow-md motion-reduce:transform-none motion-reduce:transition-[box-shadow,border-color,background-color]">
            <SmartImage
              src="/media/hero-2.jpg"
              fallbackSrc="/media/photo-fallback-2.svg"
              alt={storeImageAlt}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 54vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-black/25" />
            <div className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
              {locale === "eu" ? "Argazki bilduma" : "Galeria"}
            </div>
          </article>

          <div className="group/store relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-strong p-5 transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-surface-subtle/60">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-subtle via-transparent to-accent-subtle opacity-0 transition-opacity duration-300 group-hover/store:opacity-100" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.16em] text-brand-emphasis">
              {locale === "eu" ? "Kolekzio berria" : "Nueva coleccion"}
            </p>
            <h2 className="relative mt-2 font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {storeTitle}
            </h2>
            <p className="relative mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
              {storeDescription}
            </p>

            <div className="relative mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-border-default bg-surface-subtle px-3 py-1 text-xs uppercase tracking-[0.12em] text-ink-secondary">
                {locale === "eu" ? "Sudaderak" : "Sudaderas"}
              </span>
              <span className="rounded-full border border-border-default bg-surface-subtle px-3 py-1 text-xs uppercase tracking-[0.12em] text-ink-secondary">
                {locale === "eu" ? "Kamisetak" : "Camisetas"}
              </span>
              <span className="rounded-full border border-border-default bg-surface-subtle px-3 py-1 text-xs uppercase tracking-[0.12em] text-ink-secondary">
                {locale === "eu" ? "Osagarriak" : "Accesorios"}
              </span>
            </div>

            <Link
              href={`/${locale}/erropak`}
              className="relative mt-6 inline-flex w-fit rounded-full border border-brand/35 bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-emphasis transition-[transform,background-color,border-color,box-shadow,color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-brand/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:hover:translate-y-0"
            >
              {storeCta}
            </Link>
          </div>
        </div>
      </section>

<section className={finalSectionClass}>
        <div className="relative grid items-end gap-6 md:grid-cols-[1.2fr_0.9fr]">
          <article className="group relative min-h-[230px] overflow-hidden rounded-2xl border border-border-subtle md:min-h-[280px]">
            <SmartImage
              src="/media/hero-3.jpg"
              fallbackSrc="/media/photo-fallback-3.svg"
              alt={finalImageAlt}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/20" />
          </article>

          <div className={finalTextBoxClass}>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-subtle via-transparent to-accent-subtle opacity-0 transition-opacity duration-300 group-hover/final-box:opacity-100" />
            <h2 className="relative font-heading text-2xl font-semibold tracking-tight text-ink-primary md:text-3xl">
              {copy.home.photoTitle}
            </h2>
            <p className="fade-reveal-left relative text-sm leading-relaxed text-ink-secondary transition-colors duration-300 group-hover/final-box:text-ink-primary md:text-base">{copy.home.photoDescription}</p>
            <p className="fade-reveal-left relative rounded-xl border border-border-subtle bg-surface-subtle px-3 py-2 text-xs tracking-[0.05em] text-ink-secondary transition-colors duration-300 group-hover/final-box:border-brand/35">{copy.home.photoHint}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
