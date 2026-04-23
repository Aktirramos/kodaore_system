import { describe, expect, it } from "vitest";
import {
  isResolvedTheme,
  nextTheme,
  resolveInitialTheme,
  THEME_STORAGE_KEY,
} from "@/components/theme-toggle-utils";

describe("theme-toggle-utils", () => {
  describe("THEME_STORAGE_KEY", () => {
    it("is stable and namespaced to kodaore", () => {
      expect(THEME_STORAGE_KEY).toBe("kodaore-theme");
    });
  });

  describe("isResolvedTheme", () => {
    it("accepts 'light' and 'dark'", () => {
      expect(isResolvedTheme("light")).toBe(true);
      expect(isResolvedTheme("dark")).toBe(true);
    });

    it("rejects anything else", () => {
      expect(isResolvedTheme("system")).toBe(false);
      expect(isResolvedTheme("")).toBe(false);
      expect(isResolvedTheme(null)).toBe(false);
      expect(isResolvedTheme(undefined)).toBe(false);
      expect(isResolvedTheme(42)).toBe(false);
    });
  });

  describe("resolveInitialTheme", () => {
    it("returns the stored value when it is a valid theme", () => {
      expect(resolveInitialTheme("light", true)).toBe("light");
      expect(resolveInitialTheme("light", false)).toBe("light");
      expect(resolveInitialTheme("dark", false)).toBe("dark");
      expect(resolveInitialTheme("dark", true)).toBe("dark");
    });

    it("falls back to system preference when storage is empty", () => {
      expect(resolveInitialTheme(null, true)).toBe("dark");
      expect(resolveInitialTheme(null, false)).toBe("light");
    });

    it("ignores legacy or malformed storage values", () => {
      expect(resolveInitialTheme("system", true)).toBe("dark");
      expect(resolveInitialTheme("", true)).toBe("dark");
      expect(resolveInitialTheme("auto", false)).toBe("light");
    });
  });

  describe("nextTheme", () => {
    it("toggles between light and dark", () => {
      expect(nextTheme("light")).toBe("dark");
      expect(nextTheme("dark")).toBe("light");
    });

    it("returns to the starting value after two toggles", () => {
      expect(nextTheme(nextTheme("light"))).toBe("light");
      expect(nextTheme(nextTheme("dark"))).toBe("dark");
    });
  });
});
