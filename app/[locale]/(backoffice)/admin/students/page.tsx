import { notFound } from "next/navigation";
import { AdminStudentsActionsTable } from "@/components/admin-students-actions-table";
import {
  bulkImportStudentsAction,
  createAdminStudentAction,
  deleteAdminStudentAction,
  getAdminStudentsData,
  updateAdminStudentAction,
} from "@/lib/admin";
import { isLocale } from "@/lib/i18n";
import { AdminStatCard } from "../_shared/_components/admin-stat-card";
import { requireAdminAuth } from "../_shared/_server/require-admin-auth.server";
import { getAdminStudentsActionsCopy } from "./_copy/students-form-copy";

type AdminStudentsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminStudentsPage({ params }: AdminStudentsPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  await requireAdminAuth(locale);

  const isEu = locale === "eu";
  const data = await getAdminStudentsData();
  const copy = getAdminStudentsActionsCopy(locale);

  return (
    <div className="space-y-6">
      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">
          {isEu ? "Kudeaketa" : "Gestion"}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {isEu ? "Ikasleen administrazioa" : "Administracion de alumnos"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted md:text-base">
          {isEu
            ? "Ikasle aktiboen egoera, lotutako familiak eta matrikula aktiboak ikus ditzakezu."
            : "Consulta alumnos activos, sus familias vinculadas y el estado de matricula."}
        </p>
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-3">
        <AdminStatCard label={isEu ? "Ikasle aktiboak" : "Alumnos activos"} value={data.totals.activeStudents} />
        <AdminStatCard label={isEu ? "Matrikula aktiboak" : "Matriculas activas"} value={data.totals.activeEnrollments} />
        <AdminStatCard label={isEu ? "Egoitza aktiboak" : "Sedes representadas"} value={data.totals.representedSites} />
      </section>

      <AdminStudentsActionsTable
        locale={locale}
        availableSites={data.availableSites}
        students={data.students}
        copy={copy}
        createStudentAction={createAdminStudentAction}
        updateStudentAction={updateAdminStudentAction}
        deleteStudentAction={deleteAdminStudentAction}
        bulkImportStudentsAction={bulkImportStudentsAction}
      />
    </div>
  );
}
