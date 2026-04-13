import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

async function main() {
  const retentionDays = parsePositiveInt(process.env.AUTH_RATE_LIMIT_RETENTION_DAYS, 30);
  const lockGraceHours = parsePositiveInt(process.env.AUTH_RATE_LIMIT_LOCK_GRACE_HOURS, 24);
  const alertStateRetentionDays = parsePositiveInt(process.env.OPS_ALERT_STATE_RETENTION_DAYS, 90);

  const now = new Date();
  const staleThreshold = new Date(now.getTime() - retentionDays * 24 * 60 * 60 * 1000);
  const lockExpiredThreshold = new Date(now.getTime() - lockGraceHours * 60 * 60 * 1000);
  const alertStateStaleThreshold = new Date(now.getTime() - alertStateRetentionDays * 24 * 60 * 60 * 1000);

  const cleanup = await prisma.authRateLimit.deleteMany({
    where: {
      OR: [
        {
          updatedAt: {
            lt: staleThreshold,
          },
        },
        {
          lockUntil: {
            not: null,
            lt: lockExpiredThreshold,
          },
        },
      ],
    },
  });

  const cleanupAlertState = await prisma.opsAlertState.deleteMany({
    where: {
      updatedAt: {
        lt: alertStateStaleThreshold,
      },
    },
  });

  console.log("AuthRateLimit cleanup completed", {
    deletedAuthRateLimitCount: cleanup.count,
    deletedOpsAlertStateCount: cleanupAlertState.count,
    retentionDays,
    lockGraceHours,
    alertStateRetentionDays,
    staleThreshold: staleThreshold.toISOString(),
    lockExpiredThreshold: lockExpiredThreshold.toISOString(),
    alertStateStaleThreshold: alertStateStaleThreshold.toISOString(),
  });
}

main()
  .catch((error) => {
    console.error("AuthRateLimit cleanup failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
