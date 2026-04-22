import { describe, expect, it } from "vitest";
import { getSkeletonClasses } from "../../components/ui/skeleton";

describe("Skeleton classes", () => {
  it("incluye animate-pulse", () => {
    const result = getSkeletonClasses();
    expect(result).toContain("animate-pulse");
  });

  it("respeta prefers-reduced-motion con motion-reduce:animate-none", () => {
    const result = getSkeletonClasses();
    expect(result).toContain("motion-reduce:animate-none");
  });

  it("usa surface-subtle como background", () => {
    const result = getSkeletonClasses();
    expect(result).toContain("bg-surface-subtle");
  });

  it("acepta className adicional", () => {
    const result = getSkeletonClasses({ className: "h-32 w-full" });
    expect(result).toContain("h-32");
    expect(result).toContain("w-full");
  });

  it("siempre rounded-md", () => {
    const result = getSkeletonClasses();
    expect(result).toContain("rounded-md");
  });
});
