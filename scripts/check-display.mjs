// Keeps the display face rationed.
//
// A second display line on one screen costs the page its hierarchy. This check
// makes that a build failure instead of a review comment.

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = process.cwd();
const appDir = join(root, "src/app");

const MAX_PER_FILE = 2;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["api", "fonts"].includes(entry.name)) continue;
      yield* walk(path);
    } else if (/\.(tsx|ts)$/.test(entry.name)) {
      yield path;
    }
  }
}

const violations = [];
const usage = [];

for await (const file of walk(appDir)) {
  const source = await readFile(file, "utf8");
  const hits = source.match(/font-display/g) ?? [];
  if (hits.length === 0) continue;

  usage.push({ file: relative(root, file), count: hits.length });

  if (hits.length > MAX_PER_FILE) {
    violations.push(`${relative(root, file)}: ${hits.length} display usages (max ${MAX_PER_FILE})`);
  }
}

if (violations.length > 0) {
  console.error("display: the display face is overused\n");
  for (const violation of violations) console.error(`  ${violation}`);
  console.error("\nDemote the extra lines to body type. One display moment per screen, two per route.");
  process.exit(1);
}

console.log(`display: ${usage.length} usage across ${usage.map((entry) => entry.count).join("+")} route(s)`);
