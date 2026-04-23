import Link from "next/link";
import type { LocaleCode } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

export function FamilyPortalEntry({ locale }: { locale: LocaleCode }) {
  const copy = getCopy(locale).landing.familyPortal;
  return (
    <section
      aria-labelledby="landing-family-title"
      className="relative"
    >
      <div className="mx-auto w-full max-w-6xl px-5 md:px-12 py-[clamp(4rem,8vh,6rem)]">
        <div className="border-t border-border-subtle pt-8 md:pt-10 flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
          <h2
            id="landing-family-title"
            className="text-ink-muted-2 text-sm md:text-base font-semibold uppercase tracking-[0.14em]"
          >
            {copy.title}
          </h2>
          <nav
            aria-label={copy.title}
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm md:text-base"
          >
            <Link
              href={`/${locale}/portal`}
              className="text-ink-primary underline underline-offset-4 decoration-1 hover:decoration-2 hover:text-brand-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-base"
            >
              {copy.ledgerLabel}
            </Link>
            <Link
              href={`/${locale}/acceso`}
              className="text-ink-primary underline underline-offset-4 decoration-1 hover:decoration-2 hover:text-brand-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-base"
            >
              {copy.loginLabel}
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
