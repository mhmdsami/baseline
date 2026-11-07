export const site = {
  name: "baseline",
  title: "baseline",
  tagline: "A Next.js starter with a portable core.",
  description:
    "Next.js, Tailwind and shadcn in the app. Env access, the database driver, migrations and deploy behind a port, so a platform change touches one adapter.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "http://localhost:3000",
  author: { name: "Sami", url: "https://sam1.space" },
  locale: "en",
} as const;

// Mirrors --background, --primary and --foreground in globals.css. The manifest
// and theme-color need hex, and the tokens are oklch.
export const colors = {
  background: "#0a0a0a",
  primary: "#87b697",
  foreground: "#f5f5f5",
} as const;

export interface RouteEntry {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
  /** Excluded from the sitemap and marked noindex. */
  noindex?: boolean;
}

/**
 * Single source for the sitemap and for anything that needs the route list.
 * A route marked noindex is skipped, which is what keeps the sitemap honest
 * when indexing is on by default.
 */
export const routes: RouteEntry[] = [{ path: "/", changeFrequency: "weekly", priority: 1 }];

export function indexableRoutes(list: RouteEntry[] = routes): RouteEntry[] {
  return list.filter((route) => !route.noindex);
}

export function isIndexable(): boolean {
  return process.env.NEXT_PUBLIC_ROBOTS !== "noindex";
}

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}
