"use client";

import { RocketOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, Grid, Select, Space, Steps, Tag, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  mockPrepApi,
  useCreateSessionMutation,
  useGetTechnologiesQuery,
  useGetTracksQuery,
  useStartSessionMutation,
} from "@/features/mock-prep/api/mock-prep-api";
import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";
import { ENGINEER_LEVELS, PROFILE_ROUTES } from "@/features/profile/constants/routes";
import {
  getApiErrorMessage,
  isSessionAlreadyStartedError,
} from "@/lib/api/transform-response";
import { useAppDispatch } from "@/lib/store/hooks";

const LEVEL_OPTIONS = ENGINEER_LEVELS.filter((level) => level.value);

function formatLevelLabel(value) {
  return LEVEL_OPTIONS.find((option) => option.value === value)?.label || value;
}

export function SetupForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const isSubmittingRef = useRef(false);
  const screens = Grid.useBreakpoint();
  const { data: tracks = [], isLoading: tracksLoading } = useGetTracksQuery();
  const [trackId, setTrackId] = useState("");
  const [levelOverride, setLevelOverride] = useState(null);
  const [selectedTechIds, setSelectedTechIds] = useState([]);

  const level = levelOverride ?? user?.profile?.level ?? "";

  const { data: technologies = [], isLoading: techLoading } =
    useGetTechnologiesQuery(trackId, { skip: !trackId });

  const [createSession, { isLoading: isCreating }] = useCreateSessionMutation();
  const [startSession, { isLoading: isStarting }] = useStartSessionMutation();

  const profileLevel = user?.profile?.level;

  function selectTrack(id) {
    setTrackId(id);
    setSelectedTechIds([]);
  }

  const currentStep = useMemo(() => {
    if (!trackId) {
      return 0;
    }
    if (!level) {
      return 1;
    }
    if (selectedTechIds.length === 0) {
      return 2;
    }
    return 3;
  }, [trackId, level, selectedTechIds.length]);

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

    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    try {
      let session = await createSession({
        track_id: trackId,
        level,
        technology_ids: selectedTechIds,
      }).unwrap();

      const sessionId = session?.id;
      if (!sessionId) {
        toast.error("Could not create session. Please try again.");
        return;
      }

      if (session.status === "setup") {
        try {
          session = await startSession(sessionId).unwrap();
        } catch (startError) {
          if (!isSessionAlreadyStartedError(startError)) {
            throw startError;
          }
          const refetch = await dispatch(
            mockPrepApi.endpoints.getSession.initiate(sessionId, {
              forceRefetch: true,
            })
          );
          if (refetch.data) {
            session = refetch.data;
          }
        }
      }

      dispatch(
        mockPrepApi.util.upsertQueryData("getSession", sessionId, session)
      );
      router.push(MOCK_PREP_ROUTES.session(sessionId));
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Failed to start mock interview.")
      );
    } finally {
      isSubmittingRef.current = false;
    }
  }

  const isLoading = tracksLoading || isCreating || isStarting;
  const canStart = trackId && level && selectedTechIds.length > 0;
  const showTrackTiles = screens.md;

  return (
    <Card
      bordered={false}
      className="learner-surface-card"
      title="Configure your session"
      extra={
        <Typography.Text type="secondary">~40 min · 15–20 questions</Typography.Text>
      }
      styles={{ body: { padding: 24 } }}
    >
      {profileLevel ? (
        <div className="learner-profile-level-strip">
          Using your profile level: <strong>{formatLevelLabel(profileLevel)}</strong>.
          {" "}
          <Link href={PROFILE_ROUTES.profile}>Update in profile</Link>
        </div>
      ) : null}

      <Steps
        size="small"
        current={currentStep}
        className="learner-setup-steps"
        style={{ marginBottom: 24 }}
        items={[
          { title: "Track" },
          { title: "Level" },
          { title: "Tech" },
          { title: "Start" },
        ]}
      />

      <Alert
        type="info"
        showIcon
        message="Verbal mock interview"
        description="An AI interviewer will ask questions from the bank. Use your microphone or type answers. You'll get scores and feedback at the end."
        style={{ marginBottom: 24 }}
      />

      <Form layout="vertical" onFinish={handleStart}>
        <Form.Item label="Interview track" required>
          {showTrackTiles ? (
            <div
              style={{
                display: "grid",
                gap: 10,
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              }}
            >
              {tracks.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  className={`learner-track-tile${
                    trackId === track.id ? " learner-track-tile--selected" : ""
                  }`}
                  onClick={() => selectTrack(track.id)}
                  disabled={tracksLoading}
                >
                  <Typography.Text strong>{track.name}</Typography.Text>
                </button>
              ))}
            </div>
          ) : (
            <Select
              placeholder="Select track"
              loading={tracksLoading}
              value={trackId || undefined}
              onChange={selectTrack}
              options={tracks.map((track) => ({
                value: track.id,
                label: track.name,
              }))}
            />
          )}
        </Form.Item>

        <Form.Item label="Your level" required>
          <Select
            placeholder="Select level"
            value={level || undefined}
            onChange={setLevelOverride}
            options={LEVEL_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
          />
        </Form.Item>

        <Form.Item label="Technologies" required>
          {!trackId ? (
            <Typography.Text type="secondary">
              Select a track first to see available technologies.
            </Typography.Text>
          ) : techLoading ? (
            <Typography.Text type="secondary">Loading technologies...</Typography.Text>
          ) : (
            <Space size={[8, 8]} wrap>
              {technologies.map((tech) => {
                const isSelected = selectedTechIds.includes(tech.id);
                return (
                  <Tag.CheckableTag
                    key={tech.id}
                    checked={isSelected}
                    onChange={() => toggleTechnology(tech.id)}
                    style={{ padding: "4px 12px", fontSize: 14 }}
                  >
                    {tech.name}
                  </Tag.CheckableTag>
                );
              })}
            </Space>
          )}
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            icon={<RocketOutlined />}
            loading={isLoading}
            disabled={!canStart}
          >
            Start mock interview
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
