"use client";

import { use } from "react";

import { LiveSessionRoom } from "@/features/mock-prep/components/live-session-room";

export default function MockPrepSessionPage({ params }) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-3xl">
        <LiveSessionRoom sessionId={id} />
      </div>
    </div>
  );
}
