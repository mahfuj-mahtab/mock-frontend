"use client";

import { Suspense } from "react";

import { ProfilePageShell } from "@/features/profile";

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfilePageShell />
    </Suspense>
  );
}
