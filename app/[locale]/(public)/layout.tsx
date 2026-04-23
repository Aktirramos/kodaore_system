import type { ReactNode } from "react";
import { SumiBackdrop } from "@/components/decorative";

export default function PublicAreaLayout({ children }: { children: ReactNode }) {
  return (
    <div data-area="public" className="relative">
      <SumiBackdrop />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
