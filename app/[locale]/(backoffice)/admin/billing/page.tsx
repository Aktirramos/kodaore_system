import { notFound } from "next/navigation";
import { AdminBillingActionsTable } from "@/components/admin-billing-actions-table";
import { getAdminBillingData, updateAdminPaymentAction } from "@/lib/admin";
import { isLocale } from "@/lib/i18n";
import { AdminStatCard } from "../_shared/_components/admin-stat-card";
import { requireAdminAuth } from "../_shared/_server/require-admin-auth.server";

type AdminBillingPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminBillingPage({ params }: AdminBillingPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  await requireAdminAuth(locale);

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
        <AdminStatCard label={isEu ? "Ordainduta" : "Pagado"} value={formatCurrency(data.totals.paidAmountCents, locale)} compact />
        <AdminStatCard
          label={isEu ? "Ordaindu gabe" : "Pendiente"}
          value={formatCurrency(data.totals.pendingAmountCents, locale)}
          tone="warning"
          compact
        />
        <AdminStatCard label={isEu ? "Ordainagiri ordainduak" : "Recibos pagados"} value={data.totals.paidCount} compact />
        <AdminStatCard
          label={isEu ? "Falta diren ordainagiriak" : "Recibos pendientes"}
          value={data.totals.pendingCount}
          tone="warning"
          compact
        />
      </section>

      <AdminBillingActionsTable
        locale={locale}
        receipts={data.receipts}
        updatePaymentAction={updateAdminPaymentAction}
      />
    </div>
  );
}

function formatCurrency(amountCents: number, locale: string) {
  return new Intl.NumberFormat(locale === "eu" ? "eu-ES" : "es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);
}
