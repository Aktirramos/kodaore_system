import Link from "next/link";
import { notFound } from "next/navigation";
import { ErropakGallery, type ErropakGalleryItem } from "@/components/erropak-gallery";
import { isLocale, type LocaleCode } from "@/lib/i18n";

type ClothingPageProps = {
  params: Promise<{ locale: string }>;
};

const clothingItems: ErropakGalleryItem[] = [
  {
    categoryKey: "sudadera",
    nameEu: "Kodaore Club Sudadera",
    nameEs: "Sudadera Club Kodaore",
    categoryEu: "Sudadera",
    categoryEs: "Sudadera",
    imageSrc: "/media/hero-1.jpg",
    fallbackSrc: "/media/photo-fallback-1.svg",
  },
  {
    categoryKey: "kamiseta",
    nameEu: "Kodaore Training Kamiseta",
    nameEs: "Camiseta Training Kodaore",
    categoryEu: "Kamiseta",
    categoryEs: "Camiseta",
    imageSrc: "/media/judo-5.jpg",
    fallbackSrc: "/media/photo-fallback-2.svg",
  },
  {
    categoryKey: "osagarria",
    nameEu: "Kodaore Eguneroko Motxila",
    nameEs: "Mochila Diario Kodaore",
    categoryEu: "Osagarria",
    categoryEs: "Accesorio",
    imageSrc: "/media/judo-6.jpg",
    fallbackSrc: "/media/photo-fallback-3.svg",
  },
  {
    categoryKey: "chaqueta",
    nameEu: "Kodaore Lightweight Chaqueta",
    nameEs: "Chaqueta Lightweight Kodaore",
    categoryEu: "Chaqueta",
    categoryEs: "Chaqueta",
    imageSrc: "/media/hero-2.jpg",
    fallbackSrc: "/media/photo-fallback-2.svg",
  },
  {
    categoryKey: "kamiseta",
    nameEu: "Kodaore Competition Camiseta",
    nameEs: "Camiseta Competition Kodaore",
    categoryEu: "Kamiseta",
    categoryEs: "Camiseta",
    imageSrc: "/media/judo-4.jpg",
    fallbackSrc: "/media/photo-fallback-1.svg",
  },
  {
    categoryKey: "pantalon",
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
  const heroTag = isEu ? "Kolekzio bisuala" : "Coleccion visual";
  const heroTitle = isEu ? "Kodaore Erropak" : "Kodaore Erropak";
  const heroDescription = isEu
    ? "Momentuz ez da denda transakzionala: piezak ikusi, handitu eta gustuko dituzunak aukeratu. Ondoren klubarekin lotu zaitezke informazioa jasotzeko."
    : "Por ahora no es una tienda transaccional: mira prendas, amplialas y guarda tus favoritas para despues pedir informacion al club.";

  const highlights = [
    {
      title: isEu ? "Drop berriak" : "Nuevos drops",
      text: isEu
        ? "Denboraldiko koloreak eta entrenamendu + kale estilo nahasketak."
        : "Colores de temporada y mezclas entre estilo entrenamiento y calle.",
    },
    {
      title: isEu ? "Talde edizioa" : "Edicion equipo",
      text: isEu
        ? "Taldeko irteeretarako serigrafia berezia duten aukerak."
        : "Opciones con serigrafia especial para salidas y eventos del equipo.",
    },
    {
      title: isEu ? "Eskaera orientazioa" : "Asesoramiento",
      text: isEu
        ? "Neurrien edo piezen gomendioa nahi baduzu, zuzenean idatzi."
        : "Si quieres recomendacion de talla o combinacion, te orientamos directo.",
    },
  ];

  const interestCtaLabel = isEu ? "Informazioa eskatu" : "Solicitar informacion";
  const interestCtaHref = `/${locale}/acceso`;

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="fade-rise overflow-hidden rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-[1.25fr_0.95fr]">
          <article>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-emphasis">{heroTag}</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-5xl">{heroTitle}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted md:text-base">{heroDescription}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.12em] text-white/85">
                {isEu ? "Sudaderak" : "Sudaderas"}
              </span>
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.12em] text-white/85">
                {isEu ? "Kamisetak" : "Camisetas"}
              </span>
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.12em] text-white/85">
                {isEu ? "Osagarriak" : "Accesorios"}
              </span>
            </div>
          </article>

          <article className="rounded-2xl border border-white/15 bg-black/25 p-5">
            <h2 className="font-heading text-xl font-semibold text-foreground md:text-2xl">
              {isEu ? "Nola funtzionatzen du?" : "Como funciona"}
            </h2>
            <ol className="mt-3 space-y-2 text-sm text-ink-muted">
              <li>{isEu ? "1. Galerian piezak filtratu eta handitu." : "1. Filtra y amplia prendas en la galeria."}</li>
              <li>{isEu ? "2. Gustuko konbinazioak aukeratu." : "2. Elige combinaciones que te encajen."}</li>
              <li>{isEu ? "3. Informazioa eskatu klubari." : "3. Solicita informacion al club."}</li>
            </ol>

            <Link
              href={interestCtaHref}
              className="k-focus-ring k-hover-action mt-5 inline-flex rounded-full border border-brand/45 bg-brand/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-emphasis"
            >
              {interestCtaLabel}
            </Link>
          </article>
        </div>
      </section>

      <section className="fade-rise grid gap-3 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-2xl border border-white/10 bg-surface-strong/70 p-4">
            <h2 className="font-heading text-xl font-semibold text-foreground">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.text}</p>
          </article>
        ))}
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
