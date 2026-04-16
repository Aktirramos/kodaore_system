import type { MetadataRoute } from "next";

const locales = ["eu", "es"] as const;
const seatSlugs = ["azkoitia", "azpeitia", "zumaia"] as const;
const localizedRoutes = [
  "",
  "/acceso",
  "/acceso/crear-cuenta",
  "/sedes",
  "/erropak",
  "/fototeca",
  "/legal/privacy",
  "/legal/terms",
] as const;

function getSiteBaseUrl() {
  const fallback = "http://localhost:3000";
  const configured = process.env.NEXTAUTH_URL?.trim() || fallback;
  return configured.endsWith("/") ? configured.slice(0, -1) : configured;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteBase = getSiteBaseUrl();
  const now = new Date();

  const topLevelEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteBase}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: {
          eu: `${siteBase}/eu`,
          es: `${siteBase}/es`,
        },
      },
    },
  ];

  const localizedEntries: MetadataRoute.Sitemap = locales.flatMap((locale) => {
    const alternateLocale = locale === "eu" ? "es" : "eu";

    const baseRouteEntries = localizedRoutes.map((route) => ({
      url: `${siteBase}/${locale}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 0.95 : 0.8,
      alternates: {
        languages: {
          [locale]: `${siteBase}/${locale}${route}`,
          [alternateLocale]: `${siteBase}/${alternateLocale}${route}`,
        },
      },
    }));

    const seatEntries = seatSlugs.map((seatSlug) => ({
      url: `${siteBase}/${locale}/sedes/${seatSlug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
      alternates: {
        languages: {
          [locale]: `${siteBase}/${locale}/sedes/${seatSlug}`,
          [alternateLocale]: `${siteBase}/${alternateLocale}/sedes/${seatSlug}`,
        },
      },
    }));

    return [...baseRouteEntries, ...seatEntries];
  });

  return [...topLevelEntries, ...localizedEntries];
}
