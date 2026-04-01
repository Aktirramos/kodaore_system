"use client";

import { useEffect, useRef } from "react";

type VantaWavesBackgroundProps = {
  className?: string;
};

export function VantaWavesBackground({ className }: VantaWavesBackgroundProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let effect: { destroy?: () => void } | undefined;
    let cancelled = false;

    const init = async () => {
      const [{ default: WAVES }, THREE] = await Promise.all([
        import("vanta/dist/vanta.waves.min"),
        import("three"),
      ]);

      if (cancelled || !elementRef.current) {
        return;
      }

      effect = WAVES({
        el: elementRef.current,
        THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 240,
        minWidth: 240,
        scale: 1,
        scaleMobile: 1,
        color: 0xcf2c31,
        color2: 0x149955,
        backgroundColor: 0xf0f2ef,
        shininess: 24,
        waveHeight: 18,
        waveSpeed: 0.56,
        zoom: 0.95,
      });
    };

    void init();

    return () => {
      cancelled = true;
      effect?.destroy?.();
    };
  }, []);

  return <div ref={elementRef} className={className} aria-hidden="true" />;
}
