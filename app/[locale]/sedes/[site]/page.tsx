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
      <section className="fade-rise rounded-3xl border border-black/10 bg-surface p-5 md:p-7">
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
                    : "border border-black/15 bg-white text-foreground hover:border-black/35"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="mt-5 rounded-2xl border border-black/10 bg-white p-4 md:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand/80">Kodaore</p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-foreground">{selectedSite.name}</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{selectedSite.description}</p>

          <article className="group relative mt-4 min-h-[280px] overflow-hidden rounded-2xl border border-black/10 md:min-h-[420px]">
            <SmartImage
              src={visuals.hero}
              fallbackSrc={visuals.fallback}
              alt={selectedSite.name}
              fill
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
            <p className="absolute left-4 top-4 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
              {selectedSite.name}
            </p>
          </article>
        </div>
      </section>

      <section className="fade-rise rounded-3xl border border-black/10 bg-surface p-5 md:p-7">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{copy.home.coachesTitle}</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {selectedSite.coaches.map((coach, index) => {
            const galleryFallback = visuals.gallery[index % visuals.gallery.length];
            const coachPhoto = coach.photo ?? galleryFallback.src;

            return (
              <article key={coach.name} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
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

                <div className="space-y-2 p-4">
                  <h3 className="font-heading text-xl font-semibold text-foreground">{coach.name}</h3>
                  <p className="text-sm text-brand/80">{coach.profile}</p>
                  <p className="text-sm leading-relaxed text-ink-muted">{coach.focus}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">{coach.experience}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
