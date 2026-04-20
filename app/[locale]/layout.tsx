import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { AnimatedSiteHeader } from "@/components/animated-site-header";
import { PathnamePageTransitionShell } from "@/components/page-transition-shell";
import { SiteFooter } from "@/components/site-footer";
import { getAuthSession } from "@/lib/auth";
import { getCopy, isLocale, supportedLocales, type LocaleCode } from "@/lib/i18n";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

type LocaleMetadata = {
  title: string;
  description: string;
};

const localeMetadata: Record<LocaleCode, LocaleMetadata> = {
  eu: {
    title: "Kodaore | Judo kluba eta familien plataforma",
    description:
      "Kodaoreko web plataforma: Azkoitia, Azpeitia eta Zumaia egoitzetako informazioa, familiei zuzendutako ataria eta kudeaketa digitala.",
  },
  es: {
    title: "Kodaore | Club de judo y plataforma para familias",
    description:
      "Plataforma web de Kodaore con informacion de las sedes de Azkoitia, Azpeitia y Zumaia, acceso para familias y gestion digital del club.",
  },
};

const localeAlternates = supportedLocales.reduce(
  (alternates, locale) => {
    alternates[locale] = `/${locale}`;
    return alternates;
  },
  {} as Record<LocaleCode, string>,
);

const defaultSocialImage = {
  url: "/media/hero-1.jpg",
  width: 1600,
  height: 900,
  alt: "Kodaore judo kluba - Azkoitia, Azpeitia eta Zumaia",
};

function getMetadataBase() {
  const fallbackBase = "http://localhost:3000";
  const configuredBase = process.env.NEXTAUTH_URL?.trim() || fallbackBase;
  return new URL(configuredBase);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const current = localeMetadata[locale as LocaleCode];
  const ogLocale = locale === "eu" ? "eu_ES" : "es_ES";
  const alternateOgLocale = locale === "eu" ? "es_ES" : "eu_ES";

  return {
    metadataBase: getMetadataBase(),
    title: current.title,
    description: current.description,
    alternates: {
      canonical: "./",
      languages: localeAlternates,
    },
    openGraph: {
      title: current.title,
      description: current.description,
      siteName: "Kodaore",
      locale: ogLocale,
      alternateLocale: [alternateOgLocale],
      type: "website",
      url: "./",
      images: [defaultSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: current.title,
      description: current.description,
      images: [defaultSocialImage.url],
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCopy(locale as LocaleCode);
  const session = await getAuthSession();

  return (
    <div className="kodaore-shell flex min-h-screen flex-col">
      <a href="#main-content" className="k-skip-link">
        {locale === "eu" ? "Joan edukira" : "Saltar al contenido"}
      </a>

      <AnimatedSiteHeader
        locale={locale as LocaleCode}
        brand={copy.brand}
        discoverLabel={copy.ctas.discover}
        galleryLabel={copy.ctas.gallery}
        accessLabel={copy.ctas.access}
        isAuthenticated={Boolean(session?.user?.id)}
      />

      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 md:px-8 md:py-10" tabIndex={-1}>
        <PathnamePageTransitionShell>{children}</PathnamePageTransitionShell>
      </main>

      <SiteFooter locale={locale as LocaleCode} />
    </div>
  );
}
