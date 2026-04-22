import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const isEu = locale === "eu";

  return (
    <div className="space-y-6">
      <section className="fade-rise rounded-3xl border border-border-subtle bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">
          {isEu ? "Lege informazioa" : "Informacion legal"}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {isEu ? "Pribatutasun politika" : "Politica de privacidad"}
        </h1>
        <p className="mt-3 text-sm text-ink-muted md:text-base">
          {isEu
            ? "Testu hau placeholder profesionala da eta behin betiko bertsio juridikoarekin ordezkatu behar da argitaratu aurretik."
            : "Este texto es un placeholder profesional y debe sustituirse por la version juridica definitiva antes de publicar."}
        </p>
      </section>

      <section className="fade-rise rounded-2xl border border-border-subtle bg-surface p-6">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          {isEu ? "1. Tratamenduaren arduraduna" : "1. Responsable del tratamiento"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {isEu
            ? "Kodaore Judo Elkartea da datu pertsonalen tratamenduaren arduraduna."
            : "Kodaore Judo Elkartea es responsable del tratamiento de los datos personales."}
        </p>

        <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
          {isEu ? "2. Helburua eta legitimazioa" : "2. Finalidad y legitimacion"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {isEu
            ? "Datuak kontuaren kudeaketarako, zerbitzuaren prestaziorako eta komunikazio operatiboetarako erabiliko dira, erabiltzailearen baimenean eta kontratu-harremanean oinarrituta."
            : "Los datos se utilizaran para la gestion de la cuenta, la prestacion del servicio y las comunicaciones operativas, sobre la base del consentimiento y la relacion contractual."}
        </p>

        <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
          {isEu ? "3. Kontserbazio epeak" : "3. Plazos de conservacion"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {isEu
            ? "Datuak beharrezkoak diren bitartean gordeko dira, eta ondoren legezko betebeharrek eskatzen duten epean blokeatuta mantenduko dira."
            : "Los datos se conservaran mientras sean necesarios y, posteriormente, bloqueados durante los plazos exigidos por la normativa aplicable."}
        </p>

        <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
          {isEu ? "4. Eskubideak" : "4. Derechos"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {isEu
            ? "Sarbide, zuzenketa, ezabatze, aurkaratze, tratamendu-murrizketa eta eramangarritasun eskubideak baliatu daitezke, baita emandako baimena edozein unetan kentzea ere."
            : "Puedes ejercer los derechos de acceso, rectificacion, supresion, oposicion, limitacion y portabilidad, asi como retirar el consentimiento en cualquier momento."}
        </p>

        <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
          {isEu ? "5. Harremanetarako" : "5. Contacto"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {isEu
            ? "Datu-babesari buruzko kontsultetarako: Kodaorejudoelkartea@gmail.com"
            : "Para consultas sobre proteccion de datos: Kodaorejudoelkartea@gmail.com"}
        </p>
      </section>
    </div>
  );
}
