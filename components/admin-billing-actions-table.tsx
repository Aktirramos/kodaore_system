"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
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
  updatePaymentAction: (
    receiptId: string,
    input: { status?: ReceiptStatusCode; amountCents?: number },
  ) => Promise<unknown>;
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
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [editingReceipt, setEditingReceipt] = useState<BillingReceiptRow | null>(null);
  const [isPending, startTransition] = useTransition();

  const isEu = locale === "eu";
  const noDataMessage = isEu ? "Ez dago kobrantza daturik." : "No hay datos de cobros.";
  const actionsLabel = isEu ? "Ekintzak" : "Acciones";
  const editLabel = isEu ? "Editatu" : "Editar";
  const closeToastLabel = isEu ? "Itxi" : "Cerrar";
  const modalTitle = isEu ? "Ordainagiria editatu" : "Editar recibo";
  const modalDescription = isEu
    ? "Eguneratu ordainagiriaren egoera eta zenbatekoa eskuz."
    : "Actualiza manualmente el estado y el importe del recibo.";
  const statusLabel = isEu ? "Egoera" : "Estado";
  const amountLabel = isEu ? "Zenbatekoa (EUR)" : "Importe (EUR)";
  const saveLabel = isEu ? "Gorde aldaketak" : "Guardar cambios";
  const savingLabel = isEu ? "Gordetzen..." : "Guardando...";
  const cancelLabel = isEu ? "Utzi" : "Cancelar";

  const handleCloseEditModal = () => {
    if (isPending && editingReceipt && pendingActionId === `edit:${editingReceipt.id}`) {
      return;
    }

    setEditingReceipt(null);
  };

  const handleSaveEdit = (receipt: BillingReceiptRow, status: ReceiptStatusCode, amountEurosRaw: string) => {
    const normalizedAmount = amountEurosRaw.replace(",", ".").trim();
    const parsedAmount = Number(normalizedAmount);

    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      setToast({
        message: isEu ? "Zenbatekoa ez da baliozkoa." : "El importe no es valido.",
        variant: "error",
      });
      return;
    }

    const amountCents = Math.round(parsedAmount * 100);
    const actionId = `edit:${receipt.id}`;
    setPendingActionId(actionId);

    startTransition(() => {
      void (async () => {
        try {
          await updatePaymentAction(receipt.id, { status, amountCents });
          setToast({
            message: isEu
              ? `"${receipt.studentName}" ordainagiria eguneratu da.`
              : `Se ha actualizado el recibo de "${receipt.studentName}".`,
            variant: "success",
          });
          setEditingReceipt(null);
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
          setPendingActionId(null);
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
              const rowPending = isPending && pendingActionId === `edit:${receipt.id}`;

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
                      onClick={() => setEditingReceipt(receipt)}
                      disabled={rowPending}
                      aria-label={isEu ? `${receipt.studentName} ordainagiria editatu` : `Editar recibo de ${receipt.studentName}`}
                      className="k-focus-ring rounded-lg border border-brand/35 bg-brand/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-brand-contrast disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {rowPending ? (isEu ? "Lanean..." : "Procesando...") : editLabel}
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
                    const rowPending = isPending && pendingActionId === `edit:${receipt.id}`;

                    return (
                      <tr
                        key={receipt.id}
                        className="border-t border-white/10 transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-surface-subtle"
                      >
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
                            onClick={() => setEditingReceipt(receipt)}
                            disabled={rowPending}
                            aria-label={isEu ? `${receipt.studentName} ordainagiria editatu` : `Editar recibo de ${receipt.studentName}`}
                            className="k-focus-ring rounded-md border border-brand/35 bg-brand/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-brand-contrast disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {rowPending ? (isEu ? "Lanean..." : "Procesando...") : editLabel}
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

      <ReceiptEditModal
        locale={locale}
        receipt={editingReceipt}
        title={modalTitle}
        description={modalDescription}
        statusLabel={statusLabel}
        amountLabel={amountLabel}
        saveLabel={saveLabel}
        savingLabel={savingLabel}
        cancelLabel={cancelLabel}
        isSaving={Boolean(editingReceipt && isPending && pendingActionId === `edit:${editingReceipt.id}`)}
        onClose={handleCloseEditModal}
        onSubmit={handleSaveEdit}
      />

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

type ReceiptEditModalProps = {
  locale: LocaleCode;
  receipt: BillingReceiptRow | null;
  title: string;
  description: string;
  statusLabel: string;
  amountLabel: string;
  saveLabel: string;
  savingLabel: string;
  cancelLabel: string;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (receipt: BillingReceiptRow, status: ReceiptStatusCode, amountEurosRaw: string) => void;
};

function ReceiptEditModal({
  locale,
  receipt,
  title,
  description,
  statusLabel,
  amountLabel,
  saveLabel,
  savingLabel,
  cancelLabel,
  isSaving,
  onClose,
  onSubmit,
}: ReceiptEditModalProps) {
  const [status, setStatus] = useState<ReceiptStatusCode>("PENDING");
  const [amountEuros, setAmountEuros] = useState("0.00");

  useEffect(() => {
    if (!receipt) {
      return;
    }

    setStatus(receipt.status);
    setAmountEuros((receipt.amountCents / 100).toFixed(2));
  }, [receipt]);

  useEffect(() => {
    if (!receipt) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSaving, onClose, receipt]);

  if (!receipt) {
    return null;
  }

  const statusOptions: ReceiptStatusCode[] = ["PENDING", "PREPARED", "SENT", "PAID", "RETURNED", "CANCELED"];

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label={cancelLabel}
        onClick={onClose}
        disabled={isSaving}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative z-[66] max-h-[90vh] w-full max-w-xl overflow-auto rounded-2xl border border-white/15 bg-surface p-5 shadow-2xl md:p-6">
        <h2 className="font-heading text-2xl font-semibold text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-ink-muted">{description}</p>

        <div className="mt-4 rounded-xl border border-white/10 bg-surface-strong/40 p-3 text-sm text-ink-muted">
          <p className="font-semibold text-foreground">{receipt.studentName}</p>
          <p className="mt-1">{receipt.siteName}</p>
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(receipt, status, amountEuros);
          }}
        >
          <label className="space-y-1 text-sm text-ink-muted">
            <span>{statusLabel}</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as ReceiptStatusCode)}
              className="k-focus-ring w-full rounded-lg border border-white/15 bg-surface-strong/50 px-3 py-2 text-sm text-foreground"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {getStatusLabel(option, locale)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm text-ink-muted">
            <span>{amountLabel}</span>
            <input
              type="text"
              inputMode="decimal"
              value={amountEuros}
              onChange={(event) => setAmountEuros(event.target.value)}
              className="k-focus-ring w-full rounded-lg border border-white/15 bg-surface-strong/50 px-3 py-2 text-sm text-foreground"
            />
          </label>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="k-focus-ring rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="k-focus-ring rounded-lg border border-brand-emphasis/40 bg-brand-emphasis/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-brand-emphasis disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? savingLabel : saveLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
