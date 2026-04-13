import { env } from "@/lib/env";

type AlertSeverity = "warning" | "critical";

type OpsAlertInput = {
  key: string;
  source: string;
  title: string;
  severity: AlertSeverity;
  details?: Record<string, unknown>;
};

const ALERT_COOLDOWN_MS = 10 * 60 * 1000;
const lastAlertAtByKey = new Map<string, number>();

function shouldSendByCooldown(key: string, nowMs: number) {
  const previous = lastAlertAtByKey.get(key);
  if (typeof previous === "number" && nowMs - previous < ALERT_COOLDOWN_MS) {
    return false;
  }

  lastAlertAtByKey.set(key, nowMs);
  return true;
}

export async function sendOpsAlert(input: OpsAlertInput) {
  const webhookUrl = env.OBSERVABILITY_WEBHOOK_URL;
  if (!webhookUrl) {
    return;
  }

  const nowMs = Date.now();
  if (!shouldSendByCooldown(input.key, nowMs)) {
    return;
  }

  const payload = {
    text: `[${input.severity.toUpperCase()}] ${input.title}`,
    service: "kodaore-system",
    source: input.source,
    severity: input.severity,
    title: input.title,
    timestamp: new Date(nowMs).toISOString(),
    details: input.details ?? {},
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timer);
  } catch {
    // Alerts should never break request flow.
  }
}
