import clsx from "clsx";
import { forwardRef, type HTMLAttributes } from "react";

const BASE_CLASSES =
  "rounded-md bg-surface-subtle animate-pulse motion-reduce:animate-none";

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

/**
 * Devuelve el string de clases para un Skeleton loading indicator.
 * Incluye `motion-reduce:animate-none` para respetar `prefers-reduced-motion`.
 * Reemplazo de los `animate-pulse rounded bg-white/10` dispersos en loading.tsx.
 */
export function getSkeletonClasses({ className }: { className?: string } = {}): string {
  return clsx(BASE_CLASSES, className);
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={getSkeletonClasses({ className })}
      {...props}
    />
  );
});
