import { getCopy, isLocale, type LocaleCode } from "@/lib/i18n";

type SiteSlug = "azkoitia" | "azpeitia" | "zumaia";

type SiteContactInfo = {
  telephone: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: "ES";
  };
};

type StructuredDataInput = {
  locale: string;
  site: string;
};

const siteContactBySlug: Record<SiteSlug, SiteContactInfo> = {
  azkoitia: {
    telephone: process.env.KODAORE_AZKOITIA_PHONE?.trim() || "+34 943 85 00 01",
    address: {
      streetAddress: process.env.KODAORE_AZKOITIA_ADDRESS?.trim() || "Polideportivo Municipal de Azkoitia",
      addressLocality: "Azkoitia",
      addressRegion: "Gipuzkoa",
      postalCode: "20720",
      addressCountry: "ES",
    },
  },
  azpeitia: {
    telephone: process.env.KODAORE_AZPEITIA_PHONE?.trim() || "+34 943 81 00 02",
    address: {
      streetAddress: process.env.KODAORE_AZPEITIA_ADDRESS?.trim() || "Polideportivo Municipal de Azpeitia",
      addressLocality: "Azpeitia",
      addressRegion: "Gipuzkoa",
      postalCode: "20730",
      addressCountry: "ES",
    },
  },
  zumaia: {
    telephone: process.env.KODAORE_ZUMAIA_PHONE?.trim() || "+34 943 86 00 03",
    address: {
      streetAddress: process.env.KODAORE_ZUMAIA_ADDRESS?.trim() || "Polideportivo Municipal de Zumaia",
      addressLocality: "Zumaia",
      addressRegion: "Gipuzkoa",
      postalCode: "20750",
      addressCountry: "ES",
    },
  },
};

function getSiteBaseUrl() {
  const fallback = "http://localhost:3000";
  const configured = process.env.NEXTAUTH_URL?.trim() || fallback;
  return new URL(configured.endsWith("/") ? configured : `${configured}/`);
}

function getLocalizedSite(locale: LocaleCode, site: SiteSlug) {
  const copy = getCopy(locale);
  return copy.home.sites.find((item) => item.slug === site);
}

function isSiteSlug(value: string): value is SiteSlug {
  return value in siteContactBySlug;
}

export function buildSiteStructuredData({ locale, site }: StructuredDataInput) {
  if (!isLocale(locale) || !isSiteSlug(site)) {
    return null;
  }

  const selectedSite = getLocalizedSite(locale, site);

  if (!selectedSite) {
    return null;
  }

  const siteBase = getSiteBaseUrl();
  const localizedClubUrl = new URL(`/${locale}`, siteBase).toString();
  const localizedSiteUrl = new URL(`/${locale}/sedes/${site}`, siteBase).toString();
  const logoUrl = new URL("/media/logo-kodaore.png", siteBase).toString();
  const contactInfo = siteContactBySlug[site];
  const organizationId = new URL("/#organization", siteBase).toString();
  const localBusinessId = new URL(`/#localbusiness-${site}`, siteBase).toString();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "Kodaore",
        url: localizedClubUrl,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": localBusinessId,
        name: `Kodaore ${selectedSite.name}`,
        url: localizedSiteUrl,
        telephone: contactInfo.telephone,
        image: logoUrl,
        address: {
          "@type": "PostalAddress",
          streetAddress: contactInfo.address.streetAddress,
          addressLocality: contactInfo.address.addressLocality,
          addressRegion: contactInfo.address.addressRegion,
          postalCode: contactInfo.address.postalCode,
          addressCountry: contactInfo.address.addressCountry,
        },
        parentOrganization: {
          "@id": organizationId,
        },
      },
    ],
  };
}