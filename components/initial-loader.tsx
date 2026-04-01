"use client";

import Image from "next/image";
import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";

const START_SCALE = 3.5;
const END_SCALE = 1;
const MAX_DEPTH = 1000;
const CHROME_HIDE_PROGRESS = 0.05;

export function InitialLoader() {
  const [phase, setPhase] = useState<"visible" | "exit" | "hidden">("visible");
  const [motion, setMotion] = useState({
    progress: 0,
    scale: START_SCALE,
    y: 0,
    z: 0,
    blur: (START_SCALE - END_SCALE) * 6,
  });

  const rafRef = useRef<number | null>(null);
  const pendingDepthRef = useRef(0);
  const depthRef = useRef(0);
  const exitedRef = useRef(false);
  const startScrollYRef = useRef(0);

  const applyDepth = useCallback((depth: number) => {
    const safeDepth = Math.max(0, Math.min(MAX_DEPTH, depth));
    const progress = safeDepth / MAX_DEPTH;
    const scale = START_SCALE - (START_SCALE - END_SCALE) * progress;
    const y = progress * 24;
    const z = -(progress * 640);
    const blur = (scale - END_SCALE) * 6;

    setMotion({ progress, scale, y, z, blur });

    if (progress >= 1 && !exitedRef.current) {
      exitedRef.current = true;
      setPhase("exit");
    }
  }, []);

  const queueDepth = useCallback((depth: number) => {
    pendingDepthRef.current = Math.max(0, Math.min(MAX_DEPTH, depth));

    if (rafRef.current !== null) {
      return;
    }

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      applyDepth(pendingDepthRef.current);
    });
  }, [applyDepth]);

  useEffect(() => {
    if (phase !== "visible") {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const autoExitMs = prefersReducedMotion ? 900 : 2800;

    const startExit = window.setTimeout(() => {
      if (!exitedRef.current) {
        exitedRef.current = true;
        depthRef.current = MAX_DEPTH;
        queueDepth(MAX_DEPTH);
        setPhase("exit");
      }
    }, autoExitMs);

    return () => {
      window.clearTimeout(startExit);
    };
  }, [phase, queueDepth]);

  useEffect(() => {
    document.documentElement.setAttribute("data-loader-phase", phase);

    return () => {
      document.documentElement.removeAttribute("data-loader-phase");
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "exit") {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const exitMs = prefersReducedMotion ? 160 : 560;
    const hide = window.setTimeout(() => setPhase("hidden"), exitMs);

    return () => {
      window.clearTimeout(hide);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "visible") {
      return;
    }

    startScrollYRef.current = window.scrollY;

    const handleWheel = (event: WheelEvent) => {
      depthRef.current = Math.max(0, Math.min(MAX_DEPTH, depthRef.current + event.deltaY * 0.9));
      queueDepth(depthRef.current);
    };

    const handleScroll = () => {
      const delta = Math.max(0, window.scrollY - startScrollYRef.current);
      if (delta > depthRef.current) {
        depthRef.current = Math.min(MAX_DEPTH, delta);
      }
      queueDepth(depthRef.current);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [phase, queueDepth]);

  if (phase === "hidden") {
    return null;
  }

  const containerStyle = {
    "--loader-progress": motion.progress,
  } as CSSProperties;

  const isChromeHidden = motion.progress > CHROME_HIDE_PROGRESS;

  return (
    <div
      className={`kodaore-loader ${phase === "exit" ? "is-exit" : ""} ${isChromeHidden ? "is-chrome-hidden" : ""}`}
      style={containerStyle}
      role="status"
      aria-label="Kodaore loading screen"
    >
      <div className="kodaore-loader-backdrop" aria-hidden="true" />

      <div className="kodaore-loader-content">
        <div
          className={`kodaore-loader-logo-wrap ${phase === "exit" ? "is-exit" : ""}`}
          style={{
            transform: `translate3d(0, ${motion.y}px, ${motion.z}px) scale(${motion.scale})`,
            filter: `blur(${motion.blur}px)`,
          }}
        >
          <span className="kodaore-loader-logo-glow" aria-hidden="true" />
          <div className="relative h-32 w-32 overflow-hidden rounded-full">
            <Image
              src="/logo-kodaore.png"
              alt="Kodaore logo"
              fill
              priority
              sizes="128px"
              className="object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.22)]"
            />
          </div>
        </div>

        <p className="kodaore-loader-word font-heading">
          <span className="kodaore-loader-ko">Ko</span>
          <span>dao</span>
          <span className="kodaore-loader-re">re</span>
        </p>

        <div className="kodaore-loader-wave" aria-hidden="true" />
      </div>
    </div>
  );
}
