"use client";

import { useEffect, useRef, useState } from "react";
import { HomeHero } from "@/components/home-hero";

type HomeHeroScrollSyncProps = {
  tagline: string;
  heroTitle: string;
};

const HERO_ID = "kodaore-home-hero";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function HomeHeroScrollSync({ tagline, heroTitle }: HomeHeroScrollSyncProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      rafRef.current = null;

      const hero = document.getElementById(HERO_ID);
      if (!hero) {
        return;
      }

      const rect = hero.getBoundingClientRect();
      const heroHeight = Math.max(rect.height, 1);
      const progress = clamp01(window.scrollY / (heroHeight * 0.9));

      setScrollProgress(progress);
    };

    const queueUpdate = () => {
      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);

    return () => {
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return <HomeHero tagline={tagline} heroTitle={heroTitle} scrollProgress={scrollProgress} heroId={HERO_ID} />;
}
