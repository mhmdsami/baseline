import assert from "node:assert/strict";
import test from "node:test";
import { cn } from "./utils.ts";

test("cn joins classes", () => {
  assert.equal(cn("a", "b"), "a b");
});

test("cn drops conflicting tailwind classes", () => {
  assert.equal(cn("px-2", "px-4"), "px-4");
});

test("cn ignores falsy values", () => {
  assert.equal(cn("a", false, undefined, null, "b"), "a b");
});
