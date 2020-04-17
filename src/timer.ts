import { useRef } from "react";
import { useOnUnmount } from "./baseHooks";

/**
 *
 * @param fn callback
 * @param delay delay or interval
 * @param config intervalConfig
 * @param args the third params of the timer's
 */
export function useTimer(
  fn: (...props: any) => void,
  delay: number,
  config?: { isInterval?: boolean; runImmediately?: boolean },
  ...args: any[]
) {
  const { isInterval, runImmediately } = config || {
    isInterval: false,
    runImmediately: false,
  };
  const timer = useRef<NodeJS.Timeout>();
  const resumeTimer = useRef<NodeJS.Timeout>();
  const isRunning = useRef(false);
  const isPaused = useRef(false);
  const lastStartTime = useRef(new Date());
  const remainingTime = useRef(0);
  // tslint:disable-next-line: variable-name
  const _run = useRef<() => void>();
  const setTimer = isInterval ? setInterval : setTimeout;
  const clearTimer = isInterval ? clearInterval : clearTimeout;
  const updateLastStartTime = () => (lastStartTime.current = new Date());

  const stop = () => {
    isRunning.current = false;
    isPaused.current = false;
    clearTimer(timer.current as NodeJS.Timeout);
    clearTimeout(resumeTimer.current as NodeJS.Timeout);
  };

  const run = (...props: any[]) => {
    stop();
    isRunning.current = true;
    _run.current = () => {
      updateLastStartTime();
      fn(...props);
    };

    if (isInterval && runImmediately) {
      _run.current!();
    } else {
      updateLastStartTime();
    }

    timer.current = setTimer(
      () => {
        _run.current!();
      },
      delay,
      args
    );
  };

  const pause = () => {
    if (!isRunning.current) {
      return;
    }
    stop();
    isPaused.current = true;
    remainingTime.current =
      new Date().getTime() - lastStartTime.current.getTime();
  };

  const resume = () => {
    if (isRunning.current) {
      return;
    }
    if (!isPaused.current) {
      return;
    }
    isRunning.current = true;
    isPaused.current = false;
    updateLastStartTime();
    resumeTimer.current = setTimeout(
      () => {
        _run.current!();
        if (!isInterval) {
          return;
        }
        timer.current = setTimer(
          () => {
            _run.current!();
          },
          delay,
          args
        );
      },
      delay === remainingTime.current ? delay : delay - remainingTime.current
    );
  };

  useOnUnmount(stop);
  return {
    run,
    stop,
    pause,
    resume,
    isRunning: isRunning.current,
    isPaused: isPaused.current,
  };
}
