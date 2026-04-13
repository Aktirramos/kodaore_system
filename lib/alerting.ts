import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

type AlertSeverity = "warning" | "critical";

type OpsAlertInput = {
  key: string;
  source: string;
  title: string;
  severity: AlertSeverity;
  details?: Record<string, unknown>;
};

const ALERT_COOLDOWN_MS = 10 * 60 * 1000;

async function shouldSendByCooldown(key: string, nowMs: number) {
  const cooldownThreshold = new Date(nowMs - ALERT_COOLDOWN_MS);

  // Ensure the key row exists. We seed lastSentAt with epoch so the first alert can claim immediately.
  await prisma.opsAlertState.upsert({
    where: { key },
    create: {
      key,
      lastSentAt: new Date(0),
    },
    update: {},
  });

  const claim = await prisma.opsAlertState.updateMany({
    where: {
      key,
      lastSentAt: {
        lt: cooldownThreshold,
      },
    },
    data: {
      lastSentAt: new Date(nowMs),
    },
  });

  return claim.count > 0;
}

export async function sendOpsAlert(input: OpsAlertInput) {
  const webhookUrl = env.OBSERVABILITY_WEBHOOK_URL;
  if (!webhookUrl) {
    return;
  }

  const nowMs = Date.now();
  let allowedByCooldown = true;

  try {
    allowedByCooldown = await shouldSendByCooldown(input.key, nowMs);
  } catch {
    // If cooldown storage fails, prefer sending alert over dropping it silently.
    allowedByCooldown = true;
  }

  if (!allowedByCooldown) {
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
