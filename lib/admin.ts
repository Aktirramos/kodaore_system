import {
  Prisma,
  type PaymentMovementType,
  EnrollmentStatus,
  RoleCode,
  ReceiptStatus,
} from "@prisma/client";
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
  receiptNotFound: "El recibo no existe o ya no esta disponible.",
  invalidDueDate: "La fecha de vencimiento no es valida.",
  invalidAmount: "El importe debe ser un numero entero igual o superior a 0.",
  invalidMainSite: "Debes indicar una sede valida.",
  invalidRequiredField: "Revisa los campos obligatorios antes de guardar.",
  studentUpdateFailed: "No se ha podido actualizar el alumno. Intentalo de nuevo.",
  studentDeleteFailed: "No se ha podido eliminar el alumno. Intentalo de nuevo.",
  paymentUpdateFailed: "No se ha podido actualizar el recibo. Intentalo de nuevo.",
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

type AdminStudentsData = {
  totals: {
    activeStudents: number;
    activeEnrollments: number;
    representedSites: number;
  };
  students: Array<{
    id: string;
    fullName: string;
    siteName: string;
    schoolCourse: string | null;
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
  groups: Array<{
    id: string;
    name: string;
    level: string | null;
    siteName: string;
    capacity: number;
    leadTeacherName: string | null;
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

export async function getAdminStudentsData(): Promise<AdminStudentsData> {
  const session = await getAuthSession();
  const adminSedeSiteIds = getAdminSedeScopeSiteIds(session?.user?.roles);

  const students = await prisma.student.findMany({
    where:
      adminSedeSiteIds === null
        ? { isActive: true }
        : {
            isActive: true,
            mainSiteId: {
              in: adminSedeSiteIds,
            },
          },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      schoolCourse: true,
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
  });

  const representedSites = new Set(students.map((student) => student.mainSite.name)).size;
  const activeEnrollments = students.filter((student) => student.enrollments.length > 0).length;

  return {
    totals: {
      activeStudents: students.length,
      activeEnrollments,
      representedSites,
    },
    students: students.map((student) => ({
      id: student.id,
      fullName: `${student.firstName} ${student.lastName}`,
      siteName: student.mainSite.name,
      schoolCourse: student.schoolCourse,
      familyEmail: student.familyAccount.email,
      tuitionPlanName: student.enrollments[0]?.tuitionPlan.name ?? null,
      tuitionAmountCents: student.enrollments[0]?.tuitionPlan.amountCents ?? null,
    })),
  };
}

export async function getAdminGroupsData(): Promise<AdminGroupsData> {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const session = await getAuthSession();
  const adminSedeSiteIds = getAdminSedeScopeSiteIds(session?.user?.roles);

  const [groups, next7DaysSessions] = await Promise.all([
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
        capacity: true,
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
  ]);

  return {
    totals: {
      activeGroups: groups.length,
      totalCapacity: groups.reduce((sum, group) => sum + group.capacity, 0),
      next7DaysSessions,
    },
    groups: groups.map((group) => ({
      id: group.id,
      name: group.name,
      level: group.level,
      siteName: group.site.name,
      capacity: group.capacity,
      leadTeacherName: group.leadTeacher
        ? `${group.leadTeacher.user.firstName} ${group.leadTeacher.user.lastName}`
        : null,
      nextSessionAt: group.sessions[0]?.startsAt ?? null,
    })),
  };
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
