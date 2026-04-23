import clsx from "clsx";

type SumiStrokeProps = {
  className?: string;
  width?: number;
  height?: number;
};

/**
 * Pincelada sumi: trazo de tinta horizontal con ancho variable y bordes
 * irregulares. Pensado como acento bajo un titular, no como separador
 * estructural. Hereda color vía currentColor.
 */
export function SumiStroke({ className, width = 120, height = 14 }: SumiStrokeProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 14"
      width={width}
      height={height}
      className={clsx("inline-block text-ink-primary", className)}
      fill="currentColor"
    >
      <path d="M3 6.4c6.1-1.3 12.6-2.1 18.6-2.4 9.9-.5 19.7.5 29.5 1.6 10.4 1.2 20.8 2.3 31.3 2 8.6-.3 17.2-1.5 25.7-3l.7 3.1c-8.7 1.9-17.6 3.3-26.4 3.6-11 .4-21.9-.8-32.8-2-9-1-18-2-26.9-1.6-5.8.3-11.6 1-17.3 2l-.4-3.3c-.7.1-1.3.1-2 0l.2-3.1c.2 0 .4.1.6.1l-.8 2.9c0-.1 0 0 0 0z"/>
      <path d="M111 3.6c1.1-.2 2.1-.5 3.2-.8l.4 2.8c-1.1.3-2.2.6-3.4.9l-.2-2.9z" opacity="0.55"/>
      <ellipse cx="117.5" cy="6" rx="1.6" ry="0.9" opacity="0.35"/>
    </svg>
  );
}
