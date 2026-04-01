"use client";

import { type ReactNode } from "react";

type PageTransitionShellProps = {
  children: ReactNode;
};

export function PageTransitionShell({ children }: PageTransitionShellProps) {
  return <div className="kodaore-route-motion">{children}</div>;
}
