import clsx from "clsx";
import { forwardRef, type HTMLAttributes } from "react";

type Tone = "brand" | "accent" | "neutral" | "success" | "warning" | "info" | "danger";

const TONE_CLASSES: Record<Tone, string> = {
  brand: "bg-brand-subtle text-brand-emphasis-2 border border-brand-base/20",
  accent: "bg-accent-subtle text-accent-emphasis border border-accent-base/20",
  neutral: "bg-surface-subtle text-ink-secondary border border-border-subtle",
  success: "bg-accent-subtle text-accent-emphasis border border-accent-base/20",
  warning: "bg-warning-base/12 text-warning-base border border-warning-base/25",
  info: "bg-info-base/10 text-info-base border border-info-base/25",
  danger: "bg-danger-base/10 text-danger-base border border-danger-base/25",
};

const BASE_CLASSES =
  "inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-xs font-semibold tracking-[0.04em]";

export type BadgeVariants = {
  tone?: Tone;
};

export type BadgeProps = BadgeVariants & HTMLAttributes<HTMLSpanElement>;

export function getBadgeClasses({
  tone = "neutral",
  className,
}: BadgeVariants & { className?: string }): string {
  return clsx(BASE_CLASSES, TONE_CLASSES[tone], className);
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = "neutral", className, ...props },
  ref,
) {
  return <span ref={ref} className={getBadgeClasses({ tone, className })} {...props} />;
});
