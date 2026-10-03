"use client";

import { Mic, MicOff, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function VoiceControls({
  isSpeechSupported,
  isListening,
  isSpeaking,
  displayTranscript,
  typedAnswer,
  showTextFallback,
  onToggleTextFallback,
  onStartListening,
  onStopListening,
  onTypedAnswerChange,
  onSubmit,
  isSubmitting,
}) {
  return (
    <div className="space-y-4">
      {!isSpeechSupported ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Voice input is not supported in this browser. Please type your answers
          below.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        {isSpeechSupported ? (
          <Button
            type="button"
            variant={isListening ? "destructive" : "default"}
            onClick={isListening ? onStopListening : onStartListening}
            disabled={isSubmitting || isSpeaking}
          >
            {isListening ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                Stop listening
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Start speaking
              </>
            )}
          </Button>
        ) : null}

        <Button
          type="button"
          variant="outline"
          onClick={onToggleTextFallback}
        >
          {showTextFallback ? "Hide text input" : "Type answer instead"}
        </Button>
      </div>

      {isListening ? (
        <p className="text-sm text-primary">Listening...</p>
      ) : null}

      {displayTranscript ? (
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="mb-1 text-xs text-muted-foreground">Your answer</p>
          <p className="text-sm">{displayTranscript}</p>
        </div>
      ) : null}

      {showTextFallback ? (
        <Textarea
          placeholder="Type your answer here..."
          value={typedAnswer}
          onChange={(event) => onTypedAnswerChange(event.target.value)}
          rows={4}
          disabled={isSubmitting}
        />
      ) : null}

      <Button
        className="w-full"
        onClick={onSubmit}
        disabled={
          isSubmitting ||
          (!displayTranscript && !typedAnswer.trim())
        }
      >
        {isSubmitting ? "Submitting..." : "Submit answer"}
      </Button>
    </div>
  );
}

export function ReplayButton({ onReplay, isSpeaking }) {
  return (
    <Button type="button" variant="ghost" size="sm" onClick={onReplay} disabled={isSpeaking}>
      <Volume2 className="mr-2 h-4 w-4" />
      Replay
    </Button>
  );
}
