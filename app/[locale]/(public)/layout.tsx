import type { ReactNode } from "react";

export default function PublicAreaLayout({ children }: { children: ReactNode }) {
  return <div data-area="public">{children}</div>;
}
