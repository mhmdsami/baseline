// Skill activation hook for opencode.
//
// Reads the user prompt, matches it against skills/skill-rules.json, appends a
// suggestion to the message, and logs the decision so the wiring can be checked
// from the log.

import { appendFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { formatSuggestion, matchSkills } from "../../scripts/skills/match.mjs";

const LOG = join(process.cwd(), ".opencode", "skills-activation.log");

function rules() {
  return JSON.parse(readFileSync(join(process.cwd(), "skills", "skill-rules.json"), "utf8"));
}

function log(entry) {
  try {
    appendFileSync(LOG, `${new Date().toISOString()} ${JSON.stringify(entry)}\n`);
  } catch {}
}

export const server = async () => ({
  "chat.message": async (_input, output) => {
    try {
      const prompt = (output.parts ?? [])
        .filter((part) => part.type === "text")
        .map((part) => part.text ?? "")
        .join("\n");

      const matches = matchSkills(prompt, rules());
      log({ event: "skill-activation", matched: matches.map((match) => match.name) });

      const suggestion = formatSuggestion(matches);
      if (suggestion) {
        output.parts = [...output.parts, { type: "text", text: `\n\n${suggestion}` }];
      }
    } catch (error) {
      log({ event: "skill-activation-error", message: String(error) });
    }
  },
});
