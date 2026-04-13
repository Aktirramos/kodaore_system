export type ValidatedEnv = {
  NODE_ENV: string;
  IS_PRODUCTION: boolean;
  DATABASE_URL: string;
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string | null;
  OBSERVABILITY_WEBHOOK_URL: string | null;
};

function getRequiredEnv(source: Record<string, string | undefined>, name: string) {
  const value = source[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function validateUrl(name: string, value: string) {
  try {
    new URL(value);
  } catch {
    throw new Error(`Invalid URL in environment variable ${name}: ${value}`);
  }
}

export function buildValidatedEnv(source: Record<string, string | undefined>): ValidatedEnv {
  const NODE_ENV = source.NODE_ENV ?? "development";
  const IS_PRODUCTION = NODE_ENV === "production";

  const DATABASE_URL = getRequiredEnv(source, "DATABASE_URL");
  const NEXTAUTH_SECRET = getRequiredEnv(source, "NEXTAUTH_SECRET");
  const NEXTAUTH_URL = source.NEXTAUTH_URL;
  const OBSERVABILITY_WEBHOOK_URL = source.OBSERVABILITY_WEBHOOK_URL;

  if (NEXTAUTH_SECRET.length < 32) {
    throw new Error("NEXTAUTH_SECRET must be at least 32 characters long.");
  }

  if (IS_PRODUCTION) {
    if (!NEXTAUTH_URL || NEXTAUTH_URL.trim().length === 0) {
      throw new Error("NEXTAUTH_URL is required in production.");
    }

    validateUrl("NEXTAUTH_URL", NEXTAUTH_URL);
  } else if (NEXTAUTH_URL && NEXTAUTH_URL.trim().length > 0) {
    validateUrl("NEXTAUTH_URL", NEXTAUTH_URL);
  }

  if (OBSERVABILITY_WEBHOOK_URL && OBSERVABILITY_WEBHOOK_URL.trim().length > 0) {
    validateUrl("OBSERVABILITY_WEBHOOK_URL", OBSERVABILITY_WEBHOOK_URL);
  }

  return {
    NODE_ENV,
    IS_PRODUCTION,
    DATABASE_URL,
    NEXTAUTH_SECRET,
    NEXTAUTH_URL: NEXTAUTH_URL ?? null,
    OBSERVABILITY_WEBHOOK_URL: OBSERVABILITY_WEBHOOK_URL ?? null,
  };
}
