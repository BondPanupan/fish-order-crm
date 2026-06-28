import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["fish-crm.saveurnote.com"],
};

export default nextConfig;
