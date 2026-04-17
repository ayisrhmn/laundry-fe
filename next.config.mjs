import process from "node:process";

const isDev = process.env.NODE_ENV === "development";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: isDev,
    qualities: [25, 50, 75],
    remotePatterns: [
      {
        hostname: "localhost:3030",
        protocol: "http",
      },
    ],
  },
};

export default nextConfig;
