"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignInButton() {
  const [pending, setPending] = useState(false);

  return (
    <Button
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await authClient.signIn.social({ provider: "google", callbackURL: "/" });
        setPending(false);
      }}
    >
      {pending ? "Redirecting" : "Continue with Google"}
    </Button>
  );
}
