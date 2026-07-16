"use client";

import Link from "next/link";
import { useState } from "react";
import { Share } from "reicon-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FeedbackDialog } from "@/components/layout/feedback-dialog";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
} from "@/components/layout/social-icons";
import {
  ProfileNavLink,
  getInitials,
} from "@/components/profile/profile-ui";
import { useDemoUser } from "@/hooks/use-demo-user";
import { SITE_LINKS } from "@/lib/site-links";
import { signOut } from "@/lib/auth";
import { replayOnboarding } from "@/lib/onboarding";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { startPageTransition } from "@/components/layout/navigation-loader";

const SOCIAL_LINKS = [
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@easishop_za",
    Icon: TikTokIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/easishop_za",
    Icon: InstagramIcon,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/easishopza",
    Icon: FacebookIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/easishop",
    Icon: LinkedInIcon,
  },
] as const;

export default function ProfilePage() {
  const router = useRouter();
  const { user, refresh } = useDemoUser();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  if (!user) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  const signedIn = user.signedIn === true;
  const fullName = [user.name, user.surname].filter(Boolean).join(" ");

  function onSignOut() {
    signOut();
    refresh();
    toast.success("Signed out");
    startPageTransition();
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Profile" },
        ]}
      />

      <section className="relative overflow-hidden rounded-3xl bg-[#0e4a30] p-6 text-white md:p-8">
        <div
          className="absolute -right-20 -top-24 size-64 rounded-full bg-[var(--brand-green)]/50 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-28 -left-16 size-56 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div className="relative flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/15 font-heading text-xl font-medium ring-1 ring-white/20">
            {signedIn ? getInitials(user.name, user.surname) : "?"}
          </span>
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold">
              {signedIn ? fullName || "Your profile" : "Guest"}
            </h1>
            {signedIn ? (
              <>
                <p className="truncate text-sm text-white/70">@{user.username}</p>
                {user.email ? (
                  <p className="truncate text-xs text-white/55">{user.email}</p>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-white/70">
                Sign in to sync lists and price alerts.
              </p>
            )}
          </div>
        </div>
      </section>

      {!signedIn ? (
        <section className="space-y-3 rounded-3xl bg-white p-5 md:p-6">
          <p className="text-sm text-muted-foreground">
            Create an account to keep lists and alerts under your profile.
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Button
              type="button"
              onClick={() => {
                startPageTransition();
                router.push("/signup?next=%2Fprofile&intent=profile");
              }}
              className="h-11 flex-1 rounded-full bg-[var(--brand-green)] px-5 text-white hover:bg-[var(--brand-green)]/90"
            >
              Create account
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                startPageTransition();
                router.push("/signin?next=%2Fprofile&intent=profile");
              }}
              className="h-11 flex-1 rounded-full bg-zinc-100 px-5 hover:bg-zinc-200/80"
            >
              Sign in
            </Button>
          </div>
        </section>
      ) : (
        <section className="space-y-3">
          <p className="figma-eyebrow px-1">Settings</p>
          <ul className="space-y-2.5">
            <li>
              <ProfileNavLink
                href="/profile/edit"
                title="Edit profile"
                description="Email, username, name, surname, and phone"
              />
            </li>
            <li>
              <ProfileNavLink
                href="/profile/marketing"
                title="Marketing preferences"
                description="Email marketing consent"
              />
            </li>
            <li>
              <ProfileNavLink
                href="/profile/account"
                title="Account settings"
                description="Sign out or delete your account"
              />
            </li>
          </ul>
        </section>
      )}

      <section className="space-y-3 md:hidden">
        <p className="figma-eyebrow px-1">EasiShop</p>
        <ul className="space-y-2.5">
          {SITE_LINKS.map((link) => (
            <li key={link.href}>
              <ProfileNavLink
                href={link.href}
                title={link.label}
                description={
                  link.href === "/about"
                    ? "What EasiShop is for"
                    : link.href === "/faq"
                      ? "Common questions"
                      : link.href === "/privacy"
                        ? "How we handle your data"
                        : "Using EasiShop responsibly"
                }
              />
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="group flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="font-medium text-foreground">Send feedback</p>
                <p className="text-sm text-muted-foreground">
                  Ideas, bugs, or anything else
                </p>
              </div>
              <span className="text-lg text-muted-foreground transition-transform group-hover:translate-x-0.5">
                ›
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => replayOnboarding()}
              className="group flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="font-medium text-foreground">Onboarding</p>
                <p className="text-sm text-muted-foreground">
                  Replay the welcome flow
                </p>
              </div>
              <span className="text-lg text-muted-foreground transition-transform group-hover:translate-x-0.5">
                ›
              </span>
            </button>
          </li>
        </ul>
      </section>

      <section className="space-y-4 rounded-3xl bg-white p-5 md:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-green-light)]">
            <Share size={16} className="brand-green" aria-hidden />
          </span>
          <div className="space-y-0.5">
            <h2 className="font-heading text-lg font-semibold leading-tight">
              Follow EasiShop
            </h2>
            <p className="text-sm text-muted-foreground">
              Deals, drops and updates on your feed.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-surface-soft px-4 py-2 text-sm font-medium transition-all hover:bg-block-cream active:scale-[0.97]"
            >
              <Icon size={16} />
              {label}
            </a>
          ))}
        </div>
      </section>

      {signedIn ? (
        <div className="px-1 text-center">
          <button
            type="button"
            onClick={onSignOut}
            className="text-sm font-medium text-foreground/55 underline underline-offset-2 transition-colors hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      ) : null}

      <p className="px-1 text-center text-xs text-muted-foreground">
        Looking for something else?{" "}
        <Link href="/" className="underline underline-offset-2">
          Back home
        </Link>
      </p>

      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  );
}
