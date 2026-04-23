import { SumiStroke } from "./sumi-stroke";

/**
 * Backdrop decorativo con pinceladas sumi grandes, posicionadas fijas
 * detras del contenido. Actua como capa de ambiente "papel + tinta".
 * Decorativo (aria-hidden). No responde a interaccion.
 */
export function SumiBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none mix-blend-multiply dark:mix-blend-screen"
    >
      <SumiStroke
        width={720}
        height={72}
        className="absolute -left-16 top-[12vh] rotate-[-6deg] text-ink-primary opacity-[0.08]"
      />
      <SumiStroke
        width={500}
        height={56}
        className="absolute right-[-5rem] top-[44vh] rotate-[7deg] text-ink-primary opacity-[0.07]"
      />
      <SumiStroke
        width={640}
        height={64}
        className="absolute left-[-3rem] top-[78vh] rotate-[-2deg] text-ink-primary opacity-[0.06]"
      />
    </div>
  );
}
