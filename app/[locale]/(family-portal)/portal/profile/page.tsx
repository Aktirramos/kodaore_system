import { RoleCode } from "@prisma/client";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { isLocale } from "@/lib/i18n";
import { getPortalProfileData } from "@/lib/portal";

type PortalProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PortalProfilePage({ params }: PortalProfilePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const session = await requireAuth({
    locale,
    allowedRoles: [RoleCode.ALUMNO_TUTOR],
    forbiddenRedirectTo: `/${locale}/admin`,
  });

  const isEu = locale === "eu";
  const profile = await getPortalProfileData(session.user.id);

  return (
    <div className="space-y-6">
      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">
          {isEu ? "Datu pertsonalak" : "Datos personales"}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {isEu ? "Familiaren fitxa" : "Ficha familiar"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-muted md:text-base">
          {isEu
            ? "Atal honetan familia-unitatearen datu nagusiak eta kontakturako informazioa ikusiko dituzu."
            : "En este apartado veras los datos principales de la unidad familiar y la informacion de contacto."}
        </p>
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-2">
        {profile.familyAccounts.map((account) => (
          <article key={account.id} className="k-hover-lift rounded-2xl border border-white/10 bg-surface p-5">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {isEu ? "Harremanetarako datuak" : "Datos de contacto"}
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-ink-muted">Email</dt>
                <dd className="text-foreground">{account.email}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">{isEu ? "Telefonoa" : "Telefono"}</dt>
                <dd className="text-foreground">{account.phone ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">{isEu ? "Helbidea" : "Direccion"}</dt>
                <dd className="text-foreground">{account.address ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">{isEu ? "IBAN" : "IBAN"}</dt>
                <dd className="text-foreground">{account.ibanMasked ?? "-"}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>

      <section className="fade-rise space-y-3">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          {isEu ? "Ikasleen informazioa" : "Informacion de alumnos"}
        </h2>
        {profile.students.length === 0 ? (
          <article className="rounded-2xl border border-white/10 bg-surface p-5">
            <p className="text-sm text-ink-muted">
              {isEu ? "Ez dago ikasle aktiborik lotuta." : "No hay alumnos activos vinculados."}
            </p>
          </article>
        ) : (
          profile.students.map((student) => (
            <article key={student.id} className="k-hover-lift rounded-2xl border border-white/10 bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {student.firstName} {student.lastName}
                </h3>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-ink-muted">
                  {student.mainSite.name}
                </span>
              </div>
              <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
                <DataRow label={isEu ? "Eskola" : "Colegio"} value={student.schoolName ?? "-"} />
                <DataRow label={isEu ? "Maila" : "Curso"} value={student.schoolCourse ?? "-"} />
                <DataRow label={isEu ? "Kodea" : "Codigo"} value={student.internalCode} />
              </div>
              {student.activeEnrollment ? (
                <div className="k-hover-soft mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-sm">
                  <p className="text-foreground">{student.activeEnrollment.tuitionPlan.name}</p>
                  <p className="text-ink-muted">
                    {formatCurrency(student.activeEnrollment.tuitionPlan.amountCents, locale)} -{" "}
                    {formatPeriod(student.activeEnrollment.tuitionPlan.period, locale)}
                  </p>
                </div>
              ) : null}
            </article>
          ))
        )}
      </section>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">{label}</p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}

function formatCurrency(amountCents: number, locale: string) {
  return new Intl.NumberFormat(locale === "eu" ? "eu-ES" : "es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);
}

function formatPeriod(period: "MONTHLY" | "QUARTERLY" | "YEARLY", locale: string) {
  const map =
    locale === "eu"
      ? { MONTHLY: "hilekoa", QUARTERLY: "hiruhilekoa", YEARLY: "urtekoa" }
      : { MONTHLY: "mensual", QUARTERLY: "trimestral", YEARLY: "anual" };
  return map[period];
}
