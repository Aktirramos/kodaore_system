"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LocaleCode } from "@/lib/i18n";

type SiteFooterProps = {
  locale: LocaleCode;
};

type SocialLink = {
  label: string;
  href: string;
  short: string;
};

const socialLinks: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com", short: "IG" },
  { label: "YouTube", href: "https://youtube.com", short: "YT" },
  { label: "Facebook", href: "https://facebook.com", short: "FB" },
];

export function SiteFooter({ locale }: SiteFooterProps) {
  const [revealed, setRevealed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = contentRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("kodaore-home-hero");
      const threshold = hero
        ? hero.offsetTop + hero.clientHeight * 0.9
        : 520;

      setShowBackToTop(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const footerTitle = locale === "eu" ? "Azken kolpea" : "Cierre final";
  const footerDescription =
    locale === "eu"
      ? "Kodaore: hiru egoitza, helburu bera. Diziplina, errespetua eta talde espiritua egunero tatamian."
      : "Kodaore: tres sedes, un mismo pulso. Disciplina, respeto y espiritu de equipo en cada entrenamiento.";
  const rights =
    locale === "eu"
      ? "Kodaore Judo Elkartea. Eskubide guztiak erreserbatuak."
      : "Kodaore Judo Elkartea. Todos los derechos reservados.";
  const backTopLabel = locale === "eu" ? "Gora" : "Arriba";

  return (
    <>
      <footer className="relative mt-12 overflow-hidden bg-[#0a0c0e] text-white">
        <div className="kodaore-footer-top-line" aria-hidden="true" />

        <div className="pointer-events-none absolute inset-x-0 -bottom-10 flex justify-center" aria-hidden="true">
          <p className="font-heading text-[clamp(3.8rem,17vw,16rem)] font-semibold tracking-[0.16em] text-white/5">
            KODAORE
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <div ref={contentRef} className="space-y-8">
            <div className={revealed ? "fade-rise fade-rise-delay-100" : "opacity-0 translate-y-6"}>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">{footerTitle}</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">{footerDescription}</p>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <nav className="flex items-center gap-3 md:gap-4" aria-label="Social links">
                {socialLinks.map((social, index) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`kodaore-social-icon ${revealed ? "fade-rise" : "opacity-0 translate-y-6"}`}
                    style={{ animationDelay: revealed ? `${200 + index * 90}ms` : undefined }}
                    aria-label={social.label}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em]">{social.short}</span>
                  </Link>
                ))}
              </nav>

              <p
                className={`text-xs tracking-[0.05em] text-white/60 md:text-sm ${
                  revealed ? "fade-rise fade-rise-delay-500" : "opacity-0 translate-y-6"
                }`}
              >
                {rights}
              </p>
            </div>
          </div>
        </div>
      </footer>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={backTopLabel}
        className={`kodaore-backtop fixed bottom-6 right-6 z-50 rounded-full border border-white/20 bg-[#101417]/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_-14px_rgba(0,0,0,0.9)] transition-all duration-300 ${
          showBackToTop ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
        }`}
      >
        {backTopLabel}
      </button>
    </>
  );
}
