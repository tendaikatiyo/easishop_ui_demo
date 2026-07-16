"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "reicon-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDemoUser } from "@/hooks/use-demo-user";
import { track } from "@/lib/analytics";
import { isSignedIn } from "@/lib/auth";
import { getUser, updateUser } from "@/lib/storage";
import type { PriceAlert } from "@/types";
import { startPageTransition } from "@/components/layout/navigation-loader";
import { cn } from "@/lib/utils";

/** Layer 3b — price alert; guests are nudged to sign up first. */
export function PriceAlertPrompt({
  productId,
  productName,
  className,
}: {
  productId: string;
  productName: string;
  className?: string;
}) {
  const router = useRouter();
  const { user, refresh } = useDemoUser();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [marketing, setMarketing] = useState(false);

  const enabled = user?.priceAlerts.some(
    (a) => a.productId === productId && a.enabled
  );

  function openPrompt() {
    if (!isSignedIn()) {
      track("onboard_alert_prompt_shown", { productId, guest: true });
      track("onboard_cta_signup", { intent: "alert", productId });
      const next = `/product/${productId}`;
      startPageTransition();
      router.push(
        `/signup?next=${encodeURIComponent(next)}&intent=alert`
      );
      return;
    }

    const current = getUser();
    setEmail(
      current.email?.includes("@easishop.co.za") ? "" : current.email || ""
    );
    setPhone(current.phone || "");
    setMarketing(false);
    setOpen(true);
    track("onboard_alert_prompt_shown", { productId, guest: false });
  }

  function onSkip() {
    track("onboard_alert_prompt_skipped", { productId });
    setOpen(false);
  }

  function onSave() {
    const nextEmail = email.trim();
    const nextPhone = phone.trim();
    if (!nextEmail && !nextPhone) {
      toast.error("Add an email or phone number");
      return;
    }

    const current = getUser();
    const others = current.priceAlerts.filter((a) => a.productId !== productId);
    const alert: PriceAlert = {
      productId,
      enabled: true,
      targetPrice: null,
    };

    updateUser({
      email: nextEmail || current.email,
      phone: nextPhone || current.phone,
      marketingPrefs: { emailMarketing: marketing },
      priceAlerts: [...others, alert],
    });
    refresh();
    track("onboard_alert_prompt_accepted", {
      productId,
      via: nextEmail ? "email" : "phone",
      marketing,
    });
    track("toggle_alert", { productId, enabled: true });
    setOpen(false);
    toast.success(`We'll alert you about ${productName}`);
  }

  function onOpenChange(next: boolean) {
    if (!next && open) {
      track("onboard_alert_prompt_skipped", { productId });
    }
    setOpen(next);
  }

  if (enabled) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        Price alert on — manage under Profile.
      </p>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={openPrompt}
        className={cn(
          "h-11 w-full gap-2 rounded-full bg-zinc-100 px-5 font-medium hover:bg-zinc-200/80 sm:w-auto",
          className
        )}
      >
        <Bell size={16} aria-hidden />
        Alert me when price drops
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              Get a price drop alert
            </DialogTitle>
            <DialogDescription>
              Add an email or phone number (one is enough). You can change
              contact details under Profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="h-12 rounded-full border-0 bg-zinc-100 px-5 shadow-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            <Input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="h-12 rounded-full border-0 bg-zinc-100 px-5 shadow-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            <label className="flex cursor-pointer items-start gap-3 rounded-[28px] bg-zinc-50 px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-0.5 size-4 rounded border-zinc-300"
              />
              <span className="text-foreground/80">
                Also send me deals and tips by email (optional)
              </span>
            </label>
          </div>
          <div className="flex flex-col gap-2.5">
            <Button
              type="button"
              onClick={onSave}
              className="h-11 w-full rounded-full bg-[var(--brand-green)] px-5 text-white hover:bg-[var(--brand-green)]/90"
            >
              Turn on alert
            </Button>
            <button
              type="button"
              onClick={onSkip}
              className="py-2 text-sm font-medium text-foreground/55 transition-colors hover:text-foreground"
            >
              Not now
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
