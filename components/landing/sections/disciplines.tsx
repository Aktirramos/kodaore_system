"use client";

import { RevealOnView } from "../motion/reveal-on-view";
import type { LocaleCode } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

export function Disciplines({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale).landing.disciplines;
  return (
    <section
      aria-labelledby="landing-disciplines-title"
      className="relative"
    >
      <div className="mx-auto w-full max-w-6xl px-5 md:px-12 py-[clamp(5rem,10vh,8rem)]">
        <RevealOnView
          as="h2"
          id="landing-disciplines-title"
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

        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-4xl">
          {copy.items.map((item, i) => (
            <RevealOnView key={item.name} as="article" delay={0.12 * (i + 1)} amount={0.25}>
              <h3 className="font-heading font-medium text-ink-primary text-xl md:text-2xl leading-tight">
                {item.name}
              </h3>
              <p className="mt-3 text-ink-secondary text-base leading-relaxed">
                {item.body}
              </p>
            </RevealOnView>
          ))}
        </div>
      </div>
    </section>
  );
}
