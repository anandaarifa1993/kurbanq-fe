import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/hewan_picture/**",
      },
    ],
    // Alternative shorter syntax (if you want to allow all paths from localhost:5000)
    // domains: ['localhost'],
  },
};

export default nextConfig;
