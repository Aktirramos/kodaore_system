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
      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-5 md:p-7">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-emphasis">Kodaore</p>
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
              className="rounded-full border border-white/20 bg-surface-strong px-4 py-2 text-sm font-medium text-foreground transition hover:border-brand/35 hover:text-brand-emphasis"
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
              className="group overflow-hidden rounded-3xl border border-white/10 bg-surface-strong shadow-[0_14px_30px_rgba(15,23,42,0.26)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(15,23,42,0.36)]"
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
                <p className="absolute left-4 top-4 rounded-full bg-black/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                  Kodaore
                </p>
              </div>

              <div className="group/text relative space-y-4 rounded-2xl border border-transparent p-5 transition-colors duration-500 hover:border-brand/35 hover:bg-black/20">
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/16 via-transparent to-brand-warm/16 opacity-0 transition-opacity duration-500 group-hover/text:opacity-100" />
                <div>
                  <h2 className="relative font-heading text-2xl font-semibold tracking-tight text-foreground transition-colors duration-500 group-hover/text:text-white">{site.name}</h2>
                  <p className="relative mt-2 text-sm leading-relaxed text-ink-muted transition-colors duration-500 group-hover/text:text-foreground">{site.description}</p>
                </div>

                <div>
                    <p className="relative text-xs font-semibold uppercase tracking-[0.15em] text-brand-emphasis">{copy.home.coachesTitle}</p>
                  <ul className="mt-2 space-y-2">
                    {site.coaches.map((coach) => (
                      <li
                        key={coach.name}
                        className="relative rounded-xl border border-white/10 bg-background/45 px-3 py-2 text-sm text-foreground transition-colors duration-500 group-hover/text:border-brand/25"
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

      <section className="fade-rise relative overflow-hidden rounded-3xl border border-white/10 bg-[#151719] p-5 md:p-7">
        <div className="relative flex flex-col gap-3">
          <div className="group/final-box relative overflow-hidden rounded-2xl border border-white/15 bg-black/20 p-4 transition-colors duration-500 hover:border-brand/35">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand/14 via-transparent to-brand-warm/14 opacity-0 transition-opacity duration-500 group-hover/final-box:opacity-100" />
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-white md:text-3xl">{copy.home.photoTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80 transition-colors duration-500 group-hover/final-box:text-white">{copy.home.photoHint}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
