"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { useAuth } from "@/features/auth/hooks/use-auth";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    router.replace(
      isAuthenticated ? AUTH_ROUTES.dashboard : AUTH_ROUTES.login
    );
  }, [isAuthenticated, isInitialized, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
  );
}
