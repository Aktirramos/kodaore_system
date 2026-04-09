import bcrypt from "bcryptjs";
import { type Locale, RoleCode, UserStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

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
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials ?? {});
        if (!parsed.success) {
          return null;
        }

        const { identifier, password } = parsed.data;
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
          return null;
        }

        const roleCodes = dbUser.siteRoles.map((link) => link.role.code);
        const hasFamilyRole = roleCodes.includes(RoleCode.ALUMNO_TUTOR);
        const hasManagementRole = roleCodes.some((code) => code !== RoleCode.ALUMNO_TUTOR);

        // Families authenticate with email; management users authenticate with username.
        if (isEmailLogin && !hasFamilyRole) {
          return null;
        }

        if (!isEmailLogin && hasFamilyRole && !hasManagementRole) {
          return null;
        }

        const passwordOk = await bcrypt.compare(password, dbUser.passwordHash);
        if (!passwordOk) {
          return null;
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
