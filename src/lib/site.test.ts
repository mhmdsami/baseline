import assert from "node:assert/strict";
import test from "node:test";
import { absoluteUrl, indexableRoutes, isIndexable, routes } from "./site.ts";
import { serializeJsonLd, websiteSchema } from "./structured-data.ts";

test("absoluteUrl resolves against the site url", () => {
  assert.equal(new URL(absoluteUrl("/about")).pathname, "/about");
});

test("indexableRoutes drops noindex routes", () => {
  const all = [...routes, { path: "/private", changeFrequency: "never" as const, priority: 0.1, noindex: true }];
  assert.equal(all.length, routes.length + 1);
  assert.equal(indexableRoutes(all).length, routes.length);
  assert.ok(indexableRoutes(all).every((route) => !route.noindex));
});

test("isIndexable defaults to true and honours the opt-out", () => {
  assert.equal(isIndexable(), process.env.NEXT_PUBLIC_ROBOTS !== "noindex");
});

test("website schema has the required fields", () => {
  const schema = websiteSchema();
  assert.equal(schema["@context"], "https://schema.org");
  assert.equal(schema["@type"], "WebSite");
  assert.ok(schema.name);
  assert.ok(schema.url);
});

test("serialized json-ld escapes angle brackets", () => {
  assert.equal(serializeJsonLd({ a: "</script>" }), '{"a":"\\u003c/script>"}');
});
