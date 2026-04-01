"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";

type PageTransitionShellProps = {
  children: ReactNode;
};

const pageTransition = {
  duration: 0.82,
  ease: "easeOut" as const,
};

export function PageTransitionShell({ children }: PageTransitionShellProps) {
  const pathname = usePathname() ?? "";
  const [loaderDone, setLoaderDone] = useState(false);
  const firstStablePathRef = useRef<string | null>(null);

  useEffect(() => {
    const html = document.documentElement;

    const syncPhase = () => {
      const phase = html.getAttribute("data-loader-phase");
      const loaderElement = document.querySelector(".kodaore-loader");
      const done = phase === "hidden" || (phase === null && !loaderElement);
      setLoaderDone(done);
    };

    syncPhase();

    const observer = new MutationObserver(syncPhase);
    observer.observe(html, {
      attributes: true,
      attributeFilter: ["data-loader-phase"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!loaderDone) {
    return <div>{children}</div>;
  }

  if (firstStablePathRef.current === null) {
    firstStablePathRef.current = pathname;
    return <div className="kodaore-route-motion">{children}</div>;
  }

  return (
    <motion.div
      className="kodaore-route-motion"
      key={pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}
