"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getUser, updateUser } from "@/lib/storage";
import { track } from "@/lib/analytics";

export function OnboardingSheet() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user.onboardingSeen) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  function complete() {
    updateUser({ onboardingSeen: true });
    track("onboarding_complete");
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && complete()}>
      <SheetContent side="bottom" className="rounded-t-2xl md:mx-auto md:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl">
            Compare once. Save every shop.
          </SheetTitle>
          <SheetDescription className="text-base leading-relaxed">
            Search what you need, see who&apos;s cheapest across Checkers, Pick n
            Pay, Shoprite, Woolworths and Dis-Chem, then heart items into your
            list. You&apos;re signed in — jump right in.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-3 px-4 pb-6 pt-2">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">1.</span>
              Search or pick a category — shop with a plan.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">2.</span>
              Compare prices in one view. Screenshot-friendly on mobile.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">3.</span>
              Heart deals to your list and turn on price alerts.
            </li>
          </ul>
          <Button
            className="h-12 w-full rounded-full bg-primary text-base hover:bg-primary/90"
            onClick={complete}
          >
            Start comparing
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
