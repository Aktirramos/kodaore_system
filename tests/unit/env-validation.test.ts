import { describe, expect, it } from "vitest";
import { buildValidatedEnv } from "../../lib/env-validation";

const baseEnv = {
  DATABASE_URL: "postgresql://user:pass@localhost:5432/kodaore",
  NEXTAUTH_SECRET: "12345678901234567890123456789012",
};

describe("env validation", () => {
  it("builds production env with required fields", () => {
    const env = buildValidatedEnv({
      ...baseEnv,
      NODE_ENV: "production",
      NEXTAUTH_URL: "https://kodaore.example.com",
      OBSERVABILITY_WEBHOOK_URL: "https://hooks.example.com/ops",
    });

    expect(env.IS_PRODUCTION).toBe(true);
    expect(env.NEXTAUTH_URL).toBe("https://kodaore.example.com");
  });

  it("fails with short NEXTAUTH_SECRET", () => {
    expect(() =>
      buildValidatedEnv({
        ...baseEnv,
        NEXTAUTH_SECRET: "short-secret",
      }),
    ).toThrow(/NEXTAUTH_SECRET/);
  });

  it("fails in production without NEXTAUTH_URL", () => {
    expect(() =>
      buildValidatedEnv({
        ...baseEnv,
        NODE_ENV: "production",
      }),
    ).toThrow(/NEXTAUTH_URL is required in production/);
  });

  it("accepts development without NEXTAUTH_URL", () => {
    const env = buildValidatedEnv({
      ...baseEnv,
      NODE_ENV: "development",
    });

    expect(env.IS_PRODUCTION).toBe(false);
    expect(env.NEXTAUTH_URL).toBe(null);
  });
});
