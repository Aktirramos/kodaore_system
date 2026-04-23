"use client";

import Link from "next/link";
import { RevealOnView } from "../motion/reveal-on-view";
import type { LocaleCode } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

const sectionClass = "fade-rise fade-rise-delay-200 rounded-3xl border border-border-subtle bg-surface p-6 md:p-10 shadow-sm";

export function Sites({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale).landing.sites;
  const eyebrow = locale === "eu" ? "Egoitzak" : "Sedes";

  return (
    <section aria-labelledby="landing-sites-title" className={sectionClass}>
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

      <ul className="mt-8 md:mt-10 divide-y divide-border-subtle border-t border-b border-border-subtle">
        {copy.items.map((site, i) => (
          <RevealOnView
            key={site.slug}
            as="li"
            delay={0.1 * (i + 1)}
            amount={0.2}
          >
            <Link
              href={`/${locale}/sedes/${site.slug}`}
              className="group flex flex-col gap-2 py-5 md:flex-row md:items-baseline md:justify-between md:gap-6 md:py-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base"
            >
              <span className="font-heading font-medium text-ink-primary text-2xl md:text-3xl leading-tight group-hover:text-brand-emphasis transition-colors">
                {site.city}
              </span>
              <span className="text-ink-muted-2 text-sm md:text-base md:text-right flex-1">
                {site.venue}
              </span>
              <span
                aria-hidden="true"
                className="text-ink-muted-2 text-sm md:text-base transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </RevealOnView>
        ))}
      </ul>
    </section>
  );
}
