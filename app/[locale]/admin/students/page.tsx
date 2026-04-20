import { notFound } from "next/navigation";
import { AdminStudentsActionsTable } from "@/components/admin-students-actions-table";
import { ADMIN_ROLE_CODES, requireAuth } from "@/lib/auth";
import { deleteAdminStudentAction, getAdminStudentsData, updateAdminStudentAction } from "@/lib/admin";
import { isLocale } from "@/lib/i18n";

type AdminStudentsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminStudentsPage({ params }: AdminStudentsPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  await requireAuth({
    locale,
    allowedRoles: ADMIN_ROLE_CODES,
    forbiddenRedirectTo: `/${locale}/portal`,
  });

  const isEu = locale === "eu";
  const data = await getAdminStudentsData();

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
        <StatCard label={isEu ? "Ikasle aktiboak" : "Alumnos activos"} value={String(data.totals.activeStudents)} />
        <StatCard label={isEu ? "Matrikula aktiboak" : "Matriculas activas"} value={String(data.totals.activeEnrollments)} />
        <StatCard label={isEu ? "Egoitza aktiboak" : "Sedes representadas"} value={String(data.totals.representedSites)} />
      </section>

      <AdminStudentsActionsTable
        locale={locale}
        students={data.students}
        updateStudentAction={updateAdminStudentAction}
        deleteStudentAction={deleteAdminStudentAction}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="k-hover-lift rounded-2xl border border-white/10 bg-surface p-5">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-1 font-heading text-3xl font-semibold text-foreground">{value}</p>
    </article>
  );
}
