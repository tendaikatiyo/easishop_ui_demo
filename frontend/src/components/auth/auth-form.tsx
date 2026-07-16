"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { safeNextPath, signIn, signUp } from "@/lib/auth";
import { track } from "@/lib/analytics";
import { startPageTransition } from "@/components/layout/navigation-loader";

export type AuthMode = "signin" | "signup";

function AuthFormInner({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNextPath(params.get("next"));
  const intent = params.get("intent");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === "signup";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    if (isSignup && !name.trim()) {
      toast.error("Enter your name");
      return;
    }

    setSubmitting(true);
    try {
      if (isSignup) {
        signUp({
          name: name.trim(),
          email: trimmedEmail,
          phone,
          marketing,
        });
        toast.success("Welcome to EasiShop");
      } else {
        signIn({ email: trimmedEmail });
        toast.success("Signed in");
      }
      track(isSignup ? "onboard_cta_signup" : "onboard_cta_signin", {
        intent: intent ?? undefined,
        next,
      });
      startPageTransition();
      router.push(next);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 animate-rise">
      <div className="space-y-2 text-center">
        <p className="font-accent text-[11px] uppercase tracking-[0.14em] text-foreground/45">
          {isSignup ? "Create account" : "Welcome back"}
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {isSignup ? "Sign up" : "Sign in"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {intent === "alert"
            ? "Save an alert contact so we can notify you on price drops."
            : intent === "list"
              ? "Keep your shopping lists on this device under your profile."
              : isSignup
                ? "Save lists and price alerts. Browse without an account anytime."
                : "Sign in to manage lists, alerts, and preferences."}
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-[32px] bg-white p-6 shadow-xl"
      >
        {isSignup ? (
          <div className="space-y-1.5">
            <label htmlFor="auth-name" className="px-1 text-sm font-medium">
              Name
            </label>
            <Input
              id="auth-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Your name"
              className="h-12 rounded-full border-0 bg-zinc-100 px-5 shadow-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label htmlFor="auth-email" className="px-1 text-sm font-medium">
            Email
          </label>
          <Input
            id="auth-email"
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@email.com"
            required
            className="h-12 rounded-full border-0 bg-zinc-100 px-5 shadow-none focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>

        {isSignup ? (
          <div className="space-y-1.5">
            <label htmlFor="auth-phone" className="px-1 text-sm font-medium">
              Phone{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="auth-phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              placeholder="Phone"
              className="h-12 rounded-full border-0 bg-zinc-100 px-5 shadow-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>
        ) : null}

        {isSignup ? (
          <label className="flex cursor-pointer items-start gap-3 rounded-[28px] bg-zinc-50 px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-0.5 size-4 rounded border-zinc-300"
            />
            <span className="text-foreground/80">
              Send me deals and tips by email (optional)
            </span>
          </label>
        ) : null}

        <p className="px-1 text-xs text-muted-foreground">
          Preview only — no password; nothing is sent to a server.
        </p>

        <Button
          type="submit"
          disabled={submitting}
          className="h-11 w-full rounded-full bg-[var(--brand-green)] px-5 text-white hover:bg-[var(--brand-green)]/90"
        >
          {submitting
            ? "Please wait…"
            : isSignup
              ? "Create account"
              : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link
              href={`/signin?next=${encodeURIComponent(next)}${intent ? `&intent=${intent}` : ""}`}
              className="font-medium text-foreground underline underline-offset-2"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link
              href={`/signup?next=${encodeURIComponent(next)}${intent ? `&intent=${intent}` : ""}`}
              className="font-medium text-foreground underline underline-offset-2"
            >
              Create account
            </Link>
          </>
        )}
      </p>

      <p className="text-center text-sm">
        <Link
          href="/"
          className="text-foreground/55 transition-colors hover:text-foreground"
        >
          Continue without an account
        </Link>
      </p>
    </div>
  );
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <AuthFormInner mode={mode} />
    </Suspense>
  );
}
