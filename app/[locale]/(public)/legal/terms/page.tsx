import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function TermsPage({ params }: TermsPageProps) {
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
          {isEu ? "Zerbitzuen baldintzak" : "Terminos del servicio"}
        </h1>
        <p className="mt-3 text-sm text-ink-muted md:text-base">
          {isEu
            ? "Testu hau placeholder profesionala da eta behin betiko baldintza juridikoekin ordezkatu behar da argitaratu aurretik."
            : "Este texto es un placeholder profesional y debe sustituirse por las condiciones juridicas definitivas antes de publicar."}
        </p>
      </section>

      <section className="fade-rise rounded-2xl border border-border-subtle bg-surface p-6">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          {isEu ? "1. Erabilera onargarria" : "1. Uso aceptable"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {isEu
            ? "Erabiltzaileak plataforma modu legezkoan eta fede onez erabiltzera konprometitzen dira, hirugarrenen eskubideak errespetatuz."
            : "Las personas usuarias se comprometen a utilizar la plataforma de forma licita y de buena fe, respetando los derechos de terceros."}
        </p>

        <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
          {isEu ? "2. Kontuen segurtasuna" : "2. Seguridad de la cuenta"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {isEu
            ? "Sarbide-kredentzialak konfidentzialak dira. Erabiltzaile bakoitza bere kontuan egindako jardueren arduraduna da."
            : "Las credenciales de acceso son confidenciales. Cada persona usuaria es responsable de la actividad realizada en su cuenta."}
        </p>

        <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
          {isEu ? "3. Zerbitzuaren erabilgarritasuna" : "3. Disponibilidad del servicio"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {isEu
            ? "Kodaorek zerbitzuaren jarraitutasuna bermatzeko ahaleginak egingo ditu, baina mantentze-lanak edo gorabehera teknikoak gerta daitezke."
            : "Kodaore realizara esfuerzos razonables para garantizar la continuidad del servicio, aunque pueden producirse mantenimientos o incidencias tecnicas."}
        </p>

        <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
          {isEu ? "4. Jabetza intelektuala" : "4. Propiedad intelectual"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {isEu
            ? "Plataformako edukien eta markaren eskubideak Kodaorerenak edo dagokion titularrarenak dira."
            : "Los derechos sobre los contenidos y la marca de la plataforma pertenecen a Kodaore o a sus respectivos titulares."}
        </p>

        <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
          {isEu ? "5. Lege aplikagarria" : "5. Ley aplicable"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {isEu
            ? "Baldintza hauek Espainiako legediaren arabera arautuko dira, eta, hala badagokio, Gipuzkoako epaitegien mende jarriko dira."
            : "Estas condiciones se regiran por la legislacion espanola y, en su caso, por los juzgados y tribunales de Gipuzkoa."}
        </p>
      </section>
    </div>
  );
}
