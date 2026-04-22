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
  const heroTag = isEu ? "Ikus-bilduma" : "Coleccion visual";
  const heroTitle = isEu ? "Kodaore Erropak" : "Kodaore Erropak";
  const heroDescription = isEu
    ? "Momentuz denda honetarako da: piezak ikusi, handitu eta gustuko dituzunak aukeratzeko. Ondoren klubarekin hitz egin informazioa jasotzeko."
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
      <section className="fade-rise overflow-hidden rounded-3xl border border-border-subtle bg-surface p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-[1.25fr_0.95fr]">
          <article>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-emphasis">{heroTag}</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-5xl">{heroTitle}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted md:text-base">{heroDescription}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-border-default bg-surface-subtle px-3 py-1 text-xs uppercase tracking-[0.12em] text-ink-secondary">
                {isEu ? "Sudaderak" : "Sudaderas"}
              </span>
              <span className="rounded-full border border-border-default bg-surface-subtle px-3 py-1 text-xs uppercase tracking-[0.12em] text-ink-secondary">
                {isEu ? "Kamisetak" : "Camisetas"}
              </span>
              <span className="rounded-full border border-border-default bg-surface-subtle px-3 py-1 text-xs uppercase tracking-[0.12em] text-ink-secondary">
                {isEu ? "Osagarriak" : "Accesorios"}
              </span>
            </div>
          </article>

          <article className="group/how relative overflow-hidden rounded-2xl border border-border-default bg-surface-subtle p-5 transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-surface-subtle/60">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-subtle via-transparent to-accent-subtle opacity-0 transition-opacity duration-300 group-hover/how:opacity-100" />

            <h2 className="relative font-heading text-xl font-semibold text-foreground md:text-2xl">
              {isEu ? "Nola funtzionatzen du?" : "Como funciona"}
            </h2>
            <ol className="relative mt-3 space-y-2 text-sm text-ink-muted">
              <li>{isEu ? "1. Piezak filtratu eta handitu." : "1. Filtra y amplia prendas en la galeria."}</li>
              <li>{isEu ? "2. Gustuko konbinazioak aukeratu." : "2. Elige combinaciones que te encajen."}</li>
              <li>{isEu ? "3. Informazioa eskatu klubari." : "3. Solicita informacion al club."}</li>
            </ol>

            <Link
              href={interestCtaHref}
              className="relative mt-5 inline-flex rounded-full border border-brand/45 bg-brand-subtle px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-emphasis transition-[transform,background-color,border-color,box-shadow,color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:hover:translate-y-0"
            >
              {interestCtaLabel}
            </Link>
          </article>
        </div>
      </section>

      <section className="fade-rise grid gap-3 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="group/highlight relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-strong p-4 transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-surface-subtle/60">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-subtle via-transparent to-accent-subtle opacity-0 transition-opacity duration-300 group-hover/highlight:opacity-100" />
            <h2 className="relative font-heading text-xl font-semibold text-foreground">{item.title}</h2>
            <p className="relative mt-2 text-sm leading-relaxed text-ink-muted">{item.text}</p>
          </article>
        ))}
      </section>

      <ErropakGallery items={clothingItems} locale={locale as LocaleCode} />
    </div>
  );
}
