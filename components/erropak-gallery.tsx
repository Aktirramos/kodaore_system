"use client";

import { type TouchEvent, useCallback, useEffect, useRef, useState } from "react";
import { SmartImage } from "@/components/smart-image";
import type { LocaleCode } from "@/lib/i18n";

const SWIPE_THRESHOLD_PX = 48;

export type ErropakGalleryItem = {
  nameEu: string;
  nameEs: string;
  categoryEu: string;
  categoryEs: string;
  imageSrc: string;
  fallbackSrc: string;
};

type ErropakGalleryProps = {
  items: ErropakGalleryItem[];
  locale: LocaleCode;
};

function wrapIndex(index: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return (index + total) % total;
}

export function ErropakGallery({ items, locale }: ErropakGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isEu = locale === "eu";

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return wrapIndex(current - 1, items.length);
    });
  }, [items.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return wrapIndex(current + 1, items.length);
    });
  }, [items.length]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
        return;
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, closeLightbox, showNext, showPrevious]);

  const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    if (!touch) {
      return;
    }

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  }, []);

  const handleTouchEnd = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];

    touchStartRef.current = null;

    if (!start || !touch) {
      return;
    }

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    if (deltaX > 0) {
      showPrevious();
      return;
    }

    showNext();
  }, [showNext, showPrevious]);

  const handleTouchCancel = useCallback(() => {
    touchStartRef.current = null;
  }, []);

  return (
    <>
      <section className="fade-rise grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <button
            key={`${item.nameEs}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="k-focus-ring k-hover-lift group overflow-hidden rounded-2xl border border-white/10 bg-surface-strong text-left"
            aria-label={isEu ? `Ireki irudia ${index + 1}` : `Abrir imagen ${index + 1}`}
          >
            <div className="relative h-56 overflow-hidden">
              <SmartImage
                src={item.imageSrc}
                fallbackSrc={item.fallbackSrc}
                alt={isEu ? item.nameEu : item.nameEs}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
            </div>

            <div className="k-hover-soft group/item relative overflow-hidden p-4">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/14 via-transparent to-brand-warm/14 opacity-0 transition-opacity duration-500 group-hover/item:opacity-100" />
              <p className="relative text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-emphasis">
                {isEu ? item.categoryEu : item.categoryEs}
              </p>
              <h2 className="relative mt-1 font-heading text-xl font-semibold text-foreground">
                {isEu ? item.nameEu : item.nameEs}
              </h2>
            </div>
          </button>
        ))}
      </section>

      {activeIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={isEu ? "Irudi ikuslea" : "Visor de imagen"}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-3 top-3 z-10 rounded-full border border-white/30 bg-black/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-black/60 md:right-6 md:top-6"
          >
            {isEu ? "Itxi" : "Cerrar"}
          </button>

          <button
            type="button"
            onClick={showPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/40 px-3 py-2 text-lg font-semibold text-white hover:bg-black/60 md:left-6"
            aria-label={isEu ? "Aurrekoa" : "Anterior"}
          >
            ‹
          </button>

          <div
            className="relative h-[72vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/20 bg-black/60"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
          >
            <SmartImage
              src={items[activeIndex].imageSrc}
              fallbackSrc={items[activeIndex].fallbackSrc}
              alt={isEu ? items[activeIndex].nameEu : items[activeIndex].nameEs}
              fill
              priority
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <button
            type="button"
            onClick={showNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/40 px-3 py-2 text-lg font-semibold text-white hover:bg-black/60 md:right-6"
            aria-label={isEu ? "Hurrengoa" : "Siguiente"}
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-center text-white md:bottom-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-emphasis">
              {isEu ? items[activeIndex].categoryEu : items[activeIndex].categoryEs}
            </p>
            <p className="mt-1 text-sm font-medium">{isEu ? items[activeIndex].nameEu : items[activeIndex].nameEs}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
