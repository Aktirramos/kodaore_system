import { notFound } from "next/navigation";
import { AuthSignupForm } from "@/components/auth-signup-form";
import { isLocale } from "@/lib/i18n";

type CreateAccountPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CreateAccountPage({ params }: CreateAccountPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <div className="fade-rise mx-auto max-w-xl rounded-3xl border border-border-subtle bg-surface p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">
        {locale === "eu" ? "Alta berria" : "Nueva alta"}
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground">
        {locale === "eu" ? "Familia kontua sortu" : "Crear cuenta de familia"}
      </h1>
      <p className="mt-3 text-sm text-ink-muted">
        {locale === "eu"
          ? "Bete datuak eta kontua sortuko da automatikoki. Ondoren, zuzenean familiaren atarira sartuko zara."
          : "Completa tus datos y la cuenta se creara automaticamente. Despues entraras directamente al portal familiar."}
      </p>

      <div className="mt-6">
        <AuthSignupForm locale={locale} />
      </div>
    </div>
  );
}
