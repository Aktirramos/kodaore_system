type PortalSummaryStatCardProps = {
  label: string;
  value: string;
  tone: "neutral" | "warning" | "success";
};

export function PortalSummaryStatCard({ label, value, tone }: PortalSummaryStatCardProps) {
  const toneClass =
    tone === "warning"
      ? "border-amber-300/20 bg-amber-500/5"
      : tone === "success"
        ? "border-emerald-300/20 bg-emerald-500/5"
        : "border-white/10 bg-surface";

  return (
    <article className={`k-hover-lift rounded-2xl border p-5 ${toneClass}`}>
      <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">{label}</p>
      <p className="mt-2 font-heading text-3xl font-semibold text-foreground">{value}</p>
    </article>
  );
}
