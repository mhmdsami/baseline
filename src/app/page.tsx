import { serializeJsonLd, websiteSchema } from "@/lib/structured-data";

const steps = [
  { label: "Set your origin", command: "SITE_URL=https://example.com" },
  { label: "Create the database", command: "pnpm db:migrate" },
  { label: "Connect Google", command: "GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET" },
  { label: "Deploy", command: "pnpm deploy" },
];

export default function Page() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center gap-12 px-6 py-24">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: escaped by serializeJsonLd
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteSchema()) }}
      />

      <header className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-tertiary">baseline</p>
        <h1 className="text-balance font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
          The app <em className="text-primary">stays</em> portable.
        </h1>
        <p className="max-w-xl text-pretty text-base leading-relaxed text-text-secondary">
          Next.js, Tailwind and shadcn in the app. Env access, the database driver, migrations and deploy sit behind a
          port, so moving to another platform means adding one adapter.
        </p>
      </header>

      <section className="flex flex-col gap-1">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-text-tertiary">Start here</p>
        <ol className="divide-y divide-border border-y border-border">
          {steps.map((step, index) => (
            <li key={step.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="flex items-baseline gap-3 text-sm">
                <span className="font-mono text-text-tertiary">{String(index + 1).padStart(2, "0")}</span>
                {step.label}
              </span>
              <code className="font-mono text-xs text-text-secondary">{step.command}</code>
            </li>
          ))}
        </ol>
      </section>

      <footer className="flex items-center justify-between font-mono text-xs text-text-tertiary">
        <span>Geist Sans for text, Geist Mono for labels, Instrument Serif for display.</span>
        <a className="text-text-secondary underline-offset-4 hover:text-foreground hover:underline" href="/login">
          Sign in
        </a>
      </footer>
    </main>
  );
}
