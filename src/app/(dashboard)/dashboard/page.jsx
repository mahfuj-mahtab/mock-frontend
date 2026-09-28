"use client";

import Link from "next/link";
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
import { PROFILE_ROUTES } from "@/features/profile/constants/routes";

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
              {user?.profile?.headline ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {user.profile.headline}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={PROFILE_ROUTES.profile}>Edit profile</Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
