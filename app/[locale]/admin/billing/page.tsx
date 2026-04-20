import { notFound } from "next/navigation";
import { AdminBillingActionsTable } from "@/components/admin-billing-actions-table";
import { ADMIN_ROLE_CODES, requireAuth } from "@/lib/auth";
import { getAdminBillingData, updateAdminPaymentAction } from "@/lib/admin";
import { isLocale } from "@/lib/i18n";

type AdminBillingPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminBillingPage({ params }: AdminBillingPageProps) {
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
  const data = await getAdminBillingData();

  return (
    <div className="space-y-6">
      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">
          {isEu ? "Kudeaketa" : "Gestion"}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {isEu ? "Kobrantzen administrazioa" : "Administracion de cobros"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted md:text-base">
          {isEu
            ? "Erreziboen egoera, zenbateko metatuak eta azken mugimenduak monitorizatu."
            : "Monitorea estado de recibos, importes acumulados y ultimos movimientos."}
        </p>
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-4">
        <StatCard label={isEu ? "Ordainduta" : "Pagado"} value={formatCurrency(data.totals.paidAmountCents, locale)} />
        <StatCard
          label={isEu ? "Ordaindu gabe" : "Pendiente"}
          value={formatCurrency(data.totals.pendingAmountCents, locale)}
          tone="warning"
        />
        <StatCard label={isEu ? "Ordainagiri ordainduak" : "Recibos pagados"} value={String(data.totals.paidCount)} />
        <StatCard label={isEu ? "Falta diren ordainagiriak" : "Recibos pendientes"} value={String(data.totals.pendingCount)} tone="warning" />
      </section>

      <AdminBillingActionsTable
        locale={locale}
        receipts={data.receipts}
        updatePaymentAction={updateAdminPaymentAction}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  tone = "normal",
}: {
  label: string;
  value: string;
  tone?: "normal" | "warning";
}) {
  const toneClass = tone === "warning" ? "bg-[#2a1b21]" : "bg-surface";

  return (
    <article className={`k-hover-lift rounded-2xl border border-white/10 p-5 ${toneClass}`}>
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-1 font-heading text-2xl font-semibold text-foreground md:text-3xl">{value}</p>
    </article>
  );
}

function formatCurrency(amountCents: number, locale: string) {
  return new Intl.NumberFormat(locale === "eu" ? "eu-ES" : "es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);
}
