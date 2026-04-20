import { notFound } from "next/navigation";
import { AdminGroupsActionsTable } from "@/components/admin-groups-actions-table";
import { ADMIN_ROLE_CODES, requireAuth } from "@/lib/auth";
import { createAdminGroupAction, getAdminGroupsData, updateAdminGroupAction } from "@/lib/admin";
import { isLocale } from "@/lib/i18n";

type AdminGroupsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminGroupsPage({ params }: AdminGroupsPageProps) {
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
  const data = await getAdminGroupsData();
  const copy = isEu
    ? {
        form: {
          addGroupLabel: "Taldea gehitu",
          createModalTitle: "Talde berria sortu",
          createModalDescription: "Bete taldearen oinarrizko datuak eta esleitu arduraduna.",
          editModalTitle: "Taldea editatu",
          editModalDescription: "Eguneratu taldearen izena, maila, edukiera eta arduraduna.",
          nameLabel: "Izena",
          levelLabel: "Maila",
          capacityLabel: "Edukiera",
          siteLabel: "Egoitza",
          leadTeacherLabel: "Arduraduna",
          noneTeacherLabel: "Arduradunik gabe",
          isActiveLabel: "Aktibo gisa mantendu",
          createLabel: "Taldea sortu",
          creatingLabel: "Sortzen...",
          saveLabel: "Gorde aldaketak",
          savingLabel: "Gordetzen...",
          cancelLabel: "Utzi",
          createdSuffix: "sortu da.",
          updatedSuffix: "eguneratu da.",
          createErrorFallback: "Ezin izan da taldea sortu.",
          updateErrorFallback: "Ezin izan da taldea eguneratu.",
          requiredName: "Taldearen izena derrigorrezkoa da.",
          requiredCapacity: "Edukierak 1 baino handiagoa izan behar du.",
        },
      }
    : {
        form: {
          addGroupLabel: "Anadir grupo",
          createModalTitle: "Crear nuevo grupo",
          createModalDescription: "Completa los datos basicos del grupo y asigna responsable.",
          editModalTitle: "Editar grupo",
          editModalDescription: "Actualiza nombre, nivel, capacidad y profesor asignado.",
          nameLabel: "Nombre",
          levelLabel: "Nivel",
          capacityLabel: "Capacidad",
          siteLabel: "Sede",
          leadTeacherLabel: "Responsable",
          noneTeacherLabel: "Sin responsable",
          isActiveLabel: "Mantener como activo",
          createLabel: "Crear grupo",
          creatingLabel: "Creando...",
          saveLabel: "Guardar cambios",
          savingLabel: "Guardando...",
          cancelLabel: "Cancelar",
          createdSuffix: "se ha creado.",
          updatedSuffix: "se ha actualizado.",
          createErrorFallback: "No se ha podido crear el grupo.",
          updateErrorFallback: "No se ha podido actualizar el grupo.",
          requiredName: "El nombre del grupo es obligatorio.",
          requiredCapacity: "La capacidad debe ser mayor que 0.",
        },
      };

  return (
    <div className="space-y-6">
      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">
          {isEu ? "Kudeaketa" : "Gestion"}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {isEu ? "Taldeen administrazioa" : "Administracion de grupos"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted md:text-base">
          {isEu
            ? "Talde aktiboen edukiera, arduradunak eta hurrengo saioak kontrolatu."
            : "Controla la capacidad de grupos, responsables y proximas sesiones."}
        </p>
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-3">
        <StatCard label={isEu ? "Talde aktiboak" : "Grupos activos"} value={String(data.totals.activeGroups)} />
        <StatCard label={isEu ? "Edukiera osoa" : "Capacidad total"} value={String(data.totals.totalCapacity)} />
        <StatCard label={isEu ? "7 eguneko saioak" : "Sesiones 7 dias"} value={String(data.totals.next7DaysSessions)} />
      </section>

      <AdminGroupsActionsTable
        locale={locale}
        groups={data.groups}
        availableSites={data.availableSites}
        availableTeachers={data.availableTeachers}
        copy={copy}
        createGroupAction={createAdminGroupAction}
        updateGroupAction={updateAdminGroupAction}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="k-hover-lift rounded-2xl border border-white/10 bg-surface p-5">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-1 font-heading text-3xl font-semibold text-foreground">{value}</p>
    </article>
  );
}

