"use client";

import { PageContainer } from "@/components/layout/page-container";
import { SetupForm } from "@/features/mock-prep/components/setup-form";

export default function MockPrepPage() {
  return (
    <PageContainer width="narrow">
      <SetupForm />
    </PageContainer>
  );
}
