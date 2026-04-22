import clsx from "clsx";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-brand-base text-brand-contrast-2 hover:bg-brand-emphasis-2 active:bg-brand-emphasis-2",
  secondary:
    "border border-border-default bg-surface-elevated text-ink-primary hover:bg-surface-subtle active:bg-surface-subtle",
  ghost:
    "text-ink-primary hover:bg-surface-subtle active:bg-surface-subtle",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold tracking-[0.02em] " +
  "transition-[background-color,color,border-color,transform] duration-[var(--duration-base)] ease-[var(--ease-enter)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base " +
  "active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:opacity-50";

export type ButtonVariants = {
  variant?: Variant;
  size?: Size;
};

export type ButtonProps = ButtonVariants & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Devuelve el string de clases resuelto para un Button.
 * Exportado para ser testeado sin RTL.
 */
export function getButtonClasses({
  variant = "primary",
  size = "md",
  className,
}: ButtonVariants & { className?: string }): string {
  return clsx(BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={getButtonClasses({ variant, size, className })}
      {...props}
    />
  );
});
