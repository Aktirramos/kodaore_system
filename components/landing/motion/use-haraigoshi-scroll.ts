"use client";

import { useScroll, useTransform, type MotionValue } from "motion/react";
import { type RefObject } from "react";

export type HaraigoshiScroll = {
  scrollYProgress: MotionValue<number>;
  frameIndex: MotionValue<number>;
  moments: readonly [
    MotionValue<number>,
    MotionValue<number>,
    MotionValue<number>,
    MotionValue<number>,
  ];
  titleOpacity: MotionValue<number>;
};

/**
 * Progreso del scroll sobre el contenedor del capitulo haraigoshi.
 * Mapea scrollYProgress (0..1) a frame index (0..4) y a opacidades por
 * aforismo. Ver docs/landing-plan.md §2-§3 para el timing.
 */
export function useHaraigoshiScroll(ref: RefObject<HTMLElement | null>): HaraigoshiScroll {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, 0, 2, 2, 3, 4],
  );

  const moment1 = useTransform(scrollYProgress, [0, 0.12, 0.2], [0, 1, 1]);
  const moment2 = useTransform(scrollYProgress, [0.2, 0.32, 0.4], [0, 1, 1]);
  const moment3 = useTransform(scrollYProgress, [0.4, 0.52, 0.6], [0, 1, 1]);
  const moment4 = useTransform(scrollYProgress, [0.6, 0.72, 0.8], [0, 1, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);

  return {
    scrollYProgress,
    frameIndex,
    moments: [moment1, moment2, moment3, moment4],
    titleOpacity,
  };
}
