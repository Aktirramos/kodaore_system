import { ReceiptStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { ADMIN_ROLE_CODES, requireAuth } from "@/lib/auth";
import { getAdminBillingData } from "@/lib/admin";
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
          label={isEu ? "Ordaintzeke" : "Pendiente"}
          value={formatCurrency(data.totals.pendingAmountCents, locale)}
          tone="warning"
        />
        <StatCard label={isEu ? "Errezibo ordainduak" : "Recibos pagados"} value={String(data.totals.paidCount)} />
        <StatCard label={isEu ? "Errezibo pendienteak" : "Recibos pendientes"} value={String(data.totals.pendingCount)} tone="warning" />
      </section>

      <section className="fade-rise overflow-hidden rounded-2xl border border-white/10 bg-surface">
          <div className="space-y-3 p-4 md:hidden">
            {data.receipts.length === 0 ? (
              <article className="rounded-xl border border-white/10 bg-surface-strong/40 p-4 text-sm text-ink-muted">
                {isEu ? "Ez dago kobrantza daturik." : "No hay datos de cobros."}
              </article>
            ) : (
              data.receipts.map((receipt) => (
                <article key={receipt.id} className="rounded-xl border border-white/10 bg-surface-strong/40 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-semibold text-foreground">{receipt.studentName}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs ${statusClass(receipt.status)}`}>
                      {getStatusLabel(receipt.status, locale)}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-ink-muted">
                    <p>{isEu ? "Egoitza" : "Sede"}: {receipt.siteName}</p>
                    <p>{isEu ? "Zenbatekoa" : "Importe"}: {formatCurrency(receipt.amountCents, locale)}</p>
                    <p>{isEu ? "Epemuga" : "Vencimiento"}: {receipt.dueDate ? formatDate(receipt.dueDate, locale) : "-"}</p>
                    <p>
                      {isEu ? "Azken mugimendua" : "Ultimo movimiento"}: {receipt.latestMovement
                        ? `${getMovementLabel(receipt.latestMovement.type, locale)} · ${formatDate(receipt.latestMovement.occurredAt, locale)}`
                        : "-"}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-[920px] w-full border-collapse text-left text-sm">
                <caption className="sr-only">
                  {isEu ? "Kobrantzen eta erreziboen administrazio taula" : "Tabla de administracion de cobros y recibos"}
                </caption>
                <thead className="bg-surface-strong/70 text-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">{isEu ? "Ikaslea" : "Alumno"}</th>
                    <th className="px-4 py-3 font-semibold">{isEu ? "Egoitza" : "Sede"}</th>
                    <th className="px-4 py-3 font-semibold">{isEu ? "Egoera" : "Estado"}</th>
                    <th className="px-4 py-3 font-semibold">{isEu ? "Zenbatekoa" : "Importe"}</th>
                    <th className="px-4 py-3 font-semibold">{isEu ? "Epemuga" : "Vencimiento"}</th>
                    <th className="px-4 py-3 font-semibold">{isEu ? "Azken mugimendua" : "Ultimo movimiento"}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.receipts.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-ink-muted" colSpan={6}>
                        {isEu ? "Ez dago kobrantza daturik." : "No hay datos de cobros."}
                      </td>
                    </tr>
                  ) : (
                    data.receipts.map((receipt) => (
                      <tr key={receipt.id} className="k-row-hover border-t border-white/10">
                        <td className="px-4 py-3 font-medium text-foreground">{receipt.studentName}</td>
                        <td className="px-4 py-3 text-ink-muted">{receipt.siteName}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-3 py-1 text-xs ${statusClass(receipt.status)}`}>
                            {getStatusLabel(receipt.status, locale)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-ink-muted">{formatCurrency(receipt.amountCents, locale)}</td>
                        <td className="px-4 py-3 text-ink-muted">{receipt.dueDate ? formatDate(receipt.dueDate, locale) : "-"}</td>
                        <td className="px-4 py-3 text-ink-muted">
                          {receipt.latestMovement
                            ? `${getMovementLabel(receipt.latestMovement.type, locale)} · ${formatDate(receipt.latestMovement.occurredAt, locale)}`
                            : "-"}
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

function formatDate(value: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "eu" ? "eu-ES" : "es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

function getStatusLabel(status: ReceiptStatus, locale: string) {
  const mapEs: Record<ReceiptStatus, string> = {
    PENDING: "Pendiente",
    PREPARED: "Preparado",
    SENT: "Enviado",
    PAID: "Pagado",
    RETURNED: "Devuelto",
    CANCELED: "Cancelado",
  };

  const mapEu: Record<ReceiptStatus, string> = {
    PENDING: "Zain",
    PREPARED: "Prestatuta",
    SENT: "Bidalita",
    PAID: "Ordainduta",
    RETURNED: "Itzulita",
    CANCELED: "Bertan behera",
  };

  return locale === "eu" ? mapEu[status] : mapEs[status];
}

function getMovementLabel(type: "SEND" | "COLLECTION" | "RETURN" | "RETRY" | "ADJUSTMENT", locale: string) {
  const mapEs = {
    SEND: "Envio",
    COLLECTION: "Cobro",
    RETURN: "Devolucion",
    RETRY: "Reintento",
    ADJUSTMENT: "Ajuste",
  };

  const mapEu = {
    SEND: "Bidalketa",
    COLLECTION: "Kobrantza",
    RETURN: "Itzulketa",
    RETRY: "Birsaiakera",
    ADJUSTMENT: "Doiketa",
  };

  return locale === "eu" ? mapEu[type] : mapEs[type];
}

function statusClass(status: ReceiptStatus) {
  if (status === ReceiptStatus.PAID) {
    return "border border-emerald-300/20 bg-emerald-500/10 text-emerald-200";
  }

  if (status === ReceiptStatus.PENDING || status === ReceiptStatus.SENT || status === ReceiptStatus.PREPARED) {
    return "border border-amber-300/20 bg-amber-500/10 text-amber-100";
  }

  return "border border-white/20 bg-white/5 text-ink-muted";
}
