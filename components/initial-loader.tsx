"use client";

import Image from "next/image";
import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";

const START_SCALE = 2.8;
const MOBILE_START_SCALE = 2.4;
const END_SCALE = 1;
const MAX_DEPTH = 1500;
const LOGO_Y_OFFSET = 10;
const DESKTOP_LOGO_SIZE = 128;
const MOBILE_LOGO_SIZE = 112;
const DEPTH_FROM_WHEEL_FACTOR = 0.9;
const DEPTH_FROM_TOUCH_FACTOR = 9;
const SCROLL_HINT_DELAY_MS = 2000;
const Y_PROGRESS_TRAVEL = 24;
const Z_PROGRESS_TRAVEL = 640;

type LoaderPhase = "visible" | "exit" | "hidden";

type LoaderMotion = {
  progress: number;
  scale: number;
  y: number;
  z: number;
};

function calculateLoaderMotion(depth: number, startScale: number, logoBaseSize: number): LoaderMotion {
  const safeDepth = Math.max(0, Math.min(MAX_DEPTH, depth));
  const progress = safeDepth / MAX_DEPTH;
  const scale = startScale - (progress * (startScale - END_SCALE));
  const compensationY = ((scale - END_SCALE) * logoBaseSize) / 2;
  const y = LOGO_Y_OFFSET - compensationY + progress * Y_PROGRESS_TRAVEL;
  const z = -(progress * Z_PROGRESS_TRAVEL);

  return { progress, scale, y, z };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getResponsiveStartScale() {
  if (typeof window === "undefined") {
    return START_SCALE;
  }

  const isMobile = window.innerWidth < 768;
  const viewportHeight = window.innerHeight;
  const preferred = isMobile ? MOBILE_START_SCALE : START_SCALE;

  if (viewportHeight < 700) {
    return Math.min(preferred, isMobile ? 2 : 2.2);
  }

  if (viewportHeight < 820) {
    return Math.min(preferred, isMobile ? 2.2 : 2.5);
  }

  return Math.min(preferred, isMobile ? 2.4 : 2.8);
}

function getResponsiveLogoSize() {
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return MOBILE_LOGO_SIZE;
  }

  return DESKTOP_LOGO_SIZE;
}

export function InitialLoader() {
  const startScaleRef = useRef(START_SCALE);
  const logoBaseSizeRef = useRef(DESKTOP_LOGO_SIZE);
  const [phase, setPhase] = useState<LoaderPhase>("visible");
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [motion, setMotion] = useState<LoaderMotion>(() => calculateLoaderMotion(0, START_SCALE, DESKTOP_LOGO_SIZE));

  const rafRef = useRef<number | null>(null);
  const pendingDepthRef = useRef(0);
  const depthRef = useRef(0);
  const exitedRef = useRef(false);
  const startScrollYRef = useRef(0);

  const applyDepth = useCallback((depth: number) => {
    const safeDepth = Math.max(0, Math.min(MAX_DEPTH, depth));
    const nextMotion = calculateLoaderMotion(safeDepth, startScaleRef.current, logoBaseSizeRef.current);

    setMotion(nextMotion);

    if (nextMotion.scale <= END_SCALE + Number.EPSILON && !exitedRef.current) {
      exitedRef.current = true;
      setPhase("exit");
    }
  }, []);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      startScaleRef.current = getResponsiveStartScale();
      logoBaseSizeRef.current = getResponsiveLogoSize();
      setMotion(calculateLoaderMotion(depthRef.current, startScaleRef.current, logoBaseSizeRef.current));
    });

    return () => {
      window.cancelAnimationFrame(raf);
    };
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
    document.documentElement.setAttribute("data-loader-phase", phase);
  }, [phase]);

  useEffect(() => {
    return () => {
      document.documentElement.removeAttribute("data-loader-phase");
    };
  }, []);

  useEffect(() => {
    if (phase !== "exit") {
      return;
    }

    const exitMs = prefersReducedMotion() ? 160 : 560;
    const hide = window.setTimeout(() => setPhase("hidden"), exitMs);

    return () => {
      window.clearTimeout(hide);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "visible") {
      return;
    }

    setShowScrollHint(false);

    const hintTimer = window.setTimeout(() => {
      if (depthRef.current < MAX_DEPTH && !exitedRef.current) {
        setShowScrollHint(true);
      }
    }, SCROLL_HINT_DELAY_MS);

    return () => {
      window.clearTimeout(hintTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "visible") {
      return;
    }

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousOverscroll = html.style.overscrollBehaviorY;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehaviorY = "none";
    window.scrollTo(0, 0);

    startScrollYRef.current = window.scrollY;
    let previousTouchY: number | null = null;

    const handleWheel = (event: WheelEvent) => {
      depthRef.current = Math.max(0, Math.min(MAX_DEPTH, depthRef.current + event.deltaY * DEPTH_FROM_WHEEL_FACTOR));
      queueDepth(depthRef.current);
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      previousTouchY = touch ? touch.clientY : null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];

      if (!touch || previousTouchY === null) {
        return;
      }

      const deltaY = previousTouchY - touch.clientY;
      previousTouchY = touch.clientY;

      depthRef.current = Math.max(0, Math.min(MAX_DEPTH, depthRef.current + deltaY * DEPTH_FROM_TOUCH_FACTOR));
      queueDepth(depthRef.current);
    };

    const handleTouchEnd = () => {
      previousTouchY = null;
    };

    const handleScroll = () => {
      const delta = Math.max(0, window.scrollY - startScrollYRef.current);
      if (delta > depthRef.current) {
        depthRef.current = Math.min(MAX_DEPTH, delta);
      }
      queueDepth(depthRef.current);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      html.style.overscrollBehaviorY = previousOverscroll;
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [phase, queueDepth]);

  useEffect(() => {
    if (phase === "hidden") {
      window.scrollTo(0, 0);
    }
  }, [phase]);

  if (phase === "hidden") {
    return null;
  }

  const containerStyle = {
    "--loader-progress": motion.progress,
  } as CSSProperties;

  const chromeOpacity = motion.progress > 0.01 ? 0 : 1;

  return (
    <div
      className={`kodaore-loader ${phase === "exit" ? "is-exit" : ""}`}
      style={containerStyle}
      role="status"
      aria-live="polite"
      aria-label="Kodaore loading screen"
    >
      <div className="kodaore-loader-backdrop" aria-hidden="true" />

      <div className="kodaore-loader-content">
        <div
          className={`kodaore-loader-logo-wrap ${phase === "exit" ? "is-exit" : ""}`}
          style={{
            transform: `translate3d(0, ${motion.y}px, ${motion.z}px) scale(${motion.scale})`,
          }}
        >
          <span className="kodaore-loader-logo-glow" aria-hidden="true" />
          <div className="relative h-28 w-28 overflow-hidden rounded-full md:h-32 md:w-32">
            <Image
              src="/logo-kodaore.png"
              alt="Kodaore logo"
              fill
              priority
              sizes="(max-width: 768px) 112px, 128px"
              className="object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.22)]"
            />
          </div>
        </div>

        <p
          className="kodaore-loader-word mt-4 font-heading md:mt-5"
          style={{
            opacity: chromeOpacity,
            transition: "opacity 90ms linear",
            fontSize: "clamp(1.25rem, 5vw, 2.2rem)",
          }}
        >
          <span className="kodaore-loader-ko">Ko</span>
          <span>dao</span>
          <span className="kodaore-loader-re">re</span>
        </p>

        <div className="kodaore-loader-wave" style={{ opacity: chromeOpacity, transition: "opacity 90ms linear" }} aria-hidden="true" />

        <p className={`kodaore-loader-hint ${showScrollHint ? "is-visible" : ""}`} aria-hidden={!showScrollHint}>
          Haz scroll o desliza para continuar
        </p>
      </div>
    </div>
  );
}
