"use client";

import { type TouchEvent, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SmartImage } from "@/components/smart-image";
import type { LocaleCode } from "@/lib/i18n";

const SWIPE_THRESHOLD_PX = 48;

type GalleryItem = {
  image: string;
  fallback: string;
};

type FototecaGalleryProps = {
  items: GalleryItem[];
  brand: string;
  locale: LocaleCode;
};

function wrapIndex(index: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return (index + total) % total;
}

export function FototecaGallery({ items, brand, locale }: FototecaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setPortalReady(true);
  }, []);

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

    const html = document.documentElement;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = html.style.overflow;
    document.body.style.overflow = "hidden";
    html.style.overflow = "hidden";

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
      document.body.style.overflow = previousBodyOverflow;
      html.style.overflow = previousHtmlOverflow;
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

  const lightbox = activeIndex !== null ? (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={locale === "eu" ? "Argazki ikuslea" : "Visor de fotos"}
    >
      <button
        type="button"
        onClick={closeLightbox}
        aria-label={locale === "eu" ? "Itxi" : "Cerrar"}
        className="absolute inset-0"
      />

      <button
        type="button"
        onClick={closeLightbox}
        className="absolute right-3 top-3 z-10 rounded-full border border-white/30 bg-black/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-black/60 md:right-6 md:top-6"
      >
        {locale === "eu" ? "Itxi" : "Cerrar"}
      </button>

      <button
        type="button"
        onClick={showPrevious}
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-black/40 px-3 py-2 text-lg font-semibold text-white hover:bg-black/60 md:left-6"
        aria-label={locale === "eu" ? "Aurrekoa" : "Anterior"}
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
          src={items[activeIndex].image}
          fallbackSrc={items[activeIndex].fallback}
          alt={locale === "eu" ? `${brand} galeria ${activeIndex + 1}` : `Galeria de ${brand} ${activeIndex + 1}`}
          fill
          priority
          className="object-contain"
          sizes="100vw"
        />
      </div>

      <button
        type="button"
        onClick={showNext}
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-black/40 px-3 py-2 text-lg font-semibold text-white hover:bg-black/60 md:right-6"
        aria-label={locale === "eu" ? "Hurrengoa" : "Siguiente"}
      >
        ›
      </button>

      <p className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-semibold tracking-[0.1em] text-white md:bottom-6">
        {activeIndex + 1} / {items.length}
      </p>
      <p className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2 text-[11px] font-medium tracking-[0.08em] text-white/80 md:hidden">
        {locale === "eu" ? "Ezkerrera/eskuinera pasa" : "Desliza izquierda/derecha"}
      </p>
    </div>
  ) : null;

  return (
    <>
      <section className="fade-rise grid auto-rows-[170px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4 md:gap-4">
        {items.map((item, index) => {
          const large = index % 5 === 0;
          const wide = index % 3 === 1;

          return (
            <button
              key={`${item.image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-subtle text-left transition-[transform,box-shadow,border-color,background-color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-border-default hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:transition-[box-shadow,border-color,background-color] ${
                large ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
              } ${wide ? "md:col-span-2" : "md:col-span-1"}`}
              aria-label={
                locale === "eu"
                  ? `Ireki argazkia ${index + 1}`
                  : `Abrir foto ${index + 1}`
              }
            >
              <SmartImage
                src={item.image}
                fallbackSrc={item.fallback}
                alt={locale === "eu" ? `${brand} galeria ${index + 1}` : `Galeria de ${brand} ${index + 1}`}
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            </button>
          );
        })}
      </section>

      {portalReady && lightbox ? createPortal(lightbox, document.body) : null}
    </>
  );
}
