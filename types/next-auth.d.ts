import { type Locale, type RoleCode } from "@prisma/client";
import { type DefaultSession } from "next-auth";

type SessionUserRole = {
  code: RoleCode;
  siteId: string | null;
  siteCode: string | null;
};

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      email: string | null;
      username: string | null;
      preferredLocale: Locale;
      roles: SessionUserRole[];
    };
  }

  interface User {
    id: string;
    email: string | null;
    username: string | null;
    preferredLocale: Locale;
    roles: SessionUserRole[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    email?: string | null;
    username?: string | null;
    preferredLocale?: Locale;
    roles?: SessionUserRole[];
  }
}
