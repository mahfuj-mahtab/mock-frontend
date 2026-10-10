"use client";

import {
  EnvironmentOutlined,
  GithubOutlined,
  GlobalOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { Space, Tabs, Tag, Typography } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { LearnerPageHeader } from "@/components/dashboard/learner-page-header";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";
import { useGetProfileQuery } from "@/features/profile/api/profile-api";
import { CvUpload } from "@/features/profile/components/cv-upload";
import { EducationList } from "@/features/profile/components/education-list";
import { ExperienceList } from "@/features/profile/components/experience-list";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { ProfileReadinessCard } from "@/features/profile/components/profile-readiness-card";
import { SkillsList } from "@/features/profile/components/skills-list";
import { ENGINEER_LEVELS } from "@/features/profile/constants/routes";

const { Text, Paragraph } = Typography;

const VALID_TABS = ["about", "experience", "education", "skills", "files"];

function getInitials(user) {
  const first = user?.first_name?.[0] || "";
  const last = user?.last_name?.[0] || "";
  if (first || last) {
    return `${first}${last}`.toUpperCase();
  }
  return user?.email?.[0]?.toUpperCase() || "?";
}

function levelLabel(value) {
  return ENGINEER_LEVELS.find((option) => option.value === value)?.label || null;
}

export function ProfilePageShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { data: profile, isLoading } = useGetProfileQuery();

  const activeTab = useMemo(() => {
    const tab = searchParams.get("tab");
    return VALID_TABS.includes(tab) ? tab : "about";
  }, [searchParams]);

  const setTab = useCallback(
    (key) => {
      router.replace(`/profile?tab=${key}`, { scroll: false });
    },
    [router]
  );

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "Your profile";

  const tabItems = [
    { key: "about", label: "About", children: <ProfileForm /> },
    { key: "experience", label: "Experience", children: <ExperienceList /> },
    { key: "education", label: "Education", children: <EducationList /> },
    { key: "skills", label: "Skills", children: <SkillsList /> },
    { key: "files", label: "CV & Avatar", children: <CvUpload /> },
  ];

  return (
    <PageContainer>
      <LearnerPageHeader
        title="Profile"
        subtitle="Build your professional profile for interview context and your public CV."
      />

      <div className="learner-profile-hero">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            alignItems: "flex-start",
          }}
        >
          {profile?.avatar ? (
            <img
              src={profile.avatar}
              alt=""
              className="learner-profile-hero-avatar"
            />
          ) : (
            <div className="learner-profile-hero-initials">{getInitials(user)}</div>
          )}
          <div style={{ flex: 1, minWidth: 200 }}>
            <Typography.Title level={4} style={{ marginTop: 0, marginBottom: 4 }}>
              {displayName}
            </Typography.Title>
            {isLoading ? (
              <Text type="secondary">Loading...</Text>
            ) : (
              <>
                {profile?.headline ? (
                  <Paragraph style={{ marginBottom: 8 }}>{profile.headline}</Paragraph>
                ) : (
                  <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                    Add a headline to stand out in interviews.
                  </Text>
                )}
                <Space wrap size={[8, 8]}>
                  {profile?.level ? (
                    <Tag>{levelLabel(profile.level)}</Tag>
                  ) : null}
                  {profile?.location ? (
                    <Text type="secondary">
                      <EnvironmentOutlined /> {profile.location}
                    </Text>
                  ) : null}
                </Space>
                <Space wrap size="middle" style={{ marginTop: 12 }}>
                  {profile?.linkedin_url ? (
                    <a href={profile.linkedin_url} target="_blank" rel="noreferrer">
                      <LinkedinOutlined /> LinkedIn
                    </a>
                  ) : null}
                  {profile?.github_url ? (
                    <a href={profile.github_url} target="_blank" rel="noreferrer">
                      <GithubOutlined /> GitHub
                    </a>
                  ) : null}
                  {profile?.portfolio_url ? (
                    <a href={profile.portfolio_url} target="_blank" rel="noreferrer">
                      <GlobalOutlined /> Portfolio
                    </a>
                  ) : null}
                </Space>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="learner-profile-layout">
        <aside className="learner-profile-sidebar">
          <ProfileReadinessCard />
          <Paragraph type="secondary" style={{ fontSize: 12, marginTop: 16 }}>
            <Link href={MOCK_PREP_ROUTES.setup}>Configure a mock interview</Link> — your
            profile level pre-fills session setup when set.
          </Paragraph>
        </aside>
        <div>
          <Tabs
            activeKey={activeTab}
            onChange={setTab}
            items={tabItems}
            type="line"
            className="learner-profile-tabs"
            destroyInactiveTabPane={false}
          />
        </div>
      </div>
    </PageContainer>
  );
}
