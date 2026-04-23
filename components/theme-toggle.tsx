"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import type { LocaleCode } from "@/lib/i18n";
import {
  nextTheme,
  resolveInitialTheme,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
} from "@/components/theme-toggle-utils";

function readStoredTheme(): string | null {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

function systemPrefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(mode: ResolvedTheme) {
  document.documentElement.setAttribute("data-theme", mode);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}

const LABELS: Record<LocaleCode, Record<ResolvedTheme, string>> = {
  eu: {
    light: "Itxura iluna aktibatu",
    dark: "Itxura argia aktibatu",
  },
  es: {
    light: "Activar apariencia oscura",
    dark: "Activar apariencia clara",
  },
};

type ThemeToggleProps = {
  locale: LocaleCode;
  className?: string;
};

export function ThemeToggle({ locale, className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<ResolvedTheme>("light");

  useEffect(() => {
    setMode(resolveInitialTheme(readStoredTheme(), systemPrefersDark()));
    setMounted(true);
  }, []);

  const handleClick = () => {
    const next = nextTheme(mode);
    setMode(next);
    applyTheme(next);
  };

  const labels = LABELS[locale] ?? LABELS.eu;
  const ariaLabel = labels[mode];

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      suppressHydrationWarning
      className={clsx(
        "k-focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-default bg-surface-strong text-ink-muted transition-colors hover:text-foreground",
        className,
      )}
    >
      <span className="sr-only">{ariaLabel}</span>
      {mounted ? <ThemeIcon mode={mode} /> : <ThemeIcon mode="light" />}
    </button>
  );
}

function ThemeIcon({ mode }: { mode: ResolvedTheme }) {
  if (mode === "light") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5z" />
    </svg>
  );
}
