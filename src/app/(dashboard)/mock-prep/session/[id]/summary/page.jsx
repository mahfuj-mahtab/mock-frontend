"use client";

import Link from "next/link";
import { use } from "react";

import { Button } from "@/components/ui/button";
import { useGetSessionQuery } from "@/features/mock-prep/api/mock-prep-api";
import { SessionSummaryView } from "@/features/mock-prep/components/session-summary-view";
import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";

export default function MockPrepSummaryPage({ params }) {
  const { id } = use(params);
  const { data: session, isLoading } = useGetSessionQuery(id);

  if (isLoading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Loading summary...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <Button asChild variant="ghost" size="sm">
          <Link href={MOCK_PREP_ROUTES.setup}>← Back to mock prep</Link>
        </Button>
        <SessionSummaryView session={session} />
      </div>
    </div>
  );
}
