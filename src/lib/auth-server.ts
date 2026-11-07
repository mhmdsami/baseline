import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/schema";
import { platform } from "@/platform";

function createAuth() {
  const env = platform.env();
  const google =
    env.googleClientId && env.googleClientSecret
      ? {
          google: {
            clientId: env.googleClientId,
            clientSecret: env.googleClientSecret,
            scope: ["openid", "email", "profile"],
          },
        }
      : undefined;

  return betterAuth({
    baseURL: env.siteUrl,
    secret: env.authSecret,
    database: drizzleAdapter(platform.db(), { provider: "sqlite", schema }),
    socialProviders: google,
    session: { cookieCache: { enabled: true, maxAge: 60 } },
  });
}

type Auth = ReturnType<typeof createAuth>;

let cached: Auth | undefined;

export function auth(): Auth {
  cached ??= createAuth();
  return cached;
}
