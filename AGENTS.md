# AGENTS.md

You are working in baseline, a starter template. It is a Next.js app with a portable core. The
application does not know which platform it runs on. Copies of this repo become real projects, so
nothing here may be specific to one product.

## The port

Platform code sits behind a port. Application code must not import anything from a hosting provider.

- `src/platform/` holds the interfaces and the adapters. `src/platform/cloudflare/` is the first
  adapter.
- Nothing outside an adapter imports `wrangler`, `@cloudflare/workers-types`, `getCloudflareContext`
  or `drizzle-orm/d1`, and nothing outside an adapter references `D1Database`.
- Environment values come from the port, not from a provider global.
- Migrations and deploy belong to the adapter. `drizzle-kit generate` writes the SQL and the adapter
  applies it.

`pnpm boundaries` fails when application code reaches a provider. If a change needs the app to know
its platform, change the port.

## Layout

- `src/app/` holds routes and the layout. `globals.css` holds the tokens.
- `src/components/ui/` holds the shadcn primitives. Use them before writing raw styles.
- `src/lib/` holds shared helpers. `utils.ts` contains only `cn()`.
- `scripts/smoke.mjs` starts the dev server on `SMOKE_PORT` and checks that routes render.

## Design language

- Black surfaces, one green accent.
- Body text is Geist Sans. Code, labels and tabular data are Geist Mono. Display text is
  Instrument Serif. Sans and Mono come from the `geist` package; Instrument Serif is vendored.
- The display face is rationed. Use it for at most one line per screen area and two per route. Never
  use it for body copy, labels, buttons, table cells, navigation or error text. If a second line
  wants to be display, it is body type. `pnpm display` fails the build above the limit.
- Tokens are `oklch` custom properties in `globals.css`. Do not write raw colours, spacing or radii
  in components. Use the token and the `@theme` name.
- Primitives first. If a screen needs markup styled from scratch, add a primitive.

## Metadata

- `src/lib/site.ts` holds the name, description, canonical URL, colours and route list. Adding a
  route means adding it there, otherwise the sitemap misses it.
- `layout.tsx` holds the metadata defaults: `metadataBase`, the title template, canonical, Open
  Graph and Twitter. A page overrides what it needs and inherits the rest.
- `sitemap.ts` reads the route list and skips anything marked `noindex`. Indexing is on by default
  and `NEXT_PUBLIC_ROBOTS=noindex` turns it off. Next reads that value at build time, so changing it
  needs a rebuild.
- `opengraph-image.tsx` generates the cards at build time. They are not committed.
- Icons are generated. Change `assets/icon.svg`, run `pnpm assets` and commit the output.
- `colors` in `site.ts` repeats the `oklch` tokens as hex because the manifest and `theme-color`
  need hex. Change both together.
- `SITE_URL` must be set at build time as well as at runtime. `robots.txt`, `sitemap.xml` and the
  Open Graph card are prerendered, so a runtime-only value leaves localhost URLs in the output. Set
  it in the build environment, for example `SITE_URL=https://example.com pnpm build`.
- The Open Graph renderer runs inside the Worker, where project files do not exist. `pnpm fonts`
  writes the display face into `src/app/og-font.ts` as base64 for that reason. Do not read fonts
  from disk in a route.

## Conventions

- Conventional Commits, imperative subject, 50 characters or fewer, one line, no AI co-author
  trailer.
- Branch prefixes: `ft-`, `fx-`, `ch-`, `rf-`.
- No new dependencies without asking. Every project scaffolded from this template inherits them.
- Prose is plain. No em dashes, no filler, no stock framing.

## Commands

- `pnpm dev` starts the dev server.
- `pnpm types` runs `tsc --noEmit`.
- `pnpm lint` and `pnpm lint:fix` run biome.
- `pnpm test` runs `node --test`.
- `pnpm smoke` starts the dev server and checks that the shell renders.
- `pnpm assets` regenerates the icons from `assets/icon.svg`.
- `pnpm fonts` regenerates the Open Graph font from upstream.
- `pnpm boundaries` checks the port.
- `pnpm display` checks the display face budget.
- `pnpm gate` runs types, lint, boundaries, display, test, build and smoke. Run it before pushing.

## Working here

- Use `pnpm` only. The lockfile is `pnpm-lock.yaml`. Build scripts are allowlisted in
  `pnpm-workspace.yaml` under `allowBuilds`, because pnpm 12 blocks them otherwise.
- Geist Sans and Geist Mono come from the `geist` package under the SIL Open Font License 1.1.
  Instrument Serif is committed once under `assets/fonts/`, with the same file inlined as base64
  for the Open Graph card.
- Never commit secrets. `.env.example` documents the names only.

## Next 16

This is not the Next.js in your training data. APIs, conventions and file structure changed. Read
the guide in `node_modules/next/dist/docs/` before writing code, and check deprecation notices.
`agentRules` is off in `next.config.ts`, so Next does not append its own notes to this file.
