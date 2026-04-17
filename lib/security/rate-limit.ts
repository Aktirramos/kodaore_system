import { createHash } from "crypto";

export function buildRateLimitKey(namespace: string, scope: string, value: string) {
  const normalized = value.trim().toLowerCase();
  const hash = createHash("sha256").update(normalized).digest("hex");
  return `${namespace}:${scope}:${hash}`;
}

export function normalizeIp(rawValue: string) {
  let candidate = rawValue.trim();

  if (!candidate || candidate.toLowerCase() === "unknown") {
    return null;
  }

  if (candidate.includes(",")) {
    candidate = candidate.split(",")[0]?.trim() ?? "";
  }

  if (candidate.startsWith("::ffff:")) {
    candidate = candidate.slice(7);
  }

  if (candidate.startsWith("[") && candidate.includes("]")) {
    candidate = candidate.slice(1, candidate.indexOf("]"));
  }

  if (/^\d+\.\d+\.\d+\.\d+:\d+$/.test(candidate)) {
    candidate = candidate.split(":")[0] ?? candidate;
  }

  return candidate || null;
}

function getHeaderValue(headers: unknown, name: string) {
  if (!headers) {
    return null;
  }

  if (typeof Headers !== "undefined" && headers instanceof Headers) {
    return headers.get(name);
  }

  if (typeof headers !== "object") {
    return null;
  }

  const entries = Object.entries(headers as Record<string, string | string[] | undefined>);
  const match = entries.find(([key]) => key.toLowerCase() === name.toLowerCase());

  if (!match) {
    return null;
  }

  const value = match[1];

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export function extractClientIp(headers: unknown) {
  const forwardedFor = getHeaderValue(headers, "x-forwarded-for");
  const realIp = getHeaderValue(headers, "x-real-ip");
  const cfIp = getHeaderValue(headers, "cf-connecting-ip");

  const candidates = [forwardedFor, realIp, cfIp];
  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const normalized = normalizeIp(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}
