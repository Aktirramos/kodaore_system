"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SmartImage } from "@/components/smart-image";
import { VantaWavesBackground } from "@/components/vanta-waves-background";

type HomeHeroProps = {
  tagline: string;
  heroTitle: string;
  scrollProgress: number;
  heroId: string;
};

function getInitialReadyState() {
  if (typeof document === "undefined") {
    return false;
  }

  const phase = document.documentElement.getAttribute("data-loader-phase");
  const loaderElement = document.querySelector(".kodaore-loader");
  return phase === "exit" || phase === "hidden" || (phase === null && !loaderElement);
}

export function HomeHero({ tagline, heroTitle, scrollProgress, heroId }: HomeHeroProps) {
  const [ready, setReady] = useState(getInitialReadyState);

  useEffect(() => {
    const html = document.documentElement;

    const syncPhase = () => {
      const phase = html.getAttribute("data-loader-phase");
      const loaderElement = document.querySelector(".kodaore-loader");
      setReady(phase === "exit" || phase === "hidden" || (phase === null && !loaderElement));
    };

    syncPhase();

    const observer = new MutationObserver(syncPhase);
    observer.observe(html, {
      attributes: true,
      attributeFilter: ["data-loader-phase"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id={heroId}
      className={`kodaore-hero relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-surface shadow-[0_50px_120px_-70px_rgba(16,16,16,0.62)] min-h-[74svh] md:h-[calc(100svh-11rem)] md:min-h-[calc(100svh-11rem)] transition-opacity duration-500 ${
        ready ? "opacity-100 fade-rise fade-rise-delay-100" : "opacity-0"
      }`}
    >
      <VantaWavesBackground className="pointer-events-none absolute inset-0" scrollProgress={scrollProgress} />
      <div className="pointer-events-none absolute inset-0 bg-surface/35" />

      <div className="relative z-10 flex h-full flex-col gap-3 rounded-[1.35rem] bg-surface p-3 md:grid md:grid-cols-12 md:p-4 lg:gap-4 lg:p-5">
        <article className="group relative min-h-[46svh] overflow-hidden rounded-2xl border border-white/10 bg-black/15 md:col-span-8 md:min-h-full">
          <SmartImage
            src="/media/hero-1.jpg"
            fallbackSrc="/media/photo-fallback-1.svg"
            alt="Kodaore hero visual"
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 62vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
        </article>

        <div className="grid grid-cols-2 gap-3 md:col-span-4 md:grid-cols-1 md:grid-rows-2 md:gap-4">
          <article className="group relative min-h-[13svh] overflow-hidden rounded-2xl border border-white/10 bg-black/20 md:min-h-0">
            <SmartImage
              src="/media/hero-2.jpg"
              fallbackSrc="/media/photo-fallback-2.svg"
              alt="Kodaore side visual"
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 46vw, 26vw"
            />
          </article>

          <article className="relative min-h-[13svh] overflow-hidden rounded-2xl border border-white/10 bg-surface-strong p-4 md:min-h-0 md:p-5">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-brand" />
            <div className="pointer-events-none absolute inset-y-0 left-2 w-1.5 bg-brand-warm" />
            <div className="relative z-10 flex h-full flex-col justify-start gap-4 pl-5 pr-1 md:pl-6 md:pr-2">
              <div className={`relative aspect-square w-full max-w-[82px] overflow-hidden rounded-full md:max-w-[96px] ${ready ? "fade-rise fade-rise-delay-400" : "opacity-0"}`}>
                <Image
                  src="/logo-kodaore.png"
                  alt="Kodaore logo"
                  fill
                  priority
                  sizes="96px"
                  className="object-contain drop-shadow-[0_12px_24px_rgba(17,17,17,0.2)]"
                />
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-emphasis">{tagline}</p>
                <h1 className={`font-heading text-lg leading-tight text-foreground md:text-xl ${ready ? "fade-rise fade-rise-delay-500" : "opacity-0"}`}>
                  {heroTitle}
                </h1>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/20 to-transparent" />
    </section>
  );
}
