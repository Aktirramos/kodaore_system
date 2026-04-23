"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { HankoSeal, SumiStroke } from "@/components/decorative";
import { SmartImage } from "@/components/smart-image";

type HomeHeroProps = {
  tagline: string;
  heroTitle: string;
  heroId: string;
};

export function HomeHero({ tagline, heroTitle, heroId }: HomeHeroProps) {
  const pathname = usePathname() ?? "/eu";
  const isEu = pathname.startsWith("/eu");

  const heroImageAlt = isEu ? "Kodaore hero irudia" : "Imagen hero de Kodaore";
  const sideImageAlt = isEu ? "Kodaore alboko irudia" : "Imagen lateral de Kodaore";
  const logoAlt = isEu ? "Kodaore logoa" : "Logo de Kodaore";

  return (
    <section
      id={heroId}
      className="kodaore-hero fade-rise fade-rise-delay-100 relative isolate overflow-hidden rounded-[2rem] border border-border-subtle bg-surface shadow-[0_50px_120px_-70px_rgba(16,16,16,0.62)] min-h-[74svh] md:h-[calc(100svh-11rem)] md:min-h-[calc(100svh-11rem)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(120% 80% at 15% 10%, color-mix(in srgb, var(--brand-base) 18%, transparent) 0%, transparent 55%), radial-gradient(120% 90% at 85% 15%, color-mix(in srgb, var(--accent-base) 14%, transparent) 0%, transparent 60%), linear-gradient(180deg, var(--surface-base) 0%, var(--surface-subtle) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-surface-subtle/60" />

      <div className="relative z-10 flex h-full flex-col gap-3 rounded-[1.35rem] bg-surface p-3 md:grid md:grid-cols-12 md:p-4 lg:gap-4 lg:p-5">
        <article className="group relative min-h-[46svh] overflow-hidden rounded-2xl border border-border-subtle bg-surface-subtle md:col-span-8 md:min-h-full">
          <SmartImage
            src="/media/hero-1.jpg"
            fallbackSrc="/media/photo-fallback-1.svg"
            alt={heroImageAlt}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 62vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
        </article>

        <div className="grid grid-cols-2 gap-3 md:col-span-4 md:grid-cols-1 md:grid-rows-2 md:gap-4">
          <article className="group relative min-h-[13svh] overflow-hidden rounded-2xl border border-border-subtle bg-surface-subtle md:min-h-0">
            <SmartImage
              src="/media/hero-2.jpg"
              fallbackSrc="/media/photo-fallback-2.svg"
              alt={sideImageAlt}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 46vw, 26vw"
            />
          </article>

          <article className="relative min-h-[13svh] overflow-hidden rounded-2xl border border-border-subtle bg-surface-strong p-4 md:min-h-0 md:p-5">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-brand" />
            <div className="pointer-events-none absolute inset-y-0 left-2 w-1.5 bg-brand-warm" />
            <HankoSeal
              className="pointer-events-none absolute right-3 top-3 rotate-[8deg] drop-shadow-[0_6px_14px_rgba(154,30,37,0.35)] md:right-4 md:top-4"
              size={52}
            />
            <div className="relative z-10 flex h-full flex-col justify-start gap-4 pl-5 pr-1 md:pl-6 md:pr-2">
              <div className="fade-rise fade-rise-delay-400 relative aspect-square w-full max-w-[82px] overflow-hidden rounded-full md:max-w-[96px]">
                <Image
                  src="/logo-kodaore.png"
                  alt={logoAlt}
                  fill
                  priority
                  sizes="96px"
                  className="object-contain drop-shadow-[0_12px_24px_rgba(17,17,17,0.2)]"
                />
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-emphasis">{tagline}</p>
                <h1 className="fade-rise fade-rise-delay-500 font-heading text-lg leading-tight text-foreground md:text-xl">
                  {heroTitle}
                </h1>
                <SumiStroke className="mt-1 text-ink-primary/80" width={112} height={12} />
              </div>
            </div>
          </article>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-surface-subtle to-transparent" />
    </section>
  );
}
