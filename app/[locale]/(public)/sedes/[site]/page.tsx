import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoachProfileCard } from "@/components/coach-profile-card";
import { SmartImage } from "@/components/smart-image";
import { getCopy, isLocale, type LocaleCode } from "@/lib/i18n";
import { getSiteMedia } from "@/lib/site-media";
import { buildSiteStructuredData } from "@/lib/structured-data";

type LocaleSitePageProps = {
  params: Promise<{ locale: string; site: string }>;
};

const panelSectionClass = "fade-rise rounded-3xl border border-white/10 bg-surface p-5 md:p-7";
const textHoverBoxClass = "k-hover-soft group/text relative overflow-hidden rounded-xl border border-transparent p-3";

export async function generateMetadata({ params }: LocaleSitePageProps): Promise<Metadata> {
  const { locale, site } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCopy(locale as LocaleCode);
  const selectedSite = copy.home.sites.find((item) => item.slug === site);

  if (!selectedSite) {
    notFound();
  }

  const title =
    locale === "eu"
      ? `Kodaore | ${selectedSite.name} egoitza - Judo kluba eta entrenamenduak`
      : `Kodaore | Sede de ${selectedSite.name} - Club y entrenamiento de judo`;

  const description =
    locale === "eu"
      ? `${selectedSite.name} egoitzan, Kodaorek judo entrenamendu egituratua eta giro hezitzailea eskaintzen ditu: ${selectedSite.description}`
      : `En la sede de ${selectedSite.name}, Kodaore ofrece entrenamiento de judo estructurado y un entorno formativo: ${selectedSite.description}`;

  return {
    title,
    description,
  };
}

export default async function LocaleSitePage({ params }: LocaleSitePageProps) {
  const { locale, site } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCopy(locale as LocaleCode);
  const selectedSite = copy.home.sites.find((item) => item.slug === site);

  if (!selectedSite) {
    notFound();
  }

  const visuals = getSiteMedia(site);
  const structuredData = buildSiteStructuredData({ locale, site });
  const coverImageAlt =
    locale === "eu"
      ? `${selectedSite.name} egoitzako entrenamendu irudi nagusia`
      : `Imagen principal de entrenamiento en la sede de ${selectedSite.name}`;

  return (
    <>
      {structuredData ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      ) : null}

      <div className="space-y-6 md:space-y-8">
        <section className={panelSectionClass}>
          <div className="flex flex-wrap items-center gap-2">
            {copy.home.sites.map((item) => {
              const active = item.slug === site;

              return (
                <Link
                  key={item.slug}
                  href={`/${locale}/sedes/${item.slug}`}
                  className={`k-focus-ring k-hover-action rounded-full px-4 py-2 text-sm font-medium ${
                    active
                      ? "border border-brand bg-brand text-brand-contrast"
                      : "border border-white/20 bg-surface-strong text-foreground hover:border-white/40"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-surface-strong p-4 md:p-5">
            <div className={textHoverBoxClass}>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/14 via-transparent to-brand-warm/14 opacity-0 transition-opacity duration-500 group-hover/text:opacity-100" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.15em] text-brand-emphasis">Kodaore</p>
              <h1 className="relative mt-1 font-heading text-3xl font-semibold tracking-tight text-foreground transition-colors duration-500 group-hover/text:text-white">{selectedSite.name}</h1>
              <p className="relative mt-3 text-sm leading-relaxed text-ink-muted transition-colors duration-500 group-hover/text:text-foreground">{selectedSite.description}</p>
            </div>

            <article className="k-hover-lift group relative mt-4 min-h-[280px] overflow-hidden rounded-2xl border border-white/10 md:min-h-[420px]">
              <SmartImage
                src={visuals.coverSrc}
                fallbackSrc={visuals.fallbackSrc}
                alt={coverImageAlt}
                fill
                priority
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
              <p className="absolute left-4 top-4 rounded-full bg-black/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                {selectedSite.name}
              </p>
            </article>
          </div>
        </section>

        <section className={panelSectionClass}>
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{copy.home.coachesTitle}</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {selectedSite.coaches.map((coach, index) => {
              const galleryFallback = visuals.gallery[index % visuals.gallery.length];
              const coachPhoto = coach.photo ?? galleryFallback.src;

              return (
                <CoachProfileCard
                  key={coach.name}
                  locale={locale}
                  siteName={selectedSite.name}
                  coach={coach}
                  photoSrc={coachPhoto}
                  fallbackSrc={galleryFallback.fallbackSrc}
                />
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
