import type { Variants, Transition } from "motion/react";

// Duraciones en segundos (Motion las consume en segundos; nuestro @theme las expresa en ms).
export const MOTION_DURATION = {
  instant: 0,
  fast: 0.12,
  base: 0.2,
  slow: 0.32,
  hero: 0.6,
} as const;

// Curvas compatibles con cubic-bezier del @theme.
export const MOTION_EASE = {
  standard: [0.2, 0, 0, 1] as const,
  enter: [0, 0, 0.2, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
  emphasis: [0.3, 1.4, 0.4, 0.95] as const,
} as const;

// Distancias de desplazamiento en px.
export const MOTION_DISTANCE = {
  sm: 4,
  md: 8,
  lg: 16,
} as const;

/**
 * Fade simple con rise pequeño. Uso: entrada de bloque de contenido.
 * Distancia: sm (4px). Duración: base. Ease: enter.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: MOTION_DISTANCE.sm },
  visible: { opacity: 1, y: 0 },
};

export const fadeUpTransition: Transition = {
  duration: MOTION_DURATION.base,
  ease: MOTION_EASE.enter,
};

/**
 * Stagger de hijos. Máximo 6 items staggerean; del 7 en adelante, todos juntos.
 * El control del límite se hace en la instanciación (slice(0, 6)).
 */
export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

/**
 * Modal: scale 0.96 -> 1 + opacity 0 -> 1 en duración slow.
 * Backdrop se anima por separado con la misma duración.
 */
export const modalIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

export const modalInTransition: Transition = {
  duration: MOTION_DURATION.slow,
  ease: MOTION_EASE.enter,
};

export const modalOutTransition: Transition = {
  duration: 0.18,
  ease: MOTION_EASE.exit,
};

/**
 * Toast: slide-up md (8px) + fade.
 */
export const toastIn: Variants = {
  hidden: { opacity: 0, y: MOTION_DISTANCE.md },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 0 },
};

export const toastInTransition: Transition = {
  duration: MOTION_DURATION.slow,
  ease: MOTION_EASE.enter,
};

export const toastOutTransition: Transition = {
  duration: 0.16,
  ease: MOTION_EASE.exit,
};

/**
 * Page transition: fade+rise sm, para template.tsx del App Router.
 * No aplicar en /admin/*: el template de esas rutas no debe animar.
 */
export const routeTransition: Variants = {
  hidden: { opacity: 0, y: MOTION_DISTANCE.sm },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 0 },
};

export const routeInTransition: Transition = {
  duration: MOTION_DURATION.base,
  ease: MOTION_EASE.enter,
};

export const routeOutTransition: Transition = {
  duration: 0.16,
  ease: MOTION_EASE.exit,
};
