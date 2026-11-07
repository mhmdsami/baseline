import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import type { Database, Env, Platform } from "../types";

interface Bindings {
  DB: D1Database;
  SITE_URL?: string;
  BETTER_AUTH_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}

function bindings(): Bindings {
  const { env } = getCloudflareContext();
  return env as unknown as Bindings;
}

export const cloudflare: Platform = {
  name: "cloudflare",

  env(): Env {
    const e = bindings();
    return {
      siteUrl: e.SITE_URL ?? "http://localhost:3000",
      authSecret: e.BETTER_AUTH_SECRET ?? "",
      googleClientId: e.GOOGLE_CLIENT_ID,
      googleClientSecret: e.GOOGLE_CLIENT_SECRET,
    };
  },

  db(): Database {
    return drizzle(bindings().DB, { schema });
  },
};
