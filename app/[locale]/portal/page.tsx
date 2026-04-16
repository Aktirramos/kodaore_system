import Link from "next/link";
import { RoleCode } from "@prisma/client";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getCopy, isLocale } from "@/lib/i18n";
import { getPortalSummaryData } from "@/lib/portal";

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
          <div className="k-hover-soft mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">{isEu ? "Kontu aktiboa" : "Cuenta activa"}</p>
            <p className="mt-1 text-sm text-foreground">{summary.familyAccount.email}</p>
          </div>
        ) : null}
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-4">
        <StatCard
          label={isEu ? "Ikasle aktiboak" : "Alumnos activos"}
          value={String(summary.totals.activeStudents)}
          tone="neutral"
        />
        <StatCard
          label={isEu ? "Ordaintzeko daudenak" : "Pagos pendientes"}
          value={String(summary.totals.pendingReceipts)}
          tone="warning"
        />
        <StatCard
          label={isEu ? "Ordaindutako kuotak" : "Cuotas pagadas"}
          value={String(summary.totals.paidReceipts)}
          tone="success"
        />
        <StatCard
          label={isEu ? "Komunikazioak" : "Comunicaciones"}
          value={String(summary.totals.recentCommunications)}
          tone="neutral"
        />
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-3">
        <QuickLinkCard
          href={`/${locale}/portal/profile`}
          title={isEu ? "Datu pertsonalak" : "Datos personales"}
          text={isEu ? "Familiaren fitxa eta ikasleen datuak kontsultatu." : "Consulta ficha familiar y datos del alumnado."}
          cta={isEu ? "Ikusi xehetasunak" : "Ver detalles"}
        />
        <QuickLinkCard
          href={`/${locale}/portal/payments`}
          title={isEu ? "Ordainketak" : "Pagos"}
          text={isEu ? "Kuoten egoera eta azken mugimenduak ikusi." : "Revisa estado de cuotas y movimientos recientes."}
          cta={isEu ? "Ikusi xehetasunak" : "Ver detalles"}
        />
        <QuickLinkCard
          href={`/${locale}/portal/messages`}
          title={isEu ? "Komunikazioak" : "Comunicaciones"}
          text={isEu ? "Egoitzako mezuak eta abisuak berrikusi." : "Lee avisos y mensajes de la sede."}
          cta={isEu ? "Ikusi xehetasunak" : "Ver detalles"}
        />
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-2">
        <article className="k-hover-lift rounded-2xl border border-white/10 bg-surface p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">{isEu ? "Azken ordainketa" : "Ultimo recibo"}</p>
          {summary.latestReceipt ? (
            <>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {formatCurrency(summary.latestReceipt.amountCents, locale)}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {summary.latestReceipt.studentName} - {summary.latestReceipt.siteName}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {formatDate(summary.latestReceipt.periodStart, locale)} - {formatDate(summary.latestReceipt.periodEnd, locale)}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-ink-muted">{isEu ? "Ez dago ordainketa daturik." : "No hay datos de pagos."}</p>
          )}
        </article>

        <article className="k-hover-lift rounded-2xl border border-white/10 bg-surface p-5">
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

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "warning" | "success";
}) {
  const toneClass =
    tone === "warning"
      ? "border-amber-300/20 bg-amber-500/5"
      : tone === "success"
        ? "border-emerald-300/20 bg-emerald-500/5"
        : "border-white/10 bg-surface";

  return (
    <article className={`k-hover-lift rounded-2xl border p-5 ${toneClass}`}>
      <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">{label}</p>
      <p className="mt-2 font-heading text-3xl font-semibold text-foreground">{value}</p>
    </article>
  );
}

function QuickLinkCard({ href, title, text, cta }: { href: string; title: string; text: string; cta: string }) {
  return (
    <Link
      href={href}
      className="k-focus-ring k-hover-lift group rounded-2xl border border-white/10 bg-surface p-5 hover:border-white/30 hover:bg-surface-strong/50"
    >
      <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-ink-muted">{text}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.12em] text-brand-emphasis">{cta}</p>
    </Link>
  );
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
