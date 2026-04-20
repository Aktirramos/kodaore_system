import { buildSiteStructuredData } from "@/lib/structured-data";

type SiteHeadProps = {
  params: Promise<{ locale: string; site: string }> | { locale: string; site: string };
};

export default async function Head({ params }: SiteHeadProps) {
  const { locale, site } = await params;
  const jsonLd = buildSiteStructuredData({ locale, site });

  if (!jsonLd) {
    return null;
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}