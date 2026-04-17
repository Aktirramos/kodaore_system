"use client";

import { useEffect, useState } from "react";
import { SmartImage } from "@/components/smart-image";

type CoachProfileCardProps = {
  locale: string;
  siteName: string;
  coach: {
    name: string;
    profile: string;
    focus: string;
    experience: string;
  };
  photoSrc: string;
  fallbackSrc: string;
};

export function CoachProfileCard({ locale, siteName, coach, photoSrc, fallbackSrc }: CoachProfileCardProps) {
  const [modalMounted, setModalMounted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const isEu = locale === "eu";

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

  return (
    <>
      <article className="k-hover-lift group overflow-hidden rounded-[1.6rem] border border-white/8 bg-gradient-to-b from-surface-strong to-surface/80">
        <div className="relative min-h-[220px] overflow-hidden">
          <SmartImage
            src={photoSrc}
            fallbackSrc={fallbackSrc}
            alt={coach.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
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
          <p className="text-sm leading-relaxed text-ink-muted">{coach.focus}</p>
          <button
            type="button"
            onClick={openModal}
            className="k-focus-ring k-hover-action mt-3 inline-flex rounded-full border border-brand/35 bg-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-emphasis hover:border-brand/60"
          >
            {isEu ? "Fitxa ireki" : "Abrir ficha"}
          </button>
        </div>
      </article>

      {modalMounted ? (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-[background-color,backdrop-filter] duration-500 ease-out ${
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
            className={`relative z-10 w-full max-w-2xl overflow-hidden rounded-[1.8rem] border border-white/20 bg-[#101316] shadow-[0_24px_60px_rgba(0,0,0,0.55)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              modalVisible
                ? "translate-y-0 scale-100 opacity-100 rotate-0"
                : "translate-y-10 scale-90 opacity-0 -rotate-1"
            }`}
          >
            <div className="relative min-h-[220px] overflow-hidden border-b border-white/10">
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

            <div className="space-y-4 p-5 md:p-6">
              <div className="grid gap-3 md:grid-cols-3">
                <article
                  className={`rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all duration-500 ${
                    modalVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                  style={{ transitionDelay: modalVisible ? "190ms" : "0ms" }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-emphasis">
                    {isEu ? "Rola" : "Rol"}
                  </p>
                  <p className="mt-1 text-sm text-foreground">{coach.profile}</p>
                </article>

                <article
                  className={`rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all duration-500 ${
                    modalVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                  style={{ transitionDelay: modalVisible ? "250ms" : "0ms" }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-emphasis">
                    {isEu ? "Graduazioa" : "Graduacion"}
                  </p>
                  <p className="mt-1 text-sm text-foreground">{coach.focus}</p>
                </article>

                <article
                  className={`rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all duration-500 ${
                    modalVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                  style={{ transitionDelay: modalVisible ? "310ms" : "0ms" }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-emphasis">
                    {isEu ? "Aitorpenak" : "Acreditaciones"}
                  </p>
                  <p className="mt-1 text-sm text-foreground">{coach.experience}</p>
                </article>
              </div>

              <div
                className={`flex justify-end transition-all duration-500 ${
                  modalVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
                style={{ transitionDelay: modalVisible ? "350ms" : "0ms" }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  className="k-focus-ring k-hover-action rounded-full border border-white/20 bg-black/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.13em] text-white/90 hover:border-brand/45"
                >
                  {isEu ? "Itxi" : "Cerrar"}
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
