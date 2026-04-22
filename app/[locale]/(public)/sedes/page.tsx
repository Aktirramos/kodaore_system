import Link from "next/link";
import { notFound } from "next/navigation";
import { SmartImage } from "@/components/smart-image";
import { getCopy, isLocale, type LocaleCode } from "@/lib/i18n";
import { getSiteMedia } from "@/lib/site-media";

type LocaleSedesProps = {
  params: Promise<{ locale: string }>;
};

const headerSectionClass = "fade-rise rounded-3xl border border-border-subtle bg-surface p-5 md:p-7";
const siteCardClass = "group overflow-hidden rounded-[2rem] border border-border-subtle bg-gradient-to-b from-surface-strong via-surface-strong to-surface shadow-[0_16px_34px_rgba(15,23,42,0.08)] transition-[transform,box-shadow,border-color,background-color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-border-default hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:transition-[box-shadow,border-color,background-color]";
const siteTextBoxClass = "group/text relative space-y-4 px-5 pb-5 pt-4 transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-surface-subtle/60";
const finalSectionClass = "fade-rise relative overflow-hidden rounded-3xl border border-border-subtle bg-surface-elevated p-5 md:p-7 shadow-sm";
const finalTextBoxClass = "group/final-box relative overflow-hidden rounded-2xl border border-border-default bg-surface-subtle p-4 transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-surface-subtle/60";

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
              className="rounded-full border border-border-default bg-surface-strong px-4 py-2 text-sm font-medium text-foreground transition-[transform,background-color,border-color,box-shadow,color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-brand/35 hover:text-brand-emphasis focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:hover:translate-y-0"
            >
              {site.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-3">
        {copy.home.sites.map((site) => {
          const visual = getSiteMedia(site.slug);
          const siteImageAlt =
            locale === "eu"
              ? `${site.name} egoitzako entrenamendu irudia`
              : `Imagen de entrenamiento en la sede de ${site.name}`;

          return (
            <Link
              key={site.slug}
              href={`/${locale}/sedes/${site.slug}`}
              className={siteCardClass}
            >
                <div className="group relative h-50 overflow-hidden">
                <SmartImage
                  src={visual.coverSrc}
                  fallbackSrc={visual.fallbackSrc}
                  alt={siteImageAlt}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                <p className="absolute left-4 top-4 rounded-full bg-black/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                  Kodaore
                </p>
              </div>

              <div className={siteTextBoxClass}>
                  <div className="pointer-events-none absolute inset-2 rounded-[1.2rem] bg-gradient-to-br from-brand-subtle via-transparent to-accent-subtle opacity-0 transition-opacity duration-300 group-hover/text:opacity-100" />
                <div>
                  <h2 className="relative font-heading text-2xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover/text:text-brand-emphasis">{site.name}</h2>
                  <p className="relative mt-2 text-sm leading-relaxed text-ink-muted transition-colors duration-300 group-hover/text:text-ink-secondary">{site.description}</p>
                </div>

                <div>
                  <p className="relative text-xs font-semibold uppercase tracking-[0.15em] text-brand-emphasis">{copy.home.coachesTitle}</p>
                  <ul className="mt-2 space-y-1.5">
                    {site.coaches.map((coach) => (
                      <li
                        key={coach.name}
                        className="relative text-sm text-ink-secondary transition-colors duration-300 group-hover/text:text-ink-primary"
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
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-subtle via-transparent to-accent-subtle opacity-0 transition-opacity duration-300 group-hover/final-box:opacity-100" />
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-ink-primary md:text-3xl">{copy.home.photoTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-secondary transition-colors duration-300 group-hover/final-box:text-ink-primary">{copy.home.photoHint}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
