import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/studio",
        destination: "/studio/index",
      },
    ];
  },
};

export default nextConfig;
