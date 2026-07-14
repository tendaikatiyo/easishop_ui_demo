"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE_LINKS } from "@/lib/site-links";
import { FeedbackDialog } from "@/components/layout/feedback-dialog";

export function SiteFooter() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <footer className="mt-auto hidden border-t border-white/40 bg-white/70 backdrop-blur-xl md:block">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="space-y-1">
              <p className="font-heading text-lg font-semibold brand-green">
                EasiShop
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Compare grocery prices across South Africa&apos;s leading
                retailers.
              </p>
            </div>
            <nav aria-label="Company">
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {SITE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => setFeedbackOpen(true)}
                    className="text-foreground/70 transition-colors hover:text-foreground"
                  >
                    Feedback
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EasiShop. Prices shown are sourced from
            retailer listings and may change.
          </p>
        </div>
      </footer>
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>
  );
}
