"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

type PageTransitionShellProps = {
  children: ReactNode;
  routeKey: string;
};

function PageTransitionShell({ children, routeKey }: PageTransitionShellProps) {
  return (
    <div className="kodaore-route-motion" key={routeKey}>
      {children}
    </div>
  );
}

type PathnamePageTransitionShellProps = {
  children: ReactNode;
};

export function PathnamePageTransitionShell({ children }: PathnamePageTransitionShellProps) {
  const pathname = usePathname() ?? "";
  return <PageTransitionShell routeKey={pathname}>{children}</PageTransitionShell>;
}
