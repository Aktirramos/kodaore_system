import {
  Prisma,
  type PaymentMovementType,
  EnrollmentStatus,
  RoleCode,
  ReceiptStatus,
} from "@prisma/client";
import { hash } from "bcryptjs";
import { randomUUID } from "node:crypto";
import { getAuthSession } from "@/lib/auth";
import { createAuditLogForChanges } from "./audit";
import { prisma } from "@/lib/prisma";

const pendingReceiptStatuses = new Set<ReceiptStatus>([
  ReceiptStatus.PENDING,
  ReceiptStatus.PREPARED,
  ReceiptStatus.SENT,
  ReceiptStatus.RETURNED,
]);

const adminMutationRoleSet = new Set<RoleCode>([
  RoleCode.DEVELOPER,
  RoleCode.ADMIN_GLOBAL,
  RoleCode.ADMIN_SEDE,
]);

const adminActionMessages = {
  unauthorized: "Necesitas iniciar sesion para realizar esta accion.",
  forbidden: "No tienes permisos para realizar esta accion.",
  studentNotFound: "El alumno no existe o ya no esta disponible.",
  groupNotFound: "El grupo no existe o ya no esta disponible.",
  receiptNotFound: "El recibo no existe o ya no esta disponible.",
  invalidDueDate: "La fecha de vencimiento no es valida.",
  invalidBirthDate: "La fecha de nacimiento no es valida.",
  invalidAmount: "El importe debe ser un numero entero igual o superior a 0.",
  invalidGroupCapacity: "La capacidad debe ser un numero entero mayor que 0.",
  invalidLeadTeacher: "El profesor asignado no es valido para la sede seleccionada.",
  invalidMainSite: "Debes indicar una sede valida.",
  invalidRequiredField: "Revisa los campos obligatorios antes de guardar.",
  familyAccountNotFound: "No existe una cuenta familiar con ese email.",
  studentCreateFailed: "No se ha podido crear el alumno. Intentalo de nuevo.",
  groupCreateFailed: "No se ha podido crear el grupo. Intentalo de nuevo.",
  groupUpdateFailed: "No se ha podido actualizar el grupo. Intentalo de nuevo.",
  studentUpdateFailed: "No se ha podido actualizar el alumno. Intentalo de nuevo.",
  studentDeleteFailed: "No se ha podido eliminar el alumno. Intentalo de nuevo.",
  paymentUpdateFailed: "No se ha podido actualizar el recibo. Intentalo de nuevo.",
  bulkImportInvalidPayload: "El formato de importacion no es valido.",
  bulkImportFailed: "No se ha podido completar la importacion de alumnos.",
} as const;

class AdminActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminActionError";
  }
}

function failAdminAction(message: string): never {
  throw new AdminActionError(message);
}

function toAdminActionError(
  error: unknown,
  fallbackMessage: string,
  options?: { notFoundMessage?: string },
) {
  if (error instanceof AdminActionError) {
    return error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return new AdminActionError(options?.notFoundMessage ?? fallbackMessage);
    }
  }

  return new AdminActionError(fallbackMessage);
}

const studentAuditSelect = {
  id: true,
  firstName: true,
  lastName: true,
  phone: true,
  address: true,
  schoolName: true,
  schoolCourse: true,
  sportsCenterMemberCode: true,
  mainSiteId: true,
  isActive: true,
  deletedAt: true,
} as const;

const paymentAuditSelect = {
  id: true,
  siteId: true,
  amountCents: true,
  status: true,
  dueDate: true,
  ibanMasked: true,
  deletedAt: true,
} as const;

const groupAuditSelect = {
  id: true,
  siteId: true,
  name: true,
  level: true,
  capacity: true,
  leadTeacherId: true,
  isActive: true,
} as const;

type AdminStudentsData = {
  totals: {
    activeStudents: number;
    activeEnrollments: number;
    representedSites: number;
  };
  availableSites: Array<{
    id: string;
    name: string;
  }>;
  students: Array<{
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string | null;
    address: string | null;
    schoolName: string | null;
    siteName: string;
    mainSiteId: string;
    schoolCourse: string | null;
    sportsCenterMemberCode: string | null;
    isActive: boolean;
    familyEmail: string;
    tuitionPlanName: string | null;
    tuitionAmountCents: number | null;
  }>;
};

type AdminGroupsData = {
  totals: {
    activeGroups: number;
    totalCapacity: number;
    next7DaysSessions: number;
  };
  availableSites: Array<{
    id: string;
    name: string;
  }>;
  availableTeachers: Array<{
    id: string;
    fullName: string;
    siteId: string;
    siteName: string;
  }>;
  groups: Array<{
    id: string;
    name: string;
    level: string | null;
    siteId: string;
    siteName: string;
    capacity: number;
    leadTeacherId: string | null;
    leadTeacherName: string | null;
    isActive: boolean;
    nextSessionAt: Date | null;
  }>;
};

type AdminBillingData = {
  totals: {
    paidAmountCents: number;
    pendingAmountCents: number;
    paidCount: number;
    pendingCount: number;
  };
  receipts: Array<{
    id: string;
    amountCents: number;
    status: ReceiptStatus;
    dueDate: Date | null;
    periodStart: Date;
    periodEnd: Date;
    siteName: string;
    studentName: string;
    latestMovement:
      | {
          type: "SEND" | "COLLECTION" | "RETURN" | "RETRY" | "ADJUSTMENT";
          occurredAt: Date;
          amountCents: number;
        }
      | null;
  }>;
};

export type AdminStudentProfileData = {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    birthDate: Date;
    phone: string | null;
    address: string | null;
    schoolName: string | null;
    schoolCourse: string | null;
    sportsCenterMemberCode: string | null;
    internalCode: string;
    isActive: boolean;
    siteName: string;
  };
  receipts: Array<{
    id: string;
    amountCents: number;
    status: ReceiptStatus;
    dueDate: Date | null;
    periodStart: Date;
    periodEnd: Date;
    siteName: string;
  }>;
  receiptTotals: {
    paidCount: number;
    paidAmountCents: number;
    pendingCount: number;
    pendingAmountCents: number;
  };
  currentGroup:
    | {
        id: string;
        name: string;
        level: string | null;
        siteName: string;
        leadTeacherName: string | null;
        nextSessionAt: Date | null;
        lastSessionAt: Date | null;
      }
    | null;
  familyPortalPreview: {
    id: string;
    ownerName: string;
    ownerEmail: string | null;
    email: string;
    phone: string | null;
    address: string | null;
    preferredLocale: "eu" | "es";
    ibanMasked: string | null;
    students: Array<{
      id: string;
      fullName: string;
      schoolName: string | null;
      schoolCourse: string | null;
      internalCode: string;
      siteName: string;
      activeEnrollment:
        | {
            startsAt: Date;
            tuitionPlan: {
              name: string;
              amountCents: number;
              period: "MONTHLY" | "QUARTERLY" | "YEARLY";
            };
          }
        | null;
    }>;
  };
};

export type CreateAdminStudentInput = {
  firstName: string;
  lastName: string;
  familyEmail: string;
  birthDate: Date | string;
  phone?: string | null;
  address?: string | null;
  schoolName?: string | null;
  schoolCourse?: string | null;
  sportsCenterMemberCode?: string | null;
  mainSiteId: string;
  isActive?: boolean;
};

export type UpdateAdminStudentInput = {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  address?: string | null;
  schoolName?: string | null;
  schoolCourse?: string | null;
  sportsCenterMemberCode?: string | null;
  mainSiteId?: string;
  isActive?: boolean;
};

export type UpdateAdminPaymentInput = {
  amountCents?: number;
  status?: ReceiptStatus;
  dueDate?: Date | string | null;
  ibanMasked?: string | null;
};

export type CreateAdminGroupInput = {
  name: string;
  level?: string | null;
  capacity: number;
  siteId: string;
  leadTeacherId?: string | null;
  isActive?: boolean;
};

export type UpdateAdminGroupInput = {
  name?: string;
  level?: string | null;
  capacity?: number;
  siteId?: string;
  leadTeacherId?: string | null;
  isActive?: boolean;
};

type BulkImportSite = {
  id: string;
  code: string;
  name: string;
};

type BulkImportSiteLookup = {
  byId: Map<string, BulkImportSite>;
  byCode: Map<string, BulkImportSite>;
  byName: Map<string, BulkImportSite>;
};

type BulkImportStudentResult =
  | {
      rowIndex: number;
      status: "IMPORTED";
      studentId: string;
      familyAccountId: string;
      internalCode: string;
      siteId: string;
      familyEmail: string;
    }
  | {
      rowIndex: number;
      status: "FAILED";
      reason: string;
      familyEmail: string | null;
      siteInput: string | null;
    };

export type BulkImportStudentsResult = {
  total: number;
  imported: number;
  failed: number;
  results: BulkImportStudentResult[];
};

function hasAdminMutationRole(roles: Array<{ code: RoleCode }> | undefined) {
  if (!roles || roles.length === 0) {
    return false;
  }

  return roles.some((role) => adminMutationRoleSet.has(role.code));
}

function getAdminSedeScopeSiteIds(
  roles: Array<{ code: RoleCode; siteId?: string | null }> | undefined,
) {
  if (!roles || roles.length === 0) {
    return null;
  }

  const hasGlobalScope = roles.some(
    (role) => role.code === RoleCode.ADMIN_GLOBAL || role.code === RoleCode.DEVELOPER,
  );

  if (hasGlobalScope) {
    return null;
  }

  const adminSedeRoles = roles.filter((role) => role.code === RoleCode.ADMIN_SEDE);

  if (adminSedeRoles.length === 0) {
    return null;
  }

  return Array.from(
    new Set(
      adminSedeRoles
        .map((role) => role.siteId)
        .filter((siteId): siteId is string => Boolean(siteId)),
    ),
  );
}

async function requireAdminActionContext() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    failAdminAction(adminActionMessages.unauthorized);
  }

  if (!hasAdminMutationRole(session.user.roles)) {
    failAdminAction(adminActionMessages.forbidden);
  }

  return {
    actorUserId: session.user.id,
    adminSedeSiteIds: getAdminSedeScopeSiteIds(session.user.roles),
  };
}

function assertSiteInScope(siteId: string, adminSedeSiteIds: string[] | null) {
  if (adminSedeSiteIds !== null && !adminSedeSiteIds.includes(siteId)) {
    failAdminAction(adminActionMessages.forbidden);
  }
}

function normalizeOptionalDate(value: Date | string | null | undefined) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    failAdminAction(adminActionMessages.invalidDueDate);
  }

  return parsed;
}

function normalizeRequiredDate(
  value: Date | string | null | undefined,
  invalidMessage: string,
): Date {
  const normalized = normalizeOptionalDate(value);

  if (!normalized) {
    failAdminAction(invalidMessage);
  }

  return normalized;
}

function normalizeOptionalText(value: string | null | undefined) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeRequiredText(value: string | undefined, fieldName: string) {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    void fieldName;
    failAdminAction(adminActionMessages.invalidRequiredField);
  }

  return trimmed;
}

function normalizeOptionalPositiveAmount(value: number | undefined) {
  if (value === undefined) {
    return undefined;
  }

  if (!Number.isInteger(value) || value < 0) {
    failAdminAction(adminActionMessages.invalidAmount);
  }

  return value;
}

function normalizeOptionalPositiveCapacity(value: number | undefined) {
  if (value === undefined) {
    return undefined;
  }

  if (!Number.isInteger(value) || value <= 0) {
    failAdminAction(adminActionMessages.invalidGroupCapacity);
  }

  return value;
}

function getPaymentMovementTypeFromReceiptStatus(status: ReceiptStatus): PaymentMovementType {
  if (status === ReceiptStatus.SENT) {
    return "SEND";
  }

  if (status === ReceiptStatus.PAID) {
    return "COLLECTION";
  }

  if (status === ReceiptStatus.RETURNED) {
    return "RETURN";
  }

  if (status === ReceiptStatus.PENDING || status === ReceiptStatus.PREPARED) {
    return "RETRY";
  }

  return "ADJUSTMENT";
}

function normalizeMainSiteId(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    failAdminAction(adminActionMessages.invalidMainSite);
  }

  return trimmed;
}

function buildStudentInternalCode(siteCode: string) {
  const normalizedSiteCode = siteCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const safeSiteCode = normalizedSiteCode.length > 0 ? normalizedSiteCode : "SITE";
  const year = new Date().getFullYear();
  const token = randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();

  return `ALU-${safeSiteCode}-${year}-${token}`;
}

async function generateUniqueStudentInternalCode(
  tx: {
    student: {
      findUnique: (args: {
        where: { internalCode: string };
        select: { id: true };
      }) => PromiseLike<{ id: string } | null>;
    };
  },
  siteCode: string,
) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const candidate = buildStudentInternalCode(siteCode);
    const existing = await tx.student.findUnique({
      where: { internalCode: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }
  }

  return null;
}

const bulkImportFieldAliases = {
  firstName: ["firstName", "first_name", "nombre", "nombre_alumno", "alumno_nombre"],
  lastName: ["lastName", "last_name", "apellido", "apellido_alumno", "alumno_apellido"],
  familyEmail: ["familyEmail", "family_email", "email_familia", "correo_familia", "email"],
  site: [
    "mainSiteId",
    "main_site_id",
    "siteId",
    "site_id",
    "sede_id",
    "siteCode",
    "site_code",
    "sede_codigo",
    "sede",
    "site",
    "siteName",
    "site_name",
    "sede_nombre",
  ],
  birthDate: ["birthDate", "birth_date", "fechaNacimiento", "fecha_nacimiento", "nacimiento"],
  studentPhone: ["phone", "studentPhone", "student_phone", "telefono", "telefono_alumno"],
  studentAddress: ["address", "studentAddress", "student_address", "direccion"],
  schoolName: ["schoolName", "school_name", "colegio", "centro_escolar"],
  schoolCourse: ["schoolCourse", "school_course", "curso", "curso_escolar"],
  sportsCenterMemberCode: [
    "sportsCenterMemberCode",
    "sports_center_member_code",
    "codigo_socio",
    "codigo_de_socio",
  ],
  isActive: ["isActive", "is_active", "activo"],
  familyFirstName: [
    "familyFirstName",
    "family_first_name",
    "nombre_familia",
    "nombre_tutor",
    "tutor_nombre",
  ],
  familyLastName: [
    "familyLastName",
    "family_last_name",
    "apellido_familia",
    "apellido_tutor",
    "tutor_apellido",
  ],
  familyPhone: ["familyPhone", "family_phone", "telefono_familia", "tutor_telefono"],
  familyAddress: ["familyAddress", "family_address", "direccion_familia", "tutor_direccion"],
} as const;

function normalizeImportScalar(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return undefined;
}

function normalizeImportRow(row: unknown): Record<string, unknown> | null {
  if (typeof row !== "object" || row === null || Array.isArray(row)) {
    return null;
  }

  return row as Record<string, unknown>;
}

function getImportValue(
  row: Record<string, unknown>,
  keys: readonly string[],
): unknown {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(row, key)) {
      return row[key];
    }
  }

  return undefined;
}

function getImportText(
  row: Record<string, unknown>,
  keys: readonly string[],
) {
  const value = getImportValue(row, keys);
  return normalizeImportScalar(value);
}

function normalizeImportBirthDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      return null;
    }

    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    if (value > 100_000_000_000) {
      const timestampDate = new Date(value);
      return Number.isNaN(timestampDate.getTime()) ? null : timestampDate;
    }

    const excelEpochUtc = Date.UTC(1899, 11, 30);
    const excelDate = new Date(excelEpochUtc + Math.round(value * 24 * 60 * 60 * 1000));
    return Number.isNaN(excelDate.getTime()) ? null : excelDate;
  }

  return null;
}

function normalizeImportBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }

    if (value === 0) {
      return false;
    }

    return undefined;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();

  if (["true", "1", "si", "yes", "activo"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "inactive", "inactivo"].includes(normalized)) {
    return false;
  }

  return undefined;
}

function buildBulkImportSiteLookup(sites: BulkImportSite[]): BulkImportSiteLookup {
  const byId = new Map<string, BulkImportSite>();
  const byCode = new Map<string, BulkImportSite>();
  const byName = new Map<string, BulkImportSite>();

  for (const site of sites) {
    byId.set(site.id, site);
    byCode.set(site.code.trim().toLowerCase(), site);
    byName.set(site.name.trim().toLowerCase(), site);
  }

  return {
    byId,
    byCode,
    byName,
  };
}

function resolveBulkImportSite(
  row: Record<string, unknown>,
  siteLookup: BulkImportSiteLookup,
) {
  let fallbackInput: string | null = null;

  for (const key of bulkImportFieldAliases.site) {
    if (!Object.prototype.hasOwnProperty.call(row, key)) {
      continue;
    }

    const rawValue = normalizeImportScalar(row[key]);

    if (!rawValue) {
      continue;
    }

    fallbackInput = fallbackInput ?? rawValue;
    const normalized = rawValue.toLowerCase();
    const resolvedSite =
      siteLookup.byId.get(rawValue) ??
      siteLookup.byCode.get(normalized) ??
      siteLookup.byName.get(normalized);

    if (resolvedSite) {
      return {
        site: resolvedSite,
        siteInput: rawValue,
      };
    }
  }

  return {
    site: null,
    siteInput: fallbackInput,
  };
}

function getBulkImportErrorReason(error: unknown) {
  if (error instanceof AdminActionError) {
    return error.message;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return adminActionMessages.studentCreateFailed;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return adminActionMessages.bulkImportFailed;
}

export async function getAdminStudentsData(): Promise<AdminStudentsData> {
  const session = await getAuthSession();
  const adminSedeSiteIds = getAdminSedeScopeSiteIds(session?.user?.roles);

  const [students, availableSites] = await Promise.all([
    prisma.student.findMany({
      where:
        adminSedeSiteIds === null
          ? {
              deletedAt: null,
            }
          : {
              deletedAt: null,
              mainSiteId: {
                in: adminSedeSiteIds,
              },
            },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        schoolName: true,
        schoolCourse: true,
        sportsCenterMemberCode: true,
        mainSiteId: true,
        isActive: true,
        mainSite: {
          select: {
            name: true,
          },
        },
        familyAccount: {
          select: {
            email: true,
          },
        },
        enrollments: {
          where: { status: "ACTIVE" },
          orderBy: { startsAt: "desc" },
          take: 1,
          select: {
            tuitionPlan: {
              select: {
                name: true,
                amountCents: true,
              },
            },
          },
        },
      },
    }),
    prisma.site.findMany({
      where:
        adminSedeSiteIds === null
          ? { isActive: true }
          : {
              isActive: true,
              id: {
                in: adminSedeSiteIds,
              },
            },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  const activeStudents = students.filter((student) => student.isActive);
  const representedSites = new Set(activeStudents.map((student) => student.mainSite.name)).size;
  const activeEnrollments = activeStudents.filter((student) => student.enrollments.length > 0).length;

  return {
    totals: {
      activeStudents: activeStudents.length,
      activeEnrollments,
      representedSites,
    },
    availableSites,
    students: students.map((student) => ({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      fullName: `${student.firstName} ${student.lastName}`,
      phone: student.phone,
      address: student.address,
      schoolName: student.schoolName,
      siteName: student.mainSite.name,
      mainSiteId: student.mainSiteId,
      schoolCourse: student.schoolCourse,
      sportsCenterMemberCode: student.sportsCenterMemberCode,
      isActive: student.isActive,
      familyEmail: student.familyAccount.email,
      tuitionPlanName: student.enrollments[0]?.tuitionPlan.name ?? null,
      tuitionAmountCents: student.enrollments[0]?.tuitionPlan.amountCents ?? null,
    })),
  };
}

export async function getAdminStudentProfileData(studentId: string): Promise<AdminStudentProfileData> {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    failAdminAction(adminActionMessages.unauthorized);
  }

  const adminSedeSiteIds = getAdminSedeScopeSiteIds(session.user.roles);

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      birthDate: true,
      phone: true,
      address: true,
      schoolName: true,
      schoolCourse: true,
      sportsCenterMemberCode: true,
      internalCode: true,
      isActive: true,
      deletedAt: true,
      mainSiteId: true,
      mainSite: {
        select: {
          name: true,
        },
      },
      familyAccount: {
        select: {
          id: true,
          email: true,
          phone: true,
          address: true,
          preferredLocale: true,
          ibanMasked: true,
          owner: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          students: {
            where: {
              isActive: true,
              deletedAt: null,
            },
            orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
            select: {
              id: true,
              firstName: true,
              lastName: true,
              schoolName: true,
              schoolCourse: true,
              internalCode: true,
              mainSite: {
                select: {
                  name: true,
                },
              },
              enrollments: {
                where: {
                  status: EnrollmentStatus.ACTIVE,
                  deletedAt: null,
                },
                orderBy: {
                  startsAt: "desc",
                },
                take: 1,
                select: {
                  startsAt: true,
                  tuitionPlan: {
                    select: {
                      name: true,
                      amountCents: true,
                      period: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!student || student.deletedAt) {
    failAdminAction(adminActionMessages.studentNotFound);
  }

  assertSiteInScope(student.mainSiteId, adminSedeSiteIds);

  const now = new Date();

  const [receipts, upcomingGroupAttendance, latestGroupAttendance] = await Promise.all([
    prisma.receipt.findMany({
      where: {
        studentId: student.id,
        deletedAt: null,
      },
      orderBy: [{ dueDate: "desc" }, { createdAt: "desc" }],
      take: 40,
      select: {
        id: true,
        amountCents: true,
        status: true,
        dueDate: true,
        periodStart: true,
        periodEnd: true,
        site: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.attendance.findFirst({
      where: {
        studentId: student.id,
        classSession: {
          startsAt: {
            gte: now,
          },
          group: {
            isActive: true,
          },
        },
      },
      orderBy: {
        classSession: {
          startsAt: "asc",
        },
      },
      select: {
        classSession: {
          select: {
            startsAt: true,
            group: {
              select: {
                id: true,
                name: true,
                level: true,
                site: {
                  select: {
                    name: true,
                  },
                },
                leadTeacher: {
                  select: {
                    user: {
                      select: {
                        firstName: true,
                        lastName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.attendance.findFirst({
      where: {
        studentId: student.id,
        classSession: {
          group: {
            isActive: true,
          },
        },
      },
      orderBy: {
        classSession: {
          startsAt: "desc",
        },
      },
      select: {
        classSession: {
          select: {
            startsAt: true,
            group: {
              select: {
                id: true,
                name: true,
                level: true,
                site: {
                  select: {
                    name: true,
                  },
                },
                leadTeacher: {
                  select: {
                    user: {
                      select: {
                        firstName: true,
                        lastName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  const paidReceipts = receipts.filter((receipt) => receipt.status === ReceiptStatus.PAID);
  const pendingReceipts = receipts.filter((receipt) => pendingReceiptStatuses.has(receipt.status));

  const currentGroupSource = upcomingGroupAttendance ?? latestGroupAttendance;

  return {
    student: {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      fullName: `${student.firstName} ${student.lastName}`,
      birthDate: student.birthDate,
      phone: student.phone,
      address: student.address,
      schoolName: student.schoolName,
      schoolCourse: student.schoolCourse,
      sportsCenterMemberCode: student.sportsCenterMemberCode,
      internalCode: student.internalCode,
      isActive: student.isActive,
      siteName: student.mainSite.name,
    },
    receipts: receipts.map((receipt) => ({
      id: receipt.id,
      amountCents: receipt.amountCents,
      status: receipt.status,
      dueDate: receipt.dueDate,
      periodStart: receipt.periodStart,
      periodEnd: receipt.periodEnd,
      siteName: receipt.site.name,
    })),
    receiptTotals: {
      paidCount: paidReceipts.length,
      paidAmountCents: paidReceipts.reduce((sum, receipt) => sum + receipt.amountCents, 0),
      pendingCount: pendingReceipts.length,
      pendingAmountCents: pendingReceipts.reduce((sum, receipt) => sum + receipt.amountCents, 0),
    },
    currentGroup: currentGroupSource
      ? {
          id: currentGroupSource.classSession.group.id,
          name: currentGroupSource.classSession.group.name,
          level: currentGroupSource.classSession.group.level,
          siteName: currentGroupSource.classSession.group.site.name,
          leadTeacherName: currentGroupSource.classSession.group.leadTeacher
            ? `${currentGroupSource.classSession.group.leadTeacher.user.firstName} ${currentGroupSource.classSession.group.leadTeacher.user.lastName}`
            : null,
          nextSessionAt: upcomingGroupAttendance?.classSession.startsAt ?? null,
          lastSessionAt: latestGroupAttendance?.classSession.startsAt ?? null,
        }
      : null,
    familyPortalPreview: {
      id: student.familyAccount.id,
      ownerName: `${student.familyAccount.owner.firstName} ${student.familyAccount.owner.lastName}`.trim(),
      ownerEmail: student.familyAccount.owner.email,
      email: student.familyAccount.email,
      phone: student.familyAccount.phone,
      address: student.familyAccount.address,
      preferredLocale: student.familyAccount.preferredLocale,
      ibanMasked: student.familyAccount.ibanMasked,
      students: student.familyAccount.students.map((linkedStudent) => ({
        id: linkedStudent.id,
        fullName: `${linkedStudent.firstName} ${linkedStudent.lastName}`,
        schoolName: linkedStudent.schoolName,
        schoolCourse: linkedStudent.schoolCourse,
        internalCode: linkedStudent.internalCode,
        siteName: linkedStudent.mainSite.name,
        activeEnrollment: linkedStudent.enrollments[0]
          ? {
              startsAt: linkedStudent.enrollments[0].startsAt,
              tuitionPlan: {
                name: linkedStudent.enrollments[0].tuitionPlan.name,
                amountCents: linkedStudent.enrollments[0].tuitionPlan.amountCents,
                period: linkedStudent.enrollments[0].tuitionPlan.period,
              },
            }
          : null,
      })),
    },
  };
}

export async function createAdminStudentAction(input: CreateAdminStudentInput) {
  "use server";

  try {
    const { actorUserId, adminSedeSiteIds } = await requireAdminActionContext();

    const firstName = normalizeRequiredText(input.firstName, "firstName");
    const lastName = normalizeRequiredText(input.lastName, "lastName");
    const familyEmail = normalizeRequiredText(input.familyEmail, "familyEmail")?.toLowerCase();
    const mainSiteId = normalizeMainSiteId(input.mainSiteId);
    const birthDate = normalizeRequiredDate(input.birthDate, adminActionMessages.invalidBirthDate);

    if (!firstName || !lastName || !familyEmail || !mainSiteId) {
      failAdminAction(adminActionMessages.invalidRequiredField);
    }

    assertSiteInScope(mainSiteId, adminSedeSiteIds);

    return await prisma.$transaction(async (tx) => {
      const site = await tx.site.findUnique({
        where: { id: mainSiteId },
        select: {
          id: true,
          code: true,
        },
      });

      if (!site) {
        failAdminAction(adminActionMessages.invalidMainSite);
      }

      const familyAccount = await tx.familyAccount.findFirst({
        where: {
          email: {
            equals: familyEmail,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
        },
      });

      if (!familyAccount) {
        failAdminAction(adminActionMessages.familyAccountNotFound);
      }

      const internalCode = await generateUniqueStudentInternalCode(tx, site.code);

      if (!internalCode) {
        failAdminAction(adminActionMessages.studentCreateFailed);
      }

      const after = await tx.student.create({
        data: {
          familyAccountId: familyAccount.id,
          firstName,
          lastName,
          birthDate,
          phone: normalizeOptionalText(input.phone) ?? null,
          address: normalizeOptionalText(input.address) ?? null,
          schoolName: normalizeOptionalText(input.schoolName) ?? null,
          schoolCourse: normalizeOptionalText(input.schoolCourse) ?? null,
          sportsCenterMemberCode: normalizeOptionalText(input.sportsCenterMemberCode) ?? null,
          internalCode,
          mainSiteId,
          isActive: input.isActive ?? true,
        },
        select: studentAuditSelect,
      });

      await createAuditLogForChanges({
        db: tx,
        actorUserId,
        siteId: after.mainSiteId,
        entity: "STUDENT",
        entityId: after.id,
        action: "CREATE_STUDENT",
        before: null,
        after,
      });

      return after;
    });
  } catch (error) {
    throw toAdminActionError(error, adminActionMessages.studentCreateFailed);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Import rows are dynamic by design.
export async function bulkImportStudentsAction(data: any[]): Promise<BulkImportStudentsResult> {
  "use server";

  try {
    const { actorUserId, adminSedeSiteIds } = await requireAdminActionContext();

    if (!Array.isArray(data)) {
      failAdminAction(adminActionMessages.bulkImportInvalidPayload);
    }

    const familyRole = await prisma.role.findUnique({
      where: { code: RoleCode.ALUMNO_TUTOR },
      select: { id: true },
    });

    if (!familyRole) {
      failAdminAction(adminActionMessages.bulkImportFailed);
    }

    const sitesInScope = await prisma.site.findMany({
      where:
        adminSedeSiteIds === null
          ? { isActive: true }
          : {
              isActive: true,
              id: {
                in: adminSedeSiteIds,
              },
            },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });

    const siteLookup = buildBulkImportSiteLookup(sitesInScope);
    const results: BulkImportStudentResult[] = [];
    let imported = 0;
    let failed = 0;

    for (let rowIndex = 0; rowIndex < data.length; rowIndex += 1) {
      const row = normalizeImportRow(data[rowIndex]);

      if (!row) {
        failed += 1;
        results.push({
          rowIndex,
          status: "FAILED",
          reason: adminActionMessages.bulkImportInvalidPayload,
          familyEmail: null,
          siteInput: null,
        });
        continue;
      }

      const firstName = getImportText(row, bulkImportFieldAliases.firstName);
      const lastName = getImportText(row, bulkImportFieldAliases.lastName);
      const familyEmail = getImportText(row, bulkImportFieldAliases.familyEmail)?.toLowerCase();
      const birthDate = normalizeImportBirthDate(getImportValue(row, bulkImportFieldAliases.birthDate));
      const { site, siteInput } = resolveBulkImportSite(row, siteLookup);

      if (!firstName || !lastName || !familyEmail || !birthDate || !site) {
        const missingFields: string[] = [];

        if (!firstName) {
          missingFields.push("nombre");
        }

        if (!lastName) {
          missingFields.push("apellido");
        }

        if (!familyEmail) {
          missingFields.push("email_familia");
        }

        if (!birthDate) {
          missingFields.push("fecha_nacimiento");
        }

        if (!site) {
          missingFields.push("sede");
        }

        failed += 1;
        results.push({
          rowIndex,
          status: "FAILED",
          reason: `Campos invalidos o vacios: ${missingFields.join(", ")}.`,
          familyEmail: familyEmail ?? null,
          siteInput,
        });
        continue;
      }

      const studentPhone = getImportText(row, bulkImportFieldAliases.studentPhone) ?? null;
      const studentAddress = getImportText(row, bulkImportFieldAliases.studentAddress) ?? null;
      const schoolName = getImportText(row, bulkImportFieldAliases.schoolName) ?? null;
      const schoolCourse = getImportText(row, bulkImportFieldAliases.schoolCourse) ?? null;
      const sportsCenterMemberCode =
        getImportText(row, bulkImportFieldAliases.sportsCenterMemberCode) ?? null;
      const isActive = normalizeImportBoolean(getImportValue(row, bulkImportFieldAliases.isActive)) ?? true;

      const familyFirstName = getImportText(row, bulkImportFieldAliases.familyFirstName) ?? "Tutor";
      const familyLastName =
        getImportText(row, bulkImportFieldAliases.familyLastName) ?? `${lastName} Familia`;
      const familyPhone = getImportText(row, bulkImportFieldAliases.familyPhone) ?? null;
      const familyAddress = getImportText(row, bulkImportFieldAliases.familyAddress) ?? null;

      try {
        assertSiteInScope(site.id, adminSedeSiteIds);

        const created = await prisma.$transaction(async (tx) => {
          let familyAccount = await tx.familyAccount.findFirst({
            where: {
              email: {
                equals: familyEmail,
                mode: "insensitive",
              },
            },
            select: {
              id: true,
            },
          });

          if (!familyAccount) {
            let ownerUser = await tx.user.findFirst({
              where: {
                email: {
                  equals: familyEmail,
                  mode: "insensitive",
                },
              },
              select: {
                id: true,
              },
            });

            if (!ownerUser) {
              const passwordHash = await hash(randomUUID(), 12);

              ownerUser = await tx.user.create({
                data: {
                  username: null,
                  email: familyEmail,
                  passwordHash,
                  firstName: familyFirstName,
                  lastName: familyLastName,
                  phone: familyPhone,
                },
                select: {
                  id: true,
                },
              });
            }

            const roleLink = await tx.userSiteRole.findFirst({
              where: {
                userId: ownerUser.id,
                roleId: familyRole.id,
                siteId: null,
              },
              select: {
                id: true,
              },
            });

            if (!roleLink) {
              await tx.userSiteRole.create({
                data: {
                  userId: ownerUser.id,
                  roleId: familyRole.id,
                  siteId: null,
                  isActive: true,
                },
              });
            }

            const familyAccountByOwner = await tx.familyAccount.findUnique({
              where: {
                ownerId: ownerUser.id,
              },
              select: {
                id: true,
                email: true,
              },
            });

            if (familyAccountByOwner) {
              if (familyAccountByOwner.email.toLowerCase() === familyEmail) {
                familyAccount = {
                  id: familyAccountByOwner.id,
                };
              } else {
                const updatedFamilyAccount = await tx.familyAccount.update({
                  where: {
                    ownerId: ownerUser.id,
                  },
                  data: {
                    email: familyEmail,
                  },
                  select: {
                    id: true,
                  },
                });

                familyAccount = {
                  id: updatedFamilyAccount.id,
                };
              }
            } else {
              familyAccount = await tx.familyAccount.create({
                data: {
                  ownerId: ownerUser.id,
                  email: familyEmail,
                  phone: familyPhone,
                  address: familyAddress,
                },
                select: {
                  id: true,
                },
              });
            }
          }

          const internalCode = await generateUniqueStudentInternalCode(tx, site.code);

          if (!internalCode) {
            failAdminAction(adminActionMessages.studentCreateFailed);
          }

          const after = await tx.student.create({
            data: {
              familyAccountId: familyAccount.id,
              firstName,
              lastName,
              birthDate,
              phone: studentPhone,
              address: studentAddress,
              schoolName,
              schoolCourse,
              sportsCenterMemberCode,
              internalCode,
              mainSiteId: site.id,
              isActive,
            },
            select: {
              id: true,
              internalCode: true,
              mainSiteId: true,
            },
          });

          await createAuditLogForChanges({
            db: tx,
            actorUserId,
            siteId: after.mainSiteId,
            entity: "STUDENT",
            entityId: after.id,
            action: "BULK_IMPORT_STUDENTS",
            before: null,
            after,
          });

          return {
            studentId: after.id,
            internalCode: after.internalCode,
            familyAccountId: familyAccount.id,
          };
        });

        imported += 1;
        results.push({
          rowIndex,
          status: "IMPORTED",
          studentId: created.studentId,
          familyAccountId: created.familyAccountId,
          internalCode: created.internalCode,
          siteId: site.id,
          familyEmail,
        });
      } catch (error) {
        failed += 1;
        results.push({
          rowIndex,
          status: "FAILED",
          reason: getBulkImportErrorReason(error),
          familyEmail,
          siteInput,
        });
      }
    }

    return {
      total: data.length,
      imported,
      failed,
      results,
    };
  } catch (error) {
    throw toAdminActionError(error, adminActionMessages.bulkImportFailed);
  }
}

export async function getAdminGroupsData(): Promise<AdminGroupsData> {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const session = await getAuthSession();
  const adminSedeSiteIds = getAdminSedeScopeSiteIds(session?.user?.roles);

  const [groups, next7DaysSessions, availableSites, availableTeachers] = await Promise.all([
    prisma.group.findMany({
      where:
        adminSedeSiteIds === null
          ? { isActive: true }
          : {
              isActive: true,
              siteId: {
                in: adminSedeSiteIds,
              },
            },
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        name: true,
        level: true,
        siteId: true,
        capacity: true,
        isActive: true,
        leadTeacherId: true,
        site: {
          select: {
            name: true,
          },
        },
        leadTeacher: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        sessions: {
          where: {
            startsAt: {
              gte: now,
            },
          },
          orderBy: { startsAt: "asc" },
          take: 1,
          select: {
            startsAt: true,
          },
        },
      },
    }),
    prisma.classSession.count({
      where: {
        startsAt: {
          gte: now,
          lt: nextWeek,
        },
        ...(adminSedeSiteIds === null
          ? {}
          : {
              group: {
                siteId: {
                  in: adminSedeSiteIds,
                },
              },
            }),
      },
    }),
    prisma.site.findMany({
      where:
        adminSedeSiteIds === null
          ? { isActive: true }
          : {
              isActive: true,
              id: {
                in: adminSedeSiteIds,
              },
            },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.teacherProfile.findMany({
      where:
        adminSedeSiteIds === null
          ? {
              site: {
                isActive: true,
              },
            }
          : {
              site: {
                isActive: true,
              },
              siteId: {
                in: adminSedeSiteIds,
              },
            },
      orderBy: [{ site: { name: "asc" } }, { user: { lastName: "asc" } }, { user: { firstName: "asc" } }],
      select: {
        id: true,
        siteId: true,
        site: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
  ]);

  return {
    totals: {
      activeGroups: groups.length,
      totalCapacity: groups.reduce((sum, group) => sum + group.capacity, 0),
      next7DaysSessions,
    },
    availableSites,
    availableTeachers: availableTeachers.map((teacher) => ({
      id: teacher.id,
      fullName: `${teacher.user.firstName} ${teacher.user.lastName}`,
      siteId: teacher.siteId,
      siteName: teacher.site.name,
    })),
    groups: groups.map((group) => ({
      id: group.id,
      name: group.name,
      level: group.level,
      siteId: group.siteId,
      siteName: group.site.name,
      capacity: group.capacity,
      leadTeacherId: group.leadTeacherId,
      leadTeacherName: group.leadTeacher
        ? `${group.leadTeacher.user.firstName} ${group.leadTeacher.user.lastName}`
        : null,
      isActive: group.isActive,
      nextSessionAt: group.sessions[0]?.startsAt ?? null,
    })),
  };
}

export async function createAdminGroupAction(input: CreateAdminGroupInput) {
  "use server";

  try {
    const { actorUserId, adminSedeSiteIds } = await requireAdminActionContext();

    const name = normalizeRequiredText(input.name, "name");
    const siteId = normalizeMainSiteId(input.siteId);
    const capacity = normalizeOptionalPositiveCapacity(input.capacity);
    const level = normalizeOptionalText(input.level);
    const leadTeacherId = normalizeOptionalText(input.leadTeacherId) ?? null;

    if (!name || !siteId || capacity === undefined) {
      failAdminAction(adminActionMessages.invalidRequiredField);
    }

    assertSiteInScope(siteId, adminSedeSiteIds);

    return await prisma.$transaction(async (tx) => {
      const site = await tx.site.findUnique({
        where: { id: siteId },
        select: {
          id: true,
        },
      });

      if (!site) {
        failAdminAction(adminActionMessages.invalidMainSite);
      }

      if (leadTeacherId) {
        const teacher = await tx.teacherProfile.findFirst({
          where: {
            id: leadTeacherId,
            siteId,
          },
          select: {
            id: true,
          },
        });

        if (!teacher) {
          failAdminAction(adminActionMessages.invalidLeadTeacher);
        }
      }

      const after = await tx.group.create({
        data: {
          name,
          level,
          capacity,
          siteId,
          leadTeacherId,
          isActive: input.isActive ?? true,
        },
        select: groupAuditSelect,
      });

      await createAuditLogForChanges({
        db: tx,
        actorUserId,
        siteId: after.siteId,
        entity: "GROUP",
        entityId: after.id,
        action: "CREATE_GROUP",
        before: null,
        after,
      });

      return after;
    });
  } catch (error) {
    throw toAdminActionError(error, adminActionMessages.groupCreateFailed);
  }
}

export async function updateAdminGroupAction(groupId: string, input: UpdateAdminGroupInput) {
  "use server";

  try {
    const { actorUserId, adminSedeSiteIds } = await requireAdminActionContext();

    return await prisma.$transaction(async (tx) => {
      const before = await tx.group.findUnique({
        where: { id: groupId },
        select: groupAuditSelect,
      });

      if (!before) {
        failAdminAction(adminActionMessages.groupNotFound);
      }

      assertSiteInScope(before.siteId, adminSedeSiteIds);

      const nextSiteId = normalizeMainSiteId(input.siteId);

      if (nextSiteId) {
        assertSiteInScope(nextSiteId, adminSedeSiteIds);

        const site = await tx.site.findUnique({
          where: { id: nextSiteId },
          select: { id: true },
        });

        if (!site) {
          failAdminAction(adminActionMessages.invalidMainSite);
        }
      }

      const targetSiteId = nextSiteId ?? before.siteId;

      let nextLeadTeacherId =
        input.leadTeacherId === undefined
          ? undefined
          : (normalizeOptionalText(input.leadTeacherId) ?? null);

      if (nextSiteId && input.leadTeacherId === undefined) {
        nextLeadTeacherId = null;
      }

      if (nextLeadTeacherId) {
        const teacher = await tx.teacherProfile.findFirst({
          where: {
            id: nextLeadTeacherId,
            siteId: targetSiteId,
          },
          select: {
            id: true,
          },
        });

        if (!teacher) {
          failAdminAction(adminActionMessages.invalidLeadTeacher);
        }
      }

      const updateData: Prisma.GroupUncheckedUpdateInput = {
        name: normalizeRequiredText(input.name, "name"),
        level: normalizeOptionalText(input.level),
        capacity: normalizeOptionalPositiveCapacity(input.capacity),
        siteId: nextSiteId,
        leadTeacherId: nextLeadTeacherId,
        isActive: input.isActive,
      };

      const after = await tx.group.update({
        where: { id: groupId },
        data: updateData,
        select: groupAuditSelect,
      });

      await createAuditLogForChanges({
        db: tx,
        actorUserId,
        siteId: after.siteId,
        entity: "GROUP",
        entityId: after.id,
        action: "UPDATE_GROUP",
        before,
        after,
      });

      return after;
    });
  } catch (error) {
    throw toAdminActionError(error, adminActionMessages.groupUpdateFailed, {
      notFoundMessage: adminActionMessages.groupNotFound,
    });
  }
}

export async function getAdminBillingData(): Promise<AdminBillingData> {
  const session = await getAuthSession();
  const adminSedeSiteIds = getAdminSedeScopeSiteIds(session?.user?.roles);

  const receipts = await prisma.receipt.findMany({
    where:
      adminSedeSiteIds === null
        ? undefined
        : {
            siteId: {
              in: adminSedeSiteIds,
            },
          },
    orderBy: [{ dueDate: "desc" }, { createdAt: "desc" }],
    take: 80,
    select: {
      id: true,
      amountCents: true,
      status: true,
      dueDate: true,
      periodStart: true,
      periodEnd: true,
      site: {
        select: {
          name: true,
        },
      },
      student: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      paymentMovements: {
        orderBy: { occurredAt: "desc" },
        take: 1,
        select: {
          type: true,
          occurredAt: true,
          amountCents: true,
        },
      },
    },
  });

  const paidReceipts = receipts.filter((receipt) => receipt.status === ReceiptStatus.PAID);
  const pendingReceipts = receipts.filter((receipt) => pendingReceiptStatuses.has(receipt.status));

  return {
    totals: {
      paidAmountCents: paidReceipts.reduce((sum, receipt) => sum + receipt.amountCents, 0),
      pendingAmountCents: pendingReceipts.reduce((sum, receipt) => sum + receipt.amountCents, 0),
      paidCount: paidReceipts.length,
      pendingCount: pendingReceipts.length,
    },
    receipts: receipts.map((receipt) => ({
      id: receipt.id,
      amountCents: receipt.amountCents,
      status: receipt.status,
      dueDate: receipt.dueDate,
      periodStart: receipt.periodStart,
      periodEnd: receipt.periodEnd,
      siteName: receipt.site.name,
      studentName: `${receipt.student.firstName} ${receipt.student.lastName}`,
      latestMovement: receipt.paymentMovements[0]
        ? {
            type: receipt.paymentMovements[0].type,
            occurredAt: receipt.paymentMovements[0].occurredAt,
            amountCents: receipt.paymentMovements[0].amountCents,
          }
        : null,
    })),
  };
}

export async function updateAdminStudentAction(studentId: string, input: UpdateAdminStudentInput) {
  "use server";

  try {
    const { actorUserId, adminSedeSiteIds } = await requireAdminActionContext();

    return await prisma.$transaction(async (tx) => {
      const before = await tx.student.findUnique({
        where: { id: studentId },
        select: studentAuditSelect,
      });

      if (!before || before.deletedAt) {
        failAdminAction(adminActionMessages.studentNotFound);
      }

      assertSiteInScope(before.mainSiteId, adminSedeSiteIds);

      const nextMainSiteId = normalizeMainSiteId(input.mainSiteId);

      if (nextMainSiteId) {
        assertSiteInScope(nextMainSiteId, adminSedeSiteIds);
      }

      const updateData: Prisma.StudentUncheckedUpdateInput = {
        firstName: normalizeRequiredText(input.firstName, "firstName"),
        lastName: normalizeRequiredText(input.lastName, "lastName"),
        phone: normalizeOptionalText(input.phone),
        address: normalizeOptionalText(input.address),
        schoolName: normalizeOptionalText(input.schoolName),
        schoolCourse: normalizeOptionalText(input.schoolCourse),
        sportsCenterMemberCode: normalizeOptionalText(input.sportsCenterMemberCode),
        mainSiteId: nextMainSiteId,
        isActive: input.isActive,
      };

      const after = await tx.student.update({
        where: { id: studentId },
        data: updateData,
        select: studentAuditSelect,
      });

      await createAuditLogForChanges({
        db: tx,
        actorUserId,
        siteId: after.mainSiteId,
        entity: "STUDENT",
        entityId: after.id,
        action: "UPDATE_STUDENT",
        before,
        after,
      });

      return after;
    });
  } catch (error) {
    throw toAdminActionError(error, adminActionMessages.studentUpdateFailed, {
      notFoundMessage: adminActionMessages.studentNotFound,
    });
  }
}

export async function deleteAdminStudentAction(studentId: string) {
  "use server";

  try {
    const { actorUserId, adminSedeSiteIds } = await requireAdminActionContext();

    return await prisma.$transaction(async (tx) => {
      const before = await tx.student.findUnique({
        where: { id: studentId },
        select: studentAuditSelect,
      });

      if (!before || before.deletedAt) {
        failAdminAction(adminActionMessages.studentNotFound);
      }

      assertSiteInScope(before.mainSiteId, adminSedeSiteIds);

      const deletedAt = new Date();

      const after = await tx.student.update({
        where: { id: studentId },
        data: {
          isActive: false,
          deletedAt,
        },
        select: studentAuditSelect,
      });

      await tx.enrollment.updateMany({
        where: {
          studentId,
          deletedAt: null,
        },
        data: {
          status: EnrollmentStatus.CLOSED,
          endsAt: deletedAt,
          deletedAt,
        },
      });

      await tx.receipt.updateMany({
        where: {
          studentId,
          deletedAt: null,
          status: {
            not: ReceiptStatus.PAID,
          },
        },
        data: {
          status: ReceiptStatus.CANCELED,
          deletedAt,
        },
      });

      await tx.receipt.updateMany({
        where: {
          studentId,
          deletedAt: null,
          status: ReceiptStatus.PAID,
        },
        data: {
          deletedAt,
        },
      });

      await createAuditLogForChanges({
        db: tx,
        actorUserId,
        siteId: after.mainSiteId,
        entity: "STUDENT",
        entityId: after.id,
        action: "SOFT_DELETE_STUDENT",
        before,
        after,
      });

      return after;
    });
  } catch (error) {
    throw toAdminActionError(error, adminActionMessages.studentDeleteFailed, {
      notFoundMessage: adminActionMessages.studentNotFound,
    });
  }
}

export async function updateAdminPaymentAction(receiptId: string, input: UpdateAdminPaymentInput) {
  "use server";

  try {
    const { actorUserId, adminSedeSiteIds } = await requireAdminActionContext();

    return await prisma.$transaction(async (tx) => {
      const before = await tx.receipt.findUnique({
        where: { id: receiptId },
        select: paymentAuditSelect,
      });

      if (!before || before.deletedAt) {
        failAdminAction(adminActionMessages.receiptNotFound);
      }

      assertSiteInScope(before.siteId, adminSedeSiteIds);

      const updateData: Prisma.ReceiptUpdateInput = {
        amountCents: normalizeOptionalPositiveAmount(input.amountCents),
        status: input.status,
        dueDate: normalizeOptionalDate(input.dueDate),
        ibanMasked: normalizeOptionalText(input.ibanMasked),
      };

      const after = await tx.receipt.update({
        where: { id: receiptId },
        data: updateData,
        select: paymentAuditSelect,
      });

      await createAuditLogForChanges({
        db: tx,
        actorUserId,
        siteId: after.siteId,
        entity: "RECEIPT",
        entityId: after.id,
        action: "UPDATE_PAYMENT",
        before,
        after,
      });

      const receiptChanged =
        before.amountCents !== after.amountCents ||
        before.status !== after.status ||
        before.ibanMasked !== after.ibanMasked ||
        before.dueDate?.getTime() !== after.dueDate?.getTime();

      if (receiptChanged) {
        const changedFields: string[] = [];

        if (before.amountCents !== after.amountCents) {
          changedFields.push("amountCents");
        }

        if (before.status !== after.status) {
          changedFields.push("status");
        }

        if (before.dueDate?.getTime() !== after.dueDate?.getTime()) {
          changedFields.push("dueDate");
        }

        if (before.ibanMasked !== after.ibanMasked) {
          changedFields.push("ibanMasked");
        }

        await tx.paymentMovement.create({
          data: {
            receiptId: after.id,
            type: getPaymentMovementTypeFromReceiptStatus(after.status),
            amountCents: after.amountCents,
            note: `Admin update (${changedFields.join(", ")})`,
          },
        });
      }

      return after;
    });
  } catch (error) {
    throw toAdminActionError(error, adminActionMessages.paymentUpdateFailed, {
      notFoundMessage: adminActionMessages.receiptNotFound,
    });
  }
}
