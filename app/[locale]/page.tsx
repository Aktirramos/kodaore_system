import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SmartImage } from "@/components/smart-image";
import { VantaWavesBackground } from "@/components/vanta-waves-background";
import { getCopy, isLocale, type LocaleCode } from "@/lib/i18n";

type LocaleHomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleHome({ params }: LocaleHomeProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCopy(locale as LocaleCode);

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="fade-rise relative isolate overflow-hidden rounded-[2rem] border border-black/10 bg-surface shadow-[0_50px_120px_-70px_rgba(16,16,16,0.62)] min-h-[74svh] md:h-[calc(100svh-11rem)] md:min-h-[calc(100svh-11rem)]">
        <VantaWavesBackground className="pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_85%_at_50%_50%,rgba(255,255,255,0.02),rgba(255,255,255,0.55)_62%,rgba(255,255,255,0.75)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(227,30,36,0.16)_0%,rgba(227,30,36,0.1)_32%,rgba(255,255,255,0.06)_50%,rgba(11,158,74,0.1)_68%,rgba(11,158,74,0.16)_100%)]" />

        <div className="relative z-10 flex h-full flex-col gap-3 p-3 md:grid md:grid-cols-12 md:p-4 lg:gap-4 lg:p-5">
          <article className="group relative min-h-[46svh] overflow-hidden rounded-2xl border border-black/10 bg-black/15 md:col-span-8 md:min-h-full">
            <SmartImage
              src="/media/hero-1.jpg"
              fallbackSrc="/media/photo-fallback-1.svg"
              alt="Kodaore hero visual"
              fill
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 62vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
          </article>

          <div className="grid grid-cols-2 gap-3 md:col-span-4 md:grid-cols-1 md:grid-rows-2 md:gap-4">
            <article className="group relative min-h-[13svh] overflow-hidden rounded-2xl border border-black/10 bg-black/20 md:min-h-0">
              <SmartImage
                src="/media/hero-2.jpg"
                fallbackSrc="/media/photo-fallback-2.svg"
                alt="Kodaore side visual"
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 46vw, 26vw"
              />
            </article>

            <article className="relative min-h-[13svh] overflow-hidden rounded-2xl border border-black/15 bg-[linear-gradient(145deg,#ffffff_0%,#ececec_100%)] p-4 md:min-h-0 md:p-5">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-brand" />
              <div className="pointer-events-none absolute inset-y-0 left-2 w-1.5 bg-brand-warm" />
              <div className="relative z-10 flex h-full flex-col justify-start gap-4 pl-5 pr-1 md:pl-6 md:pr-2">
                <div className="relative aspect-square w-full max-w-[82px] overflow-hidden rounded-full md:max-w-[96px]">
                  <Image
                    src="/logo-kodaore.png"
                    alt="Kodaore logo"
                    fill
                    priority
                    sizes="96px"
                    className="object-contain drop-shadow-[0_12px_24px_rgba(17,17,17,0.2)]"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand/80">{copy.tagline}</p>
                  <h1 className="font-heading text-lg leading-tight text-foreground md:text-xl">{copy.home.heroTitle}</h1>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/20 to-transparent" />
      </section>

      <section className="fade-rise rounded-3xl border border-black/10 bg-surface p-5 md:p-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {copy.home.sitesTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">{copy.home.sitesDescription}</p>
          </div>
          <Link
            href={`/${locale}/sedes`}
            className="inline-flex w-fit rounded-full border border-brand/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand transition hover:border-brand/55"
          >
            {copy.ctas.discover}
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {copy.home.sites.map((site) => (
            <Link
              key={site.slug}
              href={`/${locale}/sedes/${site.slug}`}
              className="rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-0.5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Kodaore</p>
              <h3 className="mt-1 font-heading text-2xl font-semibold text-foreground">{site.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="fade-rise relative overflow-hidden rounded-3xl border border-black/15 bg-[#101214] p-4 md:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(227,30,36,0.24),transparent_38%),radial-gradient(circle_at_85%_85%,rgba(11,158,74,0.28),transparent_45%)]" />
        <div className="relative grid items-end gap-6 md:grid-cols-[1.2fr_0.9fr]">
          <article className="group relative min-h-[230px] overflow-hidden rounded-2xl border border-white/20 md:min-h-[280px]">
            <SmartImage
              src="/media/hero-3.jpg"
              fallbackSrc="/media/photo-fallback-3.svg"
              alt="Kodaore photography highlight"
              fill
              className="object-cover transition duration-700 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/20" />
          </article>

          <div className="space-y-3 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {copy.home.photoTitle}
            </h2>
            <p className="text-sm leading-relaxed text-white/85 md:text-base">{copy.home.photoDescription}</p>
            <p className="rounded-xl bg-black/25 px-3 py-2 text-xs tracking-[0.05em] text-white/90">{copy.home.photoHint}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
