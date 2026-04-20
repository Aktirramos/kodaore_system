"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ActionToast } from "@/components/action-toast";
import type { LocaleCode } from "@/lib/i18n";

type AdminStudentRow = {
  id: string;
  fullName: string;
  siteName: string;
  schoolCourse: string | null;
  familyEmail: string;
  tuitionPlanName: string | null;
  tuitionAmountCents: number | null;
};

type AdminStudentsActionsTableProps = {
  locale: LocaleCode;
  students: AdminStudentRow[];
  updateStudentAction: (studentId: string, input: { isActive?: boolean }) => Promise<unknown>;
  deleteStudentAction: (studentId: string) => Promise<unknown>;
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

export function AdminStudentsActionsTable({
  locale,
  students,
  updateStudentAction,
  deleteStudentAction,
}: AdminStudentsActionsTableProps) {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isEu = locale === "eu";
  const noDataMessage = isEu
    ? "Ez dago ikasle aktiboen daturik une honetan."
    : "No hay datos de alumnos activos en este momento.";
  const deactivateLabel = isEu ? "Inaktibatu" : "Inactivar";
  const deleteLabel = isEu ? "Ezabatu" : "Eliminar";
  const actionsLabel = isEu ? "Ekintzak" : "Acciones";
  const closeToastLabel = isEu ? "Itxi" : "Cerrar";

  const runAction = (
    actionId: string,
    operation: () => Promise<unknown>,
    successMessage: string,
    fallbackErrorMessage: string,
  ) => {
    setPendingActionId(actionId);

    startTransition(() => {
      void (async () => {
        try {
          await operation();
          setToast({ message: successMessage, variant: "success" });
          router.refresh();
        } catch (error) {
          setToast({ message: getErrorMessage(error, fallbackErrorMessage), variant: "error" });
        } finally {
          setPendingActionId(null);
        }
      })();
    });
  };

  const handleDeactivate = (student: AdminStudentRow) => {
    runAction(
      `deactivate:${student.id}`,
      () => updateStudentAction(student.id, { isActive: false }),
      isEu ? `"${student.fullName}" inaktibatu da.` : `"${student.fullName}" se ha inactivado.`,
      isEu ? "Ezin izan da ikaslea inaktibatu." : "No se ha podido inactivar el alumno.",
    );
  };

  const handleDelete = (student: AdminStudentRow) => {
    const confirmed = window.confirm(
      isEu
        ? `"${student.fullName}" ikaslea ezabatu nahi duzu?`
        : `Quieres eliminar al alumno "${student.fullName}"?`,
    );

    if (!confirmed) {
      return;
    }

    runAction(
      `delete:${student.id}`,
      () => deleteStudentAction(student.id),
      isEu ? `"${student.fullName}" ezabatu da.` : `"${student.fullName}" se ha eliminado.`,
      isEu ? "Ezin izan da ikaslea ezabatu." : "No se ha podido eliminar el alumno.",
    );
  };

  return (
    <>
      <section className="fade-rise overflow-hidden rounded-2xl border border-white/10 bg-surface">
        <div className="space-y-3 p-4 md:hidden">
          {students.length === 0 ? (
            <article className="rounded-xl border border-white/10 bg-surface-strong/40 p-4 text-sm text-ink-muted">
              {noDataMessage}
            </article>
          ) : (
            students.map((student) => {
              const deactivateActionId = `deactivate:${student.id}`;
              const deleteActionId = `delete:${student.id}`;
              const deactivatePending = isPending && pendingActionId === deactivateActionId;
              const deletePending = isPending && pendingActionId === deleteActionId;
              const rowPending = deactivatePending || deletePending;

              return (
                <article key={student.id} className="rounded-xl border border-white/10 bg-surface-strong/40 p-4">
                  <h2 className="font-semibold text-foreground">{student.fullName}</h2>
                  <div className="mt-2 space-y-1 text-sm text-ink-muted">
                    <p>
                      {isEu ? "Egoitza" : "Sede"}: {student.siteName}
                    </p>
                    <p>Email: {student.familyEmail}</p>
                    <p>
                      {isEu ? "Ikasturtea" : "Curso"}: {student.schoolCourse ?? "-"}
                    </p>
                    <p>
                      {isEu ? "Plana" : "Plan"}: {student.tuitionPlanName ?? "-"}
                    </p>
                    <p>
                      {isEu ? "Kuota" : "Cuota"}: {student.tuitionAmountCents !== null ? formatCurrency(student.tuitionAmountCents, locale) : "-"}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeactivate(student)}
                      disabled={rowPending}
                      aria-label={isEu ? `${student.fullName} inaktibatu` : `Inactivar a ${student.fullName}`}
                      className="k-focus-ring rounded-lg border border-amber-300/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deactivatePending ? (isEu ? "Lanean..." : "Procesando...") : deactivateLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(student)}
                      disabled={rowPending}
                      aria-label={isEu ? `${student.fullName} ezabatu` : `Eliminar a ${student.fullName}`}
                      className="k-focus-ring rounded-lg border border-rose-300/35 bg-rose-500/12 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletePending ? (isEu ? "Lanean..." : "Procesando...") : deleteLabel}
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>

        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                {isEu ? "Ikasleen administrazio taula" : "Tabla de administracion de alumnos"}
              </caption>
              <thead className="bg-surface-strong/70 text-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">{isEu ? "Ikaslea" : "Alumno"}</th>
                  <th className="px-4 py-3 font-semibold">{isEu ? "Egoitza" : "Sede"}</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">{isEu ? "Ikasturtea" : "Curso"}</th>
                  <th className="px-4 py-3 font-semibold">{isEu ? "Plana" : "Plan"}</th>
                  <th className="px-4 py-3 font-semibold">{isEu ? "Kuota" : "Cuota"}</th>
                  <th className="px-4 py-3 font-semibold">{actionsLabel}</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-ink-muted" colSpan={7}>
                      {noDataMessage}
                    </td>
                  </tr>
                ) : (
                  students.map((student) => {
                    const deactivateActionId = `deactivate:${student.id}`;
                    const deleteActionId = `delete:${student.id}`;
                    const deactivatePending = isPending && pendingActionId === deactivateActionId;
                    const deletePending = isPending && pendingActionId === deleteActionId;
                    const rowPending = deactivatePending || deletePending;

                    return (
                      <tr key={student.id} className="k-row-hover border-t border-white/10">
                        <td className="px-4 py-3 font-medium text-foreground">{student.fullName}</td>
                        <td className="px-4 py-3 text-ink-muted">{student.siteName}</td>
                        <td className="px-4 py-3 text-ink-muted">{student.familyEmail}</td>
                        <td className="px-4 py-3 text-ink-muted">{student.schoolCourse ?? "-"}</td>
                        <td className="px-4 py-3 text-ink-muted">{student.tuitionPlanName ?? "-"}</td>
                        <td className="px-4 py-3 text-ink-muted">
                          {student.tuitionAmountCents !== null ? formatCurrency(student.tuitionAmountCents, locale) : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDeactivate(student)}
                              disabled={rowPending}
                              aria-label={isEu ? `${student.fullName} inaktibatu` : `Inactivar a ${student.fullName}`}
                              className="k-focus-ring rounded-md border border-amber-300/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deactivatePending ? (isEu ? "Lanean..." : "Procesando...") : deactivateLabel}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(student)}
                              disabled={rowPending}
                              aria-label={isEu ? `${student.fullName} ezabatu` : `Eliminar a ${student.fullName}`}
                              className="k-focus-ring rounded-md border border-rose-300/35 bg-rose-500/12 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletePending ? (isEu ? "Lanean..." : "Procesando...") : deleteLabel}
                            </button>
                          </div>
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
