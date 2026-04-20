import Link from "next/link";
import { notFound } from "next/navigation";
import { getDashboardSummary } from "@/lib/dashboard";
import { isLocale } from "@/lib/i18n";
import { AdminStatCard } from "./_shared/_components/admin-stat-card";
import { requireAdminAuth } from "./_shared/_server/require-admin-auth.server";

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  await requireAdminAuth(locale);

  const isEu = locale === "eu";

  const summary = await getDashboardSummary();

  return (
    <div className="space-y-6">
      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">{isEu ? "Admin panela" : "Panel admin"}</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Kodaore Backoffice
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted md:text-base">
          {isEu
            ? "Hiru egoitzetako ikasleak, taldeak eta kobrantzak kontrolatzeko hasierako ikuspegia, rolaren arabera babestutako sarbidearekin."
            : "Vista inicial para controlar alumnos, grupos y cobros de las tres sedes con acceso protegido por rol."}
        </p>
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-4">
        <AdminStatCard label={isEu ? "Ikasle aktiboak" : "Alumnos activos"} value={summary.totals.students} />
        <AdminStatCard label={isEu ? "Talde aktiboak" : "Grupos activos"} value={summary.totals.groups} />
        <AdminStatCard label={isEu ? "Ordainagiri ordainduak" : "Recibos cobrados"} value={summary.totals.paidReceipts} />
        <AdminStatCard
          label={isEu ? "Falta diren ordainagiriak" : "Recibos pendientes"}
          value={summary.totals.pendingReceipts}
          tone="warning"
        />
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-3">
        <AdminModuleCard
          href={`/${locale}/admin/students`}
          title={isEu ? "Ikasleak" : "Alumnos"}
          description={
            isEu
              ? "Ikasleen egoera, loturak eta matrikulen ikuspegi azkarra."
              : "Vision rapida de estado, vinculaciones y matriculas del alumnado."
          }
          cta={isEu ? "Ireki modulua" : "Abrir modulo"}
        />
        <AdminModuleCard
          href={`/${locale}/admin/groups`}
          title={isEu ? "Taldeak" : "Grupos"}
          description={
            isEu
              ? "Edukiera, arduradunak eta hurrengo saioak kontrolatu."
              : "Control de capacidad, responsables y proximas sesiones."
          }
          cta={isEu ? "Ireki modulua" : "Abrir modulo"}
        />
        <AdminModuleCard
          href={`/${locale}/admin/billing`}
          title={isEu ? "Kobrantzak" : "Cobros"}
          description={
            isEu
              ? "Erreziboen egoera eta mugimendu ekonomiko berrienak berrikusi."
              : "Revisa estado de recibos y los ultimos movimientos economicos."
          }
          cta={isEu ? "Ireki modulua" : "Abrir modulo"}
        />
      </section>

      <section className="fade-rise overflow-hidden rounded-2xl border border-white/10 bg-surface">
          <div className="space-y-3 p-4 md:hidden">
            {summary.perSite.length === 0 ? (
              <article className="rounded-xl border border-white/10 bg-surface-strong/40 p-4 text-sm text-ink-muted">
                {isEu
                  ? "Oraindik ez dago daturik. Exekutatu migrazioak eta seed komandoa adibideko informazioa kargatzeko."
                  : "Sin datos todavia. Ejecuta migraciones y seed para cargar informacion de ejemplo."}
              </article>
            ) : (
              summary.perSite.map((site) => (
                <article key={site.id} className="rounded-xl border border-white/10 bg-surface-strong/40 p-4">
                  <h2 className="font-semibold text-foreground">{site.name}</h2>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-ink-muted">
                    <p>{isEu ? "Ikasleak" : "Alumnos"}: {site.activeStudents}</p>
                    <p>{isEu ? "Taldeak" : "Grupos"}: {site.activeGroups}</p>
                    <p>{isEu ? "Ordainduak" : "Cobrados"}: {site.paidReceipts}</p>
                    <p>{isEu ? "Falta direnak" : "Pendientes"}: {site.pendingReceipts}</p>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-[700px] w-full border-collapse text-left text-sm">
                <caption className="sr-only">
                  {isEu ? "Egoitza bakoitzeko kudeaketa laburpena" : "Resumen de gestion por cada sede"}
                </caption>
                <thead className="bg-surface-strong/70 text-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">{isEu ? "Egoitza" : "Sede"}</th>
                    <th className="px-4 py-3 font-semibold">{isEu ? "Ikasleak" : "Alumnos"}</th>
                    <th className="px-4 py-3 font-semibold">{isEu ? "Taldeak" : "Grupos"}</th>
                    <th className="px-4 py-3 font-semibold">{isEu ? "Ordainduak" : "Cobrados"}</th>
                    <th className="px-4 py-3 font-semibold">{isEu ? "Falta direnak" : "Pendientes"}</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.perSite.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-ink-muted" colSpan={5}>
                        {isEu
                          ? "Oraindik ez dago daturik. Exekutatu migrazioak eta seed komandoa adibideko informazioa kargatzeko."
                          : "Sin datos todavia. Ejecuta migraciones y seed para cargar informacion de ejemplo."}
                      </td>
                    </tr>
                  ) : (
                    summary.perSite.map((site) => (
                      <tr key={site.id} className="k-row-hover border-t border-white/10">
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
            </div>
        </div>
      </section>
    </div>
  );
}

function AdminModuleCard({
  href,
  title,
  description,
  cta,
}: {
  href: string;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="k-focus-ring k-hover-lift rounded-2xl border border-white/10 bg-surface p-5"
    >
      <h2 className="font-heading text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-ink-muted">{description}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.12em] text-brand-emphasis">{cta}</p>
    </Link>
  );
}
