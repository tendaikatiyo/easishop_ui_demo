"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { WhatsAppIcon } from "@/components/layout/social-icons";
import { useDemoUser } from "@/hooks/use-demo-user";
import { track } from "@/lib/analytics";
import { isSignedIn } from "@/lib/auth";
import { getUser, updateUser } from "@/lib/storage";
import type { PriceAlert } from "@/types";
import { startPageTransition } from "@/components/layout/navigation-loader";
import {
  isValidWhatsAppNumber,
  normalizeWhatsAppInput,
  whatsAppValidationError,
} from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** Layer 3b — WhatsApp price alert; guests are nudged to sign up first. */
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
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const enabled = user?.priceAlerts.some(
    (a) => a.productId === productId && a.enabled
  );

  function openPrompt() {
    if (!isSignedIn()) {
      track("onboard_alert_prompt_shown", { productId, guest: true });
      track("onboard_cta_signup", { intent: "alert", productId });
      const next = `/product/${productId}`;
      startPageTransition();
      router.push(`/signup?next=${encodeURIComponent(next)}&intent=alert`);
      return;
    }

    const current = getUser();
    const existing = current.phone?.trim() || "";
    setWhatsapp(
      existing && isValidWhatsAppNumber(existing)
        ? normalizeWhatsAppInput(existing)
        : existing.startsWith("+") || existing.startsWith("00")
          ? existing
          : ""
    );
    setError(null);
    setOpen(true);
    track("onboard_alert_prompt_shown", { productId, guest: false });
  }

  function onSkip() {
    track("onboard_alert_prompt_skipped", { productId });
    setOpen(false);
  }

  function onSave() {
    const message = whatsAppValidationError(whatsapp);
    if (message) {
      setError(message);
      toast.error(message);
      return;
    }

    const normalized = normalizeWhatsAppInput(whatsapp);
    const current = getUser();
    const others = current.priceAlerts.filter((a) => a.productId !== productId);
    const alert: PriceAlert = {
      productId,
      enabled: true,
      targetPrice: null,
    };

    updateUser({
      phone: normalized,
      priceAlerts: [...others, alert],
    });
    refresh();
    track("onboard_alert_prompt_accepted", {
      productId,
      via: "whatsapp",
    });
    track("toggle_alert", { productId, enabled: true });
    setOpen(false);
    toast.success(`We'll WhatsApp you about ${productName}`);
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
        WhatsApp price alert on — manage under Profile.
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
        <WhatsAppIcon size={16} aria-hidden />
        Alert me on WhatsApp
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              Get a WhatsApp price alert
            </DialogTitle>
            <DialogDescription>
              Enter your WhatsApp number with country code. We&apos;ll message
              you when this product drops.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label htmlFor="whatsapp-number" className="px-1 text-sm font-medium">
              WhatsApp number
            </label>
            <Input
              id="whatsapp-number"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={whatsapp}
              onChange={(e) => {
                setWhatsapp(e.target.value);
                if (error) setError(null);
              }}
              onBlur={() => {
                if (whatsapp.trim()) {
                  setError(whatsAppValidationError(whatsapp));
                }
              }}
              placeholder="+27 82 123 4567"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "whatsapp-error" : "whatsapp-hint"}
              className={cn(
                "h-12 rounded-full border-0 bg-zinc-100 px-5 shadow-none focus-visible:ring-2 focus-visible:ring-ring/40",
                error && "ring-2 ring-destructive/40"
              )}
            />
            {error ? (
              <p id="whatsapp-error" className="px-1 text-xs text-destructive">
                {error}
              </p>
            ) : (
              <p id="whatsapp-hint" className="px-1 text-xs text-muted-foreground">
                Include country code (e.g. +27 for South Africa).
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2.5">
            <Button
              type="button"
              onClick={onSave}
              className="h-11 w-full gap-2 rounded-full bg-[var(--brand-green)] px-5 text-white hover:bg-[var(--brand-green)]/90"
            >
              <WhatsAppIcon size={16} aria-hidden />
              Turn on WhatsApp alert
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
