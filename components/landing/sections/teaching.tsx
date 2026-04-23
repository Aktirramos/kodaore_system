"use client";

import { RevealOnView } from "../motion/reveal-on-view";
import { GrowingRule } from "../motion/growing-rule";
import type { LocaleCode } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

const sectionClass = "fade-rise fade-rise-delay-100 rounded-3xl border border-border-subtle bg-surface p-6 md:p-10 shadow-sm";

export function Teaching({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale).landing.teaching;
  const eyebrow = locale === "eu" ? "Filosofia" : "Filosofia";
  return (
    <section aria-labelledby="landing-teaching-title" className={sectionClass}>
      <div className="max-w-3xl">
        <RevealOnView
          as="p"
          className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-emphasis"
        >
          {eyebrow}
        </RevealOnView>

        <RevealOnView
          as="h2"
          id="landing-teaching-title"
          delay={0.08}
          className="mt-3 font-heading font-medium text-ink-primary"
          amount={0.25}
        >
          <span
            className="block"
            style={{
              fontSize: "clamp(2rem, 3.5vw, 3.25rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            {copy.title}
          </span>
        </RevealOnView>

        <RevealOnView
          as="p"
          delay={0.2}
          className="mt-8 md:mt-10 font-heading text-ink-secondary text-lg md:text-xl leading-relaxed"
        >
          {copy.p1}
        </RevealOnView>

        <RevealOnView
          as="p"
          delay={0.32}
          className="mt-6 md:mt-8 font-heading text-ink-secondary text-lg md:text-xl leading-relaxed"
        >
          {copy.p2}
        </RevealOnView>
      </div>

      <GrowingRule
        className="mt-10 md:mt-14 w-[min(60%,30rem)] text-ink-primary"
        thickness={1}
        duration={1.1}
      />
    </section>
  );
}
