import { cloudflare } from "./cloudflare/adapter";
import type { Platform } from "./types";

const adapters: Record<string, Platform> = {
  cloudflare,
};

/**
 * Resolve the platform adapter once per process. Adding a platform means adding
 * an entry here and its own directory; no application file changes.
 */
function resolve(): Platform {
  const name = process.env.BASELINE_PLATFORM ?? "cloudflare";
  const adapter = adapters[name];
  if (!adapter) {
    throw new Error(`Unknown platform "${name}". Known: ${Object.keys(adapters).join(", ")}`);
  }
  return adapter;
}

export const platform: Platform = resolve();

export type { Database, Env, Platform } from "./types";
