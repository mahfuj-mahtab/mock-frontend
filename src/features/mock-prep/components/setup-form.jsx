"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  useCreateSessionMutation,
  useGetTechnologiesQuery,
  useGetTracksQuery,
  useStartSessionMutation,
} from "@/features/mock-prep/api/mock-prep-api";
import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";
import { ENGINEER_LEVELS } from "@/features/profile/constants/routes";

const LEVEL_OPTIONS = ENGINEER_LEVELS.filter((level) => level.value);

export function SetupForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: tracks = [], isLoading: tracksLoading } = useGetTracksQuery();
  const [trackId, setTrackId] = useState("");
  const [level, setLevel] = useState(user?.profile?.level || "");
  const [selectedTechIds, setSelectedTechIds] = useState([]);

  const { data: technologies = [], isLoading: techLoading } =
    useGetTechnologiesQuery(trackId, { skip: !trackId });

  const [createSession, { isLoading: isCreating }] = useCreateSessionMutation();
  const [startSession, { isLoading: isStarting }] = useStartSessionMutation();

  useEffect(() => {
    if (user?.profile?.level && !level) {
      setLevel(user.profile.level);
    }
  }, [user, level]);

  useEffect(() => {
    setSelectedTechIds([]);
  }, [trackId]);

  function toggleTechnology(techId) {
    setSelectedTechIds((prev) =>
      prev.includes(techId)
        ? prev.filter((id) => id !== techId)
        : [...prev, techId]
    );
  }

  async function handleStart() {
    if (!trackId || !level || selectedTechIds.length === 0) {
      toast.error("Please select a track, level, and at least one technology.");
      return;
    }

    try {
      const session = await createSession({
        track_id: trackId,
        level,
        technology_ids: selectedTechIds,
      }).unwrap();

      await startSession(session.id).unwrap();
      router.push(MOCK_PREP_ROUTES.session(session.id));
    } catch (error) {
      const message =
        error?.data?.errors?.detail?.[0] ||
        error?.data?.message ||
        "Failed to start mock interview.";
      toast.error(message);
    }
  }

  const isLoading = tracksLoading || isCreating || isStarting;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mock Interview Prep</CardTitle>
        <CardDescription>
          Select your interview track, level, and technologies. You will have 40
          minutes for 15–20 verbal questions with an AI interviewer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="track">Interview track</Label>
          <Select
            id="track"
            value={trackId}
            onChange={(event) => setTrackId(event.target.value)}
            disabled={tracksLoading}
          >
            <option value="">Select track</option>
            {tracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select
            id="level"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
          >
            <option value="">Select level</option>
            {LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Technologies (select at least one)</Label>
          {!trackId ? (
            <p className="text-sm text-muted-foreground">
              Select a track first to see available technologies.
            </p>
          ) : techLoading ? (
            <p className="text-sm text-muted-foreground">Loading technologies...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => {
                const isSelected = selectedTechIds.includes(tech.id);
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => toggleTechnology(tech.id)}
                    className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-muted"
                    }`}
                  >
                    {tech.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <Button
          className="w-full"
          onClick={handleStart}
          disabled={isLoading || !trackId || !level || selectedTechIds.length === 0}
        >
          {isLoading ? "Starting..." : "Start Mock Interview"}
        </Button>
      </CardContent>
    </Card>
  );
}
