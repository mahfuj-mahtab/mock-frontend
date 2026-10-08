"use client";

import { PlayCircleOutlined, ProfileOutlined, TrophyOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Statistic, Typography } from "antd";
import Link from "next/link";
import { useMemo } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useGetSessionsQuery } from "@/features/mock-prep/api/mock-prep-api";
import { RecentSessions } from "@/features/mock-prep/components/recent-sessions";
import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";
import { PROFILE_ROUTES } from "@/features/profile/constants/routes";

const { Paragraph, Text } = Typography;

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: sessions = [] } = useGetSessionsQuery();

  const stats = useMemo(() => {
    const completed = sessions.filter((s) => s.status === "completed").length;
    const active = sessions.filter((s) => s.status === "active").length;
    return { total: sessions.length, completed, active };
  }, [sessions]);

  return (
    <PageContainer>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card bordered={false}>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} lg={14}>
              <Typography.Title level={3} style={{ marginTop: 0 }}>
                Welcome back{user?.first_name ? `, ${user.first_name}` : ""}
              </Typography.Title>
              <Paragraph type="secondary" style={{ marginBottom: 16, maxWidth: 520 }}>
                Practice technical interviews with an AI interviewer, get instant
                feedback, and build confidence before the real thing.
              </Paragraph>
              <Space wrap>
                <Link href={MOCK_PREP_ROUTES.setup}>
                  <Button type="primary" size="large" icon={<PlayCircleOutlined />}>
                    Start mock interview
                  </Button>
                </Link>
                <Link href={PROFILE_ROUTES.profile}>
                  <Button size="large" icon={<ProfileOutlined />}>
                    Edit profile
                  </Button>
                </Link>
              </Space>
            </Col>
            <Col xs={24} lg={10}>
              <div className="dashboard-profile-strip">
                <Text type="secondary">Signed in as</Text>
                <div>
                  <Text strong>{user?.email}</Text>
                </div>
                {user?.profile?.headline ? (
                  <Paragraph type="secondary" style={{ marginBottom: 0, marginTop: 8 }}>
                    {user.profile.headline}
                  </Paragraph>
                ) : null}
              </div>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card bordered={false}>
              <Statistic title="Total sessions" value={stats.total} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false}>
              <Statistic
                title="Completed"
                value={stats.completed}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false}>
              <Statistic title="In progress" value={stats.active} />
            </Card>
          </Col>
        </Row>

        <RecentSessions />
      </Space>
    </PageContainer>
  );
}
