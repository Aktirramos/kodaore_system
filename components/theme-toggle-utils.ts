export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "kodaore-theme";

export function isResolvedTheme(value: unknown): value is ResolvedTheme {
  return value === "light" || value === "dark";
}

/**
 * Resolves the initial theme when the component mounts.
 * Priority: user's stored choice > system preference > "light".
 */
export function resolveInitialTheme(
  stored: string | null,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (isResolvedTheme(stored)) return stored;
  return systemPrefersDark ? "dark" : "light";
}

export function nextTheme(current: ResolvedTheme): ResolvedTheme {
  return current === "light" ? "dark" : "light";
}
