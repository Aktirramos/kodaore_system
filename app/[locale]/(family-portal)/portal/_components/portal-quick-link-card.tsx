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
      className="k-focus-ring k-hover-lift group rounded-2xl border border-white/10 bg-surface p-5 hover:border-white/30 hover:bg-surface-strong/50"
    >
      <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-ink-muted">{text}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.12em] text-brand-emphasis">{cta}</p>
    </Link>
  );
}
