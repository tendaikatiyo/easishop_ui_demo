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
import { track } from "@/lib/analytics";
import { isSignedIn } from "@/lib/auth";
import {
  hasSeenListSavePrompt,
  markListSavePromptSeen,
} from "@/lib/onboarding";
import { startPageTransition } from "@/components/layout/navigation-loader";

/**
 * Layer 3a — after first add-to-list, guests only:
 * soft signup / sign-in prompt. Signed-in users skip this (no name dialog).
 */
let pendingPrompt = false;
const listeners = new Set<() => void>();

export function requestListSavePrompt() {
  if (hasSeenListSavePrompt()) return;
  if (isSignedIn()) {
    markListSavePromptSeen();
    return;
  }
  pendingPrompt = true;
  listeners.forEach((fn) => fn());
}

export function ListSavePrompt() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onRequest = () => {
      if (!pendingPrompt || hasSeenListSavePrompt()) return;
      if (isSignedIn()) {
        pendingPrompt = false;
        markListSavePromptSeen();
        return;
      }
      pendingPrompt = false;
      setOpen(true);
      track("onboard_list_prompt_shown", { guest: true });
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
    track("onboard_list_prompt_skipped", { guest: true });
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
      track("onboard_list_prompt_skipped", { guest: true });
      finish();
      return;
    }
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Keep this list
          </DialogTitle>
          <DialogDescription>
            Create a free account so your lists stay under your profile. You can
            keep browsing without one.
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
      </DialogContent>
    </Dialog>
  );
}
