function getRequiredEnv(name: string) {
  const value = process.env[name];

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

const NODE_ENV = process.env.NODE_ENV ?? "development";
const IS_PRODUCTION = NODE_ENV === "production";

const DATABASE_URL = getRequiredEnv("DATABASE_URL");
const NEXTAUTH_SECRET = getRequiredEnv("NEXTAUTH_SECRET");
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

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

export const env = {
  NODE_ENV,
  IS_PRODUCTION,
  DATABASE_URL,
  NEXTAUTH_SECRET,
  NEXTAUTH_URL: NEXTAUTH_URL ?? null,
};
