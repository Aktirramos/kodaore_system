"use client";

import Link from "next/link";
import { SmartImage } from "@/components/smart-image";
import { RevealOnView } from "../motion/reveal-on-view";
import type { LocaleCode } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

const sectionClass =
  "fade-rise fade-rise-delay-200 rounded-3xl border border-border-subtle bg-surface p-6 md:p-10 shadow-sm";

const PHOTOS = [
  { src: "/media/judo-7.jpg", fallback: "/media/photo-fallback-1.svg" },
  { src: "/media/judo-8.jpg", fallback: "/media/photo-fallback-2.svg" },
  { src: "/media/judo-9.jpg", fallback: "/media/photo-fallback-3.svg" },
  { src: "/media/judo-10.jpg", fallback: "/media/photo-fallback-1.svg" },
];

export function Tatami({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale).landing.tatami;

  return (
    <section aria-labelledby="landing-tatami-title" className={sectionClass}>
      <RevealOnView
        as="p"
        className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-emphasis"
      >
        {copy.eyebrow}
      </RevealOnView>

      <RevealOnView
        as="h2"
        id="landing-tatami-title"
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

      <div className="mt-8 md:mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {PHOTOS.map((photo, i) => (
          <RevealOnView
            key={photo.src}
            delay={0.08 * (i + 1)}
            amount={0.15}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border-subtle bg-surface-subtle"
          >
            <SmartImage
              src={photo.src}
              fallbackSrc={photo.fallback}
              alt={copy.alts[i] ?? ""}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </RevealOnView>
        ))}
      </div>

      <RevealOnView as="p" delay={0.4} className="mt-6 md:mt-8 text-sm md:text-base">
        <Link
          href={`/${locale}/fototeca`}
          className="inline-flex items-center gap-2 text-ink-secondary transition-colors hover:text-brand-emphasis focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base"
        >
          <span>{copy.linkLabel}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </RevealOnView>
    </section>
  );
}
