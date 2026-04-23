"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HaraigoshiFrame } from "../svg/haraigoshi-frame";
import { useHaraigoshiScroll } from "../motion/use-haraigoshi-scroll";
import { ChapterHaraigoshiStatic } from "./chapter-haraigoshi-static";
import type { LocaleCode } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

/**
 * Capitulo narrativo del haraigoshi.
 *
 * Flujo:
 *  1. SSR + pre-hidratacion + no-JS → se renderiza el fallback estatico.
 *  2. Tras montaje, si el usuario NO prefiere reducir movimiento, se
 *     sustituye por la version interactiva con pinning y scroll sync.
 *  3. Si prefiere reducir movimiento, se queda en el fallback.
 *
 * No hay scroll-jacking — el pin dura 220vh pero el scroll natural
 * avanza la timeline; un scroll rapido pasa la seccion sin problemas.
 */
export function ChapterHaraigoshi({ locale }: { locale: LocaleCode }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const reduced = useReducedMotion();

  if (!hydrated || reduced) {
    return <ChapterHaraigoshiStatic locale={locale} />;
  }
  return <ChapterHaraigoshiPinned locale={locale} />;
}

function ChapterHaraigoshiPinned({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale).landing.haraigoshi;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { frameIndex, moments, titleOpacity } = useHaraigoshiScroll(wrapperRef);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const unsub = frameIndex.on("change", (v) => {
      setActiveIdx(Math.round(Math.max(0, Math.min(4, v))));
    });
    return () => unsub();
  }, [frameIndex]);

  return (
    <section
      aria-labelledby="landing-haraigoshi-title-interactive"
      className="fade-rise fade-rise-delay-150 relative rounded-3xl border border-border-subtle bg-surface-subtle shadow-sm"
    >
      <div
        ref={wrapperRef}
        style={{ height: "220vh" }}
        className="relative"
      >
        <div className="sticky top-0 h-screen flex items-center">
          <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              {/* Frame */}
              <div className="md:col-span-6 relative">
                <motion.p
                  id="landing-haraigoshi-title-interactive"
                  style={{ opacity: titleOpacity }}
                  className="font-heading text-ink-muted-2 text-base md:text-lg lowercase tracking-tight mb-4"
                >
                  {copy.title}
                </motion.p>
                <div
                  className="relative w-full text-ink-primary"
                  style={{ aspectRatio: "472 / 580", maxHeight: "70svh" }}
                >
                  {copy.moments.map((_, i) => {
                    const svgIdx = i === 0 ? 0 : i === 1 ? 2 : i === 2 ? 3 : 4;
                    return (
                      <HaraigoshiFrame
                        key={svgIdx}
                        index={svgIdx}
                        title={`${copy.title} frame ${svgIdx + 1}`}
                        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                          activeIdx === svgIdx || (activeIdx === 1 && svgIdx === 0)
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Aforismos */}
              <div className="md:col-span-5 md:col-start-8 space-y-10">
                {copy.moments.map((moment, i) => (
                  <motion.div
                    key={moment.label}
                    style={{ opacity: moments[i] }}
                    className="flex flex-col gap-2"
                  >
                    <p className="font-heading text-ink-primary text-2xl md:text-3xl lowercase leading-tight">
                      {moment.label}
                    </p>
                    <p className="font-heading text-ink-secondary text-base md:text-lg leading-relaxed max-w-sm">
                      {moment.aforism}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
