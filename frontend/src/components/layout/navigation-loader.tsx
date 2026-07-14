"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader } from "reicon-react";
import { cn } from "@/lib/utils";

const START_EVENT = "easishop:navigate-start";
const SHOW_DELAY_MS = 180;

/** Call before programmatic `router.push` so the page loader can appear. */
export function startPageTransition() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(START_EVENT));
}

function isInternalNavAnchor(anchor: HTMLAnchorElement): boolean {
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false;
  }
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Top progress bar + delayed spinner while App Router navigations are in flight.
 */
export function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);
  const [visible, setVisible] = useState(false);
  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function begin() {
    setPending(true);
  }

  function end() {
    setPending(false);
    setVisible(false);
    if (delayRef.current) {
      clearTimeout(delayRef.current);
      delayRef.current = null;
    }
  }

  useEffect(() => {
    end();
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!pending) return;
    delayRef.current = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    const safety = setTimeout(() => end(), 10000);
    return () => {
      if (delayRef.current) clearTimeout(delayRef.current);
      clearTimeout(safety);
    };
  }, [pending]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      if (!isInternalNavAnchor(anchor)) return;
      begin();
    }

    function onStart() {
      begin();
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener(START_EVENT, onStart);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(START_EVENT, onStart);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 origin-left bg-[var(--brand-green)]",
          "animate-nav-progress"
        )}
      />
      <div className="mt-[4.5rem] flex size-10 items-center justify-center rounded-full bg-white/95 shadow-md ring-1 ring-black/5 md:mt-20">
        <Loader
          size={20}
          className="animate-spin text-[var(--brand-green)]"
          aria-hidden
        />
      </div>
    </div>
  );
}
