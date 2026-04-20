"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

type SmartImageProps = Omit<ImageProps, "src"> & {
  src: string;
  fallbackSrc: string;
  parallax?: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function isSvgSource(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized.startsWith("data:image/svg+xml")) {
    return true;
  }

  const withoutQuery = normalized.split("?")[0]?.split("#")[0] ?? normalized;
  return withoutQuery.endsWith(".svg");
}

export function SmartImage({ src, fallbackSrc, alt, onError, parallax = false, className, style, fill, ...props }: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [parallaxY, setParallaxY] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  useEffect(() => {
    if (!parallax) {
      return;
    }

    const updateParallax = () => {
      rafRef.current = null;
      const element = wrapperRef.current;

      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const viewportHeight = Math.max(window.innerHeight, 1);
      const centerOffset = rect.top + rect.height / 2 - viewportHeight / 2;
      const normalized = clamp(centerOffset / (viewportHeight / 2), -1, 1);
      const next = -normalized * 14;

      setParallaxY((previous) => (Math.abs(previous - next) < 0.2 ? previous : next));
    };

    const queueUpdate = () => {
      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);

    return () => {
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [parallax]);

  const effectiveParallaxY = parallax ? parallaxY : 0;
  const useUnoptimizedImage = isSvgSource(currentSrc);

  const imageStyle = parallax
    ? {
      ...style,
      transform: style?.transform
        ? `${style.transform} translate3d(0, ${effectiveParallaxY}px, 0)`
        : `translate3d(0, ${effectiveParallaxY}px, 0)`,
      willChange: "transform",
      transition: "transform 140ms linear",
    }
    : style;

  const imageNode = (
    <Image
      key={currentSrc}
      {...props}
      fill={fill}
      src={currentSrc}
      alt={alt}
      unoptimized={useUnoptimizedImage}
      className={className}
      style={imageStyle}
      onError={(event) => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }

        onError?.(event);
      }}
    />
  );

  if (!parallax) {
    return imageNode;
  }

  return (
    <div ref={wrapperRef} className={fill ? "absolute inset-0" : "relative block"}>
      {imageNode}
    </div>
  );
}
