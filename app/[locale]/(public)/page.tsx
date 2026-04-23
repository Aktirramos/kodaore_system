import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingRoot, LandingStructuredData } from "@/components/landing";
import { getCopy, isLocale, type LocaleCode } from "@/lib/i18n";

type LocaleHomeProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LocaleHomeProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = getCopy(locale as LocaleCode);
  return {
    title: copy.landing.meta.title,
    description: copy.landing.meta.description,
    openGraph: {
      title: copy.landing.meta.title,
      description: copy.landing.meta.description,
      locale: locale === "eu" ? "eu_ES" : "es_ES",
    },
  };
}

export default async function LocaleHome({ params }: LocaleHomeProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const localeCode = locale as LocaleCode;
  return (
    <>
      <LandingStructuredData locale={localeCode} />
      <LandingRoot locale={localeCode} />
    </>
  );
}
