import { CommunicationTargetType, ReceiptStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type PortalScope = {
  userId: string;
  familyAccountIds: string[];
  students: Array<{
    id: string;
    firstName: string;
    lastName: string;
    schoolName: string | null;
    schoolCourse: string | null;
    internalCode: string;
    mainSite: {
      code: string;
      name: string;
    };
  }>;
  familyAccounts: Array<{
    id: string;
    email: string;
    phone: string | null;
    address: string | null;
    preferredLocale: "eu" | "es";
    ibanMasked: string | null;
  }>;
  studentIds: string[];
  siteIds: string[];
};

export type PortalSummaryData = {
  familyAccount: PortalScope["familyAccounts"][number] | null;
  students: PortalScope["students"];
  totals: {
    activeStudents: number;
    pendingReceipts: number;
    paidReceipts: number;
    recentCommunications: number;
    pendingAmountCents: number;
  };
  latestReceipt: {
    id: string;
    amountCents: number;
    status: ReceiptStatus;
    dueDate: Date | null;
    periodStart: Date;
    periodEnd: Date;
    studentName: string;
    siteName: string;
  } | null;
  latestCommunication: {
    id: string;
    type: "NOTICE" | "EMAIL";
    title: string;
    content: string;
    createdAt: Date;
    siteName: string;
  } | null;
};

export type PortalProfileData = {
  familyAccounts: PortalScope["familyAccounts"];
  students: Array<
    PortalScope["students"][number] & {
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
    }
  >;
};

export type PortalPaymentsData = {
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
    studentName: string;
    siteName: string;
    latestMovement:
      | {
          type: "SEND" | "COLLECTION" | "RETURN" | "RETRY" | "ADJUSTMENT";
          occurredAt: Date;
          amountCents: number;
        }
      | null;
  }>;
};

export type PortalMessagesData = {
  communications: Array<{
    id: string;
    type: "NOTICE" | "EMAIL";
    title: string;
    content: string;
    targetType: CommunicationTargetType;
    createdAt: Date;
    siteName: string;
    authorName: string;
  }>;
};

const pendingReceiptStatuses = new Set<ReceiptStatus>([
  ReceiptStatus.PENDING,
  ReceiptStatus.PREPARED,
  ReceiptStatus.SENT,
  ReceiptStatus.RETURNED,
]);

async function getPortalScope(userId: string): Promise<PortalScope> {
  const familyAccounts = await prisma.familyAccount.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      phone: true,
      address: true,
      preferredLocale: true,
      ibanMasked: true,
      students: {
        where: { isActive: true },
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
              code: true,
              name: true,
            },
          },
        },
      },
    },
  });

  const students = familyAccounts.flatMap((account) => account.students);
  const studentIds = students.map((student) => student.id);
  const siteIds = Array.from(new Set(students.map((student) => student.mainSite.code))).map(
    (code) => students.find((student) => student.mainSite.code === code)!.mainSite.code,
  );

  // Map site codes to ids to avoid duplicated object traversal later.
  const sites = await prisma.site.findMany({
    where: { code: { in: siteIds } },
    select: { id: true, code: true },
  });

  const siteIdByCode = new Map(sites.map((site) => [site.code, site.id]));
  const resolvedSiteIds = Array.from(
    new Set(students.map((student) => siteIdByCode.get(student.mainSite.code)).filter((id): id is string => Boolean(id))),
  );

  return {
    userId,
    familyAccountIds: familyAccounts.map((account) => account.id),
    familyAccounts: familyAccounts.map((account) => ({
      id: account.id,
      email: account.email,
      phone: account.phone,
      address: account.address,
      preferredLocale: account.preferredLocale,
      ibanMasked: account.ibanMasked,
    })),
    students,
    studentIds,
    siteIds: resolvedSiteIds,
  };
}

function buildCommunicationFilters(scope: PortalScope) {
  const filters: Array<{
    targetType: CommunicationTargetType;
    siteId?: { in: string[] };
    targetRef?: string | { in: string[] };
  }> = [];

  if (scope.siteIds.length > 0) {
    filters.push({
      targetType: CommunicationTargetType.SITE,
      siteId: { in: scope.siteIds },
    });
  }

  if (scope.studentIds.length > 0) {
    filters.push({
      targetType: CommunicationTargetType.STUDENT,
      targetRef: { in: scope.studentIds },
    });
  }

  if (scope.familyAccountIds.length > 0) {
    filters.push({
      targetType: CommunicationTargetType.FAMILY,
      targetRef: { in: scope.familyAccountIds },
    });
  }

  filters.push({
    targetType: CommunicationTargetType.FAMILY,
    targetRef: scope.userId,
  });

  return filters;
}

export async function getPortalSummaryData(userId: string): Promise<PortalSummaryData> {
  const scope = await getPortalScope(userId);

  const receipts = await prisma.receipt.findMany({
    where: {
      student: {
        familyAccount: {
          ownerId: userId,
        },
      },
    },
    orderBy: [{ dueDate: "desc" }, { createdAt: "desc" }],
    take: 30,
    select: {
      id: true,
      amountCents: true,
      status: true,
      dueDate: true,
      periodStart: true,
      periodEnd: true,
      student: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      site: {
        select: {
          name: true,
        },
      },
    },
  });

  const communicationFilters = buildCommunicationFilters(scope);
  const communications = await prisma.communication.findMany({
    where: {
      OR: communicationFilters,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      type: true,
      title: true,
      content: true,
      createdAt: true,
      site: {
        select: {
          name: true,
        },
      },
    },
  });

  const pendingReceipts = receipts.filter((receipt) => pendingReceiptStatuses.has(receipt.status));
  const paidReceipts = receipts.filter((receipt) => receipt.status === ReceiptStatus.PAID);

  return {
    familyAccount: scope.familyAccounts[0] ?? null,
    students: scope.students,
    totals: {
      activeStudents: scope.students.length,
      pendingReceipts: pendingReceipts.length,
      paidReceipts: paidReceipts.length,
      recentCommunications: communications.length,
      pendingAmountCents: pendingReceipts.reduce((sum, receipt) => sum + receipt.amountCents, 0),
    },
    latestReceipt: receipts[0]
      ? {
          id: receipts[0].id,
          amountCents: receipts[0].amountCents,
          status: receipts[0].status,
          dueDate: receipts[0].dueDate,
          periodStart: receipts[0].periodStart,
          periodEnd: receipts[0].periodEnd,
          studentName: `${receipts[0].student.firstName} ${receipts[0].student.lastName}`,
          siteName: receipts[0].site.name,
        }
      : null,
    latestCommunication: communications[0]
      ? {
          id: communications[0].id,
          type: communications[0].type,
          title: communications[0].title,
          content: communications[0].content,
          createdAt: communications[0].createdAt,
          siteName: communications[0].site.name,
        }
      : null,
  };
}

export async function getPortalProfileData(userId: string): Promise<PortalProfileData> {
  const scope = await getPortalScope(userId);

  const students = await prisma.student.findMany({
    where: {
      familyAccount: {
        ownerId: userId,
      },
      isActive: true,
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
          code: true,
          name: true,
        },
      },
      enrollments: {
        where: { status: "ACTIVE" },
        orderBy: { startsAt: "desc" },
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
  });

  return {
    familyAccounts: scope.familyAccounts,
    students: students.map((student) => ({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      schoolName: student.schoolName,
      schoolCourse: student.schoolCourse,
      internalCode: student.internalCode,
      mainSite: student.mainSite,
      activeEnrollment: student.enrollments[0]
        ? {
            startsAt: student.enrollments[0].startsAt,
            tuitionPlan: {
              name: student.enrollments[0].tuitionPlan.name,
              amountCents: student.enrollments[0].tuitionPlan.amountCents,
              period: student.enrollments[0].tuitionPlan.period,
            },
          }
        : null,
    })),
  };
}

export async function getPortalPaymentsData(userId: string): Promise<PortalPaymentsData> {
  const receipts = await prisma.receipt.findMany({
    where: {
      student: {
        familyAccount: {
          ownerId: userId,
        },
      },
    },
    orderBy: [{ dueDate: "desc" }, { createdAt: "desc" }],
    take: 50,
    select: {
      id: true,
      amountCents: true,
      status: true,
      dueDate: true,
      periodStart: true,
      periodEnd: true,
      site: {
        select: { name: true },
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

  const pendingReceipts = receipts.filter((receipt) => pendingReceiptStatuses.has(receipt.status));
  const paidReceipts = receipts.filter((receipt) => receipt.status === ReceiptStatus.PAID);

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
      studentName: `${receipt.student.firstName} ${receipt.student.lastName}`,
      siteName: receipt.site.name,
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

export async function getPortalMessagesData(userId: string): Promise<PortalMessagesData> {
  const scope = await getPortalScope(userId);

  const communications = await prisma.communication.findMany({
    where: {
      OR: buildCommunicationFilters(scope),
    },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      type: true,
      title: true,
      content: true,
      targetType: true,
      createdAt: true,
      site: {
        select: {
          name: true,
        },
      },
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return {
    communications: communications.map((communication) => ({
      id: communication.id,
      type: communication.type,
      title: communication.title,
      content: communication.content,
      targetType: communication.targetType,
      createdAt: communication.createdAt,
      siteName: communication.site.name,
      authorName: `${communication.createdBy.firstName} ${communication.createdBy.lastName}`,
    })),
  };
}
