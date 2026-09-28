"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  CvUpload,
  EducationList,
  ExperienceList,
  ProfileForm,
  SkillsList,
} from "@/features/profile";
import { AUTH_ROUTES } from "@/features/auth/constants/routes";

const tabs = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "files", label: "CV & Avatar" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Engineer profile</h1>
            <p className="text-sm text-muted-foreground">
              Build your LinkedIn-style CV with experience, skills, and uploads.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={AUTH_ROUTES.dashboard}>Back to dashboard</Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              type="button"
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === "about" ? <ProfileForm /> : null}
        {activeTab === "experience" ? <ExperienceList /> : null}
        {activeTab === "education" ? <EducationList /> : null}
        {activeTab === "skills" ? <SkillsList /> : null}
        {activeTab === "files" ? <CvUpload /> : null}
      </div>
    </div>
  );
}
