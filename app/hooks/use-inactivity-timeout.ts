import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_TIMEOUT_MS = 120_000; // 2 min
const WARNING_BUFFER_MS = 30_000; // 30 sec countdown before logout
const COUNTDOWN_INTERVAL_MS = 1_000;

const ACTIVITY_EVENTS: (keyof DocumentEventMap)[] = [
  "mousemove",
  "keydown",
  "click",
  "scroll",
  "touchstart",
];

type InactivityTimeoutOptions = {
  onLogout: () => void;
  /** Total inactivity time before logout in ms. Defaults to 120000 (2 min). */
  timeoutMs?: number;
};

export function useInactivityTimeout({
  onLogout,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: InactivityTimeoutOptions) {
  const warningMs = Math.max(timeoutMs - WARNING_BUFFER_MS, 0);
  const countdownSeconds = Math.floor((timeoutMs - warningMs) / 1000);

  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(countdownSeconds);

  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isWarningVisibleRef = useRef(false);
  const onLogoutRef = useRef(onLogout);

  useEffect(() => {
    onLogoutRef.current = onLogout;
  }, [onLogout]);

  const clearAllTimers = useCallback(() => {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const scheduleTimers = useCallback(() => {
    clearAllTimers();
    isWarningVisibleRef.current = false;

    warningTimerRef.current = setTimeout(() => {
      isWarningVisibleRef.current = true;
      setShowWarning(true);

      let seconds = countdownSeconds;

      setRemainingSeconds(seconds);

      countdownRef.current = setInterval(() => {
        seconds -= 1;
        setRemainingSeconds(seconds);

        if (seconds <= 0) {
          if (countdownRef.current) clearInterval(countdownRef.current);
        }
      }, COUNTDOWN_INTERVAL_MS);

      logoutTimerRef.current = setTimeout(() => {
        onLogoutRef.current();
      }, timeoutMs - warningMs);
    }, warningMs);
  }, [clearAllTimers, countdownSeconds, timeoutMs, warningMs]);

  const dismissWarning = useCallback(() => {
    isWarningVisibleRef.current = false;
    setShowWarning(false);
    setRemainingSeconds(countdownSeconds);
    scheduleTimers();
  }, [scheduleTimers, countdownSeconds]);

  useEffect(() => {
    scheduleTimers();

    const handleActivity = () => {
      if (!isWarningVisibleRef.current) {
        scheduleTimers();
      }
    };

    for (const event of ACTIVITY_EVENTS) {
      document.addEventListener(event, handleActivity);
    }

    return () => {
      clearAllTimers();

      for (const event of ACTIVITY_EVENTS) {
        document.removeEventListener(event, handleActivity);
      }
    };
  }, [scheduleTimers, clearAllTimers]);

  return useMemo(
    () => ({ showWarning, remainingSeconds, dismissWarning }),
    [showWarning, remainingSeconds, dismissWarning]
  );
}
