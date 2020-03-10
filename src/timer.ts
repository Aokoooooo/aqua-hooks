import { useRef } from "react";
import { useOnMountAndUnmount } from "./baseHooks";

export function useInterval(
  fn: (...args: any[]) => void,
  interval: number,
  ...args: any[]
) {
  const timer = useRef<NodeJS.Timeout>();
  useOnMountAndUnmount(() => {
    timer.current = setInterval(fn, interval, args);
    return () => clearInterval(timer.current as NodeJS.Timeout);
  });
  return () => clearInterval(timer.current as NodeJS.Timeout);
}

export function useTimeout(
  fn: (...args: any[]) => void,
  delay: number,
  ...args: any[]
) {
  const timer = useRef<NodeJS.Timeout>();
  useOnMountAndUnmount(() => {
    timer.current = setTimeout(fn, delay, args);
    return () => clearTimeout(timer.current as NodeJS.Timeout);
  });
  return () => clearTimeout(timer.current as NodeJS.Timeout);
}

export function useImmediate(fn: (...args: any[]) => void, ...args: any[]) {
  const timer = useRef<NodeJS.Immediate>();
  useOnMountAndUnmount(() => {
    timer.current = setImmediate(fn, args);
    return () => clearImmediate(timer.current as NodeJS.Immediate);
  });
  return () => clearImmediate(timer.current as NodeJS.Immediate);
}
