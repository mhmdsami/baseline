---
name: design-language
description: Apply this project's design language when building or editing any screen, component, or style. Use when writing UI, adding a component, picking colours, type, spacing, or motion, or reviewing work against the house style. The answers are in globals.css, src/components/ui/, and this file, not in your taste.
---

# Design language

The look is black surfaces, one green accent, Geist Sans for body text, Geist Mono for code and labels, and
Instrument Serif set large and rarely.
Every value below exists in the repo. Use one, or extend the system.

## Rules

1. Dark only. `color-scheme: dark`, no light mode, no `.light` class, no `dark:` pairs, no theme
   toggle.
2. No raw values in components. No hex, `rgb()`, `oklch()`, pixel radii, or arbitrary spacing such as
   `p-[13px]` in `src/components/ui/` or route files. Use a token and its `@theme` name.
3. Primitives first. Style with what `src/components/ui/` provides. If a primitive is missing, add it
   there instead of pasting a styled `<div>` into a page.
4. The display face is rationed. One display line per screen area, two per route. It never appears in
   body copy, labels, buttons, table cells, navigation or error text. If a second line wants to be
   display, it is body type. `pnpm display` fails the build above the limit.
5. Run the motion gate before writing any animation. Most controls here sit above 100 uses a day and
   must not animate.
6. Extend the system rather than fork it. A new value goes into `globals.css`, and into
   `src/lib/site.ts` only when it must be hex, before it appears anywhere else.

## Colour

Tokens are `oklch` custom properties on `:root, .dark` in `src/app/globals.css`, re-exported as
Tailwind colours in `@theme inline`.

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `oklch(0.145 0 0)` | Page canvas. `bg-background` |
| `--surface-1` | `oklch(0.185 0 0)` | Cards, panels, inset sections. `bg-surface-1` |
| `--surface-2` | `oklch(0.225 0 0)` | Popovers, secondary buttons, muted blocks |
| `--surface-3` | `oklch(0.265 0 0)` | Hover, accent, the next step up |
| `--foreground` | `oklch(0.97 0 0)` | Primary text. `text-foreground` |
| `--text-secondary` | `oklch(0.72 0 0)` | Supporting copy, descriptions |
| `--text-tertiary` | `oklch(0.58 0 0)` | Micro-labels, meta, footer |
| `--primary` | `oklch(0.735 0.068 155)` | The single accent: actions, selected state, emphasis |
| `--primary-foreground` | `oklch(0.2252 0.0306 153.32)` | Text and icons on `bg-primary` |
| `--primary-hover` | `oklch(0.795 0.06 155)` | Hover for solid primary |
| `--destructive` | `oklch(0.7002 0.1535 33.14)` | Destructive actions and errors |
| `--warning` | `oklch(0.8253 0.1145 84.89)` | Warnings, degraded state |
| `--border` | `rgb(255 255 255 / 9%)` | The default hairline. `border-border` |
| `--input` | `rgb(255 255 255 / 13%)` | Form field borders |
| `--ring` | `oklch(0.735 0.068 155 / 45%)` | Focus rings only |
| `--radius` | `0.5rem` | Base radius; `--radius-sm/md/lg` derive from it |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrances, exits, transitions |

`--card`, `--popover`, `--secondary`, `--muted` and `--accent` alias the surfaces. Use the alias when
the semantic role fits (`bg-card`, `bg-muted`) and `surface-*` when you mean depth.

- One filled primary action per view. Secondary actions use `outline` or `ghost`.
- Depth comes from surface steps, not shadows. Move `background` to `surface-1` to `surface-2`.
- Dividers are `border-border`. Never a solid coloured rule.
- For a 5% hover, mix existing tokens: `color-mix(in oklch, var(--secondary), var(--foreground) 5%)`.
  Do not add a token for it.

## Type

| Role | Classes | Notes |
| --- | --- | --- |
| Body | `font-sans text-sm` or `text-base` | Geist Sans |
| Supporting copy | `text-text-secondary text-pretty leading-relaxed` | Descriptions, helper text |
| Micro-label | `font-mono text-xs uppercase tracking-[0.14em]` to `tracking-[0.18em] text-text-tertiary` | Section labels, field labels, eyebrows |
| Display | `font-display text-balance leading-[1.05] tracking-tight` | Instrument Serif, one per screen area, two per route |
| Code | `font-mono` | Same stack as body. Use it for code and identifiers |

- Body is Geist Sans from `geist/font/sans`. Do not add a second text face.
- Code, labels, numbers and identifiers are Geist Mono from `geist/font/mono`. Anything tabular or
  machine-readable sits in Mono, everything else in Sans.
- Display is Instrument Serif, loaded by `next/font/local` from
  `assets/fonts/instrument-serif-regular.ttf` and `instrument-serif-italic.ttf`. It has no bold, so
  emphasis inside a display line is `<em>`. A second display line on one screen costs the page its
  hierarchy, so demote it to body type.
- Micro-labels are uppercase with tracking between `0.14em` and `0.18em`. Lowercase micro-labels are
  a defect.
- Display lines use `text-balance` and `leading-[1.05]`. Body copy uses `text-pretty`.
- Body text is weight 400 or 500. Geist Mono at 600 and above dominates the page.

## Layout

- Spacing comes from the Tailwind scale, in multiples of `0.25rem`. Use `gap-*`, `p-*` and
  `space-y-*`. Bracketed values are a defect.
- Radius comes from the token. `rounded-lg` is `--radius-lg`, `rounded-md` is `--radius`,
  `rounded-sm` is `--radius-sm`.
- Content sits in `max-w-3xl` or narrower, with `max-w-xl` for body copy. A text line longer than
  about 75 characters is a defect.
- Section rhythm is `gap-10` at page level, `gap-4` inside cards, `gap-2` between a label and its
  value.
- Prefer borders to boxes. A grid of cards uses `border-border bg-surface-1` and lets the page
  background show through the gaps.

## Primitives

`src/components/ui/` holds the shadcn `base-nova` primitives, styled with `cva`, composed with `cn`
from `src/lib/utils.ts`, and rendered on `@base-ui/react`. `button.tsx` is the reference: variants,
sizes, `data-slot`, and a `focus-visible` ring on `--ring`.

- Import primitives instead of restyling raw elements in pages.
- Add variants to the primitive's `cva` map, not to a `className` at the call site.
- Focus stays visible: `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`.
- Every interactive element is reachable by keyboard and shows focus before it ships.

## Motion

The vocabulary is `transform` and `opacity`, and the curve is `--ease-out`. For anything beyond a
hover or press, load the `animate` skill and follow its build sequence. Its first step is a
frequency gate, and that gate applies here.

| Frequency | Decision |
| --- | --- |
| 100+ times a day (command palette, nav toggle, keyboard shortcut) | No animation |
| Tens of times a day (hover, list navigation) | Near-imperceptible, or nothing |
| Occasional (modal, drawer, toast) | Standard animation |
| Rare or first-time (onboarding, success) | Where delight belongs |

- Hover and press: a CSS transition of `150ms` to `200ms` with `var(--ease-out)`.
- Entrances: `opacity` plus `scale(0.97)`. Never `scale(0)`.
- Do not animate `width`, `height`, `margin`, `padding`, `top` or `left`. `height` is allowed for
  accordions.
- Ship reduced-motion handling with the animation, not after it.

## When the design is missing

Climb this ladder and stop at the first rung that works.

1. Compose existing primitives. Most gaps are layout, not a new component.
2. Use another token for the role. A quieter panel is `surface-2`, which already exists.
3. Mix two tokens. A hover or overlay is `color-mix(in oklch, ...)`.
4. Extend a token. Add one `oklch` property to `:root, .dark` in `globals.css`, map it in
   `@theme inline` as `--color-<name>`, and mirror it in `src/lib/site.ts` only if it must be hex for
   the manifest or `theme-color`.
5. Add a primitive. Create `src/components/ui/<name>.tsx` in the shape of `button.tsx`: `cva`
   variants, `data-slot`, `cn`, token classes only.

A one-off literal is not a rung. If you are about to write `#`, `rgb(`, `oklch(` or a bracketed pixel
value inline, you are at rung 4 or 5 and skipped it.

When you finish, state in one line what you added and why.

## Before you ship

- [ ] No raw colours, radii or bracketed spacing in the diff.
- [ ] Every colour resolves to a token name.
- [ ] Micro-labels are uppercase with tracking between `0.14em` and `0.18em`.
- [ ] At most one display line per screen area and two per route, `text-balance`.
- [ ] One primary action on the screen.
- [ ] Dark only: no light tokens, no theme toggle.
- [ ] Controls used constantly do not animate.
- [ ] Focus is visible on every interactive element.
- [ ] Anything new lives in `globals.css` or `src/components/ui/`, not inline.
