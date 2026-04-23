import clsx from "clsx";

type HankoSealProps = {
  className?: string;
  size?: number;
  label?: string;
  /** Si no se pasa, usa 柔 (ju / blandura). */
  character?: string;
};

/**
 * Sello rojo circular tipo hanko. Usa brand-base como tinta con ligera
 * irregularidad en el borde (simula la pisada del sello sobre papel).
 * Accesible: si se indica label, se expone como img role; si no, es
 * aria-hidden y debe apoyarse en texto adyacente para accesibilidad.
 */
export function HankoSeal({ className, size = 48, label, character = "柔" }: HankoSealProps) {
  const accessibilityProps = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };

  return (
    <svg
      {...accessibilityProps}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={clsx("inline-block text-brand-base", className)}
      fill="none"
    >
      <defs>
        <clipPath id="hanko-clip">
          <path d="M32 3.4c-4.2.1-8.3 1.4-11.8 3.5C13.4 11 8 17.7 6.1 25.3 4 33.8 5.4 43.2 10 50.6c4.2 6.7 11.5 11.3 19.3 12.6 7.9 1.3 16.1-1 22.2-6.1 6.2-5.2 9.8-12.9 10-20.9.2-7.5-2.4-15-7.4-20.6C48.8 9.6 40.4 5.5 32 3.4z"/>
        </clipPath>
      </defs>
      <path
        d="M32 3.4c-4.2.1-8.3 1.4-11.8 3.5C13.4 11 8 17.7 6.1 25.3 4 33.8 5.4 43.2 10 50.6c4.2 6.7 11.5 11.3 19.3 12.6 7.9 1.3 16.1-1 22.2-6.1 6.2-5.2 9.8-12.9 10-20.9.2-7.5-2.4-15-7.4-20.6C48.8 9.6 40.4 5.5 32 3.4z"
        fill="currentColor"
      />
      <g clipPath="url(#hanko-clip)" opacity="0.18">
        <circle cx="14" cy="16" r="2.2" fill="#ffffff"/>
        <circle cx="48" cy="10" r="1.4" fill="#ffffff"/>
        <circle cx="52" cy="48" r="2.8" fill="#ffffff"/>
        <circle cx="20" cy="54" r="1.6" fill="#ffffff"/>
        <circle cx="40" cy="30" r="1.1" fill="#ffffff"/>
        <circle cx="9" cy="38" r="1.8" fill="#ffffff"/>
      </g>
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontSize="30"
        fontFamily="var(--font-inter), serif"
        fontWeight="700"
        fill="#ffffff"
      >
        {character}
      </text>
    </svg>
  );
}
