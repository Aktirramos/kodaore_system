import bcrypt from "bcryptjs";
import { type Locale, RoleCode, UserStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { buildRateLimitKey, extractClientIp } from "@/lib/security/rate-limit";

export type SessionUserRole = {
  code: RoleCode;
  siteId: string | null;
  siteCode: string | null;
};

type AuthenticatedUser = {
  id: string;
  email: string | null;
  username: string | null;
  name: string;
  preferredLocale: Locale;
  roles: SessionUserRole[];
};

const credentialsSchema = z.object({
  identifier: z.string().trim().toLowerCase().min(1),
  password: z.string().min(1),
});

function buildUserName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim();
}

export const ADMIN_ROLE_CODES: RoleCode[] = [
  RoleCode.DEVELOPER,
  RoleCode.ADMIN_GLOBAL,
  RoleCode.ADMIN_SEDE,
  RoleCode.OPERADOR_SEDE,
  RoleCode.PROFESOR_SEDE,
];

const shouldUseSecureCookies = env.IS_PRODUCTION && (env.NEXTAUTH_URL?.startsWith("https://") ?? false);

const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const AUTH_RATE_LIMIT_LOCK_MS = 20 * 60 * 1000;
const AUTH_RATE_LIMIT_MAX_ATTEMPTS = 5;

function buildAuthRateLimitKey(scope: "identifier" | "ip", value: string) {
  return buildRateLimitKey("auth:v1", scope, value);
}

function buildAuthRateLimitKeys(identifier: string, clientIp: string | null) {
  const keys = [buildAuthRateLimitKey("identifier", identifier)];

  if (clientIp) {
    keys.push(buildAuthRateLimitKey("ip", clientIp));
  }

  return Array.from(new Set(keys));
}

async function isAuthRateLimitLocked(keys: string[], now: Date) {
  const records = await prisma.authRateLimit.findMany({
    where: { key: { in: keys } },
    select: {
      lockUntil: true,
    },
  });

  return records.some((record) => Boolean(record.lockUntil && record.lockUntil.getTime() > now.getTime()));
}

async function registerAuthFailure(key: string, now: Date) {
  const existing = await prisma.authRateLimit.findUnique({
    where: { key },
    select: {
      id: true,
      failedCount: true,
      windowStartedAt: true,
    },
  });

  const windowLimit = now.getTime() - AUTH_RATE_LIMIT_WINDOW_MS;
  const outOfWindow = !existing || existing.windowStartedAt.getTime() < windowLimit;

  if (outOfWindow) {
    const lockUntil = AUTH_RATE_LIMIT_MAX_ATTEMPTS <= 1 ? new Date(now.getTime() + AUTH_RATE_LIMIT_LOCK_MS) : null;

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
  const shouldLock = nextFailedCount >= AUTH_RATE_LIMIT_MAX_ATTEMPTS;

  await prisma.authRateLimit.update({
    where: { id: existing.id },
    data: {
      failedCount: nextFailedCount,
      lastFailureAt: now,
      lockUntil: shouldLock ? new Date(now.getTime() + AUTH_RATE_LIMIT_LOCK_MS) : null,
    },
  });
}

async function registerAuthFailureForKeys(keys: string[], now: Date) {
  await Promise.all(keys.map((key) => registerAuthFailure(key, now)));
}

async function clearAuthFailures(keys: string[]) {
  await prisma.authRateLimit.deleteMany({
    where: {
      key: {
        in: keys,
      },
    },
  });
}

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  useSecureCookies: shouldUseSecureCookies,
  pages: {
    signIn: "/acceso",
    error: "/acceso",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12,
    updateAge: 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Email y contrasena",
      credentials: {
        identifier: { label: "Usuario o email", type: "text" },
        password: { label: "Contrasena", type: "password" },
      },
      async authorize(credentials, req) {
        const parsed = credentialsSchema.safeParse(credentials ?? {});
        if (!parsed.success) {
          return null;
        }

        const { identifier, password } = parsed.data;
        const clientIp = extractClientIp(req?.headers);
        const throttleKeys = buildAuthRateLimitKeys(identifier, clientIp);
        const now = new Date();

        const deny = async () => {
          await registerAuthFailureForKeys(throttleKeys, now);
          return null;
        };

        if (await isAuthRateLimitLocked(throttleKeys, now)) {
          return null;
        }

        const isEmailLogin = identifier.includes("@");

        const dbUser = await prisma.user.findUnique({
          where: isEmailLogin ? { email: identifier } : { username: identifier },
          select: {
            id: true,
            username: true,
            email: true,
            passwordHash: true,
            firstName: true,
            lastName: true,
            preferredLocale: true,
            status: true,
            siteRoles: {
              where: { isActive: true },
              select: {
                siteId: true,
                role: {
                  select: {
                    code: true,
                  },
                },
                site: {
                  select: {
                    code: true,
                  },
                },
              },
            },
          },
        });

        if (!dbUser || dbUser.status !== UserStatus.ACTIVE) {
          return deny();
        }

        const roleCodes = dbUser.siteRoles.map((link) => link.role.code);
        const hasFamilyRole = roleCodes.includes(RoleCode.ALUMNO_TUTOR);
        const hasManagementRole = roleCodes.some((code) => code !== RoleCode.ALUMNO_TUTOR);

        // Families authenticate with email; management users authenticate with username.
        if (isEmailLogin && !hasFamilyRole) {
          return deny();
        }

        if (!isEmailLogin && hasFamilyRole && !hasManagementRole) {
          return deny();
        }

        const passwordOk = await bcrypt.compare(password, dbUser.passwordHash);
        if (!passwordOk) {
          return deny();
        }

        const roles: SessionUserRole[] = dbUser.siteRoles.map((link) => ({
          code: link.role.code,
          siteId: link.siteId,
          siteCode: link.site?.code ?? null,
        }));

        await prisma.user.update({
          where: { id: dbUser.id },
          data: { lastLoginAt: new Date() },
        });

        await clearAuthFailures(throttleKeys);

        const user: AuthenticatedUser = {
          id: dbUser.id,
          email: dbUser.email,
          username: dbUser.username,
          name: buildUserName(dbUser.firstName, dbUser.lastName),
          preferredLocale: dbUser.preferredLocale,
          roles,
        };

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthenticatedUser;
        token.userId = authUser.id;
        token.email = authUser.email;
        token.username = authUser.username;
        token.preferredLocale = authUser.preferredLocale;
        token.roles = authUser.roles;
      }

      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        return session;
      }

      session.user.id = token.userId ?? "";
      session.user.email = token.email ?? null;
      session.user.username = token.username ?? null;
      session.user.preferredLocale = token.preferredLocale ?? "eu";
      session.user.roles = token.roles ?? [];

      return session;
    },
  },
};

export async function getAuthSession() {
  return getServerSession(authOptions);
}

function hasAnyRole(roles: SessionUserRole[] | undefined, allowedRoles: RoleCode[]) {
  if (!roles || roles.length === 0) {
    return false;
  }

  const allowed = new Set(allowedRoles);
  return roles.some((role) => allowed.has(role.code));
}

type RequireAuthParams = {
  locale?: string;
  redirectTo?: string;
  forbiddenRedirectTo?: string;
  allowedRoles?: RoleCode[];
};

export async function requireAuth(params: RequireAuthParams = {}) {
  const locale = params.locale ?? "eu";
  const redirectTo = params.redirectTo ?? `/${locale}/acceso`;
  const forbiddenRedirectTo = params.forbiddenRedirectTo ?? redirectTo;

  const session = await getAuthSession();

  if (!session?.user?.id) {
    redirect(redirectTo);
  }

  if (params.allowedRoles && params.allowedRoles.length > 0) {
    if (!hasAnyRole(session.user.roles, params.allowedRoles)) {
      redirect(forbiddenRedirectTo);
    }
  }

  return session;
}
