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

export function SiteHeaderNav({ locale, brand, discoverLabel, galleryLabel, accessLabel }: SiteHeaderNavProps) {
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
    `border-b-2 px-1 py-2 text-sm font-medium transition ${
      active ? "border-brand text-foreground" : "border-transparent text-ink-muted hover:text-foreground"
    }`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link href={homeHref} className="group inline-flex items-center gap-3" aria-label={brand}>
        <span className="relative h-11 w-11 overflow-hidden rounded-full">
          <Image src="/logo-kodaore.png" alt="Kodaore logo" fill priority sizes="44px" className="object-contain" />
        </span>
        <span className="font-heading text-xl font-semibold tracking-[0.07em] text-foreground transition group-hover:opacity-85 md:text-2xl">
          <span className="text-brand">Ko</span>
          <span>dao</span>
          <span className="text-brand-warm">re</span>
        </span>
      </Link>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <nav className="flex flex-wrap items-center gap-3 md:gap-4">
          <Link href={homeHref} className={navClass(isHome)}>
            {locale === "eu" ? "Hasiera" : "Inicio"}
          </Link>
          <Link href={sitesHref} className={navClass(isSites)}>
            {discoverLabel}
          </Link>
          <Link href={galleryHref} className={navClass(isGallery)}>
            {galleryLabel}
          </Link>
          <Link href={accessHref} className={navClass(isAccess)}>
            {accessLabel}
          </Link>
        </nav>

        <div className="h-5 w-px bg-black/15" aria-hidden="true" />

        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
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
