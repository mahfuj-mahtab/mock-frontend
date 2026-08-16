"use client";

import { useEffect } from "react";

import { useLazyGetMeQuery } from "@/features/auth/api/auth-api";
import { setInitialized } from "@/features/auth/store/auth-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

export function AuthInitializer({ children }) {
  const dispatch = useAppDispatch();
  const { accessToken, isInitialized } = useAppSelector((state) => state.auth);
  const [getMe] = useLazyGetMeQuery();

  useEffect(() => {
    async function initializeAuth() {
      if (!accessToken) {
        dispatch(setInitialized(true));
        return;
      }

      try {
        await getMe().unwrap();
      } catch {
        // logout handled in auth-api onQueryStarted
      } finally {
        dispatch(setInitialized(true));
      }
    }

    if (!isInitialized) {
      initializeAuth();
    }
  }, [accessToken, dispatch, getMe, isInitialized]);

  return children;
}
