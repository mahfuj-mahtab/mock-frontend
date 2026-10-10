"use client";

import { FileText, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/features/profile/api/profile-api";
import { AVATAR_ACCEPT, CV_ACCEPT } from "@/features/profile/constants/routes";

function FileDropzone({ accept, disabled, hint, onFile, label }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  function handleFiles(fileList) {
    const file = fileList?.[0];
    if (file) {
      onFile(file);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={disabled}
        className={`learner-dropzone w-full${dragActive ? " learner-dropzone--active" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleFiles(event.dataTransfer.files);
        }}
      >
        <Upload size={22} className="text-muted-foreground" />
        <span className="font-medium text-sm">{label}</span>
        <span className="learner-dropzone-text">{hint}</span>
      </button>
    </>
  );
}

export function CvUpload() {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUploading }] = useUpdateProfileMutation();
  const avatarInputRef = useRef(null);

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
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <FileText size={20} className="mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">CV / Resume</p>
              <p className="text-sm text-muted-foreground">
                PDF, DOC, or DOCX up to 5 MB.
              </p>
            </div>
          </div>
          {profile?.has_cv ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/20 px-4 py-3">
              <p className="text-sm">Your CV is uploaded.</p>
              <Button asChild variant="outline" size="sm">
                <a href={profile.cv} target="_blank" rel="noreferrer">
                  Download CV
                </a>
              </Button>
            </div>
          ) : null}
          <FileDropzone
            accept={CV_ACCEPT}
            disabled={isUploading}
            label="Drop your CV here or click to browse"
            hint="Replace an existing file by uploading again"
            onFile={(file) => uploadFile("cv", file)}
          />
        </div>

        <div className="space-y-4">
          <p className="font-medium">Profile photo</p>
          <p className="text-sm text-muted-foreground">
            JPG, PNG, or WEBP up to 2 MB.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt="Profile avatar"
                className="h-28 w-28 rounded-full border-2 border-border object-cover"
              />
            ) : (
              <div
                className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-border bg-muted/30 text-sm text-muted-foreground"
              >
                No photo
              </div>
            )}
            <div className="flex flex-col gap-2">
              <input
                ref={avatarInputRef}
                type="file"
                accept={AVATAR_ACCEPT}
                className="hidden"
                disabled={isUploading}
                onChange={(event) => {
                  uploadFile("avatar", event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                onClick={() => avatarInputRef.current?.click()}
              >
                Change photo
              </Button>
            </div>
          </div>
          <FileDropzone
            accept={AVATAR_ACCEPT}
            disabled={isUploading}
            label="Or drag a photo here"
            hint="Square images work best"
            onFile={(file) => uploadFile("avatar", file)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
