import Link from "next/link";
import { notFound } from "next/navigation";
import { ErropakGallery, type ErropakGalleryItem } from "@/components/erropak-gallery";
import { isLocale, type LocaleCode } from "@/lib/i18n";

type ClothingPageProps = {
  params: Promise<{ locale: string }>;
};

const clothingItems: ErropakGalleryItem[] = [
  {
    nameEu: "Kodaore Club Sudadera",
    nameEs: "Sudadera Club Kodaore",
    categoryEu: "Sudadera",
    categoryEs: "Sudadera",
    imageSrc: "/media/hero-1.jpg",
    fallbackSrc: "/media/photo-fallback-1.svg",
  },
  {
    nameEu: "Kodaore Training Kamiseta",
    nameEs: "Camiseta Training Kodaore",
    categoryEu: "Kamiseta",
    categoryEs: "Camiseta",
    imageSrc: "/media/judo-5.jpg",
    fallbackSrc: "/media/photo-fallback-2.svg",
  },
  {
    nameEu: "Kodaore Eguneroko Motxila",
    nameEs: "Mochila Diario Kodaore",
    categoryEu: "Osagarria",
    categoryEs: "Accesorio",
    imageSrc: "/media/judo-6.jpg",
    fallbackSrc: "/media/photo-fallback-3.svg",
  },
  {
    nameEu: "Kodaore Lightweight Chaqueta",
    nameEs: "Chaqueta Lightweight Kodaore",
    categoryEu: "Chaqueta",
    categoryEs: "Chaqueta",
    imageSrc: "/media/hero-2.jpg",
    fallbackSrc: "/media/photo-fallback-2.svg",
  },
  {
    nameEu: "Kodaore Competition Camiseta",
    nameEs: "Camiseta Competition Kodaore",
    categoryEu: "Kamiseta",
    categoryEs: "Camiseta",
    imageSrc: "/media/judo-4.jpg",
    fallbackSrc: "/media/photo-fallback-1.svg",
  },
  {
    nameEu: "Kodaore Club Pantalon",
    nameEs: "Pantalon Club Kodaore",
    categoryEu: "Pantalon",
    categoryEs: "Pantalon",
    imageSrc: "/media/hero-3.jpg",
    fallbackSrc: "/media/photo-fallback-3.svg",
  },
];

export default async function ClothingPage({ params }: ClothingPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const isEu = locale === "eu";

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-emphasis">
          {isEu ? "Kodaore erropak" : "Ropa Kodaore"}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {isEu ? "Arropa eta osagarrien galeria" : "Galeria de ropa y accesorios"}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted md:text-base">
          {isEu
            ? "Momentuz arropa galeria bisual bat da: estiloak ikusi, irudiak handitu eta hurrengo bildumen inspirazioa hartu."
            : "Por ahora es una galeria visual de ropa: mira estilos, amplia imagenes y descubre la proxima coleccion del club."}
        </p>
      </section>

      <ErropakGallery items={clothingItems} locale={locale as LocaleCode} />

      <section className="fade-rise rounded-3xl border border-white/10 bg-[#151719] p-5 md:p-7">
        <div className="k-hover-soft group/info relative overflow-hidden rounded-2xl border border-white/15 bg-black/25 p-5">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand/14 via-transparent to-brand-warm/14 opacity-0 transition-opacity duration-500 group-hover/info:opacity-100" />
          <h2 className="relative font-heading text-2xl font-semibold tracking-tight text-white md:text-3xl">
            {isEu ? "Laster gehiago" : "Muy pronto mas"}
          </h2>
          <p className="relative mt-3 max-w-2xl text-sm leading-relaxed text-white/85 md:text-base">
            {isEu
              ? "Neurri gida, kolore aukera berriak eta taldeko edizio bereziak prestatzen ari gara."
              : "Estamos preparando guia de tallas, nuevos colores y ediciones especiales del club."}
          </p>

          <Link
            href={`/${locale}`}
            className="k-focus-ring k-hover-action relative mt-5 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:border-white/40"
          >
            {isEu ? "Hasierara itzuli" : "Volver al inicio"}
          </Link>
        </div>
      </section>
    </div>
  );
}
