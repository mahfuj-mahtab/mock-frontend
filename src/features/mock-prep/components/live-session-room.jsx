"use client";

import {
  App,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Progress,
  Row,
  Spin,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { PageContainer } from "@/components/layout/page-container";
import {
  useCompleteSessionMutation,
  useGetSessionQuery,
  useSubmitTurnMutation,
} from "@/features/mock-prep/api/mock-prep-api";
import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";
import { useSpeechRecognition } from "@/features/mock-prep/hooks/use-speech-recognition";
import { useSpeechSynthesis } from "@/features/mock-prep/hooks/use-speech-synthesis";

import { SessionTimer } from "./session-timer";
import { ReplayButton, VoiceControls } from "./voice-controls";

const { Text } = Typography;

function getLatestInterviewerMessage(turns) {
  const interviewerTurns = turns.filter((turn) => turn.role === "interviewer");
  return interviewerTurns[interviewerTurns.length - 1]?.content || "";
}

function formatLevel(level) {
  if (!level) {
    return "";
  }
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function TurnBubble({ turn, isLatestInterviewer, onReplay, isSpeaking }) {
  const isInterviewer = turn.role === "interviewer";
  const score = turn.ai_metadata?.answer_score;
  const feedback = turn.ai_metadata?.feedback;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isInterviewer ? "flex-start" : "flex-end",
        marginBottom: 12,
      }}
    >
      <div
        className={[
          isInterviewer ? "chat-bubble-interviewer" : "chat-bubble-user",
          isLatestInterviewer ? "chat-bubble-latest" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          maxWidth: "88%",
          padding: "12px 14px",
          borderRadius: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <Text
            type={isInterviewer ? "secondary" : undefined}
            className={isInterviewer ? undefined : "chat-bubble-label-user"}
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            {isInterviewer ? "Interviewer" : "You"}
          </Text>
          {isInterviewer && isLatestInterviewer ? (
            <ReplayButton onReplay={onReplay} isSpeaking={isSpeaking} />
          ) : null}
        </div>
        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.55 }}>{turn.content}</div>
        {!isInterviewer && score != null ? (
          <Text
            className="chat-bubble-score-user"
            style={{
              display: "block",
              marginTop: 8,
              fontSize: 12,
            }}
          >
            Score: {score}/10
            {feedback ? ` — ${feedback}` : ""}
          </Text>
        ) : null}
      </div>
    </div>
  );
}

export function LiveSessionRoom({ sessionId }) {
  const { modal } = App.useApp();
  const router = useRouter();
  const transcriptEndRef = useRef(null);
  const hasSpokenRef = useRef(false);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [showTextFallback, setShowTextFallback] = useState(false);
  const [lastTurnFeedback, setLastTurnFeedback] = useState(null);

  const { data: session, isLoading, refetch } = useGetSessionQuery(sessionId);
  const [submitTurn, { isLoading: isSubmitting }] = useSubmitTurnMutation();
  const [completeSession, { isLoading: isCompleting }] = useCompleteSessionMutation();

  const {
    isSupported: isSpeechSupported,
    isListening,
    displayTranscript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const { isSpeaking, speak, cancel } = useSpeechSynthesis();

  const turns = session?.turns || [];

  const latestMessage = useMemo(
    () => getLatestInterviewerMessage(turns),
    [turns]
  );

  const latestInterviewerTurnId = useMemo(() => {
    const interviewerTurns = turns.filter((turn) => turn.role === "interviewer");
    return interviewerTurns[interviewerTurns.length - 1]?.id;
  }, [turns]);

  const progressPercent = session
    ? Math.round(
        ((session.current_question_index + 1) / session.target_question_count) * 100
      )
    : 0;

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns.length, displayTranscript, lastTurnFeedback]);

  useEffect(() => {
    if (!latestMessage || hasSpokenRef.current) {
      return;
    }
    speak(latestMessage);
    hasSpokenRef.current = true;
  }, [latestMessage, speak]);

  useEffect(() => {
    if (session?.status === "completed") {
      router.replace(MOCK_PREP_ROUTES.summary(sessionId));
    }
  }, [session?.status, sessionId, router]);

  const handleExpire = useCallback(async () => {
    try {
      await completeSession(sessionId).unwrap();
      router.push(MOCK_PREP_ROUTES.summary(sessionId));
    } catch {
      toast.error("Failed to complete session.");
    }
  }, [completeSession, sessionId, router]);

  async function handleSubmit() {
    const content = showTextFallback ? typedAnswer.trim() : displayTranscript.trim();
    if (!content) {
      toast.error("Please provide an answer before submitting.");
      return;
    }

    stopListening();
    cancel();

    try {
      const result = await submitTurn({ sessionId, content }).unwrap();
      hasSpokenRef.current = false;
      resetTranscript();
      setTypedAnswer("");
      setLastTurnFeedback(
        result.feedback || result.answer_score != null
          ? {
              score: result.answer_score,
              feedback: result.feedback,
            }
          : null
      );

      if (result.interviewer_message) {
        speak(result.interviewer_message);
        hasSpokenRef.current = true;
      }

      if (result.is_complete) {
        router.push(MOCK_PREP_ROUTES.summary(sessionId));
      } else {
        await refetch();
      }
    } catch (error) {
      const message =
        error?.data?.errors?.detail?.[0] ||
        error?.data?.message ||
        "Failed to submit answer.";
      toast.error(message);
    }
  }

  function handleEndEarly() {
    modal.confirm({
      title: "End session early?",
      content: "You will receive a summary based on the conversation so far.",
      okText: "End session",
      okType: "danger",
      onOk: async () => {
        try {
          await completeSession(sessionId).unwrap();
          router.push(MOCK_PREP_ROUTES.summary(sessionId));
        } catch {
          toast.error("Failed to end session.");
        }
      },
    });
  }

  if (isLoading || !session) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <Spin size="large" tip="Loading session..." />
      </div>
    );
  }

  if (session.status === "setup") {
    return (
      <PageContainer width="narrow">
        <Card bordered={false}>
          <Empty description="Session has not been started yet.">
            <Link href={MOCK_PREP_ROUTES.setup}>
              <Button type="primary">Back to setup</Button>
            </Link>
          </Empty>
        </Card>
      </PageContainer>
    );
  }

  const techNames = session.technologies?.map((t) => t.name) || [];

  const statusBadge = isListening
    ? { text: "Listening", status: "processing" }
    : isSpeaking
      ? { text: "Speaking", status: "warning" }
      : isSubmitting
        ? { text: "Submitting", status: "default" }
        : { text: "Ready", status: "success" };

  return (
    <PageContainer width="wide">
      <Row gutter={[24, 24]} align="top">
        <Col xs={24} lg={7}>
          <div className="session-sidebar-sticky">
            <Card bordered={false} title="Session overview">
              <Typography.Title level={5} style={{ marginTop: 0 }}>
                {session.track?.name}
              </Typography.Title>
              <Tag>{formatLevel(session.level)}</Tag>
              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {techNames.map((name) => (
                  <Tag key={name} color="default">{name}</Tag>
                ))}
              </div>
              <Divider style={{ margin: "16px 0" }} />
              <Text type="secondary">
                Question {session.current_question_index + 1} of{" "}
                {session.target_question_count}
              </Text>
              <Progress
                percent={progressPercent}
                strokeColor="#e5e5e5"
                style={{ marginTop: 8 }}
              />
              <Divider style={{ margin: "16px 0" }} />
              <SessionTimer
                startedAt={session.started_at}
                durationMinutes={session.duration_minutes}
                onExpire={handleExpire}
              />
              <div style={{ marginTop: 16 }}>
                <Badge status={statusBadge.status} text={statusBadge.text} />
              </div>
            </Card>
          </div>
        </Col>

        <Col xs={24} lg={17}>
          <Card
            bordered={false}
            title="Conversation"
            extra={
              <Text type="secondary" style={{ fontSize: 12 }}>
                Scroll to review earlier turns
              </Text>
            }
          >
            <div className="session-transcript">
              {turns.length === 0 ? (
                <Empty
                  description="Waiting for interviewer..."
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                turns.map((turn) => (
                  <TurnBubble
                    key={turn.id}
                    turn={turn}
                    isLatestInterviewer={
                      turn.id === latestInterviewerTurnId && turn.role === "interviewer"
                    }
                    onReplay={() => speak(latestMessage)}
                    isSpeaking={isSpeaking}
                  />
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>

            {lastTurnFeedback?.feedback || lastTurnFeedback?.score != null ? (
              <div className="turn-feedback-banner">
                {lastTurnFeedback.score != null ? (
                  <Text strong>Last answer: {lastTurnFeedback.score}/10</Text>
                ) : null}
                {lastTurnFeedback.feedback ? (
                  <div style={{ marginTop: 4 }}>{lastTurnFeedback.feedback}</div>
                ) : null}
              </div>
            ) : null}

            <VoiceControls
              isSpeechSupported={isSpeechSupported}
              isListening={isListening}
              isSpeaking={isSpeaking}
              displayTranscript={showTextFallback ? "" : displayTranscript}
              typedAnswer={typedAnswer}
              showTextFallback={showTextFallback || !isSpeechSupported}
              onToggleTextFallback={() => setShowTextFallback((prev) => !prev)}
              onStartListening={startListening}
              onStopListening={stopListening}
              onTypedAnswerChange={setTypedAnswer}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting || isCompleting}
            />

            <Button
              danger
              type="text"
              block
              style={{ marginTop: 12 }}
              onClick={handleEndEarly}
              disabled={isSubmitting || isCompleting}
            >
              End session early
            </Button>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
}
