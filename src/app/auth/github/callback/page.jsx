import { Suspense } from "react";

import { GitHubCallbackHandler } from "@/features/auth/components/github-callback-handler";

export default function GitHubCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Signing you in with GitHub...</p>
        </div>
      }
    >
      <GitHubCallbackHandler />
    </Suspense>
  );
}
