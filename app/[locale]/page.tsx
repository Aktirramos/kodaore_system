import Link from "next/link";
import { notFound } from "next/navigation";
import { HomeHeroScrollSync } from "@/components/home-hero-scroll-sync";
import { SmartImage } from "@/components/smart-image";
import { getCopy, isLocale, type LocaleCode } from "@/lib/i18n";

type LocaleHomeProps = {
  params: Promise<{ locale: string }>;
};

const sitePreviewMedia: Record<string, { src: string; fallbackSrc: string }> = {
  azkoitia: { src: "/media/judo-4.jpg", fallbackSrc: "/media/photo-fallback-1.svg" },
  azpeitia: { src: "/media/judo-5.jpg", fallbackSrc: "/media/photo-fallback-2.svg" },
  zumaia: { src: "/media/judo-6.jpg", fallbackSrc: "/media/photo-fallback-3.svg" },
};

const sitesSectionClass = "fade-rise fade-rise-delay-200 rounded-3xl border border-white/10 bg-surface p-5 md:p-7";
const siteCardClass = "k-hover-lift group relative overflow-hidden rounded-2xl border border-white/10 bg-surface-strong p-5 shadow-[0_14px_30px_rgba(15,23,42,0.28)]";
const finalSectionClass = "fade-rise fade-rise-delay-300 relative overflow-hidden rounded-3xl border border-white/10 bg-[#151719] p-4 md:p-6";
const finalTextBoxClass = "k-hover-soft group/final-box relative overflow-hidden space-y-3 rounded-2xl border border-white/20 bg-black/25 p-5 backdrop-blur-sm";

export default async function LocaleHome({ params }: LocaleHomeProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCopy(locale as LocaleCode);

  return (
    <div className="space-y-6 md:space-y-8">
      <HomeHeroScrollSync tagline={copy.tagline} heroTitle={copy.home.heroTitle} />

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
            className="k-focus-ring k-hover-action inline-flex w-fit rounded-full border border-brand/35 bg-surface-strong px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-emphasis hover:border-brand/60"
          >
            {copy.ctas.discover}
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {copy.home.sites.map((site) => (
            <Link
              key={site.slug}
              href={`/${locale}/sedes/${site.slug}`}
              className={siteCardClass}
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/18 via-transparent to-brand-warm/18" />
              </div>

              <div className="relative h-44 overflow-hidden rounded-xl border border-white/10">
                <SmartImage
                  src={sitePreviewMedia[site.slug]?.src ?? "/media/hero-1.jpg"}
                  fallbackSrc={sitePreviewMedia[site.slug]?.fallbackSrc ?? "/media/photo-fallback-1.svg"}
                  alt={`${site.name} preview`}
                  fill
                  parallax
                  className="object-cover transition duration-700 group-hover:scale-105"
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
          ))}
        </div>
      </section>

      <section className={finalSectionClass}>
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(17,24,39,0.35),rgba(17,24,39,0.12)_45%,rgba(17,24,39,0.35))]" />
        <div className="relative grid items-end gap-6 md:grid-cols-[1.2fr_0.9fr]">
          <article className="group relative min-h-[230px] overflow-hidden rounded-2xl border border-white/10 md:min-h-[280px]">
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

          <div className={finalTextBoxClass}>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/12 via-transparent to-brand-warm/12 opacity-0 transition-opacity duration-500 group-hover/final-box:opacity-100" />
            <h2 className="relative font-heading text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {copy.home.photoTitle}
            </h2>
            <p className="fade-reveal-left relative text-sm leading-relaxed text-white/85 transition-colors duration-500 group-hover/final-box:text-white md:text-base">{copy.home.photoDescription}</p>
            <p className="fade-reveal-left relative rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs tracking-[0.05em] text-white/90 transition-colors duration-500 group-hover/final-box:border-brand/35 group-hover/final-box:bg-black/35">{copy.home.photoHint}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
