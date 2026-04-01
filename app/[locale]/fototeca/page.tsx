import Image from "next/image";
import { notFound } from "next/navigation";
import { SmartImage } from "@/components/smart-image";
import { getCopy, isLocale, type LocaleCode } from "@/lib/i18n";

type LocaleFototecaProps = {
  params: Promise<{ locale: string }>;
};

const galleryBlocks = [
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

export default async function LocaleFototeca({ params }: LocaleFototecaProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCopy(locale as LocaleCode);

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-5 md:p-7">
        <div className="flex flex-col gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-surface-strong px-3 py-1.5">
              <span className="relative h-7 w-7 overflow-hidden rounded-full">
                <Image src="/logo-kodaore.png" alt="Kodaore logo" fill sizes="28px" className="object-contain p-1" />
              </span>
              <span className="font-heading text-sm font-semibold tracking-[0.08em]">
                <span className="text-brand-emphasis">Ko</span>
                <span className="text-foreground">dao</span>
                <span className="text-brand-warm">re</span>
              </span>
            </div>
            <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {copy.ctas.gallery}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
              {copy.home.photoDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="fade-rise grid auto-rows-[170px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4 md:gap-4">
        {galleryBlocks.map((item, index) => {
          const large = index % 5 === 0;
          const wide = index % 3 === 1;

          return (
            <article
              key={`${item.image}-${index}`}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-black/10 ${
                large ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
              } ${wide ? "md:col-span-2" : "md:col-span-1"}`}
            >
              <SmartImage
                src={item.image}
                fallbackSrc={item.fallback}
                alt={`${copy.brand} gallery ${index + 1}`}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            </article>
          );
        })}
      </section>

      <section className="fade-rise rounded-3xl border border-white/10 bg-[#151719] p-5 md:p-7">
        <div className="flex flex-col gap-3">
          <div className="group/final-box relative overflow-hidden rounded-2xl border border-white/15 bg-black/20 p-4 transition-colors duration-500 hover:border-brand/35">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand/14 via-transparent to-brand-warm/14 opacity-0 transition-opacity duration-500 group-hover/final-box:opacity-100" />
            <h2 className="relative font-heading text-2xl font-semibold tracking-tight text-white md:text-3xl">{copy.home.photoTitle}</h2>
            <p className="relative mt-2 max-w-2xl text-sm leading-relaxed text-white/80 transition-colors duration-500 group-hover/final-box:text-white">{copy.home.photoHint}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
