import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Next from appending generated prose to AGENTS.md on every dev run.
  agentRules: false,
};

export default nextConfig;

// The Cloudflare adapter serves local bindings to `next dev`. This is the
// adapter's own concern, so the import stays out of the application. Deferred
// so it runs after Next has read the config.
if (process.env.NODE_ENV === "development") {
  void (async () => {
    const { initOpenNextCloudflareForDev } = await import("@opennextjs/cloudflare");
    initOpenNextCloudflareForDev();
  })();
}
