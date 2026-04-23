import type { LocaleCode } from "@/lib/i18n";
import { Opening } from "./sections/opening";
import { Teaching } from "./sections/teaching";
import { ChapterHaraigoshi } from "./sections/chapter-haraigoshi";
import { Method } from "./sections/method";
import { Sites } from "./sections/sites";
import { Disciplines } from "./sections/disciplines";
import { Trial } from "./sections/trial";
import { FamilyPortalEntry } from "./sections/family-portal-entry";

export function LandingRoot({ locale }: { locale: LocaleCode }) {
  return (
    <main className="relative">
      <Opening locale={locale} />
      <Teaching locale={locale} />
      <ChapterHaraigoshi locale={locale} />
      <Method locale={locale} />
      <Sites locale={locale} />
      <Disciplines locale={locale} />
      <Trial locale={locale} />
      <FamilyPortalEntry locale={locale} />
    </main>
  );
}
