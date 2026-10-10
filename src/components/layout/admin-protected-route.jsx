"use client";

import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ADMIN_ROUTES } from "@/features/admin/constants/routes";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function AdminProtectedRoute({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized } = useAuth();

  const isStaff = Boolean(user?.is_staff || user?.is_superuser);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    if (!isAuthenticated) {
      router.replace(ADMIN_ROUTES.login);
      return;
    }
    if (!isStaff) {
      router.replace(ADMIN_ROUTES.login);
    }
  }, [isAuthenticated, isInitialized, isStaff, router]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated || !isStaff) {
    return null;
  }

  return children;
}
