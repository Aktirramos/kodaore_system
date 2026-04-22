import clsx from "clsx";
import { forwardRef, type HTMLAttributes } from "react";

type Variant = "default" | "subtle" | "elevated";

const VARIANT_CLASSES: Record<Variant, string> = {
  default: "bg-surface-elevated border border-border-subtle",
  subtle: "bg-surface-subtle border border-border-subtle",
  elevated: "bg-surface-elevated border border-border-subtle shadow-md",
};

const INTERACTIVE_CLASSES =
  "transition-[transform,box-shadow,border-color,background-color] duration-[var(--duration-base)] ease-[var(--ease-enter)] " +
  "hover:-translate-y-[var(--distance-sm)] hover:shadow-md hover:border-border-default " +
  "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-base " +
  "motion-reduce:transform-none motion-reduce:transition-[box-shadow,border-color,background-color]";

const BASE_CLASSES = "relative rounded-lg p-4";

export type CardVariants = {
  variant?: Variant;
  interactive?: boolean;
};

export type CardProps = CardVariants & HTMLAttributes<HTMLDivElement>;

/**
 * Devuelve el string de clases resuelto para una Card.
 */
export function getCardClasses({
  variant = "default",
  interactive = false,
  className,
}: CardVariants & { className?: string }): string {
  return clsx(
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    interactive && INTERACTIVE_CLASSES,
    className,
  );
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "default", interactive = false, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={getCardClasses({ variant, interactive, className })}
      {...props}
    />
  );
});
