import { ProtectedRoute } from "@/components/layout/protected-route";
import { OnboardingGuard } from "@/components/layout/onboarding-guard";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <OnboardingGuard>{children}</OnboardingGuard>
    </ProtectedRoute>
  );
}
