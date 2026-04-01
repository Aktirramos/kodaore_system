import { notFound } from "next/navigation";
import { getDashboardSummary } from "@/lib/dashboard";
import { isLocale } from "@/lib/i18n";

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const summary = await getDashboardSummary();

  return (
    <div className="space-y-6">
      <section className="fade-rise rounded-3xl border border-black/10 bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Admin Dashboard</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Kodaore Backoffice
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted md:text-base">
          Vista inicial para controlar alumnos, grupos y cobros de las tres sedes. El siguiente paso sera conectar
          autenticacion y permisos reales en UI.
        </p>
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-4">
        <StatCard label="Alumnos activos" value={summary.totals.students} />
        <StatCard label="Grupos activos" value={summary.totals.groups} />
        <StatCard label="Recibos cobrados" value={summary.totals.paidReceipts} />
        <StatCard label="Recibos pendientes" value={summary.totals.pendingReceipts} tone="warning" />
      </section>

      <section className="fade-rise overflow-hidden rounded-2xl border border-black/10 bg-surface">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-surface-strong/70 text-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Sede</th>
              <th className="px-4 py-3 font-semibold">Alumnos</th>
              <th className="px-4 py-3 font-semibold">Grupos</th>
              <th className="px-4 py-3 font-semibold">Cobrados</th>
              <th className="px-4 py-3 font-semibold">Pendientes</th>
            </tr>
          </thead>
          <tbody>
            {summary.perSite.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-ink-muted" colSpan={5}>
                  Sin datos todavia. Ejecuta migraciones y seed para cargar informacion de ejemplo.
                </td>
              </tr>
            ) : (
              summary.perSite.map((site) => (
                <tr key={site.id} className="border-t border-black/10">
                  <td className="px-4 py-3 font-medium text-foreground">{site.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{site.activeStudents}</td>
                  <td className="px-4 py-3 text-ink-muted">{site.activeGroups}</td>
                  <td className="px-4 py-3 text-ink-muted">{site.paidReceipts}</td>
                  <td className="px-4 py-3 text-ink-muted">{site.pendingReceipts}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone = "normal",
}: {
  label: string;
  value: number;
  tone?: "normal" | "warning";
}) {
  const toneClass = tone === "warning" ? "bg-[#f8eadf]" : "bg-surface";

  return (
    <article className={`rounded-2xl border border-black/10 p-5 ${toneClass}`}>
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-1 font-heading text-3xl font-semibold text-foreground">{value}</p>
    </article>
  );
}
