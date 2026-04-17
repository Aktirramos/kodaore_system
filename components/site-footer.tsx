"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { LocaleCode } from "@/lib/i18n";

type SiteFooterProps = {
  locale: LocaleCode;
};

type SocialLink = {
  label: string;
  href: string;
  icon: ReactNode;
};

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="5" />
      <circle cx="12" cy="12" r="3.9" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14.6 8.2h2.2V4.9h-2.6c-3 0-4.7 1.8-4.7 4.9v2H7.2V15h2.3v4.1h3.3V15h3l.5-3.2h-3.5v-1.7c0-1 .4-1.9 1.8-1.9Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h3.5l12.5 16H16.5L4 4Z" />
      <path d="M20 4l-6 6" />
      <path d="M10 14l-6 6" />
    </svg>
  );
}

const socialLinks: SocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/judoclubkodaore/", icon: <InstagramIcon /> },
  { label: "X", href: "https://x.com/JudoClubKodaore", icon: <XIcon /> },
  { label: "Facebook", href: "https://www.facebook.com/kodaore", icon: <FacebookIcon /> },
];

export function SiteFooter({ locale }: SiteFooterProps) {
  const [revealed, setRevealed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const showBackToTopRef = useRef(false);
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
      const nextVisible = window.scrollY > threshold;

      if (nextVisible !== showBackToTopRef.current) {
        showBackToTopRef.current = nextVisible;
        setShowBackToTop(nextVisible);
      }
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
  const appsLabel = locale === "eu" ? "Aplikazioak" : "Apps";
  const legalLabel = locale === "eu" ? "Lege loturak" : "Enlaces legales";
  const termsLabel = locale === "eu" ? "Baldintzak" : "Terminos";
  const privacyLabel = locale === "eu" ? "Pribatutasuna" : "Privacidad";
  const backTopLabel = locale === "eu" ? "Gora" : "Arriba";
  const socialLabel = locale === "eu" ? "Sare sozialak" : "Redes sociales";

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

            <div className="flex flex-wrap items-end justify-between gap-8">
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/55">{appsLabel}</p>
                <nav className="flex items-center gap-3 md:gap-4" aria-label={socialLabel}>
                  {socialLinks.map((social, index) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`k-focus-ring inline-flex h-9 w-9 items-center justify-center text-white/85 transition-transform duration-300 hover:scale-110 hover:text-white ${revealed ? "fade-rise" : "opacity-0 translate-y-6"}`}
                      style={{ animationDelay: revealed ? `${200 + index * 90}ms` : undefined }}
                      aria-label={social.label}
                    >
                      {social.icon}
                      <span className="sr-only">{social.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/55">{legalLabel}</p>
                <nav className="flex items-center gap-4 text-sm text-white/80" aria-label={legalLabel}>
                  <Link
                    href={`/${locale}/legal/terms`}
                    className="k-focus-ring underline decoration-white/35 underline-offset-4 transition-colors hover:text-white hover:decoration-[color:var(--brand-emphasis)]"
                  >
                    {termsLabel}
                  </Link>
                  <Link
                    href={`/${locale}/legal/privacy`}
                    className="k-focus-ring underline decoration-white/35 underline-offset-4 transition-colors hover:text-white hover:decoration-[color:var(--brand-emphasis)]"
                  >
                    {privacyLabel}
                  </Link>
                </nav>
              </div>

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
        aria-hidden={!showBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
        className={`k-focus-ring k-hover-action k-back-top fixed bottom-6 right-6 z-50 rounded-full border border-white/20 bg-[#101417]/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_-14px_rgba(0,0,0,0.9)] ${showBackToTop ? "is-visible" : "is-hidden"}`}
      >
        <span className={`block ${showBackToTop ? "k-back-top-label" : ""}`}>{backTopLabel}</span>
      </button>
    </>
  );
}
