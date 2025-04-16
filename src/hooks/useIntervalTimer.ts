import { useState, useEffect, useCallback } from 'react';

interface UseIntervalTimerProps {
  durationInSeconds: number;
  onComplete?: () => void;
}

interface UseIntervalTimerReturn {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  reset: () => void;
  formatTime: () => string;
}

export const useIntervalTimer = ({
  durationInSeconds,
  onComplete,
}: UseIntervalTimerProps): UseIntervalTimerReturn => {
  const [seconds, setSeconds] = useState(durationInSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const formatTime = useCallback(() => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }, [seconds]);

  const reset = useCallback(() => {
    setSeconds(durationInSeconds);
    setIsRunning(false);
  }, [durationInSeconds]);

  const start = useCallback(() => {
    setSeconds(durationInSeconds);
    setIsRunning(true);
  }, [durationInSeconds]);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning) {
      interval = window.setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, onComplete]);

  return {
    seconds,
    isRunning,
    start,
    reset,
    formatTime,
  };
}; 