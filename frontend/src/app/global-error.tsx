"use client";

import { useEffect } from "react";
import { Bricolage_Grotesque, Geist_Mono, Inter } from "next/font/google";
import { Home, RotateCcw, Search } from "lucide-react";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-accent",
  subsets: ["latin"],
  display: "swap",
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html
      lang="en-ZA"
      className={`${inter.variable} ${bricolage.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <main className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center px-4 py-16">
          <div className="rounded-[32px] bg-white px-6 py-12 text-center shadow-xl md:px-10">
            <p className="font-accent text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Error
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
              EasiShop needs a moment
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A critical error stopped the app from loading. Try again, or head
              home and restart your shop.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--brand-green)] px-6 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-green)]/90"
              >
                <RotateCcw size={16} aria-hidden />
                Try again
              </button>
              <a
                href="/"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-zinc-100 px-6 text-sm font-medium text-foreground transition-colors hover:bg-zinc-200"
              >
                <Home size={16} aria-hidden />
                Back home
              </a>
              <a
                href="/search"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-zinc-100 px-6 text-sm font-medium text-foreground transition-colors hover:bg-zinc-200"
              >
                <Search size={16} aria-hidden />
                Search
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
