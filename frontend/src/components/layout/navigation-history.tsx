"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STACK_KEY = "easishop-path-stack";

function readStack(): string[] {
  try {
    const raw = sessionStorage.getItem(STACK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((p): p is string => typeof p === "string")
      : [];
  } catch {
    return [];
  }
}

function writeStack(stack: string[]) {
  sessionStorage.setItem(STACK_KEY, JSON.stringify(stack.slice(-40)));
}

/** True when the user has navigated within the app this session (safe to history.back). */
export function canSafelyGoBack(): boolean {
  if (typeof window === "undefined") return false;
  return readStack().length > 1;
}

/** Keep a short same-tab path stack for Back without relying on history.length / referrer. */
export function NavigationHistory() {
  const pathname = usePathname();

  useEffect(() => {
    const stack = readStack();
    const last = stack[stack.length - 1];
    if (last === pathname) return;

    if (stack.length >= 2 && stack[stack.length - 2] === pathname) {
      stack.pop();
    } else {
      stack.push(pathname);
    }
    writeStack(stack);
  }, [pathname]);

  return null;
}
