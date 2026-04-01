"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function InitialLoader() {
  const [phase, setPhase] = useState<"visible" | "exit" | "hidden">("visible");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const visibleMs = prefersReducedMotion ? 320 : 1450;
    const exitMs = prefersReducedMotion ? 100 : 380;

    const startExit = window.setTimeout(() => setPhase("exit"), visibleMs);
    const hide = window.setTimeout(() => setPhase("hidden"), visibleMs + exitMs);

    return () => {
      window.clearTimeout(startExit);
      window.clearTimeout(hide);
    };
  }, []);

  if (phase === "hidden") {
    return null;
  }

  return (
    <div className={`kodaore-loader ${phase === "exit" ? "is-exit" : ""}`} role="status" aria-label="Kodaore loading screen">
      <div className="kodaore-loader-card">
        <div className="kodaore-loader-logo-wrap">
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
