"use client";

import { CheckCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Button, Progress, Typography } from "antd";
import Link from "next/link";

import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";
import {
  useGetEducationQuery,
  useGetExperiencesQuery,
  useGetProfileQuery,
  useGetSkillsQuery,
} from "@/features/profile/api/profile-api";
import { getProfileCompleteness } from "@/features/profile/utils/profile-completeness";

const { Text } = Typography;

export function ProfileReadinessCard({ compact = false }) {
  const { data: profile } = useGetProfileQuery();
  const { data: experiences = [] } = useGetExperiencesQuery();
  const { data: educations = [] } = useGetEducationQuery();
  const { data: skills = [] } = useGetSkillsQuery();

  const { percent, items } = getProfileCompleteness({
    profile,
    experiences,
    educations,
    skills,
  });

  const incomplete = items.filter((item) => !item.done);

  return (
    <div className="learner-readiness-card">
      <div
        style={{
          display: "flex",
          alignItems: compact ? "center" : "flex-start",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <Progress
          type="circle"
          percent={percent}
          size={compact ? 72 : 88}
          strokeColor="hsl(0 0% 75%)"
        />
        <div style={{ flex: 1, minWidth: 160 }}>
          <Text strong style={{ display: "block", marginBottom: 4 }}>
            Interview readiness
          </Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            A complete profile helps mock sessions match your level and gives you a
            stronger public CV.
          </Text>
        </div>
      </div>

      {incomplete.length > 0 ? (
        <ul className="learner-readiness-checklist">
          {incomplete.map((item) => (
            <li key={item.key}>
              <span style={{ color: "hsl(var(--muted-foreground))", marginTop: 2 }}>
                ○
              </span>
              <Link href={item.href} style={{ color: "inherit" }}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircleOutlined style={{ color: "#52c41a" }} />
          <Text type="secondary" style={{ fontSize: 13 }}>
            Profile looks great — you&apos;re ready to practice.
          </Text>
        </div>
      )}

      <Link href={MOCK_PREP_ROUTES.setup} style={{ display: "block", marginTop: 16 }}>
        <Button type="primary" block icon={<PlayCircleOutlined />}>
          Start mock interview
        </Button>
      </Link>
    </div>
  );
}
