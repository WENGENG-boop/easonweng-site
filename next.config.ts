import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: ['192.168.60.193', '192.168.60.193:3000', 'localhost:3000'],
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/_static-pages/home.html",
        },
        {
          source: "/admin",
          destination: "/_static-pages/admin.html",
        },
      ],
      afterFiles: [
        {
          source: "/api-vault",
          destination: "/api-vault/index.html",
        },
        {
          source: "/api-vault-demo",
          destination: "/api-vault-demo/index.html",
        },
      ],
    };
  },
};

export default nextConfig;
