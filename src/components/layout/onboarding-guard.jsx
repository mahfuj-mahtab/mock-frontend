"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { PROFILE_ROUTES } from "@/features/profile/constants/routes";

export function OnboardingGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized || !isAuthenticated) {
      return;
    }

    const onboardingCompleted = user?.profile?.onboarding_completed === true;
    const isOnboardingRoute = pathname === PROFILE_ROUTES.onboarding;
    const isDashboardRoute = pathname === AUTH_ROUTES.dashboard;

    if (isOnboardingRoute && onboardingCompleted) {
      router.replace(AUTH_ROUTES.dashboard);
      return;
    }

    if (isDashboardRoute && !onboardingCompleted) {
      router.replace(PROFILE_ROUTES.onboarding);
    }
  }, [isAuthenticated, isInitialized, pathname, router, user]);

  return children;
}
