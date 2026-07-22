"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Eye, EyeOff } from "reicon-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GoogleIcon,
  WhatsAppIcon,
} from "@/components/layout/social-icons";
import {
  continueWithGoogle,
  safeNextPath,
  signIn,
  signUp,
} from "@/lib/auth";
import { track } from "@/lib/analytics";
import { startPageTransition } from "@/components/layout/navigation-loader";
import {
  normalizeWhatsAppInput,
  whatsAppValidationError,
} from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export type AuthMode = "signin" | "signup";

const inputClass =
  "h-12 rounded-full border-0 bg-zinc-100 px-5 shadow-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/30";

/** Native button — default `Button` uses `glass-dark` and paints CTAs black. */
const primaryCtaClass =
  "inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--brand-green)] px-5 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-green)]/90 disabled:pointer-events-none disabled:opacity-50";

function intentBlurb(intent: string | null, isSignup: boolean): string {
  if (intent === "alert") {
    return isSignup
      ? "Create an account and add your WhatsApp number for price alerts."
      : "Sign in, then we will ask for your WhatsApp number for alerts.";
  }
  if (intent === "list") {
    return "Keep your shopping lists under your profile on this device.";
  }
  if (intent === "profile") {
    return "Sign in to manage your profile, lists, and alerts.";
  }
  if (isSignup) {
    return "Save lists and price alerts. Browse without an account anytime.";
  }
  return "Sign in to manage lists, alerts, and preferences.";
}

function AuthFormInner({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNextPath(params.get("next"));
  const intent = params.get("intent");
  const wantsWhatsApp = intent === "alert" && mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === "signup";

  function finishAuth(trackEvent: "onboard_cta_signup" | "onboard_cta_signin") {
    track(trackEvent, { intent: intent ?? undefined, next });
    startPageTransition();
    router.push(next);
  }

  function onGoogle() {
    setSubmitting(true);
    try {
      continueWithGoogle();
      toast.success(isSignup ? "Welcome to EasiShop" : "Signed in");
      finishAuth(isSignup ? "onboard_cta_signup" : "onboard_cta_signin");
    } finally {
      setSubmitting(false);
    }
  }

  function onForgotPassword() {
    toast.message("Password reset is not wired in this preview.");
  }

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
    if (password.trim().length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    let phone = "";
    if (wantsWhatsApp) {
      const message = whatsAppValidationError(whatsapp);
      if (message) {
        setWhatsappError(message);
        toast.error(message);
        return;
      }
      phone = normalizeWhatsAppInput(whatsapp);
    }

    setSubmitting(true);
    try {
      if (isSignup) {
        signUp({
          name: name.trim(),
          email: trimmedEmail,
          phone,
          marketing: false,
        });
        toast.success(
          wantsWhatsApp
            ? "Account created — WhatsApp alerts ready"
            : "Welcome to EasiShop"
        );
      } else {
        signIn({ email: trimmedEmail });
        toast.success("Signed in");
      }
      finishAuth(isSignup ? "onboard_cta_signup" : "onboard_cta_signin");
    } finally {
      setSubmitting(false);
    }
  }

  const switchHref = `${isSignup ? "/signin" : "/signup"}?next=${encodeURIComponent(next)}${intent ? `&intent=${intent}` : ""}`;

  return (
    <div className="mx-auto w-full max-w-md space-y-5 animate-rise">
      <div className="space-y-2 text-center">
        <p className="font-accent text-[11px] uppercase tracking-[0.14em] text-[var(--brand-green)]/75">
          {isSignup ? "Create account" : "Welcome back"}
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#0e4a30] md:text-[2.05rem]">
          {isSignup ? "Join EasiShop" : "Sign in"}
        </h1>
        <p className="text-sm text-foreground/60">
          {intentBlurb(intent, isSignup)}
        </p>
      </div>

      <div className="space-y-4 rounded-[32px] bg-white/90 p-6 shadow-xl ring-1 ring-[var(--brand-green)]/12 backdrop-blur-sm">
        <Button
          type="button"
          variant="outline"
          disabled={submitting}
          onClick={onGoogle}
          className="h-11 w-full gap-2 rounded-full border border-zinc-200/80 bg-white px-5 font-medium text-foreground shadow-none hover:bg-[var(--brand-green-soft)]"
        >
          <GoogleIcon size={18} />
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 px-1">
          <div className="h-px flex-1 bg-[var(--brand-green)]/15" />
          <span className="shrink-0 text-xs text-muted-foreground">
            Or {isSignup ? "register" : "sign in"} with email
          </span>
          <div className="h-px flex-1 bg-[var(--brand-green)]/15" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
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
                className={inputClass}
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
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="auth-password" className="px-1 text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className={cn(inputClass, "pr-12")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-foreground/55 transition-colors hover:bg-white/80 hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={16} aria-hidden />
                ) : (
                  <Eye size={16} aria-hidden />
                )}
              </button>
            </div>
            <p className="px-1 text-xs text-muted-foreground">
              Preview only — password is not stored or sent.
            </p>
          </div>

          {wantsWhatsApp ? (
            <div className="space-y-1.5">
              <label
                htmlFor="auth-whatsapp"
                className="flex items-center gap-1.5 px-1 text-sm font-medium"
              >
                <WhatsAppIcon size={14} aria-hidden />
                WhatsApp number
              </label>
              <Input
                id="auth-whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={whatsapp}
                onChange={(e) => {
                  setWhatsapp(e.target.value);
                  if (whatsappError) setWhatsappError(null);
                }}
                onBlur={() => {
                  if (whatsapp.trim()) {
                    setWhatsappError(whatsAppValidationError(whatsapp));
                  }
                }}
                placeholder="+27 82 123 4567"
                aria-invalid={Boolean(whatsappError)}
                aria-describedby={
                  whatsappError ? "auth-whatsapp-error" : "auth-whatsapp-hint"
                }
                className={cn(
                  inputClass,
                  whatsappError && "ring-2 ring-destructive/40"
                )}
              />
              {whatsappError ? (
                <p
                  id="auth-whatsapp-error"
                  className="px-1 text-xs text-destructive"
                >
                  {whatsappError}
                </p>
              ) : (
                <p
                  id="auth-whatsapp-hint"
                  className="px-1 text-xs text-muted-foreground"
                >
                  Include country code. We use this for price alerts.
                </p>
              )}
            </div>
          ) : null}

          <button type="submit" disabled={submitting} className={primaryCtaClass}>
            {submitting
              ? "Please wait…"
              : isSignup
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        {!isSignup ? (
          <p className="text-center text-sm">
            <button
              type="button"
              onClick={onForgotPassword}
              className="font-medium text-[var(--brand-green)] transition-opacity hover:opacity-80"
            >
              Forgot password?
            </button>
          </p>
        ) : null}
      </div>

      <p className="text-center text-sm text-foreground/60">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link
              href={switchHref}
              className="font-medium text-[var(--brand-green)] underline underline-offset-2"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to EasiShop?{" "}
            <Link
              href={switchHref}
              className="font-medium text-[var(--brand-green)] underline underline-offset-2"
            >
              Create account
            </Link>
          </>
        )}
      </p>

      <p className="text-center text-sm">
        <Link
          href={next === "/" ? "/" : next}
          className="text-foreground/50 transition-colors hover:text-foreground"
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
