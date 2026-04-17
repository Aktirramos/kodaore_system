type SegmentErrorSource = "portal-segment" | "admin-segment";

type SegmentErrorPayload = {
  source: SegmentErrorSource;
  locale: "eu" | "es";
  pathname: string;
  message?: string;
  digest?: string;
  at?: string;
};

type SegmentRuntimeErrorLogInput = {
  source: SegmentErrorSource;
  locale: "eu" | "es";
  pathname: string;
  message?: string | null;
  digest?: string | null;
  at?: string;
  ip?: string | null;
  userAgent?: string | null;
};

function trimValue(value: string | undefined, maxLength: number) {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }

  return normalized.slice(0, maxLength);
}

function createRequestId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeRequestId(requestId: string | null | undefined) {
  return trimValue(requestId ?? undefined, 128) ?? null;
}

export function reportSegmentRuntimeError(input: SegmentRuntimeErrorLogInput, requestId?: string) {
  console.error("[segment-runtime-error]", {
    requestId: normalizeRequestId(requestId),
    source: input.source,
    locale: input.locale,
    pathname: trimValue(input.pathname, 180) ?? "/",
    digest: trimValue(input.digest ?? undefined, 128) ?? null,
    message: trimValue(input.message ?? undefined, 500) ?? null,
    at: input.at ?? new Date().toISOString(),
    ip: input.ip ?? null,
    userAgent: trimValue(input.userAgent ?? undefined, 220) ?? null,
  });
}

export async function reportSegmentClientError(payload: SegmentErrorPayload, requestId?: string) {
  const normalizedRequestId = normalizeRequestId(requestId) ?? createRequestId();

  const body: SegmentErrorPayload = {
    source: payload.source,
    locale: payload.locale,
    pathname: trimValue(payload.pathname, 180) ?? "/",
    message: trimValue(payload.message, 500),
    digest: trimValue(payload.digest, 128),
    at: payload.at ?? new Date().toISOString(),
  };

  const serialized = JSON.stringify({
    ...body,
    requestId: normalizedRequestId,
  });

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([serialized], { type: "application/json" });
      navigator.sendBeacon("/api/observability/error", blob);
      return;
    }

    await fetch("/api/observability/error", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": normalizedRequestId,
      },
      body: serialized,
      cache: "no-store",
      keepalive: true,
    });
  } catch {
    // Never break UX if observability endpoint is unavailable.
  }
}
