"use client";

import {
  PlayCircleOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";
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
import { PROFILE_ROUTES } from "@/features/profile";
import { getProfileCompleteness } from "@/features/profile/utils/profile-completeness";

const { Text, Title } = Typography;

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
      <div className="learner-home">
        <div className="learner-home-top">
          <div>
            <Title level={3} className="learner-home-title">
              Welcome back, {displayName}
            </Title>
            {percent < 100 ? (
              <p className="learner-home-note">
                <Text type="secondary">
                  Profile is {percent}% complete.{" "}
                  <Link href={PROFILE_ROUTES.profile}>Finish it</Link>
                </Text>
              </p>
            ) : null}
          </div>
          <Link href={MOCK_PREP_ROUTES.setup}>
            <Button type="primary" size="large" icon={<PlayCircleOutlined />}>
              Start mock interview
            </Button>
          </Link>
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
      </div>
    </PageContainer>
  );
}
