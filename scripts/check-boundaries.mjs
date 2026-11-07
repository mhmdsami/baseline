// Fails when application code imports a hosting provider.
//
// The port only holds if the rule is checked, so this runs in `pnpm gate`.

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = process.cwd();
const srcDir = join(root, "src");
const platformDir = join(srcDir, "platform");

const forbidden = [
  { pattern: /from\s+["']wrangler(\/|["'])/, label: "wrangler" },
  { pattern: /from\s+["']@cloudflare\/workers-types/, label: "@cloudflare/workers-types" },
  { pattern: /getCloudflareContext/, label: "getCloudflareContext" },
  { pattern: /from\s+["']drizzle-orm\/d1/, label: "drizzle-orm/d1" },
  { pattern: /\bD1Database\b/, label: "D1Database" },
  { pattern: /\bR2Bucket\b/, label: "R2Bucket" },
];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path);
    } else if (/\.(ts|tsx|mjs|js)$/.test(entry.name)) {
      yield path;
    }
  }
}

const violations = [];

for await (const file of walk(srcDir)) {
  if (file.startsWith(platformDir)) continue;

  const source = await readFile(file, "utf8");
  for (const { pattern, label } of forbidden) {
    if (pattern.test(source)) {
      violations.push(`${relative(root, file)}: references ${label}`);
    }
  }
}

if (violations.length > 0) {
  console.error("boundaries: application code reached past the port\n");
  for (const violation of violations) console.error(`  ${violation}`);
  console.error("\nMove the provider call into src/platform/<adapter>/ and call it through the port.");
  process.exit(1);
}

console.log("boundaries: clean");
