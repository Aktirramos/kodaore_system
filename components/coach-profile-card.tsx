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
  const [open, setOpen] = useState(false);
  const isEu = locale === "eu";

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

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
            onClick={() => setOpen(true)}
            className="k-focus-ring k-hover-action mt-3 inline-flex rounded-full border border-brand/35 bg-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-emphasis hover:border-brand/60"
          >
            {isEu ? "Fitxa ireki" : "Abrir ficha"}
          </button>
        </div>
      </article>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <button
            type="button"
            aria-label={isEu ? "Itxi" : "Cerrar"}
            className="absolute inset-0 cursor-default"
            onClick={() => setOpen(false)}
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-label={isEu ? `${coach.name} fitxa` : `Ficha de ${coach.name}`}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[1.8rem] border border-white/20 bg-[#101316] shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
          >
            <div className="relative min-h-[220px] overflow-hidden border-b border-white/10">
              <SmartImage
                src={photoSrc}
                fallbackSrc={fallbackSrc}
                alt={coach.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-emphasis">Kodaore</p>
                <h3 className="mt-1 font-heading text-3xl font-semibold text-white">{coach.name}</h3>
              </div>
            </div>

            <div className="space-y-4 p-5 md:p-6">
              <div className="grid gap-3 md:grid-cols-3">
                <article className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-emphasis">
                    {isEu ? "Rola" : "Rol"}
                  </p>
                  <p className="mt-1 text-sm text-foreground">{coach.profile}</p>
                </article>

                <article className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-emphasis">
                    {isEu ? "Graduazioa" : "Graduacion"}
                  </p>
                  <p className="mt-1 text-sm text-foreground">{coach.focus}</p>
                </article>

                <article className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-emphasis">
                    {isEu ? "Aitorpenak" : "Acreditaciones"}
                  </p>
                  <p className="mt-1 text-sm text-foreground">{coach.experience}</p>
                </article>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
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
