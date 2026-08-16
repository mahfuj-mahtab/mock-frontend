"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { useAuth } from "@/features/auth/hooks/use-auth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push(AUTH_ROUTES.login);
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>
              Welcome back{user?.first_name ? `, ${user.first_name}` : ""}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-background p-4">
              <p className="text-sm text-muted-foreground">Signed in as</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
