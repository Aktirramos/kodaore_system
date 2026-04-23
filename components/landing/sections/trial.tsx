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

export function Trial({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale).landing.trial;
  return (
    <section
      aria-labelledby="landing-trial-title"
      className="relative"
    >
      <div className="mx-auto w-full max-w-6xl px-5 md:px-12 py-[clamp(6rem,12vh,10rem)]">
        <div className="max-w-3xl">
          <RevealOnView
            as="h2"
            id="landing-trial-title"
            className="font-heading font-medium text-ink-primary"
            amount={0.3}
          >
            <span
              className="block"
              style={{
                fontSize: "clamp(2.25rem, 4vw, 4rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
              }}
            >
              {copy.title}
            </span>
          </RevealOnView>

          <GrowingRule className="mt-6 w-[min(40%,20rem)] text-ink-primary" thickness={1} duration={0.9} />

          <RevealOnView
            as="p"
            delay={0.18}
            className="mt-8 md:mt-10 font-heading text-ink-secondary text-lg md:text-2xl leading-relaxed"
          >
            {copy.body}
          </RevealOnView>

          <RevealOnView
            as="div"
            delay={0.32}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-base md:text-lg"
          >
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-ink-primary underline underline-offset-4 decoration-1 hover:decoration-2 hover:text-brand-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-base"
            >
              {copy.emailLabel}
            </a>
            {/* TODO(landing): reemplazar href por enlace de whatsapp cuando el cliente confirme numero */}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=WhatsApp%20-%20Kodaore`}
              className="text-ink-primary underline underline-offset-4 decoration-1 hover:decoration-2 hover:text-brand-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-base"
            >
              {copy.whatsappLabel}
            </a>
          </RevealOnView>
        </div>
      </div>
    </section>
  );
}
