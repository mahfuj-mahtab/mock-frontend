"use client";

import { LearnerPageHeader } from "@/components/dashboard/learner-page-header";
import { PageContainer } from "@/components/layout/page-container";
import { SetupForm } from "@/features/mock-prep/components/setup-form";

export default function MockPrepPage() {
  return (
    <PageContainer width="narrow">
      <LearnerPageHeader
        title="Mock interview"
        subtitle="Choose your track, level, and stack. Practice out loud with an AI interviewer and get scored feedback when you finish."
      />
      <SetupForm />
    </PageContainer>
  );
}
