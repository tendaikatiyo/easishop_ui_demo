/**
 * Conversion onboarding flags (demo / localStorage).
 * See ux-onboarding-conversion.md
 */

import { getUser, updateUser } from "@/lib/storage";

const AHA_KEY = "easishop.demo.onboard.aha";
const LIST_PROMPT_KEY = "easishop.demo.onboard.listPrompt";
const VISITED_KEY = "easishop.demo.visited";

export const REPLAY_ONBOARDING_EVENT = "easishop:replay-onboarding";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function hasSeenOnboarding(): boolean {
  return getUser().onboardingSeen === true;
}

export function markOnboardingSeen(): void {
  updateUser({ onboardingSeen: true });
}

export function hasSeenCompareAha(): boolean {
  if (!canUseStorage()) return true;
  return localStorage.getItem(AHA_KEY) === "1";
}

export function markCompareAhaSeen(): void {
  if (!canUseStorage()) return;
  localStorage.setItem(AHA_KEY, "1");
}

export function hasSeenListSavePrompt(): boolean {
  if (!canUseStorage()) return true;
  return localStorage.getItem(LIST_PROMPT_KEY) === "1";
}

export function markListSavePromptSeen(): void {
  if (!canUseStorage()) return;
  localStorage.setItem(LIST_PROMPT_KEY, "1");
}

/** Clears welcome / aha / list-prompt flags so the flow can be replayed. */
export function resetOnboardingFlags(): void {
  if (!canUseStorage()) return;
  updateUser({ onboardingSeen: false, signedIn: false });
  localStorage.removeItem(AHA_KEY);
  localStorage.removeItem(LIST_PROMPT_KEY);
  localStorage.removeItem(VISITED_KEY);
}

/** Reset flags and ask WelcomeOnboarding to open (from footer, etc.). */
export function replayOnboarding(): void {
  resetOnboardingFlags();
  window.dispatchEvent(new CustomEvent(REPLAY_ONBOARDING_EVENT));
}
