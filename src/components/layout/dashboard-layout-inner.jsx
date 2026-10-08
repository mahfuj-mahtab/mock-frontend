"use client";

import { usePathname } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PROFILE_ROUTES } from "@/features/profile/constants/routes";

export function DashboardLayoutInner({ children }) {
  const pathname = usePathname();

  if (pathname === PROFILE_ROUTES.onboarding) {
    return children;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
