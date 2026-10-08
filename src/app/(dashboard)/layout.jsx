import { DashboardLayoutInner } from "@/components/layout/dashboard-layout-inner";
import { OnboardingGuard } from "@/components/layout/onboarding-guard";
import { ProtectedRoute } from "@/components/layout/protected-route";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <OnboardingGuard>
        <DashboardLayoutInner>{children}</DashboardLayoutInner>
      </OnboardingGuard>
    </ProtectedRoute>
  );
}
