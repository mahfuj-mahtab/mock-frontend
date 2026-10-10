"use client";

import { HistoryOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Button, Card, Grid, Table, Tag } from "antd";
import Link from "next/link";

import { LearnerEmptyState } from "@/components/dashboard/learner-empty-state";
import { LearnerPageHeader } from "@/components/dashboard/learner-page-header";
import { PageContainer } from "@/components/layout/page-container";
import { useGetSessionsQuery } from "@/features/mock-prep/api/mock-prep-api";
import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";

function statusColor(status) {
  if (status === "completed") {
    return "success";
  }
  if (status === "active") {
    return "processing";
  }
  return "default";
}

function formatLevel(level) {
  if (!level) {
    return "—";
  }
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function SessionCard({ session }) {
  return (
    <div className="learner-history-card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {session.track?.name || "—"}
          </div>
          <div style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>
            {formatLevel(session.level)} · {new Date(session.created_at).toLocaleString()}
          </div>
          <Tag color={statusColor(session.status)} style={{ marginTop: 8 }}>
            {session.status}
          </Tag>
        </div>
        <Link
          href={
            session.status === "completed"
              ? MOCK_PREP_ROUTES.summary(session.id)
              : MOCK_PREP_ROUTES.session(session.id)
          }
        >
          <Button type="link" size="small">Open</Button>
        </Link>
      </div>
    </div>
  );
}

export default function MockPrepHistoryPage() {
  const screens = Grid.useBreakpoint();
  const { data: sessions = [], isLoading } = useGetSessionsQuery();

  const columns = [
    {
      title: "Track",
      dataIndex: ["track", "name"],
      key: "track",
      render: (_, record) => record.track?.name || "—",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      render: (level) => formatLevel(level),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColor(status)}>{status}</Tag>,
    },
    {
      title: "Questions",
      dataIndex: "target_question_count",
      key: "questions",
      width: 100,
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      title: "",
      key: "action",
      width: 90,
      render: (_, session) => (
        <Link
          href={
            session.status === "completed"
              ? MOCK_PREP_ROUTES.summary(session.id)
              : MOCK_PREP_ROUTES.session(session.id)
          }
        >
          <Button type="link" size="small">Open</Button>
        </Link>
      ),
    },
  ];

  const showMobileCards = !screens.md;

  return (
    <PageContainer>
      <LearnerPageHeader
        title="Session history"
        subtitle="Review past mock interviews and pick up where you left off."
        extra={
          <Link href={MOCK_PREP_ROUTES.setup}>
            <Button type="primary">New session</Button>
          </Link>
        }
      />

      {!isLoading && sessions.length === 0 ? (
        <LearnerEmptyState
          icon={<HistoryOutlined />}
          title="No sessions yet"
          description="Your completed and in-progress mock interviews will show up here."
          action={
            <Link href={MOCK_PREP_ROUTES.setup}>
              <Button type="primary" icon={<PlayCircleOutlined />}>
                Start mock interview
              </Button>
            </Link>
          }
        />
      ) : (
        <Card bordered={false} className="learner-surface-card" styles={{ body: { padding: showMobileCards ? 16 : 24 } }}>
          {showMobileCards ? (
            isLoading ? (
              <p style={{ color: "hsl(var(--muted-foreground))" }}>Loading sessions...</p>
            ) : (
              sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))
            )
          ) : (
            <Table
              rowKey="id"
              loading={isLoading}
              columns={columns}
              dataSource={sessions}
              pagination={{ pageSize: 10, showSizeChanger: false }}
              locale={{ emptyText: "No sessions yet." }}
              size="middle"
            />
          )}
        </Card>
      )}
    </PageContainer>
  );
}
