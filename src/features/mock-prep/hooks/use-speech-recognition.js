"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function getSpeechRecognition() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function useSpeechRecognition() {
  const recognitionRef = useRef(null);
  const [isSupported] = useState(() => Boolean(getSpeechRecognition()));
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      let finalText = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalText) {
        setTranscript((prev) => `${prev}${finalText}`.trim());
      }
      setInterimTranscript(interim);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || isListening) {
      return;
    }

    setInterimTranscript("");
    setIsListening(true);
    recognition.start();
  }, [isListening]);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || !isListening) {
      return;
    }

    recognition.stop();
    setIsListening(false);
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  const displayTranscript = `${transcript}${interimTranscript ? ` ${interimTranscript}` : ""}`.trim();

  return {
    isSupported,
    isListening,
    transcript,
    displayTranscript,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  };
}
