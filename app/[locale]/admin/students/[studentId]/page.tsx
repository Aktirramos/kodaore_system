import Link from "next/link";
import { ReceiptStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { ADMIN_ROLE_CODES, requireAuth } from "@/lib/auth";
import { getAdminStudentProfileData } from "@/lib/admin";
import { isLocale } from "@/lib/i18n";

type AdminStudentProfilePageProps = {
  params: Promise<{ locale: string; studentId: string }>;
};

export default async function AdminStudentProfilePage({ params }: AdminStudentProfilePageProps) {
  const { locale, studentId } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  await requireAuth({
    locale,
    allowedRoles: ADMIN_ROLE_CODES,
    forbiddenRedirectTo: `/${locale}/portal`,
  });

  const isEu = locale === "eu";
  const copy = isEu
    ? {
        backLabel: "Itzuli ikasle zerrendara",
        sectionLabel: "Kudeaketa",
        titleSuffix: "ikaslearen fitxa",
        subtitle: "Informazio pertsonala, ordainagirien egoera eta familiaren atariaren ikuspegia kontsultatu.",
        quickFamilyAccess: "Acceso rapido al perfil de familia",
        personalInfoTitle: "Informazio pertsonala",
        groupTitle: "Uneko taldea",
        receiptsTitle: "Ordainagirien historia",
        familyPortalTitle: "Familiaren profila (atariaren ikuspegia)",
        ownerLabel: "Kontuaren arduraduna",
        ownerEmailLabel: "Arduradunaren emaila",
        familyEmailLabel: "Familiaren emaila",
        phoneLabel: "Telefonoa",
        addressLabel: "Helbidea",
        preferredLocaleLabel: "Hizkuntza lehenetsia",
        ibanLabel: "IBAN",
        birthDateLabel: "Jaiotze data",
        schoolNameLabel: "Ikastetxea",
        schoolCourseLabel: "Ikasturtea",
        siteLabel: "Egoitza",
        internalCodeLabel: "Barne kodea",
        memberCodeLabel: "Kirol zentroko bazkide kodea",
        statusLabel: "Egoera",
        activeStatus: "Aktiboa",
        inactiveStatus: "Inaktiboa",
        leadTeacherLabel: "Arduraduna",
        levelLabel: "Maila",
        nextSessionLabel: "Hurrengo saioa",
        lastSessionLabel: "Azken saioa",
        noGroup: "Ez dago talde daturik ikasle honentzat.",
        noReceipts: "Ez dago ordainagiririk ikasle honentzat.",
        paidReceipts: "Ordainagiri ordainduak",
        pendingReceipts: "Ordainagiri pendienteak",
        periodLabel: "Epea",
        dueDateLabel: "Muga eguna",
        amountLabel: "Zenbatekoa",
        receiptStatusLabel: "Egoera",
        noFamilyStudents: "Familia kontu honetan ez dago ikasle aktiborik.",
        tuitionFromLabel: "Aktiboa",
      }
    : {
        backLabel: "Volver al listado de alumnos",
        sectionLabel: "Gestion",
        titleSuffix: "ficha del alumno",
        subtitle: "Consulta informacion personal, historial de recibos y una vista de lo que ve la familia en su portal.",
        quickFamilyAccess: "Acceso rapido al perfil de familia",
        personalInfoTitle: "Informacion personal",
        groupTitle: "Grupo actual",
        receiptsTitle: "Historial de recibos",
        familyPortalTitle: "Perfil de familia (vista de portal)",
        ownerLabel: "Responsable de la cuenta",
        ownerEmailLabel: "Email del responsable",
        familyEmailLabel: "Email de familia",
        phoneLabel: "Telefono",
        addressLabel: "Direccion",
        preferredLocaleLabel: "Idioma preferido",
        ibanLabel: "IBAN",
        birthDateLabel: "Fecha de nacimiento",
        schoolNameLabel: "Centro escolar",
        schoolCourseLabel: "Curso escolar",
        siteLabel: "Sede",
        internalCodeLabel: "Codigo interno",
        memberCodeLabel: "Codigo socio polideportivo",
        statusLabel: "Estado",
        activeStatus: "Activo",
        inactiveStatus: "Inactivo",
        leadTeacherLabel: "Responsable",
        levelLabel: "Nivel",
        nextSessionLabel: "Proxima sesion",
        lastSessionLabel: "Ultima sesion",
        noGroup: "No hay informacion de grupo para este alumno.",
        noReceipts: "No hay recibos para este alumno.",
        paidReceipts: "Recibos pagados",
        pendingReceipts: "Recibos pendientes",
        periodLabel: "Periodo",
        dueDateLabel: "Vencimiento",
        amountLabel: "Importe",
        receiptStatusLabel: "Estado",
        noFamilyStudents: "No hay alumnos activos en esta cuenta familiar.",
        tuitionFromLabel: "Activo desde",
      };

  const profile = await getAdminStudentProfileData(studentId).catch(() => notFound());

  return (
    <div className="space-y-6">
      <Link
        href={`/${locale}/admin/students`}
        className="k-focus-ring inline-flex items-center rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted hover:text-foreground"
      >
        {copy.backLabel}
      </Link>

      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">{copy.sectionLabel}</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {profile.student.fullName} - {copy.titleSuffix}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-ink-muted md:text-base">{copy.subtitle}</p>
          </div>

          <a
            href="#family-profile"
            className="k-focus-ring inline-flex rounded-lg border border-brand-emphasis/40 bg-brand-emphasis/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-brand-emphasis"
          >
            {copy.quickFamilyAccess}
          </a>
        </div>
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-2">
        <article className="k-hover-lift rounded-2xl border border-white/10 bg-surface p-5">
          <h2 className="font-heading text-xl font-semibold text-foreground">{copy.personalInfoTitle}</h2>
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <Info label={copy.birthDateLabel} value={formatDate(profile.student.birthDate, locale)} />
            <Info label={copy.phoneLabel} value={profile.student.phone ?? "-"} />
            <Info label={copy.schoolNameLabel} value={profile.student.schoolName ?? "-"} />
            <Info label={copy.schoolCourseLabel} value={profile.student.schoolCourse ?? "-"} />
            <Info label={copy.siteLabel} value={profile.student.siteName} />
            <Info label={copy.internalCodeLabel} value={profile.student.internalCode} />
            <Info label={copy.memberCodeLabel} value={profile.student.sportsCenterMemberCode ?? "-"} />
            <Info
              label={copy.statusLabel}
              value={profile.student.isActive ? copy.activeStatus : copy.inactiveStatus}
            />
          </dl>
          <div className="mt-3">
            <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">{copy.addressLabel}</p>
            <p className="mt-1 text-sm text-foreground">{profile.student.address ?? "-"}</p>
          </div>
        </article>

        <article className="k-hover-lift rounded-2xl border border-white/10 bg-surface p-5">
          <h2 className="font-heading text-xl font-semibold text-foreground">{copy.groupTitle}</h2>
          {profile.currentGroup ? (
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <Info label={isEu ? "Taldea" : "Grupo"} value={profile.currentGroup.name} />
              <Info label={copy.levelLabel} value={profile.currentGroup.level ?? "-"} />
              <Info label={copy.siteLabel} value={profile.currentGroup.siteName} />
              <Info label={copy.leadTeacherLabel} value={profile.currentGroup.leadTeacherName ?? "-"} />
              <Info
                label={copy.nextSessionLabel}
                value={profile.currentGroup.nextSessionAt ? formatDateTime(profile.currentGroup.nextSessionAt, locale) : "-"}
              />
              <Info
                label={copy.lastSessionLabel}
                value={profile.currentGroup.lastSessionAt ? formatDateTime(profile.currentGroup.lastSessionAt, locale) : "-"}
              />
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-muted">{copy.noGroup}</p>
          )}
        </article>
      </section>

      <section className="fade-rise space-y-4">
        <h2 className="font-heading text-xl font-semibold text-foreground">{copy.receiptsTitle}</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <StatCard
            label={copy.paidReceipts}
            value={`${profile.receiptTotals.paidCount} - ${formatCurrency(profile.receiptTotals.paidAmountCents, locale)}`}
            tone="success"
          />
          <StatCard
            label={copy.pendingReceipts}
            value={`${profile.receiptTotals.pendingCount} - ${formatCurrency(profile.receiptTotals.pendingAmountCents, locale)}`}
            tone="warning"
          />
        </div>

        <article className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
          {profile.receipts.length === 0 ? (
            <p className="p-5 text-sm text-ink-muted">{copy.noReceipts}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse text-left text-sm">
                <thead className="bg-surface-strong/70 text-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">{copy.periodLabel}</th>
                    <th className="px-4 py-3 font-semibold">{copy.dueDateLabel}</th>
                    <th className="px-4 py-3 font-semibold">{copy.amountLabel}</th>
                    <th className="px-4 py-3 font-semibold">{copy.receiptStatusLabel}</th>
                    <th className="px-4 py-3 font-semibold">{copy.siteLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.receipts.map((receipt) => (
                    <tr key={receipt.id} className="k-row-hover border-t border-white/10 text-ink-muted">
                      <td className="px-4 py-3 text-foreground">
                        {formatDate(receipt.periodStart, locale)} - {formatDate(receipt.periodEnd, locale)}
                      </td>
                      <td className="px-4 py-3">{receipt.dueDate ? formatDate(receipt.dueDate, locale) : "-"}</td>
                      <td className="px-4 py-3 text-foreground">{formatCurrency(receipt.amountCents, locale)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full border px-2.5 py-1 text-xs ${statusTone(receipt.status)}`}>
                          {formatReceiptStatus(receipt.status, locale)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{receipt.siteName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>

      <section id="family-profile" className="fade-rise space-y-4">
        <h2 className="font-heading text-xl font-semibold text-foreground">{copy.familyPortalTitle}</h2>

        <article className="k-hover-lift rounded-2xl border border-white/10 bg-surface p-5">
          <dl className="grid gap-3 text-sm md:grid-cols-3">
            <Info label={copy.ownerLabel} value={profile.familyPortalPreview.ownerName} />
            <Info label={copy.ownerEmailLabel} value={profile.familyPortalPreview.ownerEmail ?? "-"} />
            <Info label={copy.familyEmailLabel} value={profile.familyPortalPreview.email} />
            <Info label={copy.phoneLabel} value={profile.familyPortalPreview.phone ?? "-"} />
            <Info label={copy.preferredLocaleLabel} value={profile.familyPortalPreview.preferredLocale} />
            <Info label={copy.ibanLabel} value={profile.familyPortalPreview.ibanMasked ?? "-"} />
          </dl>
          <div className="mt-3">
            <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">{copy.addressLabel}</p>
            <p className="mt-1 text-sm text-foreground">{profile.familyPortalPreview.address ?? "-"}</p>
          </div>
        </article>

        {profile.familyPortalPreview.students.length === 0 ? (
          <article className="rounded-2xl border border-white/10 bg-surface p-5">
            <p className="text-sm text-ink-muted">{copy.noFamilyStudents}</p>
          </article>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {profile.familyPortalPreview.students.map((student) => (
              <article key={student.id} className="k-hover-lift rounded-2xl border border-white/10 bg-surface p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-heading text-lg font-semibold text-foreground">{student.fullName}</h3>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-ink-muted">
                    {student.siteName}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-sm md:grid-cols-3">
                  <Info label={copy.schoolNameLabel} value={student.schoolName ?? "-"} />
                  <Info label={copy.schoolCourseLabel} value={student.schoolCourse ?? "-"} />
                  <Info label={copy.internalCodeLabel} value={student.internalCode} />
                </div>
                {student.activeEnrollment ? (
                  <div className="k-hover-soft mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-sm">
                    <p className="text-foreground">{student.activeEnrollment.tuitionPlan.name}</p>
                    <p className="mt-1 text-ink-muted">
                      {formatCurrency(student.activeEnrollment.tuitionPlan.amountCents, locale)} -{" "}
                      {formatPeriod(student.activeEnrollment.tuitionPlan.period, locale)}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {copy.tuitionFromLabel}: {formatDate(student.activeEnrollment.startsAt, locale)}
                    </p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
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

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warning";
}) {
  const toneClass = tone === "success" ? "border-emerald-300/20 bg-emerald-500/5" : "border-amber-300/20 bg-amber-500/5";

  return (
    <article className={`rounded-2xl border p-5 ${toneClass}`}>
      <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">{label}</p>
      <p className="mt-2 font-heading text-2xl font-semibold text-foreground">{value}</p>
    </article>
  );
}

function statusTone(status: ReceiptStatus) {
  if (status === ReceiptStatus.PAID) {
    return "border-emerald-300/30 bg-emerald-500/12 text-emerald-100";
  }

  if (
    status === ReceiptStatus.PENDING ||
    status === ReceiptStatus.PREPARED ||
    status === ReceiptStatus.SENT ||
    status === ReceiptStatus.RETURNED
  ) {
    return "border-amber-300/30 bg-amber-500/12 text-amber-100";
  }

  return "border-white/20 bg-white/5 text-ink-muted";
}

function formatReceiptStatus(status: ReceiptStatus, locale: string) {
  const isEu = locale === "eu";

  const map = isEu
    ? {
        PENDING: "Pendiente",
        PREPARED: "Prest",
        SENT: "Bidalia",
        PAID: "Ordainduta",
        RETURNED: "Itzulita",
        CANCELED: "Bertan behera",
      }
    : {
        PENDING: "Pendiente",
        PREPARED: "Preparado",
        SENT: "Enviado",
        PAID: "Pagado",
        RETURNED: "Devuelto",
        CANCELED: "Cancelado",
      };

  return map[status];
}

function formatPeriod(period: "MONTHLY" | "QUARTERLY" | "YEARLY", locale: string) {
  const map =
    locale === "eu"
      ? { MONTHLY: "hilekoa", QUARTERLY: "hiruhilekoa", YEARLY: "urtekoa" }
      : { MONTHLY: "mensual", QUARTERLY: "trimestral", YEARLY: "anual" };

  return map[period];
}

function formatCurrency(amountCents: number, locale: string) {
  return new Intl.NumberFormat(locale === "eu" ? "eu-ES" : "es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);
}

function formatDate(value: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "eu" ? "eu-ES" : "es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

function formatDateTime(value: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "eu" ? "eu-ES" : "es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}
