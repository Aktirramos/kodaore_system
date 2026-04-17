import { ReceiptStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type SiteOverview = {
  id: string;
  code: string;
  name: string;
  activeStudents: number;
  activeGroups: number;
  paidReceipts: number;
  pendingReceipts: number;
};

export type DashboardSummary = {
  totals: {
    students: number;
    groups: number;
    paidReceipts: number;
    pendingReceipts: number;
  };
  perSite: SiteOverview[];
};

const emptySummary: DashboardSummary = {
  totals: {
    students: 0,
    groups: 0,
    paidReceipts: 0,
    pendingReceipts: 0,
  },
  perSite: [],
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const [sites, receiptTotals] = await Promise.all([
      prisma.site.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: {
          id: true,
          code: true,
          name: true,
          _count: {
            select: {
              studentsMain: {
                where: { isActive: true },
              },
              groups: {
                where: { isActive: true },
              },
            },
          },
        },
      }),
      prisma.receipt.groupBy({
        by: ["siteId", "status"],
        where: {
          site: {
            isActive: true,
          },
          status: {
            in: [
              ReceiptStatus.PAID,
              ReceiptStatus.PENDING,
              ReceiptStatus.PREPARED,
              ReceiptStatus.SENT,
              ReceiptStatus.RETURNED,
            ],
          },
        },
        _count: {
          _all: true,
        },
      }),
    ]);

    const receiptCountsBySite = new Map<string, { paid: number; pending: number }>();

    for (const total of receiptTotals) {
      const entry = receiptCountsBySite.get(total.siteId) ?? { paid: 0, pending: 0 };

      if (total.status === ReceiptStatus.PAID) {
        entry.paid = total._count._all;
      } else {
        entry.pending += total._count._all;
      }

      receiptCountsBySite.set(total.siteId, entry);
    }

    const perSite = sites.map((site) => {
      const receiptCounts = receiptCountsBySite.get(site.id) ?? { paid: 0, pending: 0 };

      return {
        id: site.id,
        code: site.code,
        name: site.name,
        activeStudents: site._count.studentsMain,
        activeGroups: site._count.groups,
        paidReceipts: receiptCounts.paid,
        pendingReceipts: receiptCounts.pending,
      };
    });

    return {
      totals: {
        students: perSite.reduce((sum, site) => sum + site.activeStudents, 0),
        groups: perSite.reduce((sum, site) => sum + site.activeGroups, 0),
        paidReceipts: perSite.reduce((sum, site) => sum + site.paidReceipts, 0),
        pendingReceipts: perSite.reduce((sum, site) => sum + site.pendingReceipts, 0),
      },
      perSite,
    };
  } catch {
    return emptySummary;
  }
}
