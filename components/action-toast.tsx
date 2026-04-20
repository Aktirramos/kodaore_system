"use client";

import { useEffect } from "react";

type ActionToastProps = {
  message: string;
  variant?: "success" | "error";
  onClose?: () => void;
  autoHideMs?: number;
};

export function ActionToast({ message, variant = "success", onClose, autoHideMs = 3200 }: ActionToastProps) {
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
      ? "border-emerald-400/45 bg-emerald-500/12 text-emerald-100"
      : "border-rose-400/45 bg-rose-500/12 text-rose-100";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-[70] w-[min(92vw,30rem)] -translate-x-1/2 rounded-xl border px-4 py-3 text-sm shadow-[0_18px_34px_-20px_rgba(0,0,0,0.8)] backdrop-blur ${toneClass}`}
    >
      <p className="pr-7">{message}</p>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar notificacion"
          className="k-focus-ring absolute right-2 top-2 rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-current/85 hover:text-current"
        >
          Cerrar
        </button>
      ) : null}
    </div>
  );
}
