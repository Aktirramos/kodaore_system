"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ActionToast } from "@/components/action-toast";
import type { CreateAdminGroupInput, UpdateAdminGroupInput } from "@/lib/admin";
import type { LocaleCode } from "@/lib/i18n";

type AdminGroupRow = {
  id: string;
  name: string;
  level: string | null;
  siteId: string;
  siteName: string;
  capacity: number;
  leadTeacherId: string | null;
  leadTeacherName: string | null;
  isActive: boolean;
  nextSessionAt: Date | null;
};

type AdminSiteOption = {
  id: string;
  name: string;
};

type AdminTeacherOption = {
  id: string;
  fullName: string;
  siteId: string;
  siteName: string;
};

export type AdminGroupsActionsCopy = {
  form: {
    addGroupLabel: string;
    createModalTitle: string;
    createModalDescription: string;
    editModalTitle: string;
    editModalDescription: string;
    nameLabel: string;
    levelLabel: string;
    capacityLabel: string;
    siteLabel: string;
    leadTeacherLabel: string;
    noneTeacherLabel: string;
    isActiveLabel: string;
    createLabel: string;
    creatingLabel: string;
    saveLabel: string;
    savingLabel: string;
    cancelLabel: string;
    createdSuffix: string;
    updatedSuffix: string;
    createErrorFallback: string;
    updateErrorFallback: string;
    requiredName: string;
    requiredCapacity: string;
  };
};

type AdminGroupsActionsTableProps = {
  locale: LocaleCode;
  groups: AdminGroupRow[];
  availableSites: AdminSiteOption[];
  availableTeachers: AdminTeacherOption[];
  copy: AdminGroupsActionsCopy;
  createGroupAction: (input: CreateAdminGroupInput) => Promise<unknown>;
  updateGroupAction: (groupId: string, input: UpdateAdminGroupInput) => Promise<unknown>;
};

type ToastState = {
  message: string;
  variant: "success" | "error";
};

type GroupFormValues = {
  name: string;
  level: string;
  capacity: number;
  siteId: string;
  leadTeacherId: string;
  isActive: boolean;
};

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
}

function buildGroupSchema(copy: AdminGroupsActionsCopy["form"]) {
  return z.object({
    name: z.string().trim().min(1, copy.requiredName),
    level: z.string(),
    capacity: z.number().int().min(1, copy.requiredCapacity),
    siteId: z.string().trim().min(1),
    leadTeacherId: z.string(),
    isActive: z.boolean(),
  });
}

function normalizeOptionalInput(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getDefaultCreateValues(defaultSiteId: string): GroupFormValues {
  return {
    name: "",
    level: "",
    capacity: 10,
    siteId: defaultSiteId,
    leadTeacherId: "",
    isActive: true,
  };
}

function getDefaultEditValues(group: AdminGroupRow | null): GroupFormValues {
  return {
    name: group?.name ?? "",
    level: group?.level ?? "",
    capacity: group?.capacity ?? 10,
    siteId: group?.siteId ?? "",
    leadTeacherId: group?.leadTeacherId ?? "",
    isActive: group?.isActive ?? true,
  };
}

export function AdminGroupsActionsTable({
  locale,
  groups,
  availableSites,
  availableTeachers,
  copy,
  createGroupAction,
  updateGroupAction,
}: AdminGroupsActionsTableProps) {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AdminGroupRow | null>(null);
  const [isPending, startTransition] = useTransition();

  const isEu = locale === "eu";
  const noDataMessage = isEu ? "Ez dago talde aktiborik une honetan." : "No hay grupos activos en este momento.";
  const actionsLabel = isEu ? "Ekintzak" : "Acciones";
  const editLabel = isEu ? "Editatu" : "Editar";
  const closeToastLabel = isEu ? "Itxi" : "Cerrar";
  const firstAvailableSiteId = availableSites[0]?.id ?? "";

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

  const handleCreate = (values: GroupFormValues) => {
    const payload: CreateAdminGroupInput = {
      name: values.name.trim(),
      level: normalizeOptionalInput(values.level),
      capacity: values.capacity,
      siteId: values.siteId,
      leadTeacherId: normalizeOptionalInput(values.leadTeacherId),
      isActive: values.isActive,
    };

    runAction(
      "create",
      () => createGroupAction(payload),
      `"${payload.name}" ${copy.form.createdSuffix}`,
      copy.form.createErrorFallback,
      {
        onSuccess: () => setIsCreateModalOpen(false),
      },
    );
  };

  const handleUpdate = (group: AdminGroupRow, values: GroupFormValues) => {
    const payload: UpdateAdminGroupInput = {
      name: values.name.trim(),
      level: normalizeOptionalInput(values.level),
      capacity: values.capacity,
      siteId: values.siteId,
      leadTeacherId: normalizeOptionalInput(values.leadTeacherId),
      isActive: values.isActive,
    };

    runAction(
      `edit:${group.id}`,
      () => updateGroupAction(group.id, payload),
      `"${payload.name}" ${copy.form.updatedSuffix}`,
      copy.form.updateErrorFallback,
      {
        onSuccess: () => setEditingGroup(null),
      },
    );
  };

  const createPending = isPending && pendingActionId === "create";
  const editActionId = editingGroup ? `edit:${editingGroup.id}` : null;
  const editPending = Boolean(editActionId && isPending && pendingActionId === editActionId);

  return (
    <>
      <div className="fade-rise flex justify-end">
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="k-focus-ring rounded-lg border border-brand-emphasis/40 bg-brand-emphasis/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-brand-emphasis hover:bg-brand-emphasis/25"
        >
          {copy.form.addGroupLabel}
        </button>
      </div>

      <section className="fade-rise overflow-hidden rounded-2xl border border-white/10 bg-surface">
        <div className="space-y-3 p-4 md:hidden">
          {groups.length === 0 ? (
            <article className="rounded-xl border border-white/10 bg-surface-strong/40 p-4 text-sm text-ink-muted">
              {noDataMessage}
            </article>
          ) : (
            groups.map((group) => (
              <article key={group.id} className="rounded-xl border border-white/10 bg-surface-strong/40 p-4">
                <h2 className="font-semibold text-foreground">{group.name}</h2>
                <div className="mt-2 space-y-1 text-sm text-ink-muted">
                  <p>
                    {copy.form.siteLabel}: {group.siteName}
                  </p>
                  <p>
                    {copy.form.levelLabel}: {group.level ?? "-"}
                  </p>
                  <p>
                    {copy.form.capacityLabel}: {group.capacity}
                  </p>
                  <p>
                    {copy.form.leadTeacherLabel}: {group.leadTeacherName ?? "-"}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingGroup(group)}
                    disabled={isPending}
                    className="k-focus-ring rounded-lg border border-sky-300/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {editLabel}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                {isEu ? "Taldeen administrazio taula" : "Tabla de administracion de grupos"}
              </caption>
              <thead className="bg-surface-strong/70 text-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">{isEu ? "Taldea" : "Grupo"}</th>
                  <th className="px-4 py-3 font-semibold">{copy.form.siteLabel}</th>
                  <th className="px-4 py-3 font-semibold">{copy.form.levelLabel}</th>
                  <th className="px-4 py-3 font-semibold">{copy.form.capacityLabel}</th>
                  <th className="px-4 py-3 font-semibold">{copy.form.leadTeacherLabel}</th>
                  <th className="px-4 py-3 font-semibold">{isEu ? "Hurrengo saioa" : "Proxima sesion"}</th>
                  <th className="px-4 py-3 font-semibold">{actionsLabel}</th>
                </tr>
              </thead>
              <tbody>
                {groups.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-ink-muted" colSpan={7}>
                      {noDataMessage}
                    </td>
                  </tr>
                ) : (
                  groups.map((group) => {
                    const rowPending = isPending && pendingActionId === `edit:${group.id}`;

                    return (
                      <tr
                        key={group.id}
                        className="border-t border-white/10 transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-surface-subtle"
                      >
                        <td className="px-4 py-3 font-medium text-foreground">{group.name}</td>
                        <td className="px-4 py-3 text-ink-muted">{group.siteName}</td>
                        <td className="px-4 py-3 text-ink-muted">{group.level ?? "-"}</td>
                        <td className="px-4 py-3 text-ink-muted">{group.capacity}</td>
                        <td className="px-4 py-3 text-ink-muted">{group.leadTeacherName ?? "-"}</td>
                        <td className="px-4 py-3 text-ink-muted">
                          {group.nextSessionAt ? formatDateTime(group.nextSessionAt, locale) : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setEditingGroup(group)}
                            disabled={rowPending}
                            className="k-focus-ring rounded-md border border-sky-300/30 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {editLabel}
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

      <GroupModal
        mode="create"
        isOpen={isCreateModalOpen}
        isPending={createPending}
        defaultSiteId={firstAvailableSiteId}
        group={null}
        availableSites={availableSites}
        availableTeachers={availableTeachers}
        copy={copy.form}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
      />

      <GroupModal
        mode="edit"
        isOpen={Boolean(editingGroup)}
        isPending={editPending}
        defaultSiteId={firstAvailableSiteId}
        group={editingGroup}
        availableSites={availableSites}
        availableTeachers={availableTeachers}
        copy={copy.form}
        onClose={() => setEditingGroup(null)}
        onSubmit={(values) => {
          if (!editingGroup) {
            return;
          }

          handleUpdate(editingGroup, values);
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

type GroupModalProps = {
  mode: "create" | "edit";
  isOpen: boolean;
  isPending: boolean;
  defaultSiteId: string;
  group: AdminGroupRow | null;
  availableSites: AdminSiteOption[];
  availableTeachers: AdminTeacherOption[];
  copy: AdminGroupsActionsCopy["form"];
  onClose: () => void;
  onSubmit: (values: GroupFormValues) => void;
};

function GroupModal({
  mode,
  isOpen,
  isPending,
  defaultSiteId,
  group,
  availableSites,
  availableTeachers,
  copy,
  onClose,
  onSubmit,
}: GroupModalProps) {
  const schema = useMemo(() => buildGroupSchema(copy), [copy]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: mode === "create" ? getDefaultCreateValues(defaultSiteId) : getDefaultEditValues(group),
  });

  const selectedSiteId = watch("siteId");

  const teacherOptions = useMemo(() => {
    return availableTeachers.filter((teacher) => teacher.siteId === selectedSiteId);
  }, [availableTeachers, selectedSiteId]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === "create") {
      reset(getDefaultCreateValues(defaultSiteId));
      return;
    }

    reset(getDefaultEditValues(group));
  }, [defaultSiteId, group, isOpen, mode, reset]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isPending, onClose]);

  if (!isOpen) {
    return null;
  }

  const title = mode === "create" ? copy.createModalTitle : copy.editModalTitle;
  const description = mode === "create" ? copy.createModalDescription : copy.editModalDescription;

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label={copy.cancelLabel}
        onClick={onClose}
        disabled={isPending}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative z-[66] max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-white/15 bg-surface p-5 shadow-2xl md:p-6">
        <h2 className="font-heading text-2xl font-semibold text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-ink-muted">{description}</p>

        <form
          className="mt-5 space-y-4"
          onSubmit={handleSubmit((values) => {
            onSubmit(values);
          })}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm text-ink-muted md:col-span-2">
              <span>{copy.nameLabel}</span>
              <input
                type="text"
                {...register("name")}
                className="k-focus-ring w-full rounded-lg border border-white/15 bg-surface-strong/50 px-3 py-2 text-sm text-foreground"
              />
              {errors.name ? <span className="text-xs text-rose-200">{errors.name.message}</span> : null}
            </label>

            <label className="space-y-1 text-sm text-ink-muted">
              <span>{copy.levelLabel}</span>
              <input
                type="text"
                {...register("level")}
                className="k-focus-ring w-full rounded-lg border border-white/15 bg-surface-strong/50 px-3 py-2 text-sm text-foreground"
              />
            </label>

            <label className="space-y-1 text-sm text-ink-muted">
              <span>{copy.capacityLabel}</span>
              <input
                type="number"
                min={1}
                {...register("capacity", { valueAsNumber: true })}
                className="k-focus-ring w-full rounded-lg border border-white/15 bg-surface-strong/50 px-3 py-2 text-sm text-foreground"
              />
              {errors.capacity ? <span className="text-xs text-rose-200">{errors.capacity.message}</span> : null}
            </label>

            <label className="space-y-1 text-sm text-ink-muted">
              <span>{copy.siteLabel}</span>
              <select
                {...register("siteId")}
                className="k-focus-ring w-full rounded-lg border border-white/15 bg-surface-strong/50 px-3 py-2 text-sm text-foreground"
              >
                {availableSites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm text-ink-muted">
              <span>{copy.leadTeacherLabel}</span>
              <select
                {...register("leadTeacherId")}
                className="k-focus-ring w-full rounded-lg border border-white/15 bg-surface-strong/50 px-3 py-2 text-sm text-foreground"
              >
                <option value="">{copy.noneTeacherLabel}</option>
                {teacherOptions.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.fullName}
                  </option>
                ))}
              </select>
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
              disabled={isPending}
              className="k-focus-ring rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              {copy.cancelLabel}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="k-focus-ring rounded-lg border border-brand-emphasis/40 bg-brand-emphasis/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-brand-emphasis disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (mode === "create" ? copy.creatingLabel : copy.savingLabel) : mode === "create" ? copy.createLabel : copy.saveLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatDateTime(value: Date, locale: LocaleCode) {
  return new Intl.DateTimeFormat(locale === "eu" ? "eu-ES" : "es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}
