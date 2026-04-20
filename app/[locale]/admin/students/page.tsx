import { notFound } from "next/navigation";
import { AdminStudentsActionsTable } from "@/components/admin-students-actions-table";
import { ADMIN_ROLE_CODES, requireAuth } from "@/lib/auth";
import {
  createAdminStudentAction,
  deleteAdminStudentAction,
  getAdminStudentsData,
  updateAdminStudentAction,
} from "@/lib/admin";
import { isLocale } from "@/lib/i18n";

type AdminStudentsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminStudentsPage({ params }: AdminStudentsPageProps) {
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
  const data = await getAdminStudentsData();
  const copy = isEu
    ? {
        form: {
          addStudentLabel: "Ikaslea gehitu",
          createModalTitle: "Ikasle berria sortu",
          createModalDescription: "Sartu ikaslearen oinarrizko datuak eta esleitu egoitza.",
          familyEmailLabel: "Familiaren emaila",
          birthDateLabel: "Jaiotze data",
          mainSiteLabel: "Egoitza nagusia",
          createLabel: "Ikaslea sortu",
          creatingLabel: "Sortzen...",
          createdSuffix: "sortu da.",
          createErrorFallback: "Ezin izan da ikaslea sortu.",
          requiredFamilyEmail: "Familiaren email zuzena idatzi.",
          requiredBirthDate: "Jaiotze data derrigorrezkoa da.",
          requiredMainSite: "Egoitza bat aukeratu behar duzu.",
          noAvailableSites: "Ez dago egoitza erabilgarririk alta egiteko.",
          editLabel: "Editatu",
          modalTitle: "Ikaslearen datuak editatu",
          modalDescription: "Eguneratu ikaslearen oinarrizko informazioa.",
          firstNameLabel: "Izena",
          lastNameLabel: "Abizena",
          phoneLabel: "Telefonoa",
          addressLabel: "Helbidea",
          schoolNameLabel: "Ikastetxea",
          schoolCourseLabel: "Ikasturtea",
          sportsCenterMemberCodeLabel: "Kirol zentroko bazkide kodea",
          isActiveLabel: "Aktibo gisa mantendu",
          saveLabel: "Gorde aldaketak",
          savingLabel: "Gordetzen...",
          cancelLabel: "Utzi",
          updatedSuffix: "eguneratu da.",
          updateErrorFallback: "Ezin izan da ikaslea eguneratu.",
          requiredFirstName: "Izena derrigorrezkoa da.",
          requiredLastName: "Abizena derrigorrezkoa da.",
        },
      }
    : {
        form: {
          addStudentLabel: "Anadir alumno",
          createModalTitle: "Crear nuevo alumno",
          createModalDescription: "Introduce los datos basicos del alumno y asigna su sede.",
          familyEmailLabel: "Email de familia",
          birthDateLabel: "Fecha de nacimiento",
          mainSiteLabel: "Sede principal",
          createLabel: "Crear alumno",
          creatingLabel: "Creando...",
          createdSuffix: "se ha creado.",
          createErrorFallback: "No se ha podido crear el alumno.",
          requiredFamilyEmail: "Introduce un email de familia valido.",
          requiredBirthDate: "La fecha de nacimiento es obligatoria.",
          requiredMainSite: "Debes seleccionar una sede.",
          noAvailableSites: "No hay sedes disponibles para dar de alta.",
          editLabel: "Editar",
          modalTitle: "Editar datos del alumno",
          modalDescription: "Actualiza la informacion basica del alumno.",
          firstNameLabel: "Nombre",
          lastNameLabel: "Apellidos",
          phoneLabel: "Telefono",
          addressLabel: "Direccion",
          schoolNameLabel: "Centro escolar",
          schoolCourseLabel: "Curso escolar",
          sportsCenterMemberCodeLabel: "Codigo de socio del polideportivo",
          isActiveLabel: "Mantener como activo",
          saveLabel: "Guardar cambios",
          savingLabel: "Guardando...",
          cancelLabel: "Cancelar",
          updatedSuffix: "se ha actualizado.",
          updateErrorFallback: "No se ha podido actualizar el alumno.",
          requiredFirstName: "El nombre es obligatorio.",
          requiredLastName: "Los apellidos son obligatorios.",
        },
      };

  return (
    <div className="space-y-6">
      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">
          {isEu ? "Kudeaketa" : "Gestion"}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {isEu ? "Ikasleen administrazioa" : "Administracion de alumnos"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted md:text-base">
          {isEu
            ? "Ikasle aktiboen egoera, lotutako familiak eta matrikula aktiboak ikus ditzakezu."
            : "Consulta alumnos activos, sus familias vinculadas y el estado de matricula."}
        </p>
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-3">
        <StatCard label={isEu ? "Ikasle aktiboak" : "Alumnos activos"} value={String(data.totals.activeStudents)} />
        <StatCard label={isEu ? "Matrikula aktiboak" : "Matriculas activas"} value={String(data.totals.activeEnrollments)} />
        <StatCard label={isEu ? "Egoitza aktiboak" : "Sedes representadas"} value={String(data.totals.representedSites)} />
      </section>

      <AdminStudentsActionsTable
        locale={locale}
        availableSites={data.availableSites}
        students={data.students}
        copy={copy}
        createStudentAction={createAdminStudentAction}
        updateStudentAction={updateAdminStudentAction}
        deleteStudentAction={deleteAdminStudentAction}
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
