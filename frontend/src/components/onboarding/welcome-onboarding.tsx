"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { track } from "@/lib/analytics";
import {
  hasSeenOnboarding,
  markOnboardingSeen,
  REPLAY_ONBOARDING_EVENT,
} from "@/lib/onboarding";
import { isReturningVisitor } from "@/lib/storage";
import { startPageTransition } from "@/components/layout/navigation-loader";

/**
 * Layer 1 — first-visit welcome. Does not block search forever; skipable.
 * Hidden for returning visitors and once onboardingSeen is set.
 *
 * Uses useLayoutEffect so we read `visited` before the hero's useEffect
 * calls markVisited() on first paint. Footer "Onboarding" replays via event.
 */
export function WelcomeOnboarding() {
  const pathname = usePathname();
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const shownRef = useRef(false);

  function openWelcome(source: "auto" | "replay") {
    shownRef.current = true;
    setOpen(true);
    track("onboard_shown", { layer: "welcome", source });
  }

  useLayoutEffect(() => {
    if (pathname !== "/") return;
    if (hasSeenOnboarding() || isReturningVisitor()) return;
    if (shownRef.current) return;

    const timer = window.setTimeout(() => openWelcome("auto"), 500);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    function onReplay() {
      if (pathname !== "/") {
        startPageTransition();
        router.push("/");
        window.setTimeout(() => openWelcome("replay"), 350);
        return;
      }
      openWelcome("replay");
    }
    window.addEventListener(REPLAY_ONBOARDING_EVENT, onReplay);
    return () => window.removeEventListener(REPLAY_ONBOARDING_EVENT, onReplay);
  }, [pathname, router]);

  function finish() {
    markOnboardingSeen();
    setOpen(false);
  }

  function onSkip() {
    track("onboard_skipped", { layer: "welcome" });
    finish();
  }

  function onSearch() {
    track("onboard_cta_search");
    finish();
    startPageTransition();
    router.push("/search");
  }

  function onDeals() {
    track("onboard_cta_deals");
    finish();
    startPageTransition();
    router.push("/deals");
  }

  function onOpenChange(next: boolean) {
    if (!next && open) {
      track("onboard_skipped", { layer: "welcome" });
      finish();
      return;
    }
    setOpen(next);
  }

  const body = (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Compare Checkers, Pick n Pay, Shoprite, Woolworths and Dis-Chem in one
        search — then save the best price.
      </p>
      <div className="flex flex-col gap-2.5 pt-1">
        <Button
          type="button"
          onClick={onSearch}
          className="h-11 w-full rounded-full bg-[var(--brand-green)] px-5 text-white hover:bg-[var(--brand-green)]/90"
        >
          Start searching
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onDeals}
          className="h-11 w-full rounded-full bg-zinc-100 px-5 hover:bg-zinc-200/80"
        >
          See today&apos;s deals
        </Button>
        <button
          type="button"
          onClick={onSkip}
          className="py-2 text-sm font-medium text-foreground/55 transition-colors hover:text-foreground"
        >
          Skip for now
        </button>
        <p className="pt-1 text-center text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => {
              track("onboard_cta_signup", { intent: "welcome" });
              finish();
              startPageTransition();
              router.push("/signup?next=%2F&intent=welcome");
            }}
            className="font-medium text-foreground/70 underline underline-offset-2 transition-colors hover:text-foreground"
          >
            Create account
          </button>
          <span className="mx-1.5 text-foreground/30">·</span>
          <button
            type="button"
            onClick={() => {
              track("onboard_cta_signin", { intent: "welcome" });
              finish();
              startPageTransition();
              router.push("/signin?next=%2F&intent=welcome");
            }}
            className="font-medium text-foreground/70 underline underline-offset-2 transition-colors hover:text-foreground"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              Search, compare, save
            </DialogTitle>
            <DialogDescription className="sr-only">
              Welcome to EasiShop. Start searching or see deals.
            </DialogDescription>
          </DialogHeader>
          {body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="gap-4 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5"
      >
        <SheetHeader className="pr-10 text-left">
          <SheetTitle className="font-heading text-xl">
            Search, compare, save
          </SheetTitle>
          <SheetDescription className="sr-only">
            Welcome to EasiShop. Start searching or see deals.
          </SheetDescription>
        </SheetHeader>
        {body}
      </SheetContent>
    </Sheet>
  );
}
