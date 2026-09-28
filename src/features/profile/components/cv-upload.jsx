"use client";

import { useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/features/profile/api/profile-api";
import { AVATAR_ACCEPT, CV_ACCEPT } from "@/features/profile/constants/routes";

export function CvUpload() {
  const cvInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUploading }] = useUpdateProfileMutation();

  async function uploadFile(field, file) {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append(field, file);

    try {
      await updateProfile(formData).unwrap();
      toast.success(`${field === "cv" ? "CV" : "Avatar"} uploaded`);
    } catch (error) {
      toast.error(error?.data?.message || `Failed to upload ${field}`);
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">
          Loading files...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>CV & avatar</CardTitle>
        <CardDescription>
          Upload your resume and an optional profile photo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3 rounded-lg border p-4">
          <div>
            <p className="font-medium">CV / Resume</p>
            <p className="text-sm text-muted-foreground">
              PDF, DOC, or DOCX up to 5 MB.
            </p>
          </div>
          {profile?.has_cv ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm">Your CV is uploaded.</p>
              <Button asChild variant="outline" size="sm">
                <a href={profile.cv} target="_blank" rel="noreferrer">
                  Download CV
                </a>
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No CV uploaded yet.</p>
          )}
          <Input
            ref={cvInputRef}
            type="file"
            accept={CV_ACCEPT}
            onChange={(event) => uploadFile("cv", event.target.files?.[0])}
            disabled={isUploading}
          />
        </div>

        <div className="space-y-3 rounded-lg border p-4">
          <div>
            <p className="font-medium">Avatar</p>
            <p className="text-sm text-muted-foreground">
              JPG, PNG, or WEBP up to 2 MB.
            </p>
          </div>
          {profile?.avatar ? (
            <img
              src={profile.avatar}
              alt="Profile avatar"
              className="h-24 w-24 rounded-full border object-cover"
            />
          ) : (
            <p className="text-sm text-muted-foreground">No avatar uploaded yet.</p>
          )}
          <Input
            ref={avatarInputRef}
            type="file"
            accept={AVATAR_ACCEPT}
            onChange={(event) => uploadFile("avatar", event.target.files?.[0])}
            disabled={isUploading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
