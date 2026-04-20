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
    <article className={`k-hover-lift rounded-2xl border border-white/10 p-5 ${toneClass}`}>
      <p className="text-sm text-ink-muted">{label}</p>
      <p className={`mt-1 font-heading font-semibold text-foreground ${valueClass}`}>{value}</p>
    </article>
  );
}
