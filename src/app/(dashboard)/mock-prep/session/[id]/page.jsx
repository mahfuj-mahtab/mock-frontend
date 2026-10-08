"use client";

import { use } from "react";

import { LiveSessionRoom } from "@/features/mock-prep/components/live-session-room";

export default function MockPrepSessionPage({ params }) {
  const { id } = use(params);

  return <LiveSessionRoom sessionId={id} />;
}
