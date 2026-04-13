import { NextResponse } from "next/server";
import { sendOpsAlert } from "@/lib/alerting";
import { prisma } from "@/lib/prisma";

const DB_TIMEOUT_MS = 2500;
const DB_DEGRADED_LATENCY_MS = 1200;
const AUTH_LOCKS_ALERT_THRESHOLD = 10;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("DB_TIMEOUT"));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

async function readDbHealthSnapshot(now: Date) {
  const dbStart = Date.now();

  await prisma.$queryRaw`SELECT 1`;

  const [sites, activeAuthLocks] = await Promise.all([
    prisma.site.count(),
    prisma.authRateLimit.count({
      where: {
        lockUntil: {
          gt: now,
        },
      },
    }),
  ]);

  return {
    sites,
    activeAuthLocks,
    latencyMs: Date.now() - dbStart,
  };
}

export async function GET() {
  const startedAt = Date.now();
  const now = new Date();

  try {
    const db = await withTimeout(readDbHealthSnapshot(now), DB_TIMEOUT_MS);
    const degradedByLatency = db.latencyMs > DB_DEGRADED_LATENCY_MS;
    const requestDurationMs = Date.now() - startedAt;

    if (degradedByLatency) {
      await sendOpsAlert({
        key: "health:degraded:db-latency",
        source: "health-endpoint",
        title: "Health degraded by database latency",
        severity: "warning",
        details: {
          dbLatencyMs: db.latencyMs,
          thresholdMs: DB_DEGRADED_LATENCY_MS,
          activeAuthLocks: db.activeAuthLocks,
          durationMs: requestDurationMs,
        },
      });
    }

    if (db.activeAuthLocks >= AUTH_LOCKS_ALERT_THRESHOLD) {
      await sendOpsAlert({
        key: "health:security:auth-locks-high",
        source: "health-endpoint",
        title: "High number of active auth lockouts",
        severity: "warning",
        details: {
          activeAuthLocks: db.activeAuthLocks,
          threshold: AUTH_LOCKS_ALERT_THRESHOLD,
        },
      });
    }

    return NextResponse.json(
      {
        status: degradedByLatency ? "degraded" : "ok",
        service: "kodaore-system",
        timestamp: now.toISOString(),
        uptimeSeconds: Math.round(process.uptime()),
        db: {
          status: degradedByLatency ? "degraded" : "ok",
        },
        durationMs: requestDurationMs,
      },
      {
        status: degradedByLatency ? 503 : 200,
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  } catch (error) {
    const requestDurationMs = Date.now() - startedAt;
    const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";

    await sendOpsAlert({
      key: `health:degraded:db-error:${message}`,
      source: "health-endpoint",
      title: "Health degraded by database error",
      severity: "critical",
      details: {
        reason: message,
        timeoutMs: DB_TIMEOUT_MS,
        durationMs: requestDurationMs,
      },
    });

    return NextResponse.json(
      {
        status: "degraded",
        service: "kodaore-system",
        timestamp: now.toISOString(),
        uptimeSeconds: Math.round(process.uptime()),
        db: {
          status: "error",
        },
        durationMs: requestDurationMs,
      },
      {
        status: 503,
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  }
}
