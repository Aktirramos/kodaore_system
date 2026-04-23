"use client";

import { RevealOnView } from "../motion/reveal-on-view";
import { GrowingRule } from "../motion/growing-rule";
import type { LocaleCode } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

export function Teaching({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale).landing.teaching;
  return (
    <section
      aria-labelledby="landing-teaching-title"
      className="relative"
    >
      <div className="mx-auto w-full max-w-6xl px-5 md:px-12 py-[clamp(5rem,10vh,8rem)]">
        <div className="max-w-3xl">
          <RevealOnView
            as="h2"
            id="landing-teaching-title"
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

          <RevealOnView
            as="p"
            delay={0.15}
            className="mt-10 md:mt-14 font-heading text-ink-secondary text-lg md:text-2xl leading-relaxed"
          >
            {copy.p1}
          </RevealOnView>

          <RevealOnView
            as="p"
            delay={0.3}
            className="mt-8 md:mt-10 font-heading text-ink-secondary text-lg md:text-2xl leading-relaxed"
          >
            {copy.p2}
          </RevealOnView>
        </div>

        <GrowingRule
          className="mt-16 md:mt-24 w-[min(60%,30rem)] text-ink-primary"
          thickness={1}
          duration={1.1}
        />
      </div>
    </section>
  );
}
