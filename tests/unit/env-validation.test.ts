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

  it("requires AUTH_EMAIL_SERVER and AUTH_EMAIL_FROM together", () => {
    expect(() =>
      buildValidatedEnv({
        ...baseEnv,
        AUTH_EMAIL_SERVER: "smtps://user:pass@smtp.example.com:465",
      }),
    ).toThrow(/AUTH_EMAIL_SERVER and AUTH_EMAIL_FROM must be set together/);
  });

  it("requires smtp protocol in AUTH_EMAIL_SERVER", () => {
    expect(() =>
      buildValidatedEnv({
        ...baseEnv,
        AUTH_EMAIL_SERVER: "https://smtp.example.com",
        AUTH_EMAIL_FROM: "Kodaore <noreply@kodaore.example.com>",
      }),
    ).toThrow(/AUTH_EMAIL_SERVER must use smtp:\/\/ or smtps:\/\//);
  });

  it("accepts AUTH_EMAIL_SERVER and AUTH_EMAIL_FROM when both are valid", () => {
    const env = buildValidatedEnv({
      ...baseEnv,
      AUTH_EMAIL_SERVER: "smtps://user:pass@smtp.example.com:465",
      AUTH_EMAIL_FROM: "Kodaore <noreply@kodaore.example.com>",
    });

    expect(env.AUTH_EMAIL_SERVER).toBe("smtps://user:pass@smtp.example.com:465");
    expect(env.AUTH_EMAIL_FROM).toBe("Kodaore <noreply@kodaore.example.com>");
  });

  it("requires Turnstile server and public keys together", () => {
    expect(() =>
      buildValidatedEnv({
        ...baseEnv,
        TURNSTILE_SECRET_KEY: "secret-only",
      }),
    ).toThrow(/TURNSTILE_SECRET_KEY and NEXT_PUBLIC_TURNSTILE_SITE_KEY must be set together/);
  });

  it("accepts Turnstile when both keys are provided", () => {
    const env = buildValidatedEnv({
      ...baseEnv,
      TURNSTILE_SECRET_KEY: "turnstile-secret",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "turnstile-site-key",
    });

    expect(env.TURNSTILE_SECRET_KEY).toBe("turnstile-secret");
    expect(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY).toBe("turnstile-site-key");
  });
});
