import { useState, useEffect, useCallback } from "react";

export function usePlayback(totalSteps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // speed in ms per step

  // Pause playback
  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Start playback
  const play = useCallback(() => {
    if (currentStep >= totalSteps - 1) {
      // If we are at the end, restart from step 0
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [currentStep, totalSteps]);

  // Step forward
  const stepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  // Step backward
  const stepBackward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  // Reset timeline
  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  // Jump to specific step
  const jumpToStep = useCallback((step) => {
    setIsPlaying(false);
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, [totalSteps]);

  // Hook interval logic
  useEffect(() => {
    let intervalId = null;

    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, speed, totalSteps]);

  return {
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    jumpToStep,
  };
}
export default usePlayback;
