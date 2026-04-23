import { HARAIGOSHI_PATHS, HARAIGOSHI_VIEWBOX } from "./haraigoshi-data";

type HaraigoshiFrameProps = {
  index: number;
  title?: string;
  className?: string;
};

export function HaraigoshiFrame({ index, title, className }: HaraigoshiFrameProps) {
  const clamped = Math.max(0, Math.min(HARAIGOSHI_PATHS.length - 1, index));
  const d = HARAIGOSHI_PATHS[clamped];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={HARAIGOSHI_VIEWBOX}
      role={title ? "img" : "presentation"}
      aria-label={title}
      className={className}
    >
      <path d={d} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
