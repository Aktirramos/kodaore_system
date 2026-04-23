"use client";

import Link from "next/link";
import { RevealOnView } from "../motion/reveal-on-view";
import { SmartImage } from "@/components/smart-image";
import type { LocaleCode } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";
import { getSiteMedia } from "@/lib/site-media";

const headerSectionClass = "fade-rise fade-rise-delay-200 rounded-3xl border border-border-subtle bg-surface p-6 md:p-10 shadow-sm";
const gridSectionClass = "fade-rise fade-rise-delay-250 grid gap-4 md:grid-cols-3";
const siteCardClass = "group relative overflow-hidden rounded-[2rem] border border-border-subtle bg-gradient-to-b from-surface-strong via-surface-strong to-surface shadow-[0_16px_34px_rgba(15,23,42,0.08)] transition-[transform,box-shadow,border-color,background-color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-border-default hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:transition-[box-shadow,border-color,background-color]";

export function Sites({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale).landing.sites;
  const eyebrow = locale === "eu" ? "Egoitzak" : "Sedes";

  return (
    <>
      <section aria-labelledby="landing-sites-title" className={headerSectionClass}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <RevealOnView
              as="p"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-emphasis"
            >
              {eyebrow}
            </RevealOnView>

            <RevealOnView
              as="h2"
              id="landing-sites-title"
              delay={0.08}
              className="mt-2 font-heading font-medium text-ink-primary"
              amount={0.25}
            >
              <span
                className="block"
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.01em",
                }}
              >
                {copy.title}
              </span>
            </RevealOnView>
          </div>

          <RevealOnView
            as="div"
            delay={0.18}
            className="flex flex-wrap gap-2"
          >
            {copy.items.map((site) => (
              <Link
                key={site.slug}
                href={`/${locale}/sedes/${site.slug}`}
                className="rounded-full border border-border-default bg-surface-strong px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-secondary transition-[transform,background-color,border-color,color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-brand/35 hover:text-brand-emphasis focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:hover:translate-y-0"
              >
                {site.city}
              </Link>
            ))}
          </RevealOnView>
        </div>
      </section>

      <section aria-label={eyebrow} className={gridSectionClass}>
        {copy.items.map((site, i) => {
          const media = getSiteMedia(site.slug);
          const imageAlt =
            locale === "eu"
              ? `${site.city} egoitzako argazkia`
              : `Fotografia de la sede de ${site.city}`;
          return (
            <RevealOnView
              key={site.slug}
              as="article"
              delay={0.1 * (i + 1)}
              amount={0.2}
            >
              <Link href={`/${locale}/sedes/${site.slug}`} className={siteCardClass}>
                <div className="relative h-52 overflow-hidden">
                  <SmartImage
                    src={media.coverSrc}
                    fallbackSrc={media.fallbackSrc}
                    alt={imageAlt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                  <p className="absolute left-4 top-4 rounded-full bg-black/45 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                    Kodaore
                  </p>
                </div>
                <div className="space-y-2 p-5 md:p-6">
                  <h3 className="font-heading font-medium text-ink-primary text-2xl md:text-3xl leading-tight">
                    {site.city}
                  </h3>
                  <p className="text-ink-secondary text-base">{site.venue}</p>
                  <p className="text-ink-muted-2 text-sm leading-relaxed">{site.schedule}</p>
                  <p className="pt-2 text-sm font-medium text-brand-emphasis">
                    <span aria-hidden="true">→ </span>
                    <span className="underline underline-offset-4 decoration-1 group-hover:decoration-2">
                      {site.linkLabel}
                    </span>
                  </p>
                </div>
              </Link>
            </RevealOnView>
          );
        })}
      </section>
    </>
  );
}
