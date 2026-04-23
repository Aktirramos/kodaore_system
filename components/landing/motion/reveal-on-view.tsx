"use client";

import { motion, type Variants } from "motion/react";
import { type HTMLAttributes, type ElementType, type ReactNode } from "react";
import { MOTION_DISTANCE, MOTION_DURATION, MOTION_EASE } from "@/components/motion";

const editorialReveal: Variants = {
  hidden: { opacity: 0, y: MOTION_DISTANCE.md },
  visible: { opacity: 1, y: 0 },
};

type RevealOnViewProps = Omit<
  HTMLAttributes<HTMLElement>,
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDragStart" | "onDragEnd" | "onDrag"
> & {
  as?: ElementType;
  children: ReactNode;
  delay?: number;
  amount?: number;
  once?: boolean;
};

export function RevealOnView({
  as: Tag = "div",
  children,
  delay = 0,
  amount = 0.25,
  once = true,
  ...rest
}: RevealOnViewProps) {
  const MotionTag = motion(Tag);
  return (
    <MotionTag
      {...rest}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={editorialReveal}
      transition={{
        duration: MOTION_DURATION.slow,
        ease: MOTION_EASE.enter,
        delay,
      }}
    >
      {children}
    </MotionTag>
  );
}
