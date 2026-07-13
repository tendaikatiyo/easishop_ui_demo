"use client";

import Link from "next/link";
import { Share2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  ProfileNavLink,
  getInitials,
} from "@/components/profile/profile-ui";
import { useDemoUser } from "@/hooks/use-demo-user";

const SOCIAL_LINKS = [
  ["TikTok", "https://www.tiktok.com/@easishop_za"],
  ["Instagram", "https://www.instagram.com/easishop_za"],
  ["Facebook", "https://www.facebook.com/easishopza"],
  ["LinkedIn", "https://www.linkedin.com/company/easishop"],
] as const;

export default function ProfilePage() {
  const { user } = useDemoUser();

  if (!user) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  const fullName = [user.name, user.surname].filter(Boolean).join(" ");

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
            {getInitials(user.name, user.surname)}
          </span>
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold">
              {fullName || "Your profile"}
            </h1>
            <p className="truncate text-sm text-white/70">@{user.username}</p>
            {user.email ? (
              <p className="truncate text-xs text-white/55">{user.email}</p>
            ) : null}
          </div>
        </div>
      </section>

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
              description="Delete your account"
            />
          </li>
        </ul>
      </section>

      <section className="space-y-4 rounded-3xl bg-white p-5 md:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-green-light)]">
            <Share2 className="size-4 brand-green" strokeWidth={2} />
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
          {SOCIAL_LINKS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-surface-soft px-4 py-2 text-sm font-medium transition-all hover:bg-block-cream active:scale-[0.97]"
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      <p className="px-1 text-center text-xs text-muted-foreground">
        Looking for something else?{" "}
        <Link href="/" className="underline underline-offset-2">
          Back home
        </Link>
      </p>
    </div>
  );
}
