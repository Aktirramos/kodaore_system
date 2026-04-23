"use client";

import { RevealOnView } from "../motion/reveal-on-view";
import { GrowingRule } from "../motion/growing-rule";
import type { LocaleCode } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

/**
 * CTA de primera clase. Sin boton grande — enlaces editoriales discretos
 * al email del club y a whatsapp. Sin scripts, sin formularios.
 *
 * Email provisional tomado de lib/i18n home.photoHint:
 *   Kodaorejudoelkartea@gmail.com
 * WhatsApp: pendiente confirmar numero con cliente.
 */
const CONTACT_EMAIL = "Kodaorejudoelkartea@gmail.com";

const sectionClass = "fade-rise fade-rise-delay-350 relative overflow-hidden rounded-3xl border border-border-subtle bg-surface-elevated p-6 md:p-10 shadow-sm";

export function Trial({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale).landing.trial;
  const eyebrow = locale === "eu" ? "Lehen pausoa" : "Primer paso";

  return (
    <section aria-labelledby="landing-trial-title" className={sectionClass}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 100% 0%, color-mix(in srgb, var(--brand-base) 10%, transparent) 0%, transparent 55%)",
        }}
      />
      <div className="relative z-10 max-w-3xl">
        <RevealOnView
          as="p"
          className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-emphasis"
        >
          {eyebrow}
        </RevealOnView>

        <RevealOnView
          as="h2"
          id="landing-trial-title"
          delay={0.08}
          className="mt-2 font-heading font-medium text-ink-primary"
          amount={0.25}
        >
          <span
            className="block"
            style={{
              fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
            }}
          >
            {copy.title}
          </span>
        </RevealOnView>

        <GrowingRule className="mt-6 w-[min(40%,20rem)] text-brand-base" thickness={1.5} duration={0.9} />

        <RevealOnView
          as="p"
          delay={0.22}
          className="mt-8 font-heading text-ink-secondary text-lg md:text-xl leading-relaxed"
        >
          {copy.body}
        </RevealOnView>

        <RevealOnView
          as="div"
          delay={0.36}
          className="mt-8 flex flex-wrap gap-3"
        >
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 rounded-full border border-brand/45 bg-surface-strong px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-brand-emphasis transition-[transform,background-color,border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-brand hover:bg-brand-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:hover:translate-y-0"
          >
            {copy.emailLabel}
          </a>
          {/* TODO(landing): reemplazar href por enlace de whatsapp cuando el cliente confirme numero */}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=WhatsApp%20-%20Kodaore`}
            className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface-strong px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-ink-secondary transition-[transform,background-color,border-color,color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-brand/35 hover:text-brand-emphasis focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:hover:translate-y-0"
          >
            {copy.whatsappLabel}
          </a>
        </RevealOnView>
      </div>
    </section>
  );
}
