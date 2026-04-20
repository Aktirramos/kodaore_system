"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ActionToast } from "@/components/action-toast";
import type { UpdateAdminStudentInput } from "@/lib/admin";
import type { LocaleCode } from "@/lib/i18n";

type AdminStudentRow = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string | null;
  address: string | null;
  schoolName: string | null;
  siteName: string;
  mainSiteId: string;
  schoolCourse: string | null;
  sportsCenterMemberCode: string | null;
  isActive: boolean;
  familyEmail: string;
  tuitionPlanName: string | null;
  tuitionAmountCents: number | null;
};

export type AdminStudentsActionsCopy = {
  form: {
    editLabel: string;
    modalTitle: string;
    modalDescription: string;
    firstNameLabel: string;
    lastNameLabel: string;
    phoneLabel: string;
    addressLabel: string;
    schoolNameLabel: string;
    schoolCourseLabel: string;
    sportsCenterMemberCodeLabel: string;
    isActiveLabel: string;
    saveLabel: string;
    savingLabel: string;
    cancelLabel: string;
    updatedSuffix: string;
    updateErrorFallback: string;
    requiredFirstName: string;
    requiredLastName: string;
  };
};

type AdminStudentsActionsTableProps = {
  locale: LocaleCode;
  students: AdminStudentRow[];
  copy: AdminStudentsActionsCopy;
  updateStudentAction: (studentId: string, input: UpdateAdminStudentInput) => Promise<unknown>;
  deleteStudentAction: (studentId: string) => Promise<unknown>;
};

type ToastState = {
  message: string;
  variant: "success" | "error";
};

type StudentEditFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  schoolName: string;
  schoolCourse: string;
  sportsCenterMemberCode: string;
  isActive: boolean;
};

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
}

function buildStudentEditSchema(copy: AdminStudentsActionsCopy["form"]) {
  return z.object({
    firstName: z.string().trim().min(1, copy.requiredFirstName),
    lastName: z.string().trim().min(1, copy.requiredLastName),
    phone: z.string(),
    address: z.string(),
    schoolName: z.string(),
    schoolCourse: z.string(),
    sportsCenterMemberCode: z.string(),
    isActive: z.boolean(),
  });
}

function normalizeOptionalInput(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getDefaultFormValues(student: AdminStudentRow | null): StudentEditFormValues {
  return {
    firstName: student?.firstName ?? "",
    lastName: student?.lastName ?? "",
    phone: student?.phone ?? "",
    address: student?.address ?? "",
    schoolName: student?.schoolName ?? "",
    schoolCourse: student?.schoolCourse ?? "",
    sportsCenterMemberCode: student?.sportsCenterMemberCode ?? "",
    isActive: student?.isActive ?? true,
  };
}

export function AdminStudentsActionsTable({
  locale,
  students,
  copy,
  updateStudentAction,
  deleteStudentAction,
}: AdminStudentsActionsTableProps) {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<AdminStudentRow | null>(null);
  const [isPending, startTransition] = useTransition();

  const isEu = locale === "eu";
  const noDataMessage = isEu
    ? "Ez dago ikasle aktiboen daturik une honetan."
    : "No hay datos de alumnos activos en este momento.";
  const editLabel = copy.form.editLabel;
  const deactivateLabel = isEu ? "Inaktibatu" : "Inactivar";
  const deleteLabel = isEu ? "Ezabatu" : "Eliminar";
  const actionsLabel = isEu ? "Ekintzak" : "Acciones";
  const closeToastLabel = isEu ? "Itxi" : "Cerrar";

  const runAction = (
    actionId: string,
    operation: () => Promise<unknown>,
    successMessage: string,
    fallbackErrorMessage: string,
    options?: {
      onSuccess?: () => void;
    },
  ) => {
    setPendingActionId(actionId);

    startTransition(() => {
      void (async () => {
        try {
          await operation();
          setToast({ message: successMessage, variant: "success" });
          options?.onSuccess?.();
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

  const handleEdit = (student: AdminStudentRow) => {
    setEditingStudent(student);
  };

  const handleCloseEditModal = () => {
    if (isPending && editingStudent && pendingActionId === `edit:${editingStudent.id}`) {
      return;
    }

    setEditingStudent(null);
  };

  const handleSaveEdit = (student: AdminStudentRow, values: StudentEditFormValues) => {
    const payload: UpdateAdminStudentInput = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phone: normalizeOptionalInput(values.phone),
      address: normalizeOptionalInput(values.address),
      schoolName: normalizeOptionalInput(values.schoolName),
      schoolCourse: normalizeOptionalInput(values.schoolCourse),
      sportsCenterMemberCode: normalizeOptionalInput(values.sportsCenterMemberCode),
      isActive: values.isActive,
    };

    runAction(
      `edit:${student.id}`,
      () => updateStudentAction(student.id, payload),
      `"${payload.firstName} ${payload.lastName}" ${copy.form.updatedSuffix}`,
      copy.form.updateErrorFallback,
      {
        onSuccess: () => setEditingStudent(null),
      },
    );
  };

  const editingActionId = editingStudent ? `edit:${editingStudent.id}` : null;
  const editModalPending = Boolean(editingActionId && isPending && pendingActionId === editingActionId);

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
              const editActionId = `edit:${student.id}`;
              const deactivateActionId = `deactivate:${student.id}`;
              const deleteActionId = `delete:${student.id}`;
              const editPending = isPending && pendingActionId === editActionId;
              const deactivatePending = isPending && pendingActionId === deactivateActionId;
              const deletePending = isPending && pendingActionId === deleteActionId;
              const rowPending = editPending || deactivatePending || deletePending;

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
                      onClick={() => handleEdit(student)}
                      disabled={rowPending}
                      aria-label={isEu ? `${student.fullName} editatu` : `Editar a ${student.fullName}`}
                      className="k-focus-ring rounded-lg border border-sky-300/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {editPending ? (isEu ? "Lanean..." : "Procesando...") : editLabel}
                    </button>
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
                    const editActionId = `edit:${student.id}`;
                    const deactivateActionId = `deactivate:${student.id}`;
                    const deleteActionId = `delete:${student.id}`;
                    const editPending = isPending && pendingActionId === editActionId;
                    const deactivatePending = isPending && pendingActionId === deactivateActionId;
                    const deletePending = isPending && pendingActionId === deleteActionId;
                    const rowPending = editPending || deactivatePending || deletePending;

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
                              onClick={() => handleEdit(student)}
                              disabled={rowPending}
                              aria-label={isEu ? `${student.fullName} editatu` : `Editar a ${student.fullName}`}
                              className="k-focus-ring rounded-md border border-sky-300/30 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {editPending ? (isEu ? "Lanean..." : "Procesando...") : editLabel}
                            </button>
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

      <StudentEditModal
        student={editingStudent}
        copy={copy.form}
        isOpen={Boolean(editingStudent)}
        isSaving={editModalPending}
        onClose={handleCloseEditModal}
        onSubmit={(values) => {
          if (!editingStudent) {
            return;
          }

          handleSaveEdit(editingStudent, values);
        }}
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

type StudentEditModalProps = {
  student: AdminStudentRow | null;
  copy: AdminStudentsActionsCopy["form"];
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (values: StudentEditFormValues) => void;
};

function StudentEditModal({ student, copy, isOpen, isSaving, onClose, onSubmit }: StudentEditModalProps) {
  const schema = useMemo(() => buildStudentEditSchema(copy), [copy]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentEditFormValues>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultFormValues(student),
  });

  useEffect(() => {
    reset(getDefaultFormValues(student));
  }, [reset, student]);

  useEffect(() => {
    if (!isOpen) {
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
  }, [isOpen, isSaving, onClose]);

  if (!isOpen || !student) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label={copy.cancelLabel}
        onClick={onClose}
        disabled={isSaving}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative z-[66] max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-white/15 bg-surface p-5 shadow-2xl md:p-6">
        <h2 className="font-heading text-2xl font-semibold text-foreground">{copy.modalTitle}</h2>
        <p className="mt-2 text-sm text-ink-muted">{copy.modalDescription}</p>

        <form
          className="mt-5 space-y-4"
          onSubmit={handleSubmit((values) => {
            onSubmit(values);
          })}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm text-ink-muted">
              <span>{copy.firstNameLabel}</span>
              <input
                type="text"
                autoComplete="given-name"
                {...register("firstName")}
                className="k-focus-ring w-full rounded-lg border border-white/15 bg-surface-strong/50 px-3 py-2 text-sm text-foreground"
              />
              {errors.firstName ? (
                <span className="text-xs text-rose-200">{errors.firstName.message}</span>
              ) : null}
            </label>

            <label className="space-y-1 text-sm text-ink-muted">
              <span>{copy.lastNameLabel}</span>
              <input
                type="text"
                autoComplete="family-name"
                {...register("lastName")}
                className="k-focus-ring w-full rounded-lg border border-white/15 bg-surface-strong/50 px-3 py-2 text-sm text-foreground"
              />
              {errors.lastName ? (
                <span className="text-xs text-rose-200">{errors.lastName.message}</span>
              ) : null}
            </label>

            <label className="space-y-1 text-sm text-ink-muted">
              <span>{copy.phoneLabel}</span>
              <input
                type="text"
                autoComplete="tel"
                {...register("phone")}
                className="k-focus-ring w-full rounded-lg border border-white/15 bg-surface-strong/50 px-3 py-2 text-sm text-foreground"
              />
            </label>

            <label className="space-y-1 text-sm text-ink-muted">
              <span>{copy.schoolCourseLabel}</span>
              <input
                type="text"
                {...register("schoolCourse")}
                className="k-focus-ring w-full rounded-lg border border-white/15 bg-surface-strong/50 px-3 py-2 text-sm text-foreground"
              />
            </label>

            <label className="space-y-1 text-sm text-ink-muted md:col-span-2">
              <span>{copy.addressLabel}</span>
              <textarea
                rows={2}
                autoComplete="street-address"
                {...register("address")}
                className="k-focus-ring w-full rounded-lg border border-white/15 bg-surface-strong/50 px-3 py-2 text-sm text-foreground"
              />
            </label>

            <label className="space-y-1 text-sm text-ink-muted">
              <span>{copy.schoolNameLabel}</span>
              <input
                type="text"
                {...register("schoolName")}
                className="k-focus-ring w-full rounded-lg border border-white/15 bg-surface-strong/50 px-3 py-2 text-sm text-foreground"
              />
            </label>

            <label className="space-y-1 text-sm text-ink-muted">
              <span>{copy.sportsCenterMemberCodeLabel}</span>
              <input
                type="text"
                {...register("sportsCenterMemberCode")}
                className="k-focus-ring w-full rounded-lg border border-white/15 bg-surface-strong/50 px-3 py-2 text-sm text-foreground"
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input
              type="checkbox"
              {...register("isActive")}
              className="k-focus-ring h-4 w-4 rounded border border-white/20 bg-surface-strong/50"
            />
            <span>{copy.isActiveLabel}</span>
          </label>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="k-focus-ring rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              {copy.cancelLabel}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="k-focus-ring rounded-lg border border-brand-emphasis/40 bg-brand-emphasis/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-brand-emphasis disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? copy.savingLabel : copy.saveLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
