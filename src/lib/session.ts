import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "./auth-server";

/**
 * The single place a project adds an authorization policy.
 *
 * The template ships no policy on purpose: any Google account can sign in and
 * every signed-in user is equal. When a project needs roles, an allowlist, or
 * per-resource grants, it is added here and nowhere else.
 */
export const getSession = cache(async () => {
  return auth().api.getSession({ headers: await headers() });
});

export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session.user;
}
