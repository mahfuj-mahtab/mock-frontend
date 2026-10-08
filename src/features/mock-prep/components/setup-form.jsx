"use client";

import { RocketOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, Select, Space, Steps, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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
  const canStart = trackId && level && selectedTechIds.length > 0;

  return (
    <Card
      bordered={false}
      title="Configure your session"
      extra={
        <Typography.Text type="secondary">~40 min · 15–20 questions</Typography.Text>
      }
    >
      <Steps
        size="small"
        current={currentStep}
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
          <Select
            placeholder="Select track"
            loading={tracksLoading}
            value={trackId || undefined}
            onChange={setTrackId}
            options={tracks.map((track) => ({
              value: track.id,
              label: track.name,
            }))}
          />
        </Form.Item>

        <Form.Item label="Your level" required>
          <Select
            placeholder="Select level"
            value={level || undefined}
            onChange={setLevel}
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
