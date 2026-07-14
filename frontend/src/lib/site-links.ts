export const SITE_LINKS = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of use" },
] as const;

export type SiteLink = (typeof SITE_LINKS)[number];
