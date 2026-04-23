import { type LocaleCode, getCopy } from "@/lib/i18n";
import { SITE_SLUGS, SITE_GEO } from "./data/sites";

/**
 * JSON-LD para la landing narrativa: una Organization + tres
 * LocalBusiness (una por sede). Los campos opcionales (telefono, geo)
 * se omiten cuando no los tenemos — nunca se inventan.
 */
export function LandingStructuredData({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kodaore.eus";

  const organization = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "Kodaore",
    url: `${base}/${locale}`,
    logo: `${base}/logo-kodaore.png`,
    description: copy.landing.meta.description,
    areaServed: [
      { "@type": "City", name: "Azkoitia" },
      { "@type": "City", name: "Azpeitia" },
      { "@type": "City", name: "Zumaia" },
    ],
    sport: ["Judo", "Self-defense"],
  };

  const sites = copy.landing.sites.items.filter((site): site is typeof site & { slug: (typeof SITE_SLUGS)[number] } =>
    (SITE_SLUGS as readonly string[]).includes(site.slug),
  );

  const localBusinesses = sites.map((site) => {
    const geo = SITE_GEO[site.slug];
    return {
      "@context": "https://schema.org",
      "@type": "SportsActivityLocation",
      name: `Kodaore · ${site.city}`,
      parentOrganization: { "@type": "SportsOrganization", name: "Kodaore" },
      url: `${base}/${locale}/sedes/${site.slug}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: geo.addressLocality,
        addressRegion: geo.addressRegion,
        addressCountry: geo.addressCountry,
      },
    };
  });

  const payload = [organization, ...localBusinesses];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
