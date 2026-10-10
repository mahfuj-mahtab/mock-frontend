"use client";

import {
  PlayCircleOutlined,
  ProfileOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Row, Space, Typography } from "antd";
import Link from "next/link";
import { useMemo } from "react";

import { LearnerStatTile } from "@/components/dashboard/learner-stat-tile";
import { PageContainer } from "@/components/layout/page-container";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useGetSessionsQuery } from "@/features/mock-prep/api/mock-prep-api";
import { RecentSessions } from "@/features/mock-prep/components/recent-sessions";
import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";
import {
  useGetEducationQuery,
  useGetExperiencesQuery,
  useGetProfileQuery,
  useGetSkillsQuery,
} from "@/features/profile/api/profile-api";
import {
  PROFILE_ROUTES,
  ProfileReadinessCard,
} from "@/features/profile";
import { getProfileCompleteness } from "@/features/profile/utils/profile-completeness";

const { Paragraph, Text, Title } = Typography;

function getInitials(user) {
  const first = user?.first_name?.[0] || "";
  const last = user?.last_name?.[0] || "";
  if (first || last) {
    return `${first}${last}`.toUpperCase();
  }
  return user?.email?.[0]?.toUpperCase() || "?";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: sessions = [] } = useGetSessionsQuery();
  const { data: profile } = useGetProfileQuery();
  const { data: experiences = [] } = useGetExperiencesQuery();
  const { data: educations = [] } = useGetEducationQuery();
  const { data: skills = [] } = useGetSkillsQuery();

  const stats = useMemo(() => {
    const completed = sessions.filter((s) => s.status === "completed").length;
    const active = sessions.filter((s) => s.status === "active").length;
    return { total: sessions.length, completed, active };
  }, [sessions]);

  const { percent } = getProfileCompleteness({
    profile,
    experiences,
    educations,
    skills,
  });

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "there";

  return (
    <PageContainer>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div className="learner-page-hero">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} lg={16}>
              <Space align="start" size="middle" style={{ marginBottom: 16 }}>
                <Avatar
                  size={56}
                  src={user?.profile?.avatar || profile?.avatar || undefined}
                  style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
                >
                  {getInitials(user)}
                </Avatar>
                <div>
                  <Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>
                    Welcome back, {displayName}
                  </Title>
                  {user?.profile?.headline || profile?.headline ? (
                    <Text type="secondary">
                      {user?.profile?.headline || profile?.headline}
                    </Text>
                  ) : (
                    <Text type="secondary">
                      Practice technical interviews with an AI interviewer.
                    </Text>
                  )}
                </div>
              </Space>
              <Paragraph type="secondary" style={{ marginBottom: 16, maxWidth: 520 }}>
                Get instant feedback, build confidence, and show up ready for the real
                loop.
              </Paragraph>
              <Space wrap>
                <Link href={MOCK_PREP_ROUTES.setup}>
                  <Button type="primary" size="large" icon={<PlayCircleOutlined />}>
                    Start mock interview
                  </Button>
                </Link>
                {percent < 100 ? (
                  <Link href={PROFILE_ROUTES.profile}>
                    <Button size="large" icon={<ProfileOutlined />}>
                      Complete profile ({percent}%)
                    </Button>
                  </Link>
                ) : (
                  <Link href={PROFILE_ROUTES.profile}>
                    <Button size="large" icon={<ProfileOutlined />}>
                      Edit profile
                    </Button>
                  </Link>
                )}
              </Space>
            </Col>
            <Col xs={24} lg={8}>
              <ProfileReadinessCard compact />
            </Col>
          </Row>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <LearnerStatTile
              icon={<ThunderboltOutlined />}
              label="Total sessions"
              value={stats.total}
            />
          </Col>
          <Col xs={24} sm={8}>
            <LearnerStatTile
              icon={<TrophyOutlined />}
              label="Completed"
              value={stats.completed}
            />
          </Col>
          <Col xs={24} sm={8}>
            <LearnerStatTile
              icon={<PlayCircleOutlined />}
              label="In progress"
              value={stats.active}
            />
          </Col>
        </Row>

        <RecentSessions />
      </Space>
    </PageContainer>
  );
}
