import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/sign-in-button";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-8 px-6">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-tertiary">baseline</p>
        <h1 className="font-display text-4xl italic leading-tight tracking-tight">Sign in</h1>
        <p className="text-sm text-text-secondary">
          Any Google account can sign in. The template ships no policy, so add one in{" "}
          <code className="font-mono text-text-secondary">src/lib/session.ts</code> when a project needs it.
        </p>
      </header>
      <SignInButton />
    </main>
  );
}
