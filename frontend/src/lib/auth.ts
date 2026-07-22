/**
 * Demo auth — localStorage only. No real credentials or backend session.
 */

import { track } from "@/lib/analytics";
import { getUser, updateUser } from "@/lib/storage";
import type { DemoUser } from "@/types";

export function isSignedIn(): boolean {
  return getUser().signedIn === true;
}

function usernameFromEmail(email: string): string {
  const local = email.split("@")[0]?.trim() || "shopper";
  return local.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 24) || "shopper";
}

export function signUp(input: {
  name: string;
  email: string;
  phone?: string;
  /** Marketing defaults off — collect later on Profile. */
  marketing?: boolean;
}): DemoUser {
  const name = input.name.trim() || "Shopper";
  const email = input.email.trim().toLowerCase();
  const phone = input.phone?.trim() || "";

  const user = updateUser({
    signedIn: true,
    onboardingSeen: true,
    name,
    surname: "",
    email,
    phone,
    username: usernameFromEmail(email),
    marketingPrefs: {
      emailMarketing: Boolean(input.marketing),
    },
  });

  track("sign_up", { method: "email" });
  return user;
}

export function signIn(input: { email: string }): DemoUser {
  const email = input.email.trim().toLowerCase();
  const current = getUser();

  const user = updateUser({
    signedIn: true,
    onboardingSeen: true,
    email: email || current.email,
    username: email
      ? usernameFromEmail(email)
      : current.username,
  });

  track("sign_in", { method: "email" });
  return user;
}

/** Demo Google path — no real OAuth; signs the local preview account in. */
export function continueWithGoogle(): DemoUser {
  const current = getUser();
  const email =
    current.email && !current.email.includes("@easishop.co.za")
      ? current.email
      : "google.user@easishop.co.za";

  const user = updateUser({
    signedIn: true,
    onboardingSeen: true,
    email,
    name: current.name?.trim() || "Google shopper",
    username: usernameFromEmail(email),
  });

  track("sign_in", { method: "google" });
  return user;
}

export function signOut(): DemoUser {
  const user = updateUser({ signedIn: false });
  track("sign_out");
  return user;
}

/** Safe internal path for post-auth redirect. */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}
