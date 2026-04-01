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
    const sites = await prisma.site.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        code: true,
        name: true,
        studentsMain: {
          where: { isActive: true },
          select: { id: true },
        },
        groups: {
          where: { isActive: true },
          select: { id: true },
        },
        receipts: {
          select: { status: true },
        },
      },
    });

    const perSite = sites.map((site) => {
      const paidReceipts = site.receipts.filter((receipt) => receipt.status === "PAID").length;
      const pendingReceipts = site.receipts.filter((receipt) =>
        ["PENDING", "PREPARED", "SENT", "RETURNED"].includes(receipt.status),
      ).length;

      return {
        id: site.id,
        code: site.code,
        name: site.name,
        activeStudents: site.studentsMain.length,
        activeGroups: site.groups.length,
        paidReceipts,
        pendingReceipts,
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
