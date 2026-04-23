import clsx from "clsx";

type TatamiDividerProps = {
  className?: string;
  /** Etiqueta opcional para lectores de pantalla (si la hay, role=separator). */
  ariaLabel?: string;
};

/**
 * Separador tatami: banda horizontal con estriado que evoca la trama de
 * una estera. Bordes superiores e inferiores en brand-emphasis para
 * marcar la separacion de forma clara; trama interior en ink-secondary.
 *
 * role=separator cuando se pasa ariaLabel; presentation en caso contrario.
 */
export function TatamiDivider({ className, ariaLabel }: TatamiDividerProps) {
  const a11yProps = ariaLabel
    ? ({ role: "separator", "aria-label": ariaLabel } as const)
    : ({ role: "presentation", "aria-hidden": true } as const);

  return (
    <div {...a11yProps} className={clsx("relative h-14 w-full", className)}>
      {/* Bordes enmarcando la banda en tono brand-emphasis */}
      <span className="absolute inset-x-0 top-1 block h-px bg-brand-emphasis/45" />
      <span className="absolute inset-x-0 top-2 block h-[2px] bg-brand-emphasis/25" />
      <span className="absolute inset-x-0 bottom-1 block h-px bg-brand-emphasis/45" />
      <span className="absolute inset-x-0 bottom-2 block h-[2px] bg-brand-emphasis/25" />

      {/* Trama interior */}
      <svg
        aria-hidden="true"
        viewBox="0 0 480 56"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-ink-secondary"
        fill="none"
      >
        <g stroke="currentColor" strokeOpacity="0.32" strokeWidth="1">
          <line x1="0" y1="16" x2="480" y2="16"/>
          <line x1="0" y1="22" x2="480" y2="22"/>
          <line x1="0" y1="28" x2="480" y2="28"/>
          <line x1="0" y1="34" x2="480" y2="34"/>
          <line x1="0" y1="40" x2="480" y2="40"/>
        </g>
        <g stroke="currentColor" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="3 7">
          <line x1="0" y1="19" x2="480" y2="19"/>
          <line x1="0" y1="25" x2="480" y2="25"/>
          <line x1="0" y1="31" x2="480" y2="31"/>
          <line x1="0" y1="37" x2="480" y2="37"/>
        </g>
      </svg>
    </div>
  );
}
