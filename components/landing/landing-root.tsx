import type { LocaleCode } from "@/lib/i18n";
import { Opening } from "./sections/opening";
import { ChapterHaraigoshi } from "./sections/chapter-haraigoshi";
import { Sites } from "./sections/sites";
import { Trial } from "./sections/trial";
import { FamilyPortalEntry } from "./sections/family-portal-entry";

export function LandingRoot({ locale }: { locale: LocaleCode }) {
  return (
    <div className="space-y-6 md:space-y-8">
      <Opening locale={locale} />
      <ChapterHaraigoshi locale={locale} />
      <Sites locale={locale} />
      <Trial locale={locale} />
      <FamilyPortalEntry locale={locale} />
    </div>
  );
}
