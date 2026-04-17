import bcrypt from "bcryptjs";
import { Locale, Prisma, RoleCode, UserStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { isLocale } from "@/lib/i18n";
import { sendWelcomeEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { buildRateLimitKey, extractClientIp } from "@/lib/security/rate-limit";

const REGISTER_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const REGISTER_RATE_LIMIT_LOCK_MS = 30 * 60 * 1000;
const REGISTER_RATE_LIMIT_MAX_ATTEMPTS = 5;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const registerSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(320),
  phone: z.string().trim().min(6).max(40),
  password: z.string().min(10).max(72).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
  acceptedTerms: z.literal(true),
  acceptedPrivacy: z.literal(true),
  locale: z.string(),
  captchaToken: z.string().trim().min(20).max(2048).optional(),
});

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function registrationAcceptedResponse() {
  return NextResponse.json({ ok: true }, { status: 201 });
}

function buildRegisterRateLimitKey(scope: "email" | "ip", value: string) {
  return buildRateLimitKey("register:v1", scope, value);
}

function buildRegisterRateLimitKeys(email: string, clientIp: string | null) {
  const keys = [buildRegisterRateLimitKey("email", email)];

  if (clientIp) {
    keys.push(buildRegisterRateLimitKey("ip", clientIp));
  }

  return Array.from(new Set(keys));
}

async function isRegisterRateLimitLocked(keys: string[], now: Date) {
  const records = await prisma.authRateLimit.findMany({
    where: { key: { in: keys } },
    select: {
      lockUntil: true,
    },
  });

  return records.some((record) => Boolean(record.lockUntil && record.lockUntil.getTime() > now.getTime()));
}

async function registerRegistrationFailure(key: string, now: Date) {
  const existing = await prisma.authRateLimit.findUnique({
    where: { key },
    select: {
      id: true,
      failedCount: true,
      windowStartedAt: true,
    },
  });

  const windowLimit = now.getTime() - REGISTER_RATE_LIMIT_WINDOW_MS;
  const outOfWindow = !existing || existing.windowStartedAt.getTime() < windowLimit;

  if (outOfWindow) {
    const lockUntil =
      REGISTER_RATE_LIMIT_MAX_ATTEMPTS <= 1 ? new Date(now.getTime() + REGISTER_RATE_LIMIT_LOCK_MS) : null;

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

  const nextFailedCount = existing.failedCount + 1;
  const shouldLock = nextFailedCount >= REGISTER_RATE_LIMIT_MAX_ATTEMPTS;

  await prisma.authRateLimit.update({
    where: { id: existing.id },
    data: {
      failedCount: nextFailedCount,
      lastFailureAt: now,
      lockUntil: shouldLock ? new Date(now.getTime() + REGISTER_RATE_LIMIT_LOCK_MS) : null,
    },
  });
}

async function registerRegistrationFailureForKeys(keys: string[], now: Date) {
  await Promise.all(keys.map((key) => registerRegistrationFailure(key, now)));
}

async function clearRegisterFailures(keys: string[]) {
  await prisma.authRateLimit.deleteMany({
    where: {
      key: {
        in: keys,
      },
    },
  });
}

async function verifyTurnstileToken(token: string, clientIp: string | null) {
  if (!env.TURNSTILE_SECRET_KEY) {
    return true;
  }

  const body = new URLSearchParams();
  body.set("secret", env.TURNSTILE_SECRET_KEY);
  body.set("response", token);

  if (clientIp) {
    body.set("remoteip", clientIp);
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as { success?: boolean };
    return payload.success === true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Invalid registration data.", 400);
  }

  const { firstName, lastName, email, password, phone, locale, captchaToken, acceptedTerms, acceptedPrivacy } = parsed.data;
  const clientIp = extractClientIp(request.headers);
  const throttleKeys = buildRegisterRateLimitKeys(email, clientIp);
  const now = new Date();

  if (await isRegisterRateLimitLocked(throttleKeys, now)) {
    return errorResponse("Too many registration attempts. Please try again later.", 429);
  }

  if (!isLocale(locale)) {
    await registerRegistrationFailureForKeys(throttleKeys, now);
    return errorResponse("Unsupported locale.", 400);
  }

  if (env.TURNSTILE_SECRET_KEY) {
    if (!captchaToken) {
      await registerRegistrationFailureForKeys(throttleKeys, now);
      return errorResponse("Invalid registration data.", 400);
    }

    const captchaOk = await verifyTurnstileToken(captchaToken, clientIp);
    if (!captchaOk) {
      await registerRegistrationFailureForKeys(throttleKeys, now);
      return errorResponse("Invalid registration data.", 400);
    }
  }

  try {
    const familyRole = await prisma.role.findUnique({
      where: { code: RoleCode.ALUMNO_TUTOR },
      select: { id: true },
    });

    if (!familyRole) {
      return errorResponse("Registration is temporarily unavailable.", 503);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      await registerRegistrationFailureForKeys(throttleKeys, now);
      return registrationAcceptedResponse();
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const normalizedPhone = phone;

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: null,
          email,
          passwordHash,
          firstName,
          lastName,
          phone: normalizedPhone,
          preferredLocale: locale as Locale,
          acceptedTerms,
          acceptedTermsAt: acceptedTerms ? now : null,
          acceptedPrivacy,
          acceptedPrivacyAt: acceptedPrivacy ? now : null,
          status: UserStatus.ACTIVE,
        },
        select: { id: true },
      });

      await tx.userSiteRole.create({
        data: {
          userId: user.id,
          roleId: familyRole.id,
          siteId: null,
          isActive: true,
        },
      });

      await tx.familyAccount.create({
        data: {
          ownerId: user.id,
          email,
          phone: normalizedPhone,
          preferredLocale: locale as Locale,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          entity: "USER",
          entityId: user.id,
          action: "REGISTER_FAMILY_ACCOUNT",
          ipAddress: clientIp,
          afterData: {
            email,
            locale,
          },
        },
      });
    });

    await clearRegisterFailures(throttleKeys);
    await sendWelcomeEmail({
      to: email,
      firstName,
      locale,
    });

    return registrationAcceptedResponse();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      await registerRegistrationFailureForKeys(throttleKeys, now);
      return registrationAcceptedResponse();
    }

    await registerRegistrationFailureForKeys(throttleKeys, now);

    return errorResponse("Registration failed. Please try again later.", 500);
  }
}
