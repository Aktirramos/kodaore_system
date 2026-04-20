import { RoleCode } from "@prisma/client";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { isLocale } from "@/lib/i18n";
import { getPortalMessagesData } from "@/lib/portal";

type PortalMessagesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PortalMessagesPage({ params }: PortalMessagesPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const session = await requireAuth({
    locale,
    allowedRoles: [RoleCode.ALUMNO_TUTOR],
    forbiddenRedirectTo: `/${locale}/admin`,
  });

  const isEu = locale === "eu";
  const messages = await getPortalMessagesData(session.user.id);

  return (
    <div className="space-y-6">
      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-emphasis">
          {isEu ? "Komunikazioak" : "Comunicaciones"}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {isEu ? "Egoitzaren mezuak" : "Mensajes de la sede"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-muted md:text-base">
          {isEu
            ? "Atal honetan jaso ditzakezu klubaren jakinarazpenak, oharrak eta mezu garrantzitsuak."
            : "En este apartado recibes avisos, recordatorios y mensajes importantes del club."}
        </p>
      </section>

      <section className="fade-rise space-y-3">
        {messages.communications.length === 0 ? (
          <article className="rounded-2xl border border-white/10 bg-surface p-5">
            <p className="text-sm text-ink-muted">{isEu ? "Ez dago komunikazio berririk." : "No hay comunicaciones nuevas."}</p>
          </article>
        ) : (
          messages.communications.map((message) => (
            <MessageItem
              key={message.id}
              title={message.title}
              text={message.content}
              badge={getMessageTypeLabel(message.type, locale)}
              meta={`${message.siteName} · ${formatDate(message.createdAt, locale)} · ${message.authorName}`}
            />
          ))
        )}
      </section>
    </div>
  );
}

function MessageItem({ title, text, badge, meta }: { title: string; text: string; badge: string; meta: string }) {
  return (
    <article className="k-hover-lift rounded-2xl border border-white/10 bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
        <span className="rounded-full border border-brand-emphasis/30 bg-brand-emphasis/10 px-3 py-1 text-xs text-brand-emphasis">
          {badge}
        </span>
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.12em] text-ink-muted">{meta}</p>
      <p className="mt-3 whitespace-pre-wrap text-sm text-ink-muted">{text}</p>
    </article>
  );
}

function formatDate(value: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "eu" ? "eu-ES" : "es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function getMessageTypeLabel(type: "NOTICE" | "EMAIL", locale: string) {
  if (locale === "eu") {
    return type === "NOTICE" ? "OHARRA" : "POSTA";
  }
  return type === "NOTICE" ? "AVISO" : "EMAIL";
}
