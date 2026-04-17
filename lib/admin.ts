import { RoleCode, ReceiptStatus } from "@prisma/client";
import { ADMIN_ROLE_CODES, getAuthSession } from "@/lib/auth";
import { createAuditLogForChanges } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

const pendingReceiptStatuses = new Set<ReceiptStatus>([
  ReceiptStatus.PENDING,
  ReceiptStatus.PREPARED,
  ReceiptStatus.SENT,
  ReceiptStatus.RETURNED,
]);

const adminRoleSet = new Set<RoleCode>(ADMIN_ROLE_CODES);

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
} as const;

const paymentAuditSelect = {
  id: true,
  siteId: true,
  amountCents: true,
  status: true,
  dueDate: true,
  ibanMasked: true,
} as const;

export type AdminStudentsData = {
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

export type AdminGroupsData = {
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

export type AdminBillingData = {
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

function hasAdminRole(roles: Array<{ code: RoleCode }> | undefined) {
  if (!roles || roles.length === 0) {
    return false;
  }

  return roles.some((role) => adminRoleSet.has(role.code));
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

async function requireAdminActorUserId() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!hasAdminRole(session.user.roles)) {
    throw new Error("Forbidden");
  }

  return session.user.id;
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
    throw new Error("Invalid dueDate value");
  }

  return parsed;
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

  const actorUserId = await requireAdminActorUserId();

  return prisma.$transaction(async (tx) => {
    const before = await tx.student.findUnique({
      where: { id: studentId },
      select: studentAuditSelect,
    });

    if (!before) {
      throw new Error("Student not found");
    }

    const after = await tx.student.update({
      where: { id: studentId },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        address: input.address,
        schoolName: input.schoolName,
        schoolCourse: input.schoolCourse,
        sportsCenterMemberCode: input.sportsCenterMemberCode,
        mainSiteId: input.mainSiteId,
        isActive: input.isActive,
      },
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
}

export async function updateAdminPaymentAction(receiptId: string, input: UpdateAdminPaymentInput) {
  "use server";

  const actorUserId = await requireAdminActorUserId();

  return prisma.$transaction(async (tx) => {
    const before = await tx.receipt.findUnique({
      where: { id: receiptId },
      select: paymentAuditSelect,
    });

    if (!before) {
      throw new Error("Payment receipt not found");
    }

    const after = await tx.receipt.update({
      where: { id: receiptId },
      data: {
        amountCents: input.amountCents,
        status: input.status,
        dueDate: normalizeOptionalDate(input.dueDate),
        ibanMasked: input.ibanMasked,
      },
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

    return after;
  });
}
