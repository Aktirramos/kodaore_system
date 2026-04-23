import { HaraigoshiFrame } from "../svg/haraigoshi-frame";
import type { LocaleCode } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

/**
 * Fallback estatico del momento haraigoshi. Se muestra cuando:
 *  - No hay JS (SSR render sin hidratacion).
 *  - prefers-reduced-motion: reduce.
 *  - Pre-hidratacion mientras la version interactiva carga.
 *
 * Diseno: rejilla 2×3 desktop / 2×3 mobile, los 5 frames como paginas
 * de un manual abierto con el aforismo correspondiente al lado.
 */
export function ChapterHaraigoshiStatic({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale).landing.haraigoshi;
  // 5 frames, 4 moments. Frame 0 (setup) + frame 1 (kuzushi2) comparten momento 1.
  const frameToMoment: Array<{ frameIdx: number; momentIdx: number }> = [
    { frameIdx: 0, momentIdx: 0 },
    { frameIdx: 1, momentIdx: 0 },
    { frameIdx: 2, momentIdx: 1 },
    { frameIdx: 3, momentIdx: 2 },
    { frameIdx: 4, momentIdx: 3 },
  ];

  return (
    <section
      aria-labelledby="landing-haraigoshi-title"
      className="relative bg-surface-subtle"
    >
      <div className="mx-auto w-full max-w-6xl px-5 md:px-12 py-[clamp(5rem,10vh,8rem)]">
        <p
          id="landing-haraigoshi-title"
          className="font-heading text-ink-primary text-2xl md:text-3xl lowercase tracking-tight"
        >
          {copy.title}
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 md:gap-y-16">
          {frameToMoment.map(({ frameIdx, momentIdx }, i) => {
            const moment = copy.moments[momentIdx];
            return (
              <figure key={frameIdx} className="flex flex-col gap-4">
                <div
                  className="relative w-full bg-surface-base text-ink-primary"
                  style={{ aspectRatio: "472 / 580" }}
                >
                  <HaraigoshiFrame
                    index={frameIdx}
                    title={`${copy.title} — ${moment.label}`}
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <figcaption className="mt-1">
                  <p className="font-heading text-ink-primary text-xl md:text-2xl lowercase">
                    {moment.label}
                  </p>
                  <p className="mt-2 font-heading text-ink-secondary text-base md:text-lg leading-relaxed">
                    {moment.aforism}
                  </p>
                </figcaption>
                {i === frameToMoment.length - 1 && null}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
