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
  // Trim client bundles by transpiling only what's used from these libs.
  experimental: {
    optimizePackageImports: ["@react-three/drei", "gsap"],
  },
};

export default nextConfig;
