import { describe, expect, it } from "vitest";
import { getCopy, isLocale, supportedLocales } from "../../lib/i18n";

describe("i18n helpers", () => {
  it("accepts only supported locales", () => {
    expect(isLocale("eu")).toBe(true);
    expect(isLocale("es")).toBe(true);
    expect(isLocale("en")).toBe(false);
  });

  it("returns translated copy for both locales", () => {
    const eu = getCopy("eu");
    const es = getCopy("es");

    expect(eu.brand).toBe("Kodaore");
    expect(es.brand).toBe("Kodaore");
    expect(eu.ctas.discover).not.toBe(es.ctas.discover);
  });

  it("keeps locale list in sync", () => {
    expect(supportedLocales).toEqual(["eu", "es"]);
  });
});
