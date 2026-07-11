import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EasiShop – Compare Grocery Prices & Save Money in South Africa",
  description:
    "Easishop helps South Africans compare grocery prices from top retailers and save money. Find the best deals and plan your shopping smartly.",
  keywords: [
    "grocery price comparison",
    "South Africa groceries",
    "supermarket deals",
    "food prices South Africa",
    "save money shopping",
    "easishop",
    "checkers specials",
    "pnp specials",
    "shoprite specials",
    "woolworths",
  ],
  metadataBase: new URL("https://easishop.co.za"),
  alternates: { canonical: "https://easishop.co.za" },
  openGraph: {
    title: "EasiShop - Compare Prices from Different Retailers",
    description:
      "Find the best deals from different stores. Save money by comparing grocery prices with EasiShop!",
    url: "https://easishop.co.za",
    type: "website",
    images: ["https://easishop.co.za/flyer1.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "EasiShop - Compare Prices from Different Retailers",
    description:
      "Get the lowest prices from top stores. EasiShop makes grocery shopping smarter!",
    images: ["https://easishop.co.za/flyer1.png"],
  },
  robots: { index: true, follow: true },
  other: {
    "http-equiv": "Content-Language",
  },
  icons: {
    icon: "/easishop_FAV.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-ZA"
      className={`${bricolage.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AppShell>{children}</AppShell>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
