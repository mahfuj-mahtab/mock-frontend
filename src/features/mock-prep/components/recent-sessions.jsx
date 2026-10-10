"use client";

import { HistoryOutlined, PlayCircleOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Card, List, Space, Tag, Typography } from "antd";
import Link from "next/link";

import { LearnerEmptyState } from "@/components/dashboard/learner-empty-state";
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
    return "";
  }
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function RecentSessions() {
  const { data: sessions = [], isLoading } = useGetSessionsQuery();

  const recent = sessions.slice(0, 5);

  return (
    <Card bordered={false} className="learner-surface-card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          padding: "16px 16px 0",
        }}
      >
        <Typography.Title level={5} style={{ margin: 0 }}>
          Recent mock interviews
        </Typography.Title>
        <Link href={MOCK_PREP_ROUTES.history}>
          <Button type="link" icon={<RightOutlined />}>
            View all
          </Button>
        </Link>
      </div>
      <div style={{ padding: "0 8px 8px" }}>
        <List
          loading={isLoading}
          locale={{ emptyText: " " }}
          dataSource={recent}
          renderItem={(session) => (
            <List.Item
              className="learner-session-row"
              actions={[
                <Link
                  key="view"
                  href={
                    session.status === "completed"
                      ? MOCK_PREP_ROUTES.summary(session.id)
                      : MOCK_PREP_ROUTES.session(session.id)
                  }
                >
                  <Button type="link">Open</Button>
                </Link>,
              ]}
            >
              <List.Item.Meta
                title={session.track?.name}
                description={
                  <Space size={4} wrap>
                    <Tag color={statusColor(session.status)}>{session.status}</Tag>
                    <Typography.Text type="secondary">
                      {formatLevel(session.level)} ·{" "}
                      {new Date(session.created_at).toLocaleDateString()}
                    </Typography.Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
        {!isLoading && recent.length === 0 ? (
          <LearnerEmptyState
            icon={<HistoryOutlined />}
            title="No sessions yet"
            description="Start your first mock interview to see progress and feedback here."
            action={
              <Link href={MOCK_PREP_ROUTES.setup}>
                <Button type="primary" icon={<PlayCircleOutlined />}>
                  Start now
                </Button>
              </Link>
            }
          />
        ) : null}
      </div>
    </Card>
  );
}
