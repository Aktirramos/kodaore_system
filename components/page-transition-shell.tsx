"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

type PageTransitionShellProps = {
  children: ReactNode;
  routeKey: string;
};

export function PageTransitionShell({ children, routeKey }: PageTransitionShellProps) {
  return (
    <motion.div
      className="kodaore-route-motion"
      key={routeKey}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

type PathnamePageTransitionShellProps = {
  children: ReactNode;
};

export function PathnamePageTransitionShell({ children }: PathnamePageTransitionShellProps) {
  const pathname = usePathname() ?? "";
  return <PageTransitionShell routeKey={pathname}>{children}</PageTransitionShell>;
}
