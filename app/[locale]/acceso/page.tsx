import { notFound, redirect } from "next/navigation";
import { AuthCredentialsForm } from "@/components/auth-credentials-form";
import { ADMIN_ROLE_CODES, getAuthSession } from "@/lib/auth";
import { isLocale } from "@/lib/i18n";

type AccessPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AccessPage({ params }: AccessPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getAuthSession();
  const roleCodes = Array.from(new Set(session?.user?.roles.map((role) => role.code) ?? []));
  const canAccessAdmin = roleCodes.some((code) => ADMIN_ROLE_CODES.includes(code));

  if (session?.user?.id) {
    if (canAccessAdmin) {
      redirect(`/${locale}/admin`);
    }

    redirect(`/${locale}/portal`);
  }

  return (
    <div className="fade-rise mx-auto max-w-lg rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">Acceso</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground">
        {locale === "eu" ? "Saioa hasi" : "Iniciar sesion"}
      </h1>
      <p className="mt-3 text-sm text-ink-muted">
        {locale === "eu"
          ? "Sartu zure kontuarekin familiaren atarian jarraitzeko."
          : "Accede con tu cuenta para continuar al portal familiar."}
      </p>

      <div className="mt-6">
        <AuthCredentialsForm locale={locale} />
      </div>
    </div>
  );
}
