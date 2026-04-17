import { RoleCode, ReceiptStatus } from "@prisma/client";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const pendingReceiptStatuses = new Set<ReceiptStatus>([
  ReceiptStatus.PENDING,
  ReceiptStatus.PREPARED,
  ReceiptStatus.SENT,
  ReceiptStatus.RETURNED,
]);

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
