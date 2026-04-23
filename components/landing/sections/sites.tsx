"use client";

import Link from "next/link";
import { RevealOnView } from "../motion/reveal-on-view";
import type { LocaleCode } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

export function Sites({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale).landing.sites;
  return (
    <section
      aria-labelledby="landing-sites-title"
      className="relative"
    >
      <div className="mx-auto w-full max-w-6xl px-5 md:px-12 py-[clamp(5rem,10vh,8rem)]">
        <RevealOnView
          as="h2"
          id="landing-sites-title"
          className="font-heading font-medium text-ink-primary"
          amount={0.3}
        >
          <span
            className="block"
            style={{
              fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            {copy.title}
          </span>
        </RevealOnView>

        <ul className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-border-subtle">
          {copy.items.map((site, i) => (
            <RevealOnView
              key={site.slug}
              as="li"
              delay={0.1 * (i + 1)}
              amount={0.25}
              className={`border-b border-border-subtle md:border-b-0 md:border-r md:last:border-r-0 py-6 md:py-8 md:px-6 md:first:pl-0 md:last:pr-0`}
            >
              <h3 className="font-heading font-medium text-ink-primary text-2xl md:text-3xl leading-tight">
                {site.city}
              </h3>
              <p className="mt-2 text-ink-secondary text-base">
                {site.venue}
              </p>
              <p className="mt-1 text-ink-muted-2 text-sm leading-relaxed">
                {site.schedule}
              </p>
              <Link
                href={`/${locale}/sedes/${site.slug}`}
                className="mt-4 inline-flex items-center gap-2 text-ink-primary text-sm font-medium hover:text-brand-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-base"
              >
                <span>→</span>
                <span className="underline underline-offset-4 decoration-1 hover:decoration-2">
                  {site.linkLabel}
                </span>
              </Link>
            </RevealOnView>
          ))}
        </ul>
      </div>
    </section>
  );
}
