"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { SiteHeaderNav } from "@/components/site-header-nav";
import type { LocaleCode } from "@/lib/i18n";

type AnimatedSiteHeaderProps = {
  locale: LocaleCode;
  brand: string;
  discoverLabel: string;
  galleryLabel: string;
  accessLabel: string;
  isAuthenticated: boolean;
};

export function AnimatedSiteHeader({ locale, brand, discoverLabel, galleryLabel, accessLabel, isAuthenticated }: AnimatedSiteHeaderProps) {
  const [show, setShow] = useState(false);
  const [compactByScroll, setCompactByScroll] = useState(false);
  const [deepScrolled, setDeepScrolled] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) {
      return;
    }

    const onScroll = () => {
      const scrollY = window.scrollY;
      setCompactByScroll(scrollY > 28);
      setDeepScrolled(scrollY > 28);
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
      className={clsx(
        "kodaore-site-header sticky top-0 z-40 border-b transition-all duration-200",
        deepScrolled ? "border-border-subtle bg-surface-elevated/85 backdrop-blur-md" : "border-transparent bg-surface-elevated/50 backdrop-blur-sm",
        show ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-5 opacity-0",
      )}
    >
      <div className={clsx("mx-auto w-full max-w-6xl px-5 transition-all duration-[450ms] md:px-8", compact ? "py-1.5" : "py-3")}>
        <div className={clsx("transition-all duration-[450ms]", compact ? "p-2" : "p-3")}>
          <SiteHeaderNav
            locale={locale}
            brand={brand}
            discoverLabel={discoverLabel}
            galleryLabel={galleryLabel}
            accessLabel={accessLabel}
            isAuthenticated={isAuthenticated}
            show={show}
            compact={compact}
          />
        </div>
      </div>
    </header>
  );
}
