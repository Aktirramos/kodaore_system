import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { sendOpsAlert } from "@/lib/alerting";
import { env } from "@/lib/env";
import { reportSegmentRuntimeError } from "@/lib/observability";
import { prisma } from "@/lib/prisma";

const ERROR_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const ERROR_RATE_LIMIT_LOCK_MS = 15 * 60 * 1000;
const ERROR_RATE_LIMIT_MAX_EVENTS = 40;

const payloadSchema = z.object({
  source: z.enum(["portal-segment", "admin-segment"]),
  locale: z.enum(["eu", "es"]),
  pathname: z.string().min(1).max(180),
  message: z.string().max(500).optional(),
  digest: z.string().max(128).optional(),
  at: z.string().datetime().optional(),
  requestId: z.string().min(1).max(128).optional(),
});

function normalizeIp(raw: string | null) {
  if (!raw) {
    return null;
  }

  let value = raw.trim();
  if (!value) {
    return null;
  }

  if (value.includes(",")) {
    value = value.split(",")[0]?.trim() ?? value;
  }

  if (value.startsWith("::ffff:")) {
    value = value.slice(7);
  }

  if (value.startsWith("[") && value.includes("]")) {
    value = value.slice(1, value.indexOf("]"));
  }

  if (/^\d+\.\d+\.\d+\.\d+:\d+$/.test(value)) {
    value = value.split(":")[0] ?? value;
  }

  return value || null;
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfIp = request.headers.get("cf-connecting-ip");

  return normalizeIp(forwarded) ?? normalizeIp(realIp) ?? normalizeIp(cfIp);
}

function buildErrorRateLimitKey(scope: "ip" | "event", value: string) {
  const normalized = value.trim().toLowerCase();
  return `observability:v1:${scope}:${createHash("sha256").update(normalized).digest("hex")}`;
}

function buildErrorRateLimitKeys(ip: string | null, fingerprint: string | null) {
  const keys: string[] = [];

  if (ip) {
    keys.push(buildErrorRateLimitKey("ip", ip));
  }

  if (fingerprint) {
    keys.push(buildErrorRateLimitKey("event", fingerprint));
  }

  return Array.from(new Set(keys));
}

async function isErrorRateLimitLocked(keys: string[], now: Date) {
  if (keys.length === 0) {
    return false;
  }

  const records = await prisma.authRateLimit.findMany({
    where: {
      key: {
        in: keys,
      },
    },
    select: {
      lockUntil: true,
    },
  });

  return records.some((record) => Boolean(record.lockUntil && record.lockUntil.getTime() > now.getTime()));
}

async function registerErrorEvent(key: string, now: Date) {
  const existing = await prisma.authRateLimit.findUnique({
    where: { key },
    select: {
      id: true,
      failedCount: true,
      windowStartedAt: true,
    },
  });

  const windowLimit = now.getTime() - ERROR_RATE_LIMIT_WINDOW_MS;
  const outOfWindow = !existing || existing.windowStartedAt.getTime() < windowLimit;

  if (outOfWindow) {
    const lockUntil = ERROR_RATE_LIMIT_MAX_EVENTS <= 1 ? new Date(now.getTime() + ERROR_RATE_LIMIT_LOCK_MS) : null;

    await prisma.authRateLimit.upsert({
      where: { key },
      create: {
        key,
        failedCount: 1,
        windowStartedAt: now,
        lastFailureAt: now,
        lockUntil,
      },
      update: {
        failedCount: 1,
        windowStartedAt: now,
        lastFailureAt: now,
        lockUntil,
      },
    });
    return;
  }

  const nextCount = existing.failedCount + 1;
  const shouldLock = nextCount >= ERROR_RATE_LIMIT_MAX_EVENTS;

  await prisma.authRateLimit.update({
    where: { id: existing.id },
    data: {
      failedCount: nextCount,
      lastFailureAt: now,
      lockUntil: shouldLock ? new Date(now.getTime() + ERROR_RATE_LIMIT_LOCK_MS) : null,
    },
  });
}

async function registerErrorEventForKeys(keys: string[], now: Date) {
  if (keys.length === 0) {
    return;
  }

  await Promise.all(keys.map((key) => registerErrorEvent(key, now)));
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: env.NEXTAUTH_SECRET });
  const userId =
    typeof token?.sub === "string"
      ? token.sub
      : typeof (token as { userId?: unknown } | null)?.userId === "string"
        ? ((token as { userId?: string }).userId ?? null)
        : null;

  if (!userId) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const now = new Date();

  try {
    const ipKeys = buildErrorRateLimitKeys(ip, null);
    if (await isErrorRateLimitLocked(ipKeys, now)) {
      return NextResponse.json({ ok: true }, { status: 202 });
    }

    const json = await request.json();
    const parsed = payloadSchema.safeParse(json);

    if (!parsed.success) {
      await registerErrorEventForKeys(ipKeys, now);
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }

    const payload = parsed.data;
    const requestIdFromHeader = request.headers.get("x-request-id")?.trim() ?? null;
    const requestId = payload.requestId ?? requestIdFromHeader;
    const fingerprint = `${payload.source}:${payload.locale}:${payload.pathname}:${payload.digest ?? "-"}`;
    const rateLimitKeys = buildErrorRateLimitKeys(ip, fingerprint);

    if (await isErrorRateLimitLocked(rateLimitKeys, now)) {
      return NextResponse.json({ ok: true }, { status: 202 });
    }

    await registerErrorEventForKeys(rateLimitKeys, now);

    const userAgent = request.headers.get("user-agent")?.slice(0, 220) ?? null;

    reportSegmentRuntimeError(
      {
        source: payload.source,
        locale: payload.locale,
        pathname: payload.pathname,
        digest: payload.digest ?? null,
        message: payload.message ?? null,
        at: payload.at,
        ip,
        userAgent,
      },
      requestId ?? undefined,
    );

    await sendOpsAlert({
      key: `segment-error:${payload.source}:${payload.digest ?? payload.pathname}`,
      source: "segment-runtime",
      title: `Runtime error in ${payload.source}`,
      severity: "warning",
      details: {
        requestId,
        locale: payload.locale,
        pathname: payload.pathname,
        digest: payload.digest ?? null,
        message: payload.message ?? null,
        ip,
      },
    });

    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    await registerErrorEventForKeys(buildErrorRateLimitKeys(ip, null), now);
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
