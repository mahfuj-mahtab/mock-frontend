"use client";

import { Button, Card, Table, Tag } from "antd";
import Link from "next/link";

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

export default function MockPrepHistoryPage() {
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

  return (
    <PageContainer>
      <Card
        bordered={false}
        title="All mock interviews"
        extra={
          <Link href={MOCK_PREP_ROUTES.setup}>
            <Button type="primary">New session</Button>
          </Link>
        }
      >
        <Table
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={sessions}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: "No sessions yet." }}
          size="middle"
        />
      </Card>
    </PageContainer>
  );
}
