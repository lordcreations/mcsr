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
    ],
  }
};

export default nextConfig;
