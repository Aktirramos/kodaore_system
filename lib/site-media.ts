type SiteGalleryItem = {
  src: string;
  fallbackSrc: string;
};

export type SiteMedia = {
  coverSrc: string;
  fallbackSrc: string;
  gallery: ReadonlyArray<SiteGalleryItem>;
};

const siteMediaBySlug = {
  azkoitia: {
    coverSrc: "/media/sedes/azkoitia-poli.jpg",
    fallbackSrc: "/media/photo-fallback-1.svg",
    gallery: [
      { src: "/media/sedes/azkoitia-poli.jpg", fallbackSrc: "/media/photo-fallback-1.svg" },
      { src: "/media/judo-4.jpg", fallbackSrc: "/media/photo-fallback-1.svg" },
      { src: "/media/judo-6.jpg", fallbackSrc: "/media/photo-fallback-3.svg" },
    ],
  },
  azpeitia: {
    coverSrc: "/media/sedes/azpeitia-poli.jpg",
    fallbackSrc: "/media/photo-fallback-2.svg",
    gallery: [
      { src: "/media/sedes/azpeitia-poli.jpg", fallbackSrc: "/media/photo-fallback-2.svg" },
      { src: "/media/judo-5.jpg", fallbackSrc: "/media/photo-fallback-2.svg" },
      { src: "/media/judo-4.jpg", fallbackSrc: "/media/photo-fallback-1.svg" },
    ],
  },
  zumaia: {
    coverSrc: "/media/sedes/zumaia-poli.jpg",
    fallbackSrc: "/media/photo-fallback-3.svg",
    gallery: [
      { src: "/media/sedes/zumaia-poli.jpg", fallbackSrc: "/media/photo-fallback-3.svg" },
      { src: "/media/judo-6.jpg", fallbackSrc: "/media/photo-fallback-3.svg" },
      { src: "/media/judo-5.jpg", fallbackSrc: "/media/photo-fallback-2.svg" },
    ],
  },
} as const;

const defaultSiteMedia: SiteMedia = siteMediaBySlug.azkoitia;

export function getSiteMedia(siteSlug: string): SiteMedia {
  return siteMediaBySlug[siteSlug as keyof typeof siteMediaBySlug] ?? defaultSiteMedia;
}
