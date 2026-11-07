import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { formatSuggestion, matchSkills } from "./match.mjs";

const rules = JSON.parse(readFileSync(new URL("../../skills/skill-rules.json", import.meta.url), "utf8"));

test("a design prompt activates design-language", () => {
  const matches = matchSkills("this page looks cramped, check the spacing", rules);
  assert.equal(matches[0].name, "design-language");
});

test("keywords match on word boundaries only", () => {
  const matches = matchSkills("prompt engineering", rules);
  assert.ok(!matches.some((match) => match.name === "to-tickets"));
});

test("generic words alone never activate a skill", () => {
  assert.deepEqual(matchSkills("fix the config and plan the test", rules), []);
});

test("intent patterns require the words near each other", () => {
  const close = matchSkills("make the panel feel alive", rules);
  assert.ok(close.some((match) => match.name === "animate"));

  const far = matchSkills(`make ${"x ".repeat(200)} feel alive`, rules);
  assert.ok(!far.some((match) => match.name === "animate"));
});

test("empty prompts return nothing", () => {
  assert.deepEqual(matchSkills("", rules), []);
});

test("suggestion text names each skill", () => {
  const text = formatSuggestion(matchSkills("break the ui with long names", rules));
  assert.match(text, /break-ui/);
});
