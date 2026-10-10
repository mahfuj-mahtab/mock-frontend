"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSpeechSynthesis() {
  const [isSupported] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text) => {
      if (!text || typeof window === "undefined" || !window.speechSynthesis) {
        return;
      }

      cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [cancel]
  );

  return {
    isSupported,
    isSpeaking,
    speak,
    cancel,
  };
}
