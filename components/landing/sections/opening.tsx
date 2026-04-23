"use client";

import { RevealOnView } from "../motion/reveal-on-view";
import type { LocaleCode } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

const heroSectionClass = "fade-rise relative isolate overflow-hidden rounded-[2rem] border border-border-subtle bg-surface shadow-[0_50px_120px_-70px_rgba(16,16,16,0.62)]";

export function Opening({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale).landing.opening;
  return (
    <section
      id="kodaore-home-hero"
      aria-labelledby="landing-opening-title"
      className={heroSectionClass}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 15% 10%, color-mix(in srgb, var(--brand-base) 18%, transparent) 0%, transparent 55%), radial-gradient(120% 90% at 85% 15%, color-mix(in srgb, var(--accent-base) 14%, transparent) 0%, transparent 60%), linear-gradient(180deg, var(--surface-base) 0%, var(--surface-subtle) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-surface-subtle/55" />

      <div className="relative z-10 flex min-h-[70svh] items-center rounded-[1.35rem] bg-surface p-6 md:min-h-[78svh] md:p-12 lg:p-16">
        <div className="max-w-4xl">
          <RevealOnView
            as="p"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-emphasis"
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
