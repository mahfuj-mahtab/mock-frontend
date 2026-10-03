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

export default function MockPrepHistoryPage() {
  const { data: sessions = [], isLoading } = useGetSessionsQuery();

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Session history</h1>
          <Button asChild variant="outline" size="sm">
            <Link href={MOCK_PREP_ROUTES.setup}>New session</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All mock interviews</CardTitle>
            <CardDescription>Review past practice sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sessions yet.</p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{session.track?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.level} · {session.status} ·{" "}
                      {session.target_question_count} questions ·{" "}
                      {new Date(session.created_at).toLocaleString()}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
