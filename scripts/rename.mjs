// Renames this repository in place.
//
// Use it after creating a project from the GitHub template, where the clone
// arrives with every identifier still set to the template name.
//
//   pnpm rename my-app

import { applyName, assertSlug, toSlug } from "./lib/identifiers.mjs";

const name = process.argv[2];

if (!name) {
  console.error("usage: pnpm rename <name>");
  process.exit(1);
}

const slug = toSlug(name);

try {
  assertSlug(slug);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const changed = await applyName(process.cwd(), slug);

console.log(`renamed to ${slug}`);
console.log(`  files ${changed.length}`);
for (const file of changed) console.log(`  ${file}`);
console.log("");
console.log("next:");
console.log('  git add -A && git commit -m "chore: rename from the template"');
console.log("  set database_id in wrangler.jsonc before deploying");
