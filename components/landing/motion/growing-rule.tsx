"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

type GrowingRuleProps = {
  className?: string;
  /** Altura del trazo en px. */
  thickness?: number;
  /** Duracion en segundos. */
  duration?: number;
};

/**
 * Linea horizontal fina que crece desde la izquierda cuando entra en
 * viewport. Sin scroll linking — es un reveal one-shot. Uso editorial
 * para separar bloques (§2/§3 de la landing).
 */
export function GrowingRule({ className, thickness = 1, duration = 1 }: GrowingRuleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  return (
    <div
      ref={ref}
      className={className}
      aria-hidden="true"
      style={{ height: thickness, background: "transparent" }}
    >
      <motion.div
        style={{
          height: "100%",
          background: "currentColor",
          transformOrigin: "left center",
        }}
        initial={{ scaleX: reduced ? 1 : 0 }}
        animate={{ scaleX: inView ? 1 : reduced ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : duration, ease: [0.2, 0, 0, 1] }}
      />
    </div>
  );
}
