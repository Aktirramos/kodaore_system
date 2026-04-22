import { describe, expect, it } from "vitest";
import { getBadgeClasses } from "../../components/ui/badge";

describe("Badge classes", () => {
  it("default tone neutral", () => {
    const result = getBadgeClasses({});
    expect(result).toContain("bg-surface-subtle");
    expect(result).toContain("text-ink-secondary");
  });

  it("tone brand usa brand-subtle + brand-emphasis-2", () => {
    const result = getBadgeClasses({ tone: "brand" });
    expect(result).toContain("bg-brand-subtle");
    expect(result).toContain("text-brand-emphasis-2");
  });

  it("tone accent usa accent-subtle + accent-emphasis", () => {
    const result = getBadgeClasses({ tone: "accent" });
    expect(result).toContain("bg-accent-subtle");
    expect(result).toContain("text-accent-emphasis");
  });

  it("tone success es alias visual de accent", () => {
    const success = getBadgeClasses({ tone: "success" });
    const accent = getBadgeClasses({ tone: "accent" });
    // success y accent comparten tratamiento (alias semántico)
    expect(success).toBe(accent);
  });

  it("tone warning usa warning-base", () => {
    const result = getBadgeClasses({ tone: "warning" });
    expect(result).toContain("text-warning-base");
  });

  it("tone danger usa danger-base", () => {
    const result = getBadgeClasses({ tone: "danger" });
    expect(result).toContain("text-danger-base");
  });

  it("siempre rounded-pill + text-xs", () => {
    const result = getBadgeClasses({});
    expect(result).toContain("rounded-pill");
    expect(result).toContain("text-xs");
  });
});
