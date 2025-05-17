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
        // https://mc-heads.net
        protocol: "https",
        hostname: "mc-heads.net",
        port: "",
        pathname: "/avatar/**",
      }
    ],
  }
};

export default nextConfig;
