import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { AnimatedSiteHeader } from "@/components/animated-site-header";
import { PageTransitionShell } from "@/components/page-transition-shell";
import { SiteFooter } from "@/components/site-footer";
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
      <AnimatedSiteHeader
        locale={locale as LocaleCode}
        brand={copy.brand}
        discoverLabel={copy.ctas.discover}
        galleryLabel={copy.ctas.gallery}
        accessLabel={copy.ctas.access}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 md:px-8 md:py-10">
        <PageTransitionShell>{children}</PageTransitionShell>
      </main>

      <SiteFooter locale={locale as LocaleCode} />
    </div>
  );
}
