"use client";

import { PlayCircleOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Card, List, Space, Tag, Typography } from "antd";
import Link from "next/link";

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
    <Card
      bordered={false}
      title="Recent mock interviews"
      extra={
        <Link href={MOCK_PREP_ROUTES.history}>
          <Button type="link" icon={<RightOutlined />}>
            View all
          </Button>
        </Link>
      }
    >
      <List
        loading={isLoading}
        locale={{
          emptyText: (
            <Space direction="vertical" size="small">
              <Typography.Text type="secondary">
                No sessions yet. Start your first mock interview!
              </Typography.Text>
              <Link href={MOCK_PREP_ROUTES.setup}>
                <Button type="primary" icon={<PlayCircleOutlined />}>
                  Start now
                </Button>
              </Link>
            </Space>
          ),
        }}
        dataSource={recent}
        renderItem={(session) => (
          <List.Item
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
    </Card>
  );
}
