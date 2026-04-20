"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ActionToast } from "@/components/action-toast";
import type { LocaleCode } from "@/lib/i18n";

type ReceiptStatusCode = "PENDING" | "PREPARED" | "SENT" | "PAID" | "RETURNED" | "CANCELED";
type PaymentMovementCode = "SEND" | "COLLECTION" | "RETURN" | "RETRY" | "ADJUSTMENT";

type BillingReceiptRow = {
  id: string;
  amountCents: number;
  status: ReceiptStatusCode;
  dueDate: Date | string | null;
  periodStart: Date | string;
  periodEnd: Date | string;
  siteName: string;
  studentName: string;
  latestMovement:
    | {
        type: PaymentMovementCode;
        occurredAt: Date | string;
        amountCents: number;
      }
    | null;
};

type AdminBillingActionsTableProps = {
  locale: LocaleCode;
  receipts: BillingReceiptRow[];
  updatePaymentAction: (receiptId: string, input: { status?: ReceiptStatusCode }) => Promise<unknown>;
};

type ToastState = {
  message: string;
  variant: "success" | "error";
};

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
}

export function AdminBillingActionsTable({ locale, receipts, updatePaymentAction }: AdminBillingActionsTableProps) {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [pendingReceiptId, setPendingReceiptId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isEu = locale === "eu";
  const noDataMessage = isEu ? "Ez dago kobrantza daturik." : "No hay datos de cobros.";
  const actionsLabel = isEu ? "Ekintzak" : "Acciones";
  const closeToastLabel = isEu ? "Itxi" : "Cerrar";

  const runStatusAction = (receipt: BillingReceiptRow, nextStatus: ReceiptStatusCode) => {
    setPendingReceiptId(receipt.id);

    startTransition(() => {
      void (async () => {
        try {
          await updatePaymentAction(receipt.id, { status: nextStatus });
          setToast({
            message: isEu
              ? `"${receipt.studentName}" ordainagiria eguneratu da.`
              : `Se ha actualizado el recibo de "${receipt.studentName}".`,
            variant: "success",
          });
          router.refresh();
        } catch (error) {
          setToast({
            message: getErrorMessage(
              error,
              isEu ? "Ezin izan da ordainagiria eguneratu." : "No se ha podido actualizar el recibo.",
            ),
            variant: "error",
          });
        } finally {
          setPendingReceiptId(null);
        }
      })();
    });
  };

  return (
    <>
      <section className="fade-rise overflow-hidden rounded-2xl border border-white/10 bg-surface">
        <div className="space-y-3 p-4 md:hidden">
          {receipts.length === 0 ? (
            <article className="rounded-xl border border-white/10 bg-surface-strong/40 p-4 text-sm text-ink-muted">
              {noDataMessage}
            </article>
          ) : (
            receipts.map((receipt) => {
              const rowPending = isPending && pendingReceiptId === receipt.id;
              const canToggle = receipt.status !== "CANCELED";
              const nextStatus: ReceiptStatusCode = receipt.status === "PAID" ? "PENDING" : "PAID";
              const actionLabel = canToggle
                ? receipt.status === "PAID"
                  ? isEu
                    ? "Zain jarri"
                    : "Marcar pendiente"
                  : isEu
                    ? "Ordainduta jarri"
                    : "Marcar pagado"
                : isEu
                  ? "Blokeatuta"
                  : "Bloqueado";

              return (
                <article key={receipt.id} className="rounded-xl border border-white/10 bg-surface-strong/40 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-semibold text-foreground">{receipt.studentName}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs ${statusClass(receipt.status)}`}>
                      {getStatusLabel(receipt.status, locale)}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-sm text-ink-muted">
                    <p>
                      {isEu ? "Egoitza" : "Sede"}: {receipt.siteName}
                    </p>
                    <p>
                      {isEu ? "Zenbatekoa" : "Importe"}: {formatCurrency(receipt.amountCents, locale)}
                    </p>
                    <p>
                      {isEu ? "Epemuga" : "Vencimiento"}: {receipt.dueDate ? formatDate(receipt.dueDate, locale) : "-"}
                    </p>
                    <p>
                      {isEu ? "Azken mugimendua" : "Ultimo movimiento"}:{" "}
                      {receipt.latestMovement
                        ? `${getMovementLabel(receipt.latestMovement.type, locale)} · ${formatDate(receipt.latestMovement.occurredAt, locale)}`
                        : "-"}
                    </p>
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => runStatusAction(receipt, nextStatus)}
                      disabled={rowPending || !canToggle}
                      aria-label={
                        canToggle
                          ? isEu
                            ? `${receipt.studentName} ordainagiriaren egoera aldatu`
                            : `Cambiar estado del recibo de ${receipt.studentName}`
                          : isEu
                            ? "Ordainagiri hau ezin da aldatu"
                            : "Este recibo no se puede modificar"
                      }
                      className="k-focus-ring rounded-lg border border-brand/35 bg-brand/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-brand-contrast disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {rowPending ? (isEu ? "Lanean..." : "Procesando...") : actionLabel}
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>

        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="min-w-[1020px] w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                {isEu ? "Kobrantzen eta ordainagirien administrazio taula" : "Tabla de administracion de cobros y recibos"}
              </caption>
              <thead className="bg-surface-strong/70 text-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">{isEu ? "Ikaslea" : "Alumno"}</th>
                  <th className="px-4 py-3 font-semibold">{isEu ? "Egoitza" : "Sede"}</th>
                  <th className="px-4 py-3 font-semibold">{isEu ? "Egoera" : "Estado"}</th>
                  <th className="px-4 py-3 font-semibold">{isEu ? "Zenbatekoa" : "Importe"}</th>
                  <th className="px-4 py-3 font-semibold">{isEu ? "Epemuga" : "Vencimiento"}</th>
                  <th className="px-4 py-3 font-semibold">{isEu ? "Azken mugimendua" : "Ultimo movimiento"}</th>
                  <th className="px-4 py-3 font-semibold">{actionsLabel}</th>
                </tr>
              </thead>
              <tbody>
                {receipts.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-ink-muted" colSpan={7}>
                      {noDataMessage}
                    </td>
                  </tr>
                ) : (
                  receipts.map((receipt) => {
                    const rowPending = isPending && pendingReceiptId === receipt.id;
                    const canToggle = receipt.status !== "CANCELED";
                    const nextStatus: ReceiptStatusCode = receipt.status === "PAID" ? "PENDING" : "PAID";
                    const actionLabel = canToggle
                      ? receipt.status === "PAID"
                        ? isEu
                          ? "Zain jarri"
                          : "Marcar pendiente"
                        : isEu
                          ? "Ordainduta jarri"
                          : "Marcar pagado"
                      : isEu
                        ? "Blokeatuta"
                        : "Bloqueado";

                    return (
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
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => runStatusAction(receipt, nextStatus)}
                            disabled={rowPending || !canToggle}
                            aria-label={
                              canToggle
                                ? isEu
                                  ? `${receipt.studentName} ordainagiriaren egoera aldatu`
                                  : `Cambiar estado del recibo de ${receipt.studentName}`
                                : isEu
                                  ? "Ordainagiri hau ezin da aldatu"
                                  : "Este recibo no se puede modificar"
                            }
                            className="k-focus-ring rounded-md border border-brand/35 bg-brand/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-brand-contrast disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {rowPending ? (isEu ? "Lanean..." : "Procesando...") : actionLabel}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {toast ? (
        <ActionToast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
          closeLabel={closeToastLabel}
        />
      ) : null}
    </>
  );
}

function formatCurrency(amountCents: number, locale: LocaleCode) {
  return new Intl.NumberFormat(locale === "eu" ? "eu-ES" : "es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);
}

function formatDate(value: Date | string, locale: LocaleCode) {
  const normalized = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat(locale === "eu" ? "eu-ES" : "es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(normalized);
}

function getStatusLabel(status: ReceiptStatusCode, locale: LocaleCode) {
  const mapEs: Record<ReceiptStatusCode, string> = {
    PENDING: "Pendiente",
    PREPARED: "Preparado",
    SENT: "Enviado",
    PAID: "Pagado",
    RETURNED: "Devuelto",
    CANCELED: "Cancelado",
  };

  const mapEu: Record<ReceiptStatusCode, string> = {
    PENDING: "Zain",
    PREPARED: "Prestatuta",
    SENT: "Bidalita",
    PAID: "Ordainduta",
    RETURNED: "Itzulita",
    CANCELED: "Bertan behera",
  };

  return locale === "eu" ? mapEu[status] : mapEs[status];
}

function getMovementLabel(type: PaymentMovementCode, locale: LocaleCode) {
  const mapEs: Record<PaymentMovementCode, string> = {
    SEND: "Envio",
    COLLECTION: "Cobro",
    RETURN: "Devolucion",
    RETRY: "Reintento",
    ADJUSTMENT: "Ajuste",
  };

  const mapEu: Record<PaymentMovementCode, string> = {
    SEND: "Bidalketa",
    COLLECTION: "Kobrantza",
    RETURN: "Itzulketa",
    RETRY: "Birsaiakera",
    ADJUSTMENT: "Doiketa",
  };

  return locale === "eu" ? mapEu[type] : mapEs[type];
}

function statusClass(status: ReceiptStatusCode) {
  if (status === "PAID") {
    return "border border-emerald-300/20 bg-emerald-500/10 text-emerald-200";
  }

  if (status === "PENDING" || status === "SENT" || status === "PREPARED") {
    return "border border-amber-300/20 bg-amber-500/10 text-amber-100";
  }

  return "border border-white/20 bg-white/5 text-ink-muted";
}
