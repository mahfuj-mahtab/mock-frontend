"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { useLazyGetMeQuery } from "@/features/auth/api/auth-api";
import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { setCredentials } from "@/features/auth/store/auth-slice";
import { getPostAuthRoute } from "@/features/auth/utils/post-auth-redirect";
import { useAppDispatch } from "@/lib/store/hooks";

export function GitHubCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [getMe] = useLazyGetMeQuery();
  const hasHandledCallback = useRef(false);

  useEffect(() => {
    if (hasHandledCallback.current) {
      return;
    }
    hasHandledCallback.current = true;

    const access = searchParams.get("access");
    const refresh = searchParams.get("refresh");

    if (!access || !refresh) {
      toast.error("GitHub sign-in failed");
      router.replace(AUTH_ROUTES.login);
      return;
    }

    async function completeAuth() {
      try {
        dispatch(
          setCredentials({
            user: null,
            access,
            refresh,
          })
        );

        const result = await getMe().unwrap();
        const user = result?.data;

        if (!user) {
          throw new Error("Failed to load user profile");
        }

        dispatch(
          setCredentials({
            user,
            access,
            refresh,
          })
        );

        router.replace(getPostAuthRoute(user));
      } catch {
        toast.error("GitHub sign-in failed");
        router.replace(AUTH_ROUTES.login);
      }
    }

    completeAuth();
  }, [dispatch, getMe, router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Signing you in with GitHub...</p>
    </div>
  );
}
