// Shared by `scaffold` (copy to a new directory) and `rename` (in place, for a
// repo created from the GitHub template).

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const RENAME_FILES = [
  "package.json",
  "wrangler.jsonc",
  "src/lib/site.ts",
  "src/app/page.tsx",
  "src/app/login/page.tsx",
  "src/app/icon.svg",
  "src/app/opengraph-image.alt.txt",
  "assets/icon.svg",
  "README.md",
  "AGENTS.md",
];

export function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function assertSlug(slug) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    throw new Error(`"${slug}" is not a usable name. Use lowercase letters, digits and dashes.`);
  }
}

export async function applyName(root, slug) {
  const changed = [];

  for (const relative of RENAME_FILES) {
    const path = join(root, relative);
    try {
      const original = await readFile(path, "utf8");
      const next = original.replaceAll("baseline", slug);
      if (next !== original) {
        await writeFile(path, next);
        changed.push(relative);
      }
    } catch {
      // A future variant of the template may not have every file.
    }
  }

  return changed;
}
