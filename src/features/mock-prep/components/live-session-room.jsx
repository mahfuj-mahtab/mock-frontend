"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  useCompleteSessionMutation,
  useGetSessionQuery,
  useSubmitTurnMutation,
} from "@/features/mock-prep/api/mock-prep-api";
import { MOCK_PREP_ROUTES } from "@/features/mock-prep/constants/routes";
import { useSpeechRecognition } from "@/features/mock-prep/hooks/use-speech-recognition";
import { useSpeechSynthesis } from "@/features/mock-prep/hooks/use-speech-synthesis";

import { SessionTimer } from "./session-timer";
import { ReplayButton, VoiceControls } from "./voice-controls";

function getLatestInterviewerMessage(turns) {
  const interviewerTurns = turns.filter((turn) => turn.role === "interviewer");
  return interviewerTurns[interviewerTurns.length - 1]?.content || "";
}

export function LiveSessionRoom({ sessionId }) {
  const router = useRouter();
  const hasSpokenRef = useRef(false);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [showTextFallback, setShowTextFallback] = useState(false);

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

  const latestMessage = useMemo(
    () => getLatestInterviewerMessage(session?.turns || []),
    [session?.turns]
  );

  const progressLabel = session
    ? `Question ${session.current_question_index + 1} of ${session.target_question_count}`
    : "";

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

  async function handleEndEarly() {
    try {
      await completeSession(sessionId).unwrap();
      router.push(MOCK_PREP_ROUTES.summary(sessionId));
    } catch {
      toast.error("Failed to end session.");
    }
  }

  if (isLoading || !session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading session...</p>
      </div>
    );
  }

  if (session.status === "setup") {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">Session has not been started yet.</p>
          <Button asChild className="mt-4">
            <Link href={MOCK_PREP_ROUTES.setup}>Back to setup</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle>
                {session.track?.name} · {session.level}
              </CardTitle>
              <CardDescription>{progressLabel}</CardDescription>
            </div>
            <SessionTimer
              startedAt={session.started_at}
              durationMinutes={session.duration_minutes}
              onExpire={handleExpire}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border bg-muted/20 p-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Interviewer
              </p>
              <ReplayButton
                onReplay={() => speak(latestMessage)}
                isSpeaking={isSpeaking}
              />
            </div>
            <p className="text-base leading-relaxed">
              {latestMessage || "Waiting for interviewer..."}
            </p>
            {isSpeaking ? (
              <p className="mt-2 text-sm text-primary">Speaking...</p>
            ) : null}
          </div>

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
            variant="outline"
            className="w-full"
            onClick={handleEndEarly}
            disabled={isSubmitting || isCompleting}
          >
            End session early
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
