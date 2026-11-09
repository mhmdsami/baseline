import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/sign-in-button";
import { getSession } from "@/lib/session";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklch,var(--primary)_12%,transparent),transparent)]"
      />
      <div className="relative w-full max-w-sm rounded-lg border border-border bg-card p-8 shadow-[0_18px_50px_-30px_rgb(0_0_0/0.9)]">
        <h1 className="font-display text-2xl tracking-tight">{site.name}</h1>
        <p className="mt-1 text-xs text-text-tertiary">{site.tagline}</p>
        <h2 className="mt-7 text-base font-medium">Sign in</h2>
        <div className="mt-6">
          <SignInButton />
        </div>
      </div>
    </main>
  );
}
