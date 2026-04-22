type AdminStatCardProps = {
  label: string;
  value: string | number;
  tone?: "normal" | "warning";
  compact?: boolean;
};

export function AdminStatCard({
  label,
  value,
  tone = "normal",
  compact = false,
}: AdminStatCardProps) {
  const toneClass = tone === "warning" ? "bg-[#2a1b21]" : "bg-surface";
  const valueClass = compact ? "text-2xl md:text-3xl" : "text-3xl";

  return (
    <article
      className={`rounded-2xl border border-white/10 p-5 transition-[transform,box-shadow,border-color,background-color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:shadow-md hover:border-border-default motion-reduce:transform-none motion-reduce:transition-[box-shadow,border-color,background-color] ${toneClass}`}
    >
      <p className="text-sm text-ink-muted">{label}</p>
      <p className={`mt-1 font-heading font-semibold text-foreground ${valueClass}`}>{value}</p>
    </article>
  );
}
