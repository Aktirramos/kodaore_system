import Link from "next/link";

type PortalQuickLinkCardProps = {
  href: string;
  title: string;
  text: string;
  cta: string;
};

export function PortalQuickLinkCard({ href, title, text, cta }: PortalQuickLinkCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-surface p-5 transition-[transform,box-shadow,border-color,background-color] duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:-translate-y-[var(--distance-sm)] hover:border-white/30 hover:bg-surface-strong/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base motion-reduce:transform-none motion-reduce:transition-[box-shadow,border-color,background-color]"
    >
      <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-ink-muted">{text}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.12em] text-brand-emphasis">{cta}</p>
    </Link>
  );
}
