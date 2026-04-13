import { notFound } from "next/navigation";
import { ADMIN_ROLE_CODES, requireAuth } from "@/lib/auth";
import { getAdminStudentsData } from "@/lib/admin";
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

      <section className="fade-rise overflow-hidden rounded-2xl border border-white/10 bg-surface">
          <div className="space-y-3 p-4 md:hidden">
            {data.students.length === 0 ? (
              <article className="rounded-xl border border-white/10 bg-surface-strong/40 p-4 text-sm text-ink-muted">
                {isEu
                  ? "Ez dago ikasle aktiboen daturik une honetan."
                  : "No hay datos de alumnos activos en este momento."}
              </article>
            ) : (
              data.students.map((student) => (
                <article key={student.id} className="rounded-xl border border-white/10 bg-surface-strong/40 p-4">
                  <h2 className="font-semibold text-foreground">{student.fullName}</h2>
                  <div className="mt-2 space-y-1 text-sm text-ink-muted">
                    <p>{isEu ? "Egoitza" : "Sede"}: {student.siteName}</p>
                    <p>Email: {student.familyEmail}</p>
                    <p>{isEu ? "Ikasturtea" : "Curso"}: {student.schoolCourse ?? "-"}</p>
                    <p>{isEu ? "Plana" : "Plan"}: {student.tuitionPlanName ?? "-"}</p>
                    <p>
                      {isEu ? "Kuota" : "Cuota"}: {student.tuitionAmountCents !== null ? formatCurrency(student.tuitionAmountCents, locale) : "-"}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full border-collapse text-left text-sm">
                <caption className="sr-only">
                  {isEu ? "Ikasleen administrazio taula" : "Tabla de administracion de alumnos"}
                </caption>
                <thead className="bg-surface-strong/70 text-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">{isEu ? "Ikaslea" : "Alumno"}</th>
                    <th className="px-4 py-3 font-semibold">{isEu ? "Egoitza" : "Sede"}</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">{isEu ? "Ikasturtea" : "Curso"}</th>
                    <th className="px-4 py-3 font-semibold">{isEu ? "Plana" : "Plan"}</th>
                    <th className="px-4 py-3 font-semibold">{isEu ? "Kuota" : "Cuota"}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.students.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-ink-muted" colSpan={6}>
                        {isEu
                          ? "Ez dago ikasle aktiboen daturik une honetan."
                          : "No hay datos de alumnos activos en este momento."}
                      </td>
                    </tr>
                  ) : (
                    data.students.map((student) => (
                      <tr key={student.id} className="k-row-hover border-t border-white/10">
                        <td className="px-4 py-3 font-medium text-foreground">{student.fullName}</td>
                        <td className="px-4 py-3 text-ink-muted">{student.siteName}</td>
                        <td className="px-4 py-3 text-ink-muted">{student.familyEmail}</td>
                        <td className="px-4 py-3 text-ink-muted">{student.schoolCourse ?? "-"}</td>
                        <td className="px-4 py-3 text-ink-muted">{student.tuitionPlanName ?? "-"}</td>
                        <td className="px-4 py-3 text-ink-muted">
                          {student.tuitionAmountCents !== null ? formatCurrency(student.tuitionAmountCents, locale) : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
        </div>
      </section>
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

function formatCurrency(amountCents: number, locale: string) {
  return new Intl.NumberFormat(locale === "eu" ? "eu-ES" : "es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);
}
