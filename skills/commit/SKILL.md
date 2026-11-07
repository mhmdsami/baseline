---
name: commit
description: Write git commit messages and branch names for this repository. Use when staging a change, writing or amending a commit message, splitting work into commits, creating a branch, or asked to commit. Produces Conventional Commits with an imperative subject of 50 characters or fewer and no AI co-author trailer.
---

# Commit

Conventional Commits, one idea per commit, imperative subject. Someone reads the message in
`git log` months later while deciding whether to revert you. Write for them.

## Subject

```
<type>(<scope>): <imperative subject>
```

| Rule | Detail |
| --- | --- |
| Length | 50 characters or fewer, including type and scope |
| Mood | Imperative: `add`, `fix`, `remove`, `rename`, `move`. Not `added`, `adds`, `adding` |
| Case | Lowercase after the colon |
| Punctuation | No trailing period, no exclamation mark |
| Lines | One line. No wrapped subjects, no ticket IDs |
| Scope | Optional, names the area: `ui`, `auth`, `platform`, `db`, `site`, `assets`, `deps` |

The subject completes the sentence "This commit will ...". If it does not, rewrite it.

## Types

| Type | Use for |
| --- | --- |
| `feat` | A capability the user can observe |
| `fix` | A defect corrected |
| `chore` | Maintenance with no behaviour change: dependencies, config, scripts |
| `docs` | Documentation, comments, AGENTS.md, README |
| `refactor` | Code reshaped with no behaviour change |
| `test` | Tests added or corrected |
| `perf` | Same behaviour, measurably faster |
| `style` | Formatting only: whitespace, ordering, quotes |
| `build` | Build system, bundler, lockfile mechanics |
| `ci` | CI configuration and workflows |

`style` and `refactor` both promise that nothing observable changed. Do not use them when something
did.

## Body

The body is optional. Write one only when the change is non-obvious: a workaround, a constraint, a
trade-off, a data migration, or a reason you rejected the obvious alternative.

- Put a blank line between the subject and the body.
- Wrap at 72 characters.
- Explain why, not what. The diff shows what.
- Plain prose. No em dashes, no bullet list that restates the diff, no "This commit ...".

If the body would say "updated the file", delete it.

## Trailers

Never add an AI co-author trailer. No `Co-authored-by:`, no `Generated-by:`, no assistant name, no
robot emoji. The commit has one author, the human running the command.

Reserve `Co-authored-by` for a real second person who wrote part of the change.

## Branches

| Prefix | Use for | Example |
| --- | --- | --- |
| `ft-` | Feature | `ft-email-sign-in` |
| `fx-` | Fix | `fx-focus-ring-contrast` |
| `ch-` | Chore | `ch-bump-next` |
| `rf-` | Refactor | `rf-split-platform-port` |

Lowercase, hyphen separated, three or four words. The prefix matches the dominant commit type on the
branch.

## Granularity

- One commit per reviewable idea. A reviewer accepts or rejects it without touching the next one.
- Never mix a refactor with a behaviour change. Land the refactor, then the behaviour. The same rule
  covers formatting with logic and a dependency bump with the code that needs it.
- Every commit builds and passes the gate. Run `pnpm gate` before pushing. A commit that cannot
  stand alone belongs squashed into one that can.
- Split by intent, not by file. A new primitive and its use in one page are one idea. A rename
  across ten files is another.

## Worked examples

**1. A fix.**

Bad: `Fixed the button focus ring.`
Past tense, a trailing period, no scope, and it does not say what changed.

Good: `fix(ui): align button focus ring with ring token`

**2. A feature.**

Bad: `feat: add auth and refactor the platform port and update env handling`
Three ideas in one commit, a refactor mixed with behaviour, no scope.

Good: `feat(auth): add email and password sign in`
One idea, scoped, imperative, 42 characters. The refactor lands separately as
`rf(platform): move env access behind the port`.

**3. A chore.**

Bad: `update stuff`
No type, no scope, no information. Nobody can review it and nobody can revert it.

Good: `chore(deps): bump next to 16.1`
Typed, scoped, specific, and the diff matches the claim.

## Before you commit

- [ ] Subject is imperative, 50 characters or fewer, no trailing period.
- [ ] The diff holds exactly one idea.
- [ ] No refactor hidden inside a behaviour change.
- [ ] The body exists only for a non-obvious change, and it explains why.
- [ ] No AI co-author and no `Co-authored-by` trailer.
- [ ] The branch uses `ft-`, `fx-`, `ch-` or `rf-`.
