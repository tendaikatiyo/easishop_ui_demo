"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Scroll to `#id` after App Router navigations (soft nav ignores hash by default). */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    function scrollToHash() {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      // Wait a frame so home sections exist after soft nav.
      requestAnimationFrame(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [pathname]);

  return null;
}
