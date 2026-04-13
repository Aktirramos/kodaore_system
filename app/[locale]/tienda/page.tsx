import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

type StorePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function StorePage({ params }: StorePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  redirect(`/${locale}/erropak`);
}
