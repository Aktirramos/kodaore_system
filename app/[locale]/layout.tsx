import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SiteHeaderNav } from "@/components/site-header-nav";
import { getCopy, isLocale, type LocaleCode } from "@/lib/i18n";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCopy(locale as LocaleCode);

  return (
    <div className="kodaore-shell flex min-h-screen flex-col">
      <header className="kodaore-site-header sticky top-0 z-40 border-b border-black/10 bg-surface/70 backdrop-blur-md">
        <div className="mx-auto w-full max-w-6xl px-5 py-3 md:px-8">
          <div className="rounded-2xl border border-black/10 bg-white/70 p-3 shadow-[0_18px_45px_-34px_rgba(0,0,0,0.6)]">
            <SiteHeaderNav
              locale={locale as LocaleCode}
              brand={copy.brand}
              discoverLabel={copy.ctas.discover}
              galleryLabel={copy.ctas.gallery}
              accessLabel={copy.ctas.access}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 md:px-8 md:py-10">{children}</main>
    </div>
  );
}
