import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow hot reload when testing from other devices on the LAN. */
  allowedDevOrigins: ["192.168.0.37"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "assets.woolworthsstatic.co.za" },
      { protocol: "https", hostname: "cdn-prd-02.pnp.co.za" },
      { protocol: "https", hostname: "cdn.pnp.co.za" },
      { protocol: "https", hostname: "www.pnp.co.za" },
      { protocol: "https", hostname: "cdn.checkers.co.za" },
      { protocol: "https", hostname: "www.checkers.co.za" },
      { protocol: "https", hostname: "digital.checkers.co.za" },
      { protocol: "https", hostname: "www.shoprite.co.za" },
      { protocol: "https", hostname: "cdn.shoprite.co.za" },
      { protocol: "https", hostname: "www.dischem.co.za" },
      { protocol: "https", hostname: "media.dischem.co.za" },
      { protocol: "https", hostname: "easishop.co.za" },
      { protocol: "https", hostname: "www.easishop.co.za" },
    ],
  },
};

export default nextConfig;
