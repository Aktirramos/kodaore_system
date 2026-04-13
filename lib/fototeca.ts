export type FototecaItem = {
  image: string;
  fallback: string;
  name?: string;
};

export const DEFAULT_FOTOTECA_ITEMS: FototecaItem[] = [
  {
    image: "/media/hero-1.jpg",
    fallback: "/media/photo-fallback-1.svg",
  },
  {
    image: "/media/hero-2.jpg",
    fallback: "/media/photo-fallback-2.svg",
  },
  {
    image: "/media/hero-3.jpg",
    fallback: "/media/photo-fallback-3.svg",
  },
  {
    image: "/media/judo-4.jpg",
    fallback: "/media/photo-fallback-1.svg",
  },
  {
    image: "/media/judo-5.jpg",
    fallback: "/media/photo-fallback-2.svg",
  },
  {
    image: "/media/judo-6.jpg",
    fallback: "/media/photo-fallback-3.svg",
  },
];

export async function getFototecaItems(): Promise<FototecaItem[]> {
  return DEFAULT_FOTOTECA_ITEMS;
}
