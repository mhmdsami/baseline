// Matching for skill activation. Pure, so it can be tested without a harness.
//
// Keywords match on word boundaries, so "pr" does not fire inside "prompt".
// Multi-word keywords match as a phrase. Patterns cap their gaps, so a match
// means the words appear near each other, not anywhere in a long prompt.

const MAX_GAP = 40;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function keywordPattern(keyword) {
  const body = keyword.split(/\s+/).map(escapeRegExp).join("\\s+");
  return new RegExp(`\\b${body}\\b`, "i");
}

function intentPattern(pattern) {
  const bounded = pattern.replaceAll(".*?", `.{0,${MAX_GAP}}?`);
  return new RegExp(bounded, /[A-Z]/.test(pattern) ? "" : "i");
}

export function normalize(text) {
  return String(text ?? "").toLowerCase();
}

export function matchSkills(prompt, rules) {
  const text = normalize(prompt);
  if (!text.trim()) return [];

  const ignored = new Set((rules.ignore ?? []).map((word) => word.toLowerCase()));
  const matches = [];

  for (const [name, rule] of Object.entries(rules.skills ?? {})) {
    let score = 0;

    for (const keyword of rule.keywords ?? []) {
      const words = keyword.toLowerCase().split(/\s+/);
      if (words.length === 1 && ignored.has(words[0])) continue;
      if (keywordPattern(keyword).test(text)) score += 2;
    }

    for (const pattern of rule.intentPatterns ?? []) {
      if (intentPattern(pattern).test(text)) score += 1;
    }

    if (score > 0) matches.push({ name, score, description: rule.description ?? "" });
  }

  return matches.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

export function formatSuggestion(matches) {
  if (matches.length === 0) return "";
  const lines = matches.map((match) => `- ${match.name}: ${match.description}`);
  return `Relevant skills in this repo:\n${lines.join("\n")}`;
}
