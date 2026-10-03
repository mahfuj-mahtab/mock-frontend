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
import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";

export function SessionSummaryView({ session }) {
  const summary = session.summary || {};
  const breakdown = summary.question_breakdown || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Session Summary</CardTitle>
          <CardDescription>
            {session.track?.name} · {session.level} ·{" "}
            {session.ended_at
              ? new Date(session.ended_at).toLocaleString()
              : "In progress"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {summary.overall_score != null ? (
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className="text-sm text-muted-foreground">Overall score</p>
              <p className="text-4xl font-bold">{summary.overall_score}/10</p>
            </div>
          ) : (
            <p className="text-muted-foreground">Summary is being generated...</p>
          )}

          {summary.strengths?.length ? (
            <div>
              <h3 className="mb-2 font-medium">Strengths</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {summary.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {summary.weaknesses?.length ? (
            <div>
              <h3 className="mb-2 font-medium">Areas to improve</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {summary.weaknesses.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {summary.recommendations?.length ? (
            <div>
              <h3 className="mb-2 font-medium">Recommendations</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {summary.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {breakdown.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Question breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {breakdown.map((item) => (
              <div key={item.question_id} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="font-medium">{item.question_prompt}</p>
                  <span className="shrink-0 text-sm font-medium">
                    {item.score}/10
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.feedback}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href={MOCK_PREP_ROUTES.setup}>Start another session</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={MOCK_PREP_ROUTES.history}>View history</Link>
        </Button>
      </div>
    </div>
  );
}
