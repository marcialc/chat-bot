import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useLightningcss: false, // Webpack build will use PostCSS instead
  },
};

export default nextConfig;
