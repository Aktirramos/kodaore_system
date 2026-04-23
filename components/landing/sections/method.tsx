"use client";

import { RevealOnView } from "../motion/reveal-on-view";
import type { LocaleCode } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

const sectionClass = "fade-rise fade-rise-delay-150 rounded-3xl border border-border-subtle bg-surface p-6 md:p-10 shadow-sm";
const pillarClass = "group/pillar relative rounded-2xl border border-border-subtle bg-surface-strong p-5 md:p-6 transition-[transform,border-color,background-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-border-default hover:shadow-md motion-reduce:transform-none motion-reduce:transition-[border-color,background-color,box-shadow]";

export function Method({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale).landing.method;
  const eyebrow = locale === "eu" ? "Metodoa" : "Metodo";
  return (
    <section aria-labelledby="landing-method-title" className={sectionClass}>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <RevealOnView
            as="p"
            className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-emphasis"
          >
            {eyebrow}
          </RevealOnView>

          <RevealOnView
            as="h2"
            id="landing-method-title"
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
      </div>

      <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {copy.pillars.map((pillar, i) => (
          <RevealOnView
            key={pillar.title}
            as="article"
            delay={0.12 * (i + 1)}
            amount={0.2}
            className={pillarClass}
          >
            <h3 className="font-heading font-medium text-ink-primary text-xl md:text-2xl leading-tight">
              {pillar.title}
            </h3>
            <p className="mt-4 text-ink-secondary text-base leading-relaxed">
              {pillar.body}
            </p>
          </RevealOnView>
        ))}
      </div>
    </section>
  );
}
