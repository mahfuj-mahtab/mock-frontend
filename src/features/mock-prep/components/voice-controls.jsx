"use client";

import { AudioOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Input, Space, Typography } from "antd";

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
    <Card
      size="small"
      title="Your response"
      bordered={false}
      className="voice-response-panel"
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {!isSpeechSupported ? (
          <Alert
            type="warning"
            showIcon
            message="Voice input is not supported in this browser. Type your answer below."
          />
        ) : null}

        <Space wrap>
          {isSpeechSupported ? (
            <Button
              type={isListening ? "primary" : "default"}
              danger={isListening}
              icon={<AudioOutlined />}
              onClick={isListening ? onStopListening : onStartListening}
              disabled={isSubmitting || isSpeaking}
            >
              {isListening ? "Stop listening" : "Start speaking"}
            </Button>
          ) : null}

          <Button icon={<EditOutlined />} onClick={onToggleTextFallback}>
            {showTextFallback ? "Hide text input" : "Type instead"}
          </Button>
        </Space>

        {isListening ? (
          <Alert type="info" showIcon message="Listening — speak your answer clearly." />
        ) : null}

        {displayTranscript ? (
          <div className="voice-captured-answer">
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Captured answer
            </Typography.Text>
            <div style={{ marginTop: 4 }}>{displayTranscript}</div>
          </div>
        ) : null}

        {showTextFallback ? (
          <Input.TextArea
            placeholder="Type your answer here..."
            value={typedAnswer}
            onChange={(event) => onTypedAnswerChange(event.target.value)}
            rows={4}
            disabled={isSubmitting}
            showCount
            maxLength={4000}
          />
        ) : null}

        <Button
          type="primary"
          block
          size="large"
          icon={<SendOutlined />}
          onClick={onSubmit}
          loading={isSubmitting}
          disabled={!displayTranscript && !typedAnswer.trim()}
        >
          Submit answer
        </Button>
      </Space>
    </Card>
  );
}

export function ReplayButton({ onReplay, isSpeaking }) {
  return (
    <Button type="link" size="small" onClick={onReplay} disabled={isSpeaking}>
      Replay audio
    </Button>
  );
}
