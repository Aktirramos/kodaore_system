import { describe, expect, it } from "vitest";
import { getButtonClasses } from "../../components/ui/button";

describe("Button classes", () => {
  it("default produce variant primary + size md", () => {
    const result = getButtonClasses({});
    expect(result).toContain("bg-brand-base");
    expect(result).toContain("h-10");
    expect(result).toContain("px-4");
  });

  it("variant secondary aplica border + bg-surface-elevated", () => {
    const result = getButtonClasses({ variant: "secondary" });
    expect(result).toContain("border-border-default");
    expect(result).toContain("bg-surface-elevated");
  });

  it("variant ghost no tiene background sólido", () => {
    const result = getButtonClasses({ variant: "ghost" });
    expect(result).not.toContain("bg-brand-base");
    expect(result).not.toContain("bg-surface-elevated");
    expect(result).toContain("text-ink-primary");
  });

  it("size sm reduce altura y padding", () => {
    const result = getButtonClasses({ size: "sm" });
    expect(result).toContain("h-8");
    expect(result).toContain("px-3");
  });

  it("size lg aumenta altura y padding", () => {
    const result = getButtonClasses({ size: "lg" });
    expect(result).toContain("h-12");
    expect(result).toContain("px-6");
    expect(result).toContain("text-base");
  });

  it("acepta className adicional", () => {
    const result = getButtonClasses({ className: "mx-auto" });
    expect(result).toContain("mx-auto");
  });

  it("incluye focus ring y disabled", () => {
    const result = getButtonClasses({});
    expect(result).toContain("focus-visible:outline-brand-base");
    expect(result).toContain("disabled:opacity-50");
  });
});
