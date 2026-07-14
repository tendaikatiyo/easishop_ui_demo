/**
 * Hierarchical parents for mobile Back.
 * `force: true` — always go to parent (predictable Save/Browse stacks).
 * `force: false` — prefer history.back(); use href only when history is thin.
 */
export type NavParent = {
  href: string;
  force: boolean;
};

export function getNavParent(pathname: string): NavParent | null {
  if (/^\/lists\/[^/]+$/.test(pathname)) {
    return { href: "/lists", force: true };
  }
  if (pathname.startsWith("/profile/") && pathname !== "/profile") {
    return { href: "/profile", force: true };
  }
  if (pathname.startsWith("/category/")) {
    return { href: "/#categories", force: true };
  }
  if (pathname.startsWith("/store/")) {
    return { href: "/#stores", force: true };
  }
  if (/^\/(about|faq|privacy|terms)$/.test(pathname)) {
    return { href: "/", force: true };
  }
  if (pathname.startsWith("/product/")) {
    return { href: "/search", force: false };
  }
  if (
    pathname === "/search" ||
    pathname === "/deals" ||
    pathname === "/lists" ||
    pathname === "/profile"
  ) {
    return { href: "/", force: false };
  }
  return null;
}
