"use client";

import { useEffect, useState } from "react";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function SessionTimer({ startedAt, durationMinutes, onExpire }) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationMinutes * 60);

  useEffect(() => {
    if (!startedAt) {
      return undefined;
    }

    const endTime =
      new Date(startedAt).getTime() + durationMinutes * 60 * 1000;

    function tick() {
      const secondsLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setRemainingSeconds(secondsLeft);

      if (secondsLeft === 0) {
        onExpire?.();
      }
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt, durationMinutes, onExpire]);

  const isLow = remainingSeconds <= 5 * 60;

  return (
    <div
      className={`text-sm font-medium tabular-nums ${
        isLow ? "text-destructive" : "text-muted-foreground"
      }`}
    >
      {formatTime(remainingSeconds)} remaining
    </div>
  );
}
