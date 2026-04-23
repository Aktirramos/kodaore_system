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
};

/**
 * Progreso del scroll sobre el contenedor del capitulo haraigoshi.
 *
 * Como Math.round del frameIndex redondea medio hacia arriba, los
 * cambios de frame suceden a 10%, 30%, 50%, 70% (mitades de los tramos
 * 0-20, 20-40, 40-60, 60-80). Los aforismos aparecen exactamente en
 * esos puntos de switch para que imagen y texto vayan a la par:
 *
 *   scroll 0%..10%  → frame 0 setup                oreka hautsi aparece 8-20 %
 *   scroll 10%..30% → frame 1 rompiendo equilibrio (sigue oreka hautsi)
 *   scroll 30%..50% → frame 2 entrando             sartu aparece 30-42 %
 *   scroll 50%..70% → frame 3 proyectando          bota aparece 50-62 %
 *   scroll 70%..100%→ frame 4 caida                ondo erori aparece 70-82 %
 */
export function useHaraigoshiScroll(ref: RefObject<HTMLElement | null>): HaraigoshiScroll {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, 1, 2, 3, 4, 4],
  );

  const moment1 = useTransform(scrollYProgress, [0.08, 0.2], [0, 1]);
  const moment2 = useTransform(scrollYProgress, [0.3, 0.42], [0, 1]);
  const moment3 = useTransform(scrollYProgress, [0.5, 0.62], [0, 1]);
  const moment4 = useTransform(scrollYProgress, [0.7, 0.82], [0, 1]);

  return {
    scrollYProgress,
    frameIndex,
    moments: [moment1, moment2, moment3, moment4],
  };
}
