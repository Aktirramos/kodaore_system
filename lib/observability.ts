type SegmentErrorSource = "portal-segment" | "admin-segment";

type SegmentErrorPayload = {
  source: SegmentErrorSource;
  locale: "eu" | "es";
  pathname: string;
  message?: string;
  digest?: string;
  at?: string;
  requestId?: string;
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

export async function reportSegmentClientError(payload: SegmentErrorPayload) {
  const requestId = trimValue(payload.requestId, 128) ?? createRequestId();

  const body: SegmentErrorPayload = {
    source: payload.source,
    locale: payload.locale,
    pathname: trimValue(payload.pathname, 180) ?? "/",
    message: trimValue(payload.message, 500),
    digest: trimValue(payload.digest, 128),
    at: payload.at ?? new Date().toISOString(),
    requestId,
  };

  const serialized = JSON.stringify(body);

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
        "x-request-id": requestId,
      },
      body: serialized,
      cache: "no-store",
      keepalive: true,
    });
  } catch {
    // Never break UX if observability endpoint is unavailable.
  }
}
