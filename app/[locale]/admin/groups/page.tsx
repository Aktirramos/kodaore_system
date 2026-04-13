import { notFound } from "next/navigation";
import { ADMIN_ROLE_CODES, requireAuth } from "@/lib/auth";
import { getAdminGroupsData } from "@/lib/admin";
import { isLocale } from "@/lib/i18n";

type AdminGroupsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminGroupsPage({ params }: AdminGroupsPageProps) {
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
  const data = await getAdminGroupsData();

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
        <StatCard label={isEu ? "Talde aktiboak" : "Grupos activos"} value={String(data.totals.activeGroups)} />
        <StatCard label={isEu ? "Edukiera osoa" : "Capacidad total"} value={String(data.totals.totalCapacity)} />
        <StatCard label={isEu ? "7 eguneko saioak" : "Sesiones 7 dias"} value={String(data.totals.next7DaysSessions)} />
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-2">
        {data.groups.length === 0 ? (
          <article className="rounded-2xl border border-white/10 bg-surface p-5">
            <p className="text-sm text-ink-muted">
              {isEu ? "Ez dago talde aktiborik une honetan." : "No hay grupos activos en este momento."}
            </p>
          </article>
        ) : (
          data.groups.map((group) => (
            <article key={group.id} className="k-hover-lift rounded-2xl border border-white/10 bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-heading text-xl font-semibold text-foreground">{group.name}</h2>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-ink-muted">{group.siteName}</span>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-ink-muted md:grid-cols-2">
                <Info label={isEu ? "Maila" : "Nivel"} value={group.level ?? "-"} />
                <Info label={isEu ? "Edukiera" : "Capacidad"} value={String(group.capacity)} />
                <Info label={isEu ? "Arduraduna" : "Responsable"} value={group.leadTeacherName ?? "-"} />
                <Info
                  label={isEu ? "Hurrengo saioa" : "Proxima sesion"}
                  value={group.nextSessionAt ? formatDate(group.nextSessionAt, locale) : "-"}
                />
              </div>
            </article>
          ))
        )}
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">{label}</p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}

function formatDate(value: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "eu" ? "eu-ES" : "es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}
