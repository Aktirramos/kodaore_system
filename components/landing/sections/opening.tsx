"use client";

import { RevealOnView } from "../motion/reveal-on-view";
import type { LocaleCode } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

export function Opening({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale).landing.opening;
  return (
    <section
      id="kodaore-home-hero"
      aria-labelledby="landing-opening-title"
      className="relative min-h-[70svh] md:min-h-[80svh] flex items-center"
    >
      <div className="mx-auto w-full max-w-6xl px-5 md:px-12 py-16 md:py-24">
        <div className="max-w-4xl">
          <RevealOnView
            as="p"
            className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-ink-muted-2"
          >
            {copy.brand}
          </RevealOnView>

          <RevealOnView
            as="h1"
            delay={0.12}
            className="mt-6 md:mt-8 font-heading font-medium text-ink-primary"
            amount={0.2}
          >
            <span
              id="landing-opening-title"
              className="block"
              style={{
                fontSize: "var(--text-display-2xl)",
                lineHeight: 0.95,
                letterSpacing: "-0.015em",
              }}
            >
              {copy.title}
            </span>
          </RevealOnView>

          <RevealOnView
            as="p"
            delay={0.28}
            className="mt-8 md:mt-10 max-w-2xl font-heading text-ink-secondary text-lg md:text-xl leading-relaxed"
          >
            {copy.lede}
          </RevealOnView>
        </div>
      </div>
    </section>
  );
}
