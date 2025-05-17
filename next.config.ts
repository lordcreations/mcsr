import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "starlightskins.lunareclipse.studio",
        port: "",
        pathname: "/render/head/**",
      },
      {
        protocol: "https",
        hostname: "mc-heads.net",
        port: "",
        pathname: "/avatar/**",
      }
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
