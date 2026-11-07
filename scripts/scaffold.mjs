// Creates a new project from this template.
//
//   node scripts/scaffold.mjs ../my-app my-app
//
// Copies the working tree without build output or local state, then rewrites the
// identifiers that differ per project. A script rather than a published CLI,
// because the template is a repo and a copy is the operation.

import { cp, mkdir, readdir, readFile, rm } from "node:fs/promises";
import { basename, join, relative, resolve } from "node:path";
import { applyName, assertSlug, toSlug } from "./lib/identifiers.mjs";

const [, , targetArg, nameArg] = process.argv;

if (!targetArg) {
  console.error("usage: node scripts/scaffold.mjs <target-dir> [name]");
  process.exit(1);
}

const root = process.cwd();
const target = resolve(root, targetArg);
const name = nameArg ?? basename(target);
const slug = toSlug(name);

try {
  assertSlug(slug);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const skip = new Set([
  ".git",
  "node_modules",
  ".next",
  ".open-next",
  ".wrangler",
  ".dev.vars",
  ".env.local",
  ".DS_Store",
  ".opencode/skills-activation.log",
]);

const skipPrefixes = ["node_modules/", ".next/", ".open-next/", ".wrangler/"];

function shouldSkip(relativePath) {
  if (skip.has(relativePath)) return true;
  return skipPrefixes.some((prefix) => relativePath.startsWith(prefix));
}

async function walk(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = relative(base, full);
    if (shouldSkip(rel)) continue;
    if (entry.isDirectory()) {
      out.push(...(await walk(full, base)));
    } else {
      out.push(rel);
    }
  }
  return out;
}

const files = await walk(root);

const force = process.argv.includes("--force");

// Refuse to delete something that looks like a real project rather than a
// previous scaffold. This script removes the target outright.
try {
  const head = await readFile(join(target, ".git", "HEAD"), "utf8");
  if (head && !force) {
    console.error(`${target} is a git repository. Pass --force to overwrite it.`);
    process.exit(1);
  }
} catch {
  // No .git, so it is not a repository. Fine to replace.
}

for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    await rm(target, { recursive: true, force: true });
    break;
  } catch (error) {
    if (attempt === 3) {
      console.error(`could not clear ${target}: ${error.message}`);
      console.error("a process may still be running there; stop it and retry");
      process.exit(1);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

await mkdir(target, { recursive: true });

for (const rel of files) {
  const destination = join(target, rel);
  await mkdir(join(destination, ".."), { recursive: true });
  await cp(join(root, rel), destination);
}

const replaced = await applyName(target, slug);

console.log(`scaffolded ${slug} at ${target}`);
console.log(`  files      ${files.length}`);
console.log(`  renamed in ${replaced.join(", ") || "nothing"}`);
console.log("");
console.log("next:");
console.log(`  cd ${relative(root, target) || "."}`);
console.log("  cp .env.example .dev.vars   # fill in secrets");
console.log("  pnpm install");
console.log("  pnpm db:migrate");
console.log("  pnpm preview");
console.log("");
console.log("Before deploying, set wrangler.jsonc database_id to a real D1 database.");
