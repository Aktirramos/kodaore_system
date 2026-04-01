"use client";

import { useEffect, useRef } from "react";

type VantaWavesBackgroundProps = {
  className?: string;
  scrollProgress?: number;
};

type VantaEffect = {
  destroy?: () => void;
  setOptions?: (options: Record<string, number>) => void;
};

const BASE_COLOR = 0xcf2c31;
const BASE_COLOR_2 = 0x149955;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function blendHexColor(from: number, to: number, t: number) {
  const mix = clamp01(t);
  const fr = (from >> 16) & 0xff;
  const fg = (from >> 8) & 0xff;
  const fb = from & 0xff;
  const tr = (to >> 16) & 0xff;
  const tg = (to >> 8) & 0xff;
  const tb = to & 0xff;

  const rr = Math.round(fr + (tr - fr) * mix);
  const rg = Math.round(fg + (tg - fg) * mix);
  const rb = Math.round(fb + (tb - fb) * mix);

  return (rr << 16) | (rg << 8) | rb;
}

export function VantaWavesBackground({ className, scrollProgress = 0 }: VantaWavesBackgroundProps) {
  const normalizedScrollProgress = Math.max(0, Math.min(1, scrollProgress));

  const elementRef = useRef<HTMLDivElement | null>(null);
  const effectRef = useRef<VantaEffect | undefined>(undefined);
  const lastWaveSpeedRef = useRef(0.7);
  const lastWaveHeightRef = useRef(19);

  useEffect(() => {
    let effect: VantaEffect | undefined;
    let cancelled = false;
    let lastUpdateTime = 0;

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
        mouseControls: true,
        touchControls: false,
        gyroControls: false,
        minHeight: 240,
        minWidth: 240,
        scale: 1,
        scaleMobile: 1,
        color: BASE_COLOR,
        color2: BASE_COLOR_2,
        backgroundColor: 0xf0f2ef,
        shininess: 24,
        waveHeight: 19,
        waveSpeed: 0.7,
        zoom: 0.95,
      });

      effectRef.current = effect;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!elementRef.current || !effect?.setOptions) {
        return;
      }

      const now = performance.now();
      if (now - lastUpdateTime < 80) {
        return;
      }
      lastUpdateTime = now;

      const rect = elementRef.current.getBoundingClientRect();
      const nx = clamp01((event.clientX - rect.left) / rect.width);
      const ny = clamp01((event.clientY - rect.top) / rect.height);

      const color = blendHexColor(0xd94348, 0xbd2026, nx * 0.7 + ny * 0.3);
      const color2 = blendHexColor(0x22ae68, 0x0f8a4b, nx * 0.75 + (1 - ny) * 0.25);

      effect.setOptions({ color, color2 });
    };

    const handlePointerLeave = () => {
      effect?.setOptions?.({ color: BASE_COLOR, color2: BASE_COLOR_2 });
    };

    void init();

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      effectRef.current = undefined;
      effect?.destroy?.();
    };
  }, []);

  useEffect(() => {
    if (!effectRef.current?.setOptions) {
      return;
    }

    const nextWaveSpeed = 0.7 + normalizedScrollProgress * 2.8;
    const nextWaveHeight = 19 + normalizedScrollProgress * 34;

    if (
      Math.abs(nextWaveSpeed - lastWaveSpeedRef.current) < 0.01 &&
      Math.abs(nextWaveHeight - lastWaveHeightRef.current) < 0.04
    ) {
      return;
    }

    lastWaveSpeedRef.current = nextWaveSpeed;
    lastWaveHeightRef.current = nextWaveHeight;
    effectRef.current.setOptions({ waveSpeed: nextWaveSpeed, waveHeight: nextWaveHeight });
  }, [normalizedScrollProgress]);

  return <div ref={elementRef} className={className} aria-hidden="true" />;
}
