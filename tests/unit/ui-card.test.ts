import { describe, expect, it } from "vitest";
import { getCardClasses } from "../../components/ui/card";

describe("Card classes", () => {
  it("default aplica surface-elevated + border subtle", () => {
    const result = getCardClasses({});
    expect(result).toContain("bg-surface-elevated");
    expect(result).toContain("border-border-subtle");
  });

  it("variant subtle usa bg-surface-subtle", () => {
    const result = getCardClasses({ variant: "subtle" });
    expect(result).toContain("bg-surface-subtle");
  });

  it("variant elevated incluye shadow-md", () => {
    const result = getCardClasses({ variant: "elevated" });
    expect(result).toContain("shadow-md");
  });

  it("interactive=true añade hover lift + motion-reduce fallback", () => {
    const result = getCardClasses({ interactive: true });
    expect(result).toContain("hover:-translate-y-[var(--distance-sm)]");
    expect(result).toContain("hover:shadow-md");
    expect(result).toContain("motion-reduce:transform-none");
  });

  it("interactive=false NO añade hover lift", () => {
    const result = getCardClasses({ interactive: false });
    expect(result).not.toContain("hover:-translate-y-[var(--distance-sm)]");
  });

  it("acepta className adicional", () => {
    const result = getCardClasses({ className: "mt-4" });
    expect(result).toContain("mt-4");
  });

  it("siempre incluye padding y rounded", () => {
    const result = getCardClasses({});
    expect(result).toContain("p-4");
    expect(result).toContain("rounded-lg");
  });
});
