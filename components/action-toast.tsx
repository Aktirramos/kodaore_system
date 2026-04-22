"use client";

import { useEffect } from "react";

type ActionToastProps = {
  message: string;
  variant?: "success" | "error";
  onClose?: () => void;
  autoHideMs?: number;
  closeLabel?: string;
};

export function ActionToast({
  message,
  variant = "success",
  onClose,
  autoHideMs = 3200,
  closeLabel = "Cerrar",
}: ActionToastProps) {
  useEffect(() => {
    if (!onClose || autoHideMs <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      onClose();
    }, autoHideMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [autoHideMs, onClose]);

  const toneClass =
    variant === "success"
      ? "border-l-accent-base"
      : "border-l-danger";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-[70] w-[min(92vw,30rem)] -translate-x-1/2 rounded-xl border border-border-subtle border-l-4 bg-surface-elevated px-4 py-3 text-sm text-ink-primary shadow-md ${toneClass}`}
    >
      <p className="pr-7">{message}</p>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="k-focus-ring absolute right-2 top-2 rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-current/85 hover:text-current"
        >
          {closeLabel}
        </button>
      ) : null}
    </div>
  );
}
