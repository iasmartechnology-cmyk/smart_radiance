import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Keep Next from writing AGENTS.md/CLAUDE.md into the repo (existing
  // production setting for this project).
  agentRules: false,
  // Pin the workspace root so a stray lockfile in a parent dir isn't inferred.
  turbopack: { root: projectRoot },
  // No framework fingerprint in responses.
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    // Strip console.* from production bundles (errors are kept).
    removeConsole: { exclude: ["error"] },
  },
  async headers() {
    return [
      {
        // Background frames never change in place — a new cut gets new files.
        source: "/sequence/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  // Trim client bundles by transpiling only what's used from these libs.
  experimental: {
    optimizePackageImports: ["gsap"],
  },
};

export default nextConfig;
