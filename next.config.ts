import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
   images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "cdn.pixabay.com"
        }
      ]
   }
};

export default nextConfig;
