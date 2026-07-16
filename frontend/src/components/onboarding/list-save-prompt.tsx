"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  hasSeenListSavePrompt,
  markListSavePromptSeen,
} from "@/lib/onboarding";
import { updateUser } from "@/lib/storage";
import { startPageTransition } from "@/components/layout/navigation-loader";

/**
 * Layer 3a — after first add-to-list:
 * guests → soft signup prompt; signed-in → optional display name.
 */
let pendingPrompt = false;
const listeners = new Set<() => void>();

export function requestListSavePrompt() {
  if (hasSeenListSavePrompt()) return;
  pendingPrompt = true;
  listeners.forEach((fn) => fn());
}

export function ListSavePrompt() {
  const router = useRouter();
  const { refresh } = useDemoUser();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    const onRequest = () => {
      if (!pendingPrompt || hasSeenListSavePrompt()) return;
      pendingPrompt = false;
      const asGuest = !isSignedIn();
      setGuest(asGuest);
      setOpen(true);
      track("onboard_list_prompt_shown", {
        guest: asGuest,
      });
    };
    listeners.add(onRequest);
    if (pendingPrompt) onRequest();
    return () => {
      listeners.delete(onRequest);
    };
  }, []);

  function finish() {
    markListSavePromptSeen();
    setOpen(false);
  }

  function onSkip() {
    track("onboard_list_prompt_skipped", { guest });
    finish();
  }

  function onSaveName() {
    const trimmed = name.trim();
    if (trimmed) {
      updateUser({ name: trimmed });
      refresh();
    }
    track("onboard_list_prompt_accepted", {
      guest: false,
      hasName: Boolean(trimmed),
    });
    finish();
  }

  function onCreateAccount() {
    track("onboard_list_prompt_accepted", { guest: true, action: "signup" });
    track("onboard_cta_signup", { intent: "list" });
    finish();
    startPageTransition();
    router.push(`/signup?next=${encodeURIComponent("/lists")}&intent=list`);
  }

  function onSignIn() {
    track("onboard_cta_signin", { intent: "list" });
    finish();
    startPageTransition();
    router.push(`/signin?next=${encodeURIComponent("/lists")}&intent=list`);
  }

  function onOpenChange(next: boolean) {
    if (!next && open) {
      track("onboard_list_prompt_skipped", { guest });
      finish();
      return;
    }
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {guest ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                Keep this list
              </DialogTitle>
              <DialogDescription>
                Create a free account so your lists stay under your profile.
                You can keep browsing without one.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2.5">
              <Button
                type="button"
                onClick={onCreateAccount}
                className="h-11 w-full rounded-full bg-[var(--brand-green)] px-5 text-white hover:bg-[var(--brand-green)]/90"
              >
                Create account
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onSignIn}
                className="h-11 w-full rounded-full bg-zinc-100 px-5 hover:bg-zinc-200/80"
              >
                Sign in
              </Button>
              <button
                type="button"
                onClick={onSkip}
                className="py-2 text-sm font-medium text-foreground/55 transition-colors hover:text-foreground"
              >
                Not now
              </button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                Lists stay on this device
              </DialogTitle>
              <DialogDescription>
                Optional — add a first name for your profile. You can change it
                anytime under Profile.
              </DialogDescription>
            </DialogHeader>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name (optional)"
              autoComplete="given-name"
              className="h-12 rounded-full border-0 bg-zinc-100 px-5 shadow-none focus-visible:ring-2 focus-visible:ring-ring/40"
              onKeyDown={(e) => {
                if (e.key === "Enter") onSaveName();
              }}
            />
            <div className="flex flex-col gap-2.5">
              <Button
                type="button"
                onClick={onSaveName}
                className="h-11 w-full rounded-full bg-[var(--brand-green)] px-5 text-white hover:bg-[var(--brand-green)]/90"
              >
                Continue
              </Button>
              <button
                type="button"
                onClick={onSkip}
                className="py-2 text-sm font-medium text-foreground/55 transition-colors hover:text-foreground"
              >
                Skip
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
