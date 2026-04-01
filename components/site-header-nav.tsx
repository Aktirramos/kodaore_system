"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LocaleCode } from "@/lib/i18n";

type SiteHeaderNavProps = {
  locale: LocaleCode;
  brand: string;
  discoverLabel: string;
  galleryLabel: string;
  accessLabel: string;
  show: boolean;
  compact?: boolean;
  frosted?: boolean;
};

const locales: LocaleCode[] = ["eu", "es"];

function localizePath(pathname: string, targetLocale: LocaleCode) {
  const segments = pathname.split("/");

  if (segments.length > 1 && locales.includes(segments[1] as LocaleCode)) {
    segments[1] = targetLocale;
  } else {
    segments.splice(1, 0, targetLocale);
  }

  const result = segments.join("/");
  return result === "" ? `/${targetLocale}` : result;
}

export function SiteHeaderNav({ locale, brand, discoverLabel, galleryLabel, accessLabel, show, compact = false, frosted = false }: SiteHeaderNavProps) {
  const pathname = usePathname() ?? `/${locale}`;

  const homeHref = `/${locale}`;
  const sitesHref = `/${locale}/sedes`;
  const galleryHref = `/${locale}/fototeca`;
  const accessHref = `/${locale}/acceso`;

  const isHome = pathname === homeHref || pathname === `${homeHref}/`;
  const isSites = pathname.startsWith(sitesHref);
  const isGallery = pathname.startsWith(galleryHref);
  const isAccess = pathname.startsWith(accessHref);

  const navClass = (active: boolean) =>
    `border-b-2 px-1 py-2 text-sm font-medium transition-colors ${
      active ? "border-brand text-foreground" : "border-transparent text-ink-muted hover:text-foreground"
    }`;

  const revealClass = show ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0";

  const navItems = [
    {
      href: homeHref,
      label: locale === "eu" ? "Hasiera" : "Inicio",
      active: isHome,
      delay: 160,
    },
    {
      href: sitesHref,
      label: discoverLabel,
      active: isSites,
      delay: 260,
    },
    {
      href: galleryHref,
      label: galleryLabel,
      active: isGallery,
      delay: 360,
    },
    {
      href: accessHref,
      label: accessLabel,
      active: isAccess,
      delay: 460,
    },
  ];

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl transition-all duration-500 ${
        frosted ? "bg-white/30 backdrop-blur-xl border border-white/10" : "bg-transparent border border-transparent"
      }`}
    >
      <Link
        href={homeHref}
        className={`group inline-flex items-center gap-3 transition-all duration-700 ${revealClass}`}
        style={{ transitionDelay: show ? "0ms" : "0ms" }}
        aria-label={brand}
      >
        <span className={`relative overflow-hidden rounded-full transition-all duration-500 ${compact ? "h-9 w-9" : "h-11 w-11"}`}>
          <Image src="/logo-kodaore.png" alt="Kodaore logo" fill priority sizes="44px" className="object-contain" />
        </span>
        <span
          className={`font-heading font-semibold tracking-[0.07em] text-foreground transition-all duration-500 group-hover:opacity-85 ${
            compact ? "text-lg md:text-xl" : "text-xl md:text-2xl"
          }`}
        >
          <span className="text-brand">Ko</span>
          <span>dao</span>
          <span className="text-brand-warm">re</span>
        </span>
      </Link>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <nav className="flex flex-wrap items-center gap-3 md:gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${navClass(item.active)} transform-gpu transition-all duration-700 ${revealClass}`}
              style={{ transitionDelay: show ? `${item.delay}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div
          className={`h-5 w-px bg-black/15 transition-all duration-700 ${revealClass}`}
          style={{ transitionDelay: show ? "560ms" : "0ms" }}
          aria-hidden="true"
        />

        <div
          className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-700 ${revealClass}`}
          style={{ transitionDelay: show ? "650ms" : "0ms" }}
        >
          <Link
            href={localizePath(pathname, "eu")}
            className={locale === "eu" ? "text-brand" : "text-ink-muted hover:text-foreground"}
          >
            EU
          </Link>
          <span className="text-black/30">/</span>
          <Link
            href={localizePath(pathname, "es")}
            className={locale === "es" ? "text-brand" : "text-ink-muted hover:text-foreground"}
          >
            ES
          </Link>
        </div>

      </div>
    </div>
  );
}
