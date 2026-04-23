export const SITE_SLUGS = ["azkoitia", "azpeitia", "zumaia"] as const;
export type SiteSlug = (typeof SITE_SLUGS)[number];

export const SITE_GEO: Record<SiteSlug, { street?: string; postalCode?: string; addressLocality: string; addressRegion: string; addressCountry: string }> = {
  azkoitia: {
    addressLocality: "Azkoitia",
    addressRegion: "Gipuzkoa",
    addressCountry: "ES",
  },
  azpeitia: {
    addressLocality: "Azpeitia",
    addressRegion: "Gipuzkoa",
    addressCountry: "ES",
  },
  zumaia: {
    addressLocality: "Zumaia",
    addressRegion: "Gipuzkoa",
    addressCountry: "ES",
  },
};
