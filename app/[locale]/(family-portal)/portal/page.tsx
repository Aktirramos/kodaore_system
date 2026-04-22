import { RoleCode } from "@prisma/client";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getCopy, isLocale } from "@/lib/i18n";
import { getPortalSummaryData } from "@/lib/portal";
import { PortalQuickLinkCard } from "./_components/portal-quick-link-card";
import { PortalSummaryStatCard } from "./_components/portal-summary-stat-card";
import { formatPortalCurrency, formatPortalDate } from "./_utils/format";

type PortalPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PortalPage({ params }: PortalPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const session = await requireAuth({
    locale,
    allowedRoles: [RoleCode.ALUMNO_TUTOR],
    forbiddenRedirectTo: `/${locale}/admin`,
  });

  const copy = getCopy(locale);
  const isEu = locale === "eu";
  const summary = await getPortalSummaryData(session.user.id);

  return (
    <div className="space-y-6">
      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">{copy.ctas.access}</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {isEu ? "Familia eta ikasleen ataria" : "Portal de familias y alumnado"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-muted md:text-base">
          {isEu
            ? "Hau zure laburpen orokorra da. Goiko menuan aurkituko dituzu datu pertsonalak, ordainketak eta komunikazioak modu zehatzean."
            : "Este es tu resumen general. En el menu superior tienes los apartados de datos personales, pagos y comunicaciones."}
        </p>

        {summary.familyAccount ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-surface-subtle/60">
            <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">{isEu ? "Kontu aktiboa" : "Cuenta activa"}</p>
            <p className="mt-1 text-sm text-foreground">{summary.familyAccount.email}</p>
          </div>
        ) : null}
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-4">
        <PortalSummaryStatCard
          label={isEu ? "Ikasle aktiboak" : "Alumnos activos"}
          value={String(summary.totals.activeStudents)}
          tone="neutral"
        />
        <PortalSummaryStatCard
          label={isEu ? "Ordaintzeko daudenak" : "Pagos pendientes"}
          value={String(summary.totals.pendingReceipts)}
          tone="warning"
        />
        <PortalSummaryStatCard
          label={isEu ? "Ordaindutako kuotak" : "Cuotas pagadas"}
          value={String(summary.totals.paidReceipts)}
          tone="success"
        />
        <PortalSummaryStatCard
          label={isEu ? "Komunikazioak" : "Comunicaciones"}
          value={String(summary.totals.recentCommunications)}
          tone="neutral"
        />
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-3">
        <PortalQuickLinkCard
          href={`/${locale}/portal/profile`}
          title={isEu ? "Datu pertsonalak" : "Datos personales"}
          text={isEu ? "Familiaren fitxa eta ikasleen datuak kontsultatu." : "Consulta ficha familiar y datos del alumnado."}
          cta={isEu ? "Ikusi xehetasunak" : "Ver detalles"}
        />
        <PortalQuickLinkCard
          href={`/${locale}/portal/payments`}
          title={isEu ? "Ordainketak" : "Pagos"}
          text={isEu ? "Kuoten egoera eta azken mugimenduak ikusi." : "Revisa estado de cuotas y movimientos recientes."}
          cta={isEu ? "Ikusi xehetasunak" : "Ver detalles"}
        />
        <PortalQuickLinkCard
          href={`/${locale}/portal/messages`}
          title={isEu ? "Komunikazioak" : "Comunicaciones"}
          text={isEu ? "Egoitzako mezuak eta abisuak berrikusi." : "Lee avisos y mensajes de la sede."}
          cta={isEu ? "Ikusi xehetasunak" : "Ver detalles"}
        />
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-surface p-5 transition-[transform,box-shadow,border-color,background-color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:shadow-md hover:border-border-default motion-reduce:transform-none motion-reduce:transition-[box-shadow,border-color,background-color]">
          <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">{isEu ? "Azken ordainketa" : "Ultimo recibo"}</p>
          {summary.latestReceipt ? (
            <>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {formatPortalCurrency(summary.latestReceipt.amountCents, locale)}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {summary.latestReceipt.studentName} - {summary.latestReceipt.siteName}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {formatPortalDate(summary.latestReceipt.periodStart, locale)} - {formatPortalDate(summary.latestReceipt.periodEnd, locale)}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-ink-muted">{isEu ? "Ez dago ordainketa daturik." : "No hay datos de pagos."}</p>
          )}
        </article>

        <article className="rounded-2xl border border-white/10 bg-surface p-5 transition-[transform,box-shadow,border-color,background-color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:shadow-md hover:border-border-default motion-reduce:transform-none motion-reduce:transition-[box-shadow,border-color,background-color]">
          <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">{isEu ? "Azken komunikazioa" : "Ultima comunicacion"}</p>
          {summary.latestCommunication ? (
            <>
              <p className="mt-2 text-lg font-semibold text-foreground">{summary.latestCommunication.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{summary.latestCommunication.siteName}</p>
              <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{summary.latestCommunication.content}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-ink-muted">{isEu ? "Ez dago komunikazio berririk." : "No hay comunicaciones nuevas."}</p>
          )}
        </article>
      </section>

      <section className="fade-rise rounded-2xl border border-white/10 bg-surface p-5 md:p-6">
        <h2 className="font-heading text-xl font-semibold text-foreground">{isEu ? "Gogorarazpena" : "Recordatorio"}</h2>
        <p className="mt-3 text-sm text-ink-muted md:text-base">
          {isEu
            ? "Goiko menuan daude zure atariko atal guztiak. Hemendik laburpen orokorra ikusiko duzu beti."
            : "En el menu superior tienes todos los apartados del portal. Aqui veras siempre el resumen general."}
        </p>
        <p className="mt-5 text-xs uppercase tracking-[0.12em] text-ink-muted">
          {isEu
            ? "Xehetasunetara joateko, erabili goiko menuko estekak"
            : "Para entrar en detalle, usa los enlaces del menu superior"}
        </p>
      </section>
    </div>
  );
}
