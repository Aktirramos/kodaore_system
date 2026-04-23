import clsx from "clsx";

type TatamiDividerProps = {
  className?: string;
  /** Etiqueta opcional para lectores de pantalla (si la hay, role=separator). */
  ariaLabel?: string;
};

/**
 * Separador tatami: banda horizontal con estriado que evoca la trama de
 * una estera. Usa currentColor para que el contexto CSS defina el tono
 * (ink-secondary por defecto en el CSS consumidor).
 *
 * Usa role=presentation cuando es puramente decorativo. Si se pasa
 * ariaLabel se promueve a role=separator.
 */
export function TatamiDivider({ className, ariaLabel }: TatamiDividerProps) {
  const a11yProps = ariaLabel
    ? ({ role: "separator", "aria-label": ariaLabel } as const)
    : ({ role: "presentation", "aria-hidden": true } as const);

  return (
    <div {...a11yProps} className={clsx("relative h-8 w-full text-ink-secondary", className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 480 32"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <line x1="0" y1="4" x2="480" y2="4" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3"/>
        <line x1="0" y1="28" x2="480" y2="28" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3"/>
        <g stroke="currentColor" strokeOpacity="0.14" strokeWidth="0.9">
          <line x1="0" y1="9" x2="480" y2="9"/>
          <line x1="0" y1="13" x2="480" y2="13"/>
          <line x1="0" y1="17" x2="480" y2="17"/>
          <line x1="0" y1="21" x2="480" y2="21"/>
          <line x1="0" y1="25" x2="480" y2="25"/>
        </g>
        <g stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.8" strokeDasharray="3 7">
          <line x1="0" y1="11" x2="480" y2="11"/>
          <line x1="0" y1="15" x2="480" y2="15"/>
          <line x1="0" y1="19" x2="480" y2="19"/>
          <line x1="0" y1="23" x2="480" y2="23"/>
        </g>
      </svg>
    </div>
  );
}
