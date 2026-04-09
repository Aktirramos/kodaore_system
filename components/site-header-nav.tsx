"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthSignOutButton } from "@/components/auth-signout-button";
import type { LocaleCode } from "@/lib/i18n";

type SiteHeaderNavProps = {
  locale: LocaleCode;
  brand: string;
  discoverLabel: string;
  galleryLabel: string;
  accessLabel: string;
  isAuthenticated: boolean;
  show: boolean;
  compact?: boolean;
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

export function SiteHeaderNav({ locale, brand, discoverLabel, galleryLabel, accessLabel, isAuthenticated, show, compact = false }: SiteHeaderNavProps) {
  const pathname = usePathname() ?? `/${locale}`;

  const homeHref = `/${locale}`;
  const sitesHref = `/${locale}/sedes`;
  const galleryHref = `/${locale}/fototeca`;
  const accessHref = `/${locale}/acceso`;
  const adminHref = `/${locale}/admin`;
  const portalHref = `/${locale}/portal`;
  const portalProfileHref = `/${locale}/portal/profile`;
  const portalPaymentsHref = `/${locale}/portal/payments`;
  const portalMessagesHref = `/${locale}/portal/messages`;

  const isAdminArea = pathname.startsWith(adminHref);
  const isPortalArea = pathname.startsWith(portalHref);
  const isPortalSummary = pathname === portalHref || pathname === `${portalHref}/`;
  const isPrivateArea = isAuthenticated && (isAdminArea || isPortalArea);

  const panelHref = isAdminArea ? adminHref : portalHref;
  const panelLabel = isPortalArea ? (locale === "eu" ? "Laburpena" : "Resumen") : locale === "eu" ? "Panel nagusia" : "Panel principal";
  const publicSiteLabel = locale === "eu" ? "Web nagusia" : "Pagina principal";
  const portalSectionLinks = [
    {
      href: portalProfileHref,
      label: locale === "eu" ? "Datu pertsonalak" : "Datos personales",
      active: pathname.startsWith(portalProfileHref),
    },
    {
      href: portalPaymentsHref,
      label: locale === "eu" ? "Ordainketak" : "Pagos",
      active: pathname.startsWith(portalPaymentsHref),
    },
    {
      href: portalMessagesHref,
      label: locale === "eu" ? "Komunikazioak" : "Comunicaciones",
      active: pathname.startsWith(portalMessagesHref),
    },
  ];

  const isHome = pathname === homeHref || pathname === `${homeHref}/`;
  const isSites = pathname.startsWith(sitesHref);
  const isGallery = pathname.startsWith(galleryHref);
  const isAccess = pathname.startsWith(accessHref);

  const navClass = (active: boolean) => clsx(
    "border-b-2 px-1 py-2 text-sm font-medium transition-colors",
    active ? "border-brand text-foreground" : "border-transparent text-ink-muted hover:text-foreground",
  );

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
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-transparent bg-transparent transition-all duration-500"
    >
      <Link
        href={isPrivateArea ? panelHref : homeHref}
        className={clsx("group inline-flex items-center gap-3 transition-all duration-700", revealClass)}
        style={{ transitionDelay: show ? "0ms" : "0ms" }}
        aria-label={brand}
      >
        <span className={clsx("relative overflow-hidden rounded-full transition-all duration-500", compact ? "h-9 w-9" : "h-11 w-11")}>
          <Image src="/logo-kodaore.png" alt="Kodaore logo" fill priority sizes="44px" className="object-contain" />
        </span>
        <span
          className={clsx(
            "font-heading font-semibold tracking-[0.07em] text-foreground transition-all duration-500 group-hover:opacity-85",
            compact ? "text-lg md:text-xl" : "text-xl md:text-2xl",
          )}
        >
          <span className="text-brand-emphasis">Ko</span>
          <span>dao</span>
          <span className="text-brand-warm">re</span>
        </span>
      </Link>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <nav className="flex flex-wrap items-center gap-3 md:gap-4">
          {isPrivateArea ? (
            <>
              <Link
                href={panelHref}
                className={clsx(navClass(isPortalArea ? isPortalSummary : pathname.startsWith(panelHref)), "transform-gpu transition-all duration-700", revealClass)}
                style={{ transitionDelay: show ? "180ms" : "0ms" }}
              >
                {panelLabel}
              </Link>
              {isPortalArea
                ? portalSectionLinks.map((item, index) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(navClass(item.active), "transform-gpu transition-all duration-700", revealClass)}
                      style={{ transitionDelay: show ? `${260 + index * 80}ms` : "0ms" }}
                    >
                      {item.label}
                    </Link>
                  ))
                : null}
              <Link
                href={homeHref}
                className={clsx(navClass(false), "transform-gpu transition-all duration-700", revealClass)}
                style={{ transitionDelay: show ? "520ms" : "0ms" }}
              >
                {publicSiteLabel}
              </Link>
            </>
          ) : (
            navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(navClass(item.active), "transform-gpu transition-all duration-700", revealClass)}
                style={{ transitionDelay: show ? `${item.delay}ms` : "0ms" }}
              >
                {item.label}
              </Link>
            ))
          )}
        </nav>

        <div
          className={clsx("h-5 w-px bg-white/20 transition-all duration-700", revealClass)}
          style={{ transitionDelay: show ? "560ms" : "0ms" }}
          aria-hidden="true"
        />

        <div
          className={clsx("inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-700", revealClass)}
          style={{ transitionDelay: show ? "650ms" : "0ms" }}
        >
          <Link
            href={localizePath(pathname, "eu")}
            className={clsx("rounded px-1 py-0.5 transition-colors", locale === "eu" ? "text-brand-emphasis" : "text-ink-muted hover:text-foreground")}
          >
            EU
          </Link>
          <span className="text-ink-muted">/</span>
          <Link
            href={localizePath(pathname, "es")}
            className={clsx("rounded px-1 py-0.5 transition-colors", locale === "es" ? "text-brand-emphasis" : "text-ink-muted hover:text-foreground")}
          >
            ES
          </Link>
        </div>

        {isAuthenticated ? (
          <div
            className={clsx("transition-all duration-700", revealClass)}
            style={{ transitionDelay: show ? "720ms" : "0ms" }}
          >
            <AuthSignOutButton locale={locale} className="min-h-9 px-3 py-1.5 text-xs md:text-sm" />
          </div>
        ) : null}

      </div>
    </div>
  );
}
