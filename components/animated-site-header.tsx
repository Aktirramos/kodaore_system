"use client";

import { useEffect, useState } from "react";
import { SiteHeaderNav } from "@/components/site-header-nav";
import type { LocaleCode } from "@/lib/i18n";

type AnimatedSiteHeaderProps = {
  locale: LocaleCode;
  brand: string;
  discoverLabel: string;
  galleryLabel: string;
  accessLabel: string;
};

export function AnimatedSiteHeader({ locale, brand, discoverLabel, galleryLabel, accessLabel }: AnimatedSiteHeaderProps) {
  const [show, setShow] = useState(false);
  const [compactByScroll, setCompactByScroll] = useState(false);
  const [deepScrolled, setDeepScrolled] = useState(false);

  useEffect(() => {
    const html = document.documentElement;

    const syncPhase = () => {
      const phase = html.getAttribute("data-loader-phase");
      setShow(phase === "hidden");
    };

    syncPhase();

    const observer = new MutationObserver(syncPhase);
    observer.observe(html, {
      attributes: true,
      attributeFilter: ["data-loader-phase"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!show) {
      return;
    }

    const onScroll = () => {
      const scrollY = window.scrollY;
      setCompactByScroll(scrollY > 28);
      setDeepScrolled(scrollY > 50);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [show]);

  const compact = show && compactByScroll;

  return (
    <header
      className={`kodaore-site-header sticky top-0 z-40 border-b transition-all duration-700 ${
        deepScrolled ? "border-white/10 bg-surface/60 backdrop-blur-xl" : "border-transparent bg-surface/70 backdrop-blur-sm"
      } ${
        show ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0 pointer-events-none"
      }`}
    >
      <div className={`mx-auto w-full max-w-6xl px-5 transition-all duration-[450ms] md:px-8 ${compact ? "py-1.5" : "py-3"}`}>
        <div
          className={`rounded-2xl border border-black/10 bg-white/70 shadow-[0_18px_45px_-34px_rgba(0,0,0,0.6)] transition-all duration-[450ms] ${
            compact ? "p-2" : "p-3"
          }`}
        >
          <SiteHeaderNav
            locale={locale}
            brand={brand}
            discoverLabel={discoverLabel}
            galleryLabel={galleryLabel}
            accessLabel={accessLabel}
            show={show}
            compact={compact}
            frosted={deepScrolled}
          />
        </div>
      </div>
    </header>
  );
}
