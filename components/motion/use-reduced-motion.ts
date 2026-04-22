"use client";

import { useReducedMotion as motionUseReducedMotion } from "motion/react";

/**
 * SSR-safe wrapper sobre useReducedMotion de Motion.
 * Devuelve true si el usuario prefiere reducir animaciones.
 * En SSR, devuelve false (Motion ya lo hace; este fichero existe para
 * centralizar el import y poder añadir overrides locales si es necesario).
 */
export function useReducedMotion(): boolean {
  const reduced = motionUseReducedMotion();
  return reduced === true;
}
