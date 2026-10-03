"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetSessionsQuery } from "@/features/mock-prep/api/mock-prep-api";
import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";

export function RecentSessions() {
  const { data: sessions = [], isLoading } = useGetSessionsQuery();

  const recent = sessions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent mock interviews</CardTitle>
        <CardDescription>Your latest practice sessions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading sessions...</p>
        ) : recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No sessions yet. Start your first mock interview!
          </p>
        ) : (
          recent.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-medium">{session.track?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {session.level} · {session.status} ·{" "}
                  {new Date(session.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link
                  href={
                    session.status === "completed"
                      ? MOCK_PREP_ROUTES.summary(session.id)
                      : MOCK_PREP_ROUTES.session(session.id)
                  }
                >
                  View
                </Link>
              </Button>
            </div>
          ))
        )}
        <Button asChild variant="outline" className="w-full">
          <Link href={MOCK_PREP_ROUTES.history}>View all sessions</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
