import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "assets.woolworthsstatic.co.za" },
      { protocol: "https", hostname: "cdn.checkers.co.za" },
      { protocol: "https", hostname: "www.checkers.co.za" },
      { protocol: "https", hostname: "cdn.pnp.co.za" },
      { protocol: "https", hostname: "www.pnp.co.za" },
      { protocol: "https", hostname: "www.shoprite.co.za" },
      { protocol: "https", hostname: "www.dischem.co.za" },
      { protocol: "https", hostname: "easishop.co.za" },
      { protocol: "https", hostname: "www.easishop.co.za" },
    ],
  },
};

export default nextConfig;
