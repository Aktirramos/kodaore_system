import Link from "next/link";
import { notFound } from "next/navigation";
import { SmartImage } from "@/components/smart-image";
import { getCopy, isLocale, type LocaleCode } from "@/lib/i18n";

type LocaleSitePageProps = {
  params: Promise<{ locale: string; site: string }>;
};

const siteVisuals: Record<string, { hero: string; fallback: string; gallery: Array<{ src: string; fallback: string }> }> = {
  azkoitia: {
    hero: "/media/hero-1.jpg",
    fallback: "/media/photo-fallback-1.svg",
    gallery: [
      { src: "/media/hero-1.jpg", fallback: "/media/photo-fallback-1.svg" },
      { src: "/media/judo-4.jpg", fallback: "/media/photo-fallback-1.svg" },
      { src: "/media/judo-6.jpg", fallback: "/media/photo-fallback-3.svg" },
    ],
  },
  azpeitia: {
    hero: "/media/hero-2.jpg",
    fallback: "/media/photo-fallback-2.svg",
    gallery: [
      { src: "/media/hero-2.jpg", fallback: "/media/photo-fallback-2.svg" },
      { src: "/media/judo-5.jpg", fallback: "/media/photo-fallback-2.svg" },
      { src: "/media/judo-4.jpg", fallback: "/media/photo-fallback-1.svg" },
    ],
  },
  zumaia: {
    hero: "/media/hero-3.jpg",
    fallback: "/media/photo-fallback-3.svg",
    gallery: [
      { src: "/media/hero-3.jpg", fallback: "/media/photo-fallback-3.svg" },
      { src: "/media/judo-6.jpg", fallback: "/media/photo-fallback-3.svg" },
      { src: "/media/judo-5.jpg", fallback: "/media/photo-fallback-2.svg" },
    ],
  },
};

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

  const visuals = siteVisuals[site] ?? siteVisuals.azkoitia;

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-5 md:p-7">
        <div className="flex flex-wrap items-center gap-2">
          {copy.home.sites.map((item) => {
            const active = item.slug === site;

            return (
              <Link
                key={item.slug}
                href={`/${locale}/sedes/${item.slug}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
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
          <div className="group/text relative overflow-hidden rounded-xl border border-transparent p-3 transition-colors duration-500 hover:border-brand/35 hover:bg-black/20">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/14 via-transparent to-brand-warm/14 opacity-0 transition-opacity duration-500 group-hover/text:opacity-100" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.15em] text-brand-emphasis">Kodaore</p>
            <h1 className="relative mt-1 font-heading text-3xl font-semibold tracking-tight text-foreground transition-colors duration-500 group-hover/text:text-white">{selectedSite.name}</h1>
            <p className="relative mt-3 text-sm leading-relaxed text-ink-muted transition-colors duration-500 group-hover/text:text-foreground">{selectedSite.description}</p>
          </div>

          <article className="group relative mt-4 min-h-[280px] overflow-hidden rounded-2xl border border-white/10 md:min-h-[420px]">
            <SmartImage
              src={visuals.hero}
              fallbackSrc={visuals.fallback}
              alt={selectedSite.name}
              fill
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

      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-5 md:p-7">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{copy.home.coachesTitle}</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {selectedSite.coaches.map((coach, index) => {
            const galleryFallback = visuals.gallery[index % visuals.gallery.length];
            const coachPhoto = coach.photo ?? galleryFallback.src;

            return (
              <article key={coach.name} className="overflow-hidden rounded-2xl border border-white/10 bg-surface-strong">
                <div className="group relative min-h-[220px] overflow-hidden">
                  <SmartImage
                    src={coachPhoto}
                    fallbackSrc={galleryFallback.fallback}
                    alt={coach.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/12 to-transparent" />
                </div>

                <div className="group/text relative overflow-hidden space-y-2 rounded-xl border border-transparent p-4 transition-colors duration-500 hover:border-brand/35 hover:bg-black/20">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/14 via-transparent to-brand-warm/14 opacity-0 transition-opacity duration-500 group-hover/text:opacity-100" />
                  <h3 className="relative font-heading text-xl font-semibold text-foreground transition-colors duration-500 group-hover/text:text-white">{coach.name}</h3>
                  <p className="relative text-sm text-brand-emphasis">{coach.profile}</p>
                  <p className="relative text-sm leading-relaxed text-ink-muted transition-colors duration-500 group-hover/text:text-foreground">{coach.focus}</p>
                  <p className="relative text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted transition-colors duration-500 group-hover/text:text-foreground">{coach.experience}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
