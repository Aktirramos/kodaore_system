import type { AdminGroupsActionsCopy } from "@/components/admin-groups-actions-table";
import type { LocaleCode } from "@/lib/i18n";

export function getAdminGroupsActionsCopy(locale: LocaleCode): AdminGroupsActionsCopy {
  if (locale === "eu") {
    return {
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
    };
  }

  return {
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
}
