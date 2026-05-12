import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents conflita com autenticação por cookies em layouts dinâmicos
  // cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
