"use client";

import { logout } from "@/features/auth/store/auth-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    isInitialized,
    logout: handleLogout,
  };
}
