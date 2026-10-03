"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SetupForm } from "@/features/mock-prep/components/setup-form";
import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";

export default function MockPrepPage() {
  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex justify-end">
          <Button asChild variant="outline" size="sm">
            <Link href={MOCK_PREP_ROUTES.history}>Session history</Link>
          </Button>
        </div>
        <SetupForm />
      </div>
    </div>
  );
}
