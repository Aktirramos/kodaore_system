import { ReceiptStatus, RoleCode } from "@prisma/client";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { isLocale } from "@/lib/i18n";
import { getPortalPaymentsData } from "@/lib/portal";

type PortalPaymentsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PortalPaymentsPage({ params }: PortalPaymentsPageProps) {
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
  const payments = await getPortalPaymentsData(session.user.id);

  return (
    <div className="space-y-6">
      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">
          {isEu ? "Ordainketak" : "Pagos"}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {isEu ? "Kuoten egoera" : "Estado de cuotas"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-muted md:text-base">
          {isEu
            ? "Hemen kontsulta ditzakezu kobratutako kuotak, zain dauden ordainketak eta azken mugimenduak."
            : "Aqui puedes consultar cuotas cobradas, pagos pendientes y ultimos movimientos."}
        </p>
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-3">
        <Stat
          label={isEu ? "Ordainduta" : "Pagado"}
          value={formatCurrency(payments.totals.paidAmountCents, locale)}
        />
        <Stat
          label={isEu ? "Ordainketa zainak" : "Pagos pendientes"}
          value={formatCurrency(payments.totals.pendingAmountCents, locale)}
        />
        <Stat
          label={isEu ? "Errezibo kopurua" : "Numero de recibos"}
          value={`${payments.totals.paidCount + payments.totals.pendingCount}`}
        />
      </section>

      <section className="fade-rise rounded-2xl border border-white/10 bg-surface p-5 md:p-6">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          {isEu ? "Mugimenduak" : "Movimientos"}
        </h2>

        {payments.receipts.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">{isEu ? "Ez dago ordainketa erregistrorik." : "No hay registros de pagos."}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {payments.receipts.map((receipt) => (
              <article key={receipt.id} className="k-hover-lift rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{receipt.studentName}</p>
                  <span className={`rounded-full px-3 py-1 text-xs ${statusClass(receipt.status)}`}>
                    {getStatusLabel(receipt.status, locale)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">{receipt.siteName}</p>
                <div className="mt-3 grid gap-2 text-sm md:grid-cols-3">
                  <Data label={isEu ? "Zenbatekoa" : "Importe"} value={formatCurrency(receipt.amountCents, locale)} />
                  <Data
                    label={isEu ? "Epea" : "Periodo"}
                    value={`${formatDate(receipt.periodStart, locale)} - ${formatDate(receipt.periodEnd, locale)}`}
                  />
                  <Data
                    label={isEu ? "Mugimendu berriena" : "Ultimo movimiento"}
                    value={
                      receipt.latestMovement
                        ? `${getMovementLabel(receipt.latestMovement.type, locale)} · ${formatDate(receipt.latestMovement.occurredAt, locale)}`
                        : "-"
                    }
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article className="k-hover-lift rounded-2xl border border-white/10 bg-surface p-5">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-1 font-heading text-2xl font-semibold text-foreground">{value}</p>
    </article>
  );
}

function Data({ label, value }: { label: string; value: string }) {
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

function statusClass(status: ReceiptStatus) {
  if (status === ReceiptStatus.PAID) {
    return "border border-emerald-300/20 bg-emerald-500/10 text-emerald-200";
  }
  if (status === ReceiptStatus.PENDING || status === ReceiptStatus.SENT || status === ReceiptStatus.PREPARED) {
    return "border border-amber-300/20 bg-amber-500/10 text-amber-100";
  }
  return "border border-white/20 bg-white/5 text-ink-muted";
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
