"use client";

import { Spin } from "antd";
import { use } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { useGetSessionQuery } from "@/features/mock-prep/api/mock-prep-api";
import { SessionSummaryView } from "@/features/mock-prep/components/session-summary-view";

export default function MockPrepSummaryPage({ params }) {
  const { id } = use(params);
  const { data: session, isLoading } = useGetSessionQuery(id);

  if (isLoading || !session) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <Spin size="large" tip="Loading summary..." />
      </div>
    );
  }

  return (
    <PageContainer>
      <SessionSummaryView session={session} />
    </PageContainer>
  );
}
