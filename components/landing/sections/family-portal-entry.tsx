import Link from "next/link";
import type { LocaleCode } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

const sectionClass = "fade-rise fade-rise-delay-400 rounded-3xl border border-border-subtle bg-surface-subtle p-5 md:p-7";

export function FamilyPortalEntry({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale).landing.familyPortal;
  return (
    <section aria-labelledby="landing-family-title" className={sectionClass}>
      <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
        <h2
          id="landing-family-title"
          className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-emphasis"
        >
          {copy.title}
        </h2>
        <nav
          aria-label={copy.title}
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm md:text-base"
        >
          <Link
            href={`/${locale}/portal`}
            className="text-ink-primary underline underline-offset-4 decoration-1 hover:decoration-2 hover:text-brand-emphasis focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-base"
          >
            {copy.ledgerLabel}
          </Link>
          <Link
            href={`/${locale}/acceso`}
            className="text-ink-primary underline underline-offset-4 decoration-1 hover:decoration-2 hover:text-brand-emphasis focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-base"
          >
            {copy.loginLabel}
          </Link>
        </nav>
      </div>
    </section>
  );
}
