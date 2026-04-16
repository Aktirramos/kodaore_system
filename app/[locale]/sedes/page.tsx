import Link from "next/link";
import { notFound } from "next/navigation";
import { SmartImage } from "@/components/smart-image";
import { getCopy, isLocale, type LocaleCode } from "@/lib/i18n";

type LocaleSedesProps = {
  params: Promise<{ locale: string }>;
};

const siteImages = [
  { src: "/media/sedes/azkoitia-poli.jpg", fallback: "/media/photo-fallback-1.svg" },
  { src: "/media/sedes/azpeitia-poli.jpg", fallback: "/media/photo-fallback-2.svg" },
  { src: "/media/sedes/zumaia-poli.jpg", fallback: "/media/photo-fallback-3.svg" },
];

const headerSectionClass = "fade-rise rounded-3xl border border-white/10 bg-surface p-5 md:p-7";
const siteCardClass = "k-hover-lift group overflow-hidden rounded-[2rem] border border-white/8 bg-gradient-to-b from-surface-strong via-surface-strong to-surface/80 shadow-[0_16px_34px_rgba(15,23,42,0.24)]";
const siteTextBoxClass = "k-hover-soft group/text relative space-y-4 px-5 pb-5 pt-4";
const finalSectionClass = "fade-rise relative overflow-hidden rounded-3xl border border-white/10 bg-[#151719] p-5 md:p-7";
const finalTextBoxClass = "k-hover-soft group/final-box relative overflow-hidden rounded-2xl border border-white/15 bg-black/20 p-4";

export default async function LocaleSedesPage({ params }: LocaleSedesProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCopy(locale as LocaleCode);

  return (
    <div className="space-y-6 md:space-y-8">
      <section className={headerSectionClass}>
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
              className="k-focus-ring k-hover-action rounded-full border border-white/20 bg-surface-strong px-4 py-2 text-sm font-medium text-foreground hover:border-brand/35 hover:text-brand-emphasis"
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
              className={siteCardClass}
            >
                <div className="group relative h-50 overflow-hidden">
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

              <div className={siteTextBoxClass}>
                  <div className="pointer-events-none absolute inset-x-0 -top-4 h-10 bg-gradient-to-b from-black/35 to-transparent" />
                  <div className="pointer-events-none absolute inset-2 rounded-[1.2rem] bg-gradient-to-br from-brand/10 via-transparent to-brand-warm/10 opacity-0 transition-opacity duration-500 group-hover/text:opacity-100" />
                <div>
                  <h2 className="relative font-heading text-2xl font-semibold tracking-tight text-foreground transition-colors duration-500 group-hover/text:text-white">{site.name}</h2>
                  <p className="relative mt-2 text-sm leading-relaxed text-ink-muted transition-colors duration-500 group-hover/text:text-foreground">{site.description}</p>
                </div>

                <div>
                  <p className="relative text-xs font-semibold uppercase tracking-[0.15em] text-brand-emphasis">{copy.home.coachesTitle}</p>
                  <ul className="mt-2 space-y-1.5">
                    {site.coaches.map((coach) => (
                      <li
                        key={coach.name}
                        className="relative text-sm text-foreground/90 transition-colors duration-500 group-hover/text:text-foreground"
                      >
                          * {coach.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      <section className={finalSectionClass}>
        <div className="relative flex flex-col gap-3">
          <div className={finalTextBoxClass}>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand/14 via-transparent to-brand-warm/14 opacity-0 transition-opacity duration-500 group-hover/final-box:opacity-100" />
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-white md:text-3xl">{copy.home.photoTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80 transition-colors duration-500 group-hover/final-box:text-white">{copy.home.photoHint}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
