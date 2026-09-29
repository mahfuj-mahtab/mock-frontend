import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { PROFILE_ROUTES } from "@/features/profile/constants/routes";

export function getPostAuthRoute(user) {
  return user?.profile?.onboarding_completed
    ? AUTH_ROUTES.dashboard
    : PROFILE_ROUTES.onboarding;
}
