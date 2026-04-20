"use client";

import { type FocusEvent, type MouseEvent, type TouchEvent, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SmartImage } from "@/components/smart-image";
import type { LocaleCode } from "@/lib/i18n";

const SWIPE_THRESHOLD_PX = 48;

export type ErropakGalleryItem = {
  categoryKey: string;
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
  const [portalReady, setPortalReady] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverPreviewExpanded, setHoverPreviewExpanded] = useState(false);
  const [hoverPreviewOrigin, setHoverPreviewOrigin] = useState<{ top: number; left: number; size: number } | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1280, height: 720 });
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>("all");
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const hoverHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isEu = locale === "eu";

  const categoryMap = new Map<string, { key: string; label: string }>();

  for (const item of items) {
    if (categoryMap.has(item.categoryKey)) {
      continue;
    }

    categoryMap.set(item.categoryKey, {
      key: item.categoryKey,
      label: isEu ? item.categoryEu : item.categoryEs,
    });
  }

  const categories = Array.from(categoryMap.values());
  const visibleItems = activeCategoryKey === "all"
    ? items
    : items.filter((item) => item.categoryKey === activeCategoryKey);

  const allCategoryLabel = isEu ? "Guztiak" : "Todo";
  const activeItem = activeIndex === null ? null : (visibleItems[activeIndex] ?? null);
  const hoveredItem = hoveredIndex === null ? null : (visibleItems[hoveredIndex] ?? null);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    const syncViewport = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => {
      window.removeEventListener("resize", syncViewport);
    };
  }, []);

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return wrapIndex(current - 1, visibleItems.length);
    });
  }, [visibleItems.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return wrapIndex(current + 1, visibleItems.length);
    });
  }, [visibleItems.length]);

  const selectCategory = useCallback((nextCategoryKey: string) => {
    setActiveCategoryKey(nextCategoryKey);
    setActiveIndex(null);
    setHoveredIndex(null);
    setHoverPreviewExpanded(false);
    setHoverPreviewOrigin(null);
  }, []);

  const openHoverPreview = useCallback((index: number, originElement: HTMLElement) => {
    if (hoverHideTimerRef.current) {
      clearTimeout(hoverHideTimerRef.current);
      hoverHideTimerRef.current = null;
    }

    const rect = originElement.getBoundingClientRect();
    const size = Math.max(90, Math.min(rect.width, rect.height));
    const top = rect.top + (rect.height - size) / 2;
    const left = rect.left + (rect.width - size) / 2;

    setHoveredIndex(index);
    setHoverPreviewOrigin({ top, left, size });
    setHoverPreviewExpanded(false);

    window.requestAnimationFrame(() => {
      setHoverPreviewExpanded(true);
    });
  }, []);

  const closeHoverPreview = useCallback(() => {
    setHoverPreviewExpanded(false);

    if (hoverHideTimerRef.current) {
      clearTimeout(hoverHideTimerRef.current);
    }

    hoverHideTimerRef.current = setTimeout(() => {
      setHoveredIndex(null);
      setHoverPreviewOrigin(null);
      hoverHideTimerRef.current = null;
    }, 220);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverHideTimerRef.current) {
        clearTimeout(hoverHideTimerRef.current);
      }
    };
  }, []);

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

  const previewSize = Math.max(220, Math.min(460, Math.min(viewportSize.width * 0.42, viewportSize.height * 0.62)));
  const previewTop = (viewportSize.height - previewSize) / 2;
  const previewLeft = (viewportSize.width - previewSize) / 2;
  const animatedPreviewStyle = hoverPreviewOrigin
    ? {
      top: hoverPreviewExpanded ? previewTop : hoverPreviewOrigin.top,
      left: hoverPreviewExpanded ? previewLeft : hoverPreviewOrigin.left,
      width: hoverPreviewExpanded ? previewSize : hoverPreviewOrigin.size,
      height: hoverPreviewExpanded ? previewSize : hoverPreviewOrigin.size,
      opacity: hoverPreviewExpanded ? 1 : 0.65,
      transform: hoverPreviewExpanded ? "scale(1)" : "scale(0.96)",
      transition:
        "top 280ms cubic-bezier(0.2, 0.9, 0.2, 1), left 280ms cubic-bezier(0.2, 0.9, 0.2, 1), width 280ms cubic-bezier(0.2, 0.9, 0.2, 1), height 280ms cubic-bezier(0.2, 0.9, 0.2, 1), opacity 220ms ease, transform 220ms ease",
    }
    : undefined;

  const handleTouchCancel = useCallback(() => {
    touchStartRef.current = null;
  }, []);

  const lightbox = activeItem ? (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={isEu ? "Irudi ikuslea" : "Visor de imagen"}
    >
      <button
        type="button"
        onClick={closeLightbox}
        aria-label={isEu ? "Itxi" : "Cerrar"}
        className="absolute inset-0"
      />

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
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-black/40 px-3 py-2 text-lg font-semibold text-white hover:bg-black/60 md:left-6"
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
          src={activeItem.imageSrc}
          fallbackSrc={activeItem.fallbackSrc}
          alt={isEu ? activeItem.nameEu : activeItem.nameEs}
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
        aria-label={isEu ? "Hurrengoa" : "Siguiente"}
      >
        ›
      </button>

      <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-center text-white md:bottom-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-emphasis">
          {isEu ? activeItem.categoryEu : activeItem.categoryEs}
        </p>
        <p className="mt-1 text-sm font-medium">{isEu ? activeItem.nameEu : activeItem.nameEs}</p>
      </div>
    </div>
  ) : null;

  return (
    <>
      <section className="fade-rise space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => selectCategory("all")}
            className={`k-focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
              activeCategoryKey === "all"
                ? "border-brand/60 bg-brand/15 text-brand-emphasis"
                : "border-white/15 bg-black/20 text-white/75 hover:border-white/30"
            }`}
          >
            {allCategoryLabel}
          </button>

          {categories.map((category) => (
            <button
              key={category.key}
              type="button"
              onClick={() => selectCategory(category.key)}
              className={`k-focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                activeCategoryKey === category.key
                  ? "border-brand/60 bg-brand/15 text-brand-emphasis"
                  : "border-white/15 bg-black/20 text-white/75 hover:border-white/30"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="relative">
        {hoveredItem && hoverPreviewOrigin ? (
          <div className="pointer-events-none fixed z-40 hidden md:block" style={animatedPreviewStyle}>
            <article className="h-full w-full overflow-hidden rounded-2xl border border-white/25 bg-black/75 shadow-[0_24px_48px_rgba(0,0,0,0.5)]">
              <div className="relative h-full w-full overflow-hidden">
                <SmartImage
                  src={hoveredItem.imageSrc}
                  fallbackSrc={hoveredItem.fallbackSrc}
                  alt={isEu ? hoveredItem.nameEu : hoveredItem.nameEs}
                  fill
                  className="object-cover"
                  sizes="460px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              </div>
              <div className="px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-emphasis">
                  {isEu ? hoveredItem.categoryEu : hoveredItem.categoryEs}
                </p>
                <p className="mt-1 text-xs font-medium text-white/90">
                  {isEu ? hoveredItem.nameEu : hoveredItem.nameEs}
                </p>
              </div>
            </article>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item, index) => (
          <button
            key={`${item.nameEs}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            onMouseEnter={(event: MouseEvent<HTMLButtonElement>) => openHoverPreview(index, event.currentTarget)}
            onMouseLeave={closeHoverPreview}
            onFocus={(event: FocusEvent<HTMLButtonElement>) => openHoverPreview(index, event.currentTarget)}
            onBlur={closeHoverPreview}
            className={`k-focus-ring k-hover-lift group overflow-hidden rounded-2xl border bg-surface-strong text-left transition-colors ${
              hoveredIndex === index ? "border-brand/45" : "border-white/10"
            }`}
            aria-label={isEu ? `Ireki irudia ${index + 1}` : `Abrir imagen ${index + 1}`}
          >
            <div className="relative h-56 overflow-hidden">
              <SmartImage
                src={item.imageSrc}
                fallbackSrc={item.fallbackSrc}
                alt={isEu ? item.nameEu : item.nameEs}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.1]"
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
        </div>
        </div>
      </section>

      {portalReady && lightbox ? createPortal(lightbox, document.body) : null}
    </>
  );
}
