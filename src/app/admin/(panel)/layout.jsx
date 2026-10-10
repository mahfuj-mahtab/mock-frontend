import { AdminProtectedRoute } from "@/components/layout/admin-protected-route";
import { AdminShell } from "@/features/admin/components/admin-shell";

export default function AdminPanelLayout({ children }) {
  return (
    <AdminProtectedRoute>
      <AdminShell>{children}</AdminShell>
    </AdminProtectedRoute>
  );
}
