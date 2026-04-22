"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SmartImage } from "@/components/smart-image";

type CoachProfileCardProps = {
  locale: string;
  siteName: string;
  coach: {
    name: string;
    profile: string;
    focus: string;
    experience: string;
    disciplines?: Array<{
      name: string;
      summary?: string;
      details: string[];
    }>;
  };
  photoSrc: string;
  fallbackSrc: string;
};

const teacherTitleCatalog = [
  {
    eu: "Maisu entrenatzaile nazionala",
    es: "Maestro entrenador nacional",
    variants: ["Maisu entrenatzaile nazionala", "Maestro entrenador nacional"],
  },
  {
    eu: "Monitore Autonomikoa",
    es: "Monitor autonomico",
    variants: ["Monitore Autonomikoa", "Monitor autonomico"],
  },
  {
    eu: "Monitore irakaslea",
    es: "Monitor titulado",
    variants: ["Monitore irakaslea", "Monitor titulado", "Monitor titulada"],
  },
] as const;

function normalizeText(value: string) {
  return value.toLocaleLowerCase();
}

function containsAnyVariant(value: string, variants: ReadonlyArray<string>) {
  const normalizedValue = normalizeText(value);
  return variants.some((variant) => normalizedValue.includes(normalizeText(variant)));
}

function isTeacherTitleDetail(value: string) {
  return teacherTitleCatalog.some((title) => containsAnyVariant(value, title.variants));
}

function getTeacherTitles(values: string[], locale: string) {
  const labels = teacherTitleCatalog
    .filter((title) => values.some((value) => containsAnyVariant(value, title.variants)))
    .map((title) => (locale === "eu" ? title.eu : title.es));

  return Array.from(new Set(labels));
}

function splitDetails(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getValidDisciplines(
  disciplines: CoachProfileCardProps["coach"]["disciplines"],
): Array<{ name: string; summary?: string; details: string[] }> {
  if (!disciplines) {
    return [];
  }

  return disciplines
    .map((discipline) => {
      const details = discipline.details.map((item) => item.trim()).filter(Boolean);
      return {
        ...discipline,
        details,
      };
    })
    .filter((discipline) => discipline.name.trim().length > 0 && discipline.details.length > 0);
}

export function CoachProfileCard({ locale, siteName, coach, photoSrc, fallbackSrc }: CoachProfileCardProps) {
  const [modalMounted, setModalMounted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [activeDisciplineIndex, setActiveDisciplineIndex] = useState(0);
  const isEu = locale === "eu";
  const focusParts = splitDetails(coach.focus);
  const beltGrade = focusParts[0] ?? coach.focus;
  const focusExtras = focusParts.slice(1);
  const accreditationParts = splitDetails(coach.experience);
  const credentialSource = [...focusExtras, ...accreditationParts];
  const teacherTitles = getTeacherTitles(credentialSource, locale);
  const accreditationDetails = credentialSource.filter((item) => !isTeacherTitleDetail(item));
  const disciplineEntries = getValidDisciplines(coach.disciplines);
  const hasDisciplineTabs = disciplineEntries.length > 0;
  const activeDiscipline = disciplineEntries[activeDisciplineIndex] ?? disciplineEntries[0];
  const coachId = coach.name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-");

  const roleLabel = isEu ? "Rola" : "Rol";
  const beltLabel = isEu ? "Gerriko maila" : "Grado de cinturon";
  const focusLabel = isEu ? "Irakasle titulua" : "Titulo de entrenador";
  const accreditationLabel = isEu ? "Aitorpenak" : "Acreditaciones";
  const disciplinesLabel = isEu ? "Diziplinak" : "Disciplinas";
  const disciplineDetailsLabel = isEu ? "Diziplinaren fitxa" : "Ficha de la disciplina";
  const detailPreview = hasDisciplineTabs
    ? (disciplineEntries[0]?.summary ?? disciplineEntries[0]?.details[0] ?? coach.experience)
    : (focusExtras[0] ?? coach.experience);

  const openModal = () => {
    setModalMounted(true);
    window.requestAnimationFrame(() => {
      setModalVisible(true);
    });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!modalMounted) {
      return;
    }

    setActiveDisciplineIndex(0);
  }, [coach.name, modalMounted]);

  useEffect(() => {
    if (!modalMounted) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [modalMounted]);

  useEffect(() => {
    if (!modalMounted || modalVisible) {
      return;
    }

    const unmountTimer = window.setTimeout(() => {
      setModalMounted(false);
    }, 420);

    return () => {
      window.clearTimeout(unmountTimer);
    };
  }, [modalMounted, modalVisible]);

  const modal = modalMounted ? (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto p-3 md:p-4 transition-[background-color,backdrop-filter] duration-500 ease-out ${
        modalVisible ? "bg-black/75 backdrop-blur-md" : "bg-black/0 backdrop-blur-none"
      }`}
    >
      <button
        type="button"
        aria-label={isEu ? "Itxi" : "Cerrar"}
        className={`absolute inset-0 cursor-default transition-opacity duration-500 ${modalVisible ? "opacity-100" : "opacity-0"}`}
        onClick={closeModal}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label={isEu ? `${coach.name} fitxa` : `Ficha de ${coach.name}`}
        className={`relative z-10 grid w-full max-w-xl grid-rows-[240px_minmax(0,1fr)] overflow-hidden rounded-[1.8rem] border border-border-default bg-[#101316] shadow-[0_24px_60px_rgba(0,0,0,0.55)] max-h-[calc(100svh-1.5rem)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:max-h-[88svh] md:grid-rows-[250px_minmax(0,1fr)] ${
          modalVisible
            ? "translate-y-0 scale-100 opacity-100 rotate-0"
            : "translate-y-10 scale-90 opacity-0 -rotate-1"
        }`}
      >
        <div className="relative h-full overflow-hidden border-b border-border-subtle">
              <div
                className={`pointer-events-none absolute -left-24 -right-24 -top-28 h-44 rotate-6 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ${
                  modalVisible ? "translate-y-0" : "-translate-y-20"
                }`}
              />
              <SmartImage
                src={photoSrc}
                fallbackSrc={fallbackSrc}
                alt={coach.name}
                fill
                className={`object-cover transition-transform duration-700 ${modalVisible ? "scale-100" : "scale-110"}`}
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.15em] text-brand-emphasis transition-all duration-500 ${
                    modalVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                  style={{ transitionDelay: modalVisible ? "110ms" : "0ms" }}
                >
                  Kodaore
                </p>
                <h3
                  className={`mt-1 font-heading text-3xl font-semibold text-white transition-all duration-500 ${
                    modalVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                  style={{ transitionDelay: modalVisible ? "170ms" : "0ms" }}
                >
                  {coach.name}
                </h3>
              </div>
            </div>

        <div className="min-h-0 space-y-4 overflow-y-auto p-5 md:p-6">
              <article
                className={`rounded-xl border border-border-subtle bg-surface-subtle p-4 transition-all duration-500 ${
                  modalVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: modalVisible ? "190ms" : "0ms" }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-emphasis">{roleLabel}</p>
                <p className="mt-1 text-sm text-foreground">{coach.profile}</p>
              </article>

              <article
                className={`rounded-xl border border-brand/25 bg-gradient-to-br from-brand-subtle via-surface-subtle to-accent-subtle p-4 transition-all duration-500 ${
                  modalVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: modalVisible ? "250ms" : "0ms" }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-emphasis">{beltLabel}</p>
                <p className="mt-2 font-heading text-3xl font-semibold text-white">{beltGrade}</p>
              </article>

              {hasDisciplineTabs ? (
                <article
                  className={`rounded-xl border border-border-subtle bg-surface-subtle p-3 transition-all duration-500 ${
                    modalVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                  style={{ transitionDelay: modalVisible ? "310ms" : "0ms" }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-emphasis">{disciplinesLabel}</p>
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={disciplinesLabel}>
                    {disciplineEntries.map((discipline, index) => {
                      const isActive = index === activeDisciplineIndex;
                      const panelId = `discipline-panel-${coachId}-${index}`;
                      const tabId = `discipline-tab-${coachId}-${index}`;

                      return (
                        <button
                          key={`${discipline.name}-${index}`}
                          type="button"
                          role="tab"
                          id={tabId}
                          aria-controls={panelId}
                          aria-selected={isActive}
                          onClick={() => setActiveDisciplineIndex(index)}
                          className={`k-focus-ring shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.11em] transition-colors ${
                            isActive
                              ? "border-brand/65 bg-brand-subtle text-brand-emphasis"
                              : "border-border-default bg-surface-subtle text-ink-secondary hover:border-brand/45"
                          }`}
                        >
                          {discipline.name}
                        </button>
                      );
                    })}
                  </div>
                </article>

              ) : (
                <>
                  <article
                    className={`rounded-xl border border-border-subtle bg-surface-subtle p-3 transition-all duration-500 ${
                      modalVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                    }`}
                    style={{ transitionDelay: modalVisible ? "310ms" : "0ms" }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-emphasis">{focusLabel}</p>
                    <ul className="mt-2 space-y-2">
                      {teacherTitles.length > 0 ? (
                        teacherTitles.map((item) => (
                          <li key={item} className="rounded-lg border border-border-subtle bg-surface-subtle px-3 py-2 text-sm text-ink-primary">
                            {item}
                          </li>
                        ))
                      ) : (
                        <li className="rounded-lg border border-border-subtle bg-surface-subtle px-3 py-2 text-sm text-ink-primary">
                          {isEu ? "Titulurik gabe" : "Sin titulo"}
                        </li>
                      )}
                    </ul>
                  </article>

                  {accreditationDetails.length > 0 ? (
                    <article
                      className={`rounded-xl border border-border-subtle bg-surface-subtle p-3 transition-all duration-500 ${
                        modalVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                      }`}
                      style={{ transitionDelay: modalVisible ? "350ms" : "0ms" }}
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-emphasis">{accreditationLabel}</p>
                      <ul className="mt-2 space-y-2">
                        {accreditationDetails.map((item) => (
                          <li key={item} className="rounded-lg border border-border-subtle bg-surface-subtle px-3 py-2 text-sm text-ink-primary">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ) : null}
                </>
              )}

              {hasDisciplineTabs && activeDiscipline ? (
                <article
                  role="tabpanel"
                  id={`discipline-panel-${coachId}-${activeDisciplineIndex}`}
                  aria-labelledby={`discipline-tab-${coachId}-${activeDisciplineIndex}`}
                  className={`rounded-xl border border-border-subtle bg-surface-subtle p-3 transition-all duration-500 ${
                    modalVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                  style={{ transitionDelay: modalVisible ? "350ms" : "0ms" }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-emphasis">{disciplineDetailsLabel}</p>
                  {activeDiscipline.summary ? <p className="mt-2 text-sm text-ink-primary">{activeDiscipline.summary}</p> : null}
                  <ul className="mt-2 space-y-2">
                    {activeDiscipline.details.map((item) => (
                      <li key={item} className="rounded-lg border border-border-subtle bg-surface-subtle px-3 py-2 text-sm text-ink-primary">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ) : null}

              <div
                className={`flex justify-end transition-all duration-500 ${
                  modalVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
                style={{ transitionDelay: modalVisible ? "350ms" : "0ms" }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex items-center justify-center rounded-full border border-border-default bg-surface-subtle px-4 py-2 text-xs font-semibold uppercase tracking-[0.13em] text-ink-primary transition-[transform,background-color,border-color,box-shadow,color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-brand/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:hover:translate-y-0"
                >
                  {isEu ? "Itxi" : "Cerrar"}
                </button>
              </div>
        </div>
      </section>
    </div>
  ) : null;

  return (
    <>
      <article className="group relative overflow-hidden rounded-[1.6rem] border border-border-subtle bg-gradient-to-b from-surface-strong to-surface/80 transition-[transform,box-shadow,border-color,background-color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-border-default hover:shadow-md motion-reduce:transform-none motion-reduce:transition-[box-shadow,border-color,background-color]">
        <div className="relative min-h-[220px] overflow-hidden">
          <SmartImage
            src={photoSrc}
            fallbackSrc={fallbackSrc}
            alt={coach.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <p className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/45 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/95">
            {siteName}
          </p>
        </div>

        <div className="relative space-y-2 px-5 pb-5 pt-4">
          <h3 className="font-heading text-xl font-semibold text-foreground">{coach.name}</h3>
          <p className="text-sm text-brand-emphasis">{coach.profile}</p>
          <p className="inline-flex rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-xs font-semibold tracking-[0.08em] text-brand-emphasis">
            {beltGrade}
          </p>
          <p className="text-sm leading-relaxed text-ink-muted">{detailPreview}</p>
          <button
            type="button"
            onClick={openModal}
            className="mt-3 inline-flex rounded-full border border-brand/35 bg-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-emphasis transition-[transform,background-color,border-color,box-shadow,color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-brand/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:hover:translate-y-0"
          >
            {isEu ? "Fitxa ireki" : "Abrir ficha"}
          </button>
        </div>
      </article>

      {portalReady && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
