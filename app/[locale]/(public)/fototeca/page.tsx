import Image from "next/image";
import { notFound } from "next/navigation";
import { FototecaGallery } from "@/components/fototeca-gallery";
import { getFototecaItems } from "@/lib/fototeca";
import { getCopy, isLocale, type LocaleCode } from "@/lib/i18n";

type LocaleFototecaProps = {
  params: Promise<{ locale: string }>;
};

const panelSectionClass = "fade-rise rounded-3xl border border-border-subtle bg-surface p-5 md:p-7";
const finalSectionClass = "fade-rise rounded-3xl border border-border-subtle bg-surface-elevated p-5 md:p-7 shadow-sm";
const finalTextBoxClass = "group/final-box relative overflow-hidden rounded-2xl border border-border-default bg-surface-subtle p-4 transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-surface-subtle/60";

export default async function LocaleFototeca({ params }: LocaleFototecaProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCopy(locale as LocaleCode);
  const galleryItems = await getFototecaItems();

  return (
    <div className="space-y-6 md:space-y-8">
      <section className={panelSectionClass}>
        <div className="flex flex-col gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface-strong px-3 py-1.5 transition-colors duration-[var(--duration-base)] ease-[var(--ease-enter)] hover:bg-surface-subtle/60">
              <span className="relative h-7 w-7 overflow-hidden rounded-full">
                <Image src="/logo-kodaore.png" alt={locale === "eu" ? "Kodaore logoa" : "Logo de Kodaore"} fill sizes="28px" className="object-contain p-1" />
              </span>
              <span className="font-heading text-sm font-semibold tracking-[0.08em]">
                <span className="text-brand-emphasis">Ko</span>
                <span className="text-foreground">dao</span>
                <span className="text-brand-warm">re</span>
              </span>
            </div>
            <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {copy.ctas.gallery}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
              {copy.home.photoDescription}
            </p>
          </div>
        </div>
      </section>

      <FototecaGallery items={galleryItems} brand={copy.brand} locale={locale as LocaleCode} />

      <section className={finalSectionClass}>
        <div className="flex flex-col gap-3">
          <div className={finalTextBoxClass}>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-subtle via-transparent to-accent-subtle opacity-0 transition-opacity duration-300 group-hover/final-box:opacity-100" />
            <h2 className="relative font-heading text-2xl font-semibold tracking-tight text-ink-primary md:text-3xl">{copy.home.photoTitle}</h2>
            <p className="relative mt-2 max-w-2xl text-sm leading-relaxed text-ink-secondary transition-colors duration-300 group-hover/final-box:text-ink-primary">{copy.home.photoHint}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
