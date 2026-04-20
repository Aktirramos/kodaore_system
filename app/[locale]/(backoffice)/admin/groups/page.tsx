import { notFound } from "next/navigation";
import { AdminGroupsActionsTable } from "@/components/admin-groups-actions-table";
import { createAdminGroupAction, getAdminGroupsData, updateAdminGroupAction } from "@/lib/admin";
import { isLocale } from "@/lib/i18n";
import { AdminStatCard } from "../_shared/_components/admin-stat-card";
import { requireAdminAuth } from "../_shared/_server/require-admin-auth.server";
import { getAdminGroupsActionsCopy } from "./_copy/groups-form-copy";

type AdminGroupsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminGroupsPage({ params }: AdminGroupsPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  await requireAdminAuth(locale);

  const isEu = locale === "eu";
  const data = await getAdminGroupsData();
  const copy = getAdminGroupsActionsCopy(locale);

  return (
    <div className="space-y-6">
      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">
          {isEu ? "Kudeaketa" : "Gestion"}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {isEu ? "Taldeen administrazioa" : "Administracion de grupos"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted md:text-base">
          {isEu
            ? "Talde aktiboen edukiera, arduradunak eta hurrengo saioak kontrolatu."
            : "Controla la capacidad de grupos, responsables y proximas sesiones."}
        </p>
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-3">
        <AdminStatCard label={isEu ? "Talde aktiboak" : "Grupos activos"} value={data.totals.activeGroups} />
        <AdminStatCard label={isEu ? "Edukiera osoa" : "Capacidad total"} value={data.totals.totalCapacity} />
        <AdminStatCard label={isEu ? "7 eguneko saioak" : "Sesiones 7 dias"} value={data.totals.next7DaysSessions} />
      </section>

      <AdminGroupsActionsTable
        locale={locale}
        groups={data.groups}
        availableSites={data.availableSites}
        availableTeachers={data.availableTeachers}
        copy={copy}
        createGroupAction={createAdminGroupAction}
        updateGroupAction={updateAdminGroupAction}
      />
    </div>
  );
}

