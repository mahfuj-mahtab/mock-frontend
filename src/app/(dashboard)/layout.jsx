import { ProtectedRoute } from "@/components/layout/protected-route";

export default function DashboardLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
