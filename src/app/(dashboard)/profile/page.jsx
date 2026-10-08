"use client";

import { Tabs, Typography } from "antd";

import { PageContainer } from "@/components/layout/page-container";
import {
  CvUpload,
  EducationList,
  ExperienceList,
  ProfileForm,
  SkillsList,
} from "@/features/profile";

const { Paragraph } = Typography;

const tabItems = [
  {
    key: "about",
    label: "About",
    children: <ProfileForm />,
  },
  {
    key: "experience",
    label: "Experience",
    children: <ExperienceList />,
  },
  {
    key: "education",
    label: "Education",
    children: <EducationList />,
  },
  {
    key: "skills",
    label: "Skills",
    children: <SkillsList />,
  },
  {
    key: "files",
    label: "CV & Avatar",
    children: <CvUpload />,
  },
];

export default function ProfilePage() {
  return (
    <PageContainer>
      <Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Build your professional profile for interview context and your public CV.
      </Paragraph>
      <Tabs
        defaultActiveKey="about"
        items={tabItems}
        type="card"
        destroyInactiveTabPane={false}
      />
    </PageContainer>
  );
}
