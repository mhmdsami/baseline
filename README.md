# baseline

A Next.js starter with a portable core. Env access, the database driver, migrations and deploy sit
behind a port, so the app never imports a hosting provider.

## Stack

| Piece | Choice |
|---|---|
| Framework | Next 16, App Router |
| Styles | Tailwind v4, shadcn (`base-nova`) |
| Body type | Geist Sans |
| Mono | Geist Mono, for code and labels |
| Display type | Instrument Serif, rationed |
| Metadata | Generated OG cards, sitemap, robots, manifest, JSON-LD |

## Use it

```sh
pnpm install
pnpm dev
```

Check a change:

```sh
pnpm gate
```

## Layout

```
src/app/            routes, layout, metadata routes (robots, sitemap, manifest, opengraph-image)
src/components/ui/  shadcn primitives
src/lib/            shared helpers, site config, structured data
src/platform/       the port and its adapters
assets/             icon source, and the Instrument Serif ttf used by both the browser and the
                    Open Graph card
scripts/            smoke, asset generation, font fetch
```

## The port

Application code never imports provider packages. To add a platform, add one adapter under
`src/platform/` and leave the app alone. `AGENTS.md` has the full rule.

## Notes

- Use `pnpm` only. pnpm 12 blocks dependency build scripts, so `pnpm-workspace.yaml` allowlists them.
- Geist Sans and Geist Mono come from the `geist` package. Instrument Serif is vendored. Both are
  under the SIL Open Font License 1.1.
