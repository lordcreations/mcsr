import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    domains: ["mcsrranked.com", "starlightskins.lunareclipse.studio"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "starlightskins.lunareclipse.studio",
        port: "",
        pathname: "/render/head/**",
      },
    ],
  }
};

export default nextConfig;
