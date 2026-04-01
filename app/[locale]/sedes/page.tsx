import Link from "next/link";
import { notFound } from "next/navigation";
import { SmartImage } from "@/components/smart-image";
import { getCopy, isLocale, type LocaleCode } from "@/lib/i18n";

type LocaleSedesProps = {
  params: Promise<{ locale: string }>;
};

const siteImages = [
  { src: "/media/hero-1.jpg", fallback: "/media/photo-fallback-1.svg" },
  { src: "/media/hero-2.jpg", fallback: "/media/photo-fallback-2.svg" },
  { src: "/media/hero-3.jpg", fallback: "/media/photo-fallback-3.svg" },
];

export default async function LocaleSedesPage({ params }: LocaleSedesProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCopy(locale as LocaleCode);

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="fade-rise rounded-3xl border border-black/10 bg-surface p-5 md:p-7">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand/80">Kodaore</p>
            <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {copy.home.sitesTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
              {copy.home.sitesDescription}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {copy.home.sites.map((site) => (
            <Link
              key={site.slug}
              href={`/${locale}/sedes/${site.slug}`}
              className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:border-black/35"
            >
              {site.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-3">
        {copy.home.sites.map((site, index) => {
          const visual = siteImages[index % siteImages.length];

          return (
            <Link
              key={site.slug}
              href={`/${locale}/sedes/${site.slug}`}
              className="group overflow-hidden rounded-3xl border border-black/10 bg-white transition hover:-translate-y-0.5"
            >
              <div className="group relative h-48 overflow-hidden">
                <SmartImage
                  src={visual.src}
                  fallbackSrc={visual.fallback}
                  alt={site.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                <p className="absolute left-4 top-4 rounded-full bg-white/92 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
                  Kodaore
                </p>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">{site.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{site.description}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand/80">{copy.home.coachesTitle}</p>
                  <ul className="mt-2 space-y-2">
                    {site.coaches.map((coach) => (
                      <li
                        key={coach.name}
                        className="rounded-xl border border-black/10 bg-[#f6f6f6] px-3 py-2 text-sm text-foreground"
                      >
                        {coach.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="fade-rise rounded-3xl border border-black/10 bg-[#151719] p-5 md:p-7">
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-white md:text-3xl">{copy.home.photoTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">{copy.home.photoHint}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
