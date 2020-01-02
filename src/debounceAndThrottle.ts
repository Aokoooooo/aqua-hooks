import { DependencyList, useRef, useState } from "react";

import { useOnlyOnUpdate, useOnUnmount, useRefCallback } from ".";

type FnType = (...args: any[]) => any;

export interface ReturnValue<T extends any[]> {
  run: (...args: T) => void;
  cancel: () => void;
}

/**
 * to debounce a function
 * @param fn target function
 * @param wait interval(ms)
 */
export function useDebounceFn<T extends any[]>(
  fn: (...args: T) => any,
  wait: number
): ReturnValue<T>;
/**
 * to debounce a function
 * @param fn target function
 * @param deps dependencies, the `fn` will be called while `deps` changed
 * @param wait interval(ms)
 */
export function useDebounceFn<T extends any[]>(
  fn: (...args: T) => any,
  deps: DependencyList,
  wait: number
): ReturnValue<T>;
export function useDebounceFn<T extends any[]>(
  fn: (...args: T) => any,
  deps: DependencyList | number,
  wait?: number
): ReturnValue<T> {
  // tslint:disable-next-line: variable-name
  const _wait = (typeof deps === "number" ? deps : wait) as number;
  // tslint:disable-next-line: variable-name
  const _deps = (Array.isArray(deps) ? deps : []) as DependencyList;

  const timer = useRef<any>(null);
  const fnRef = useRef<FnType>(fn);
  fnRef.current = fn;

  const cancel = useRefCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
  }, []);

  /**
   * debounce. each time before we call the function, cancel the last one.
   */
  const run = useRefCallback(
    (...args: any[]) => {
      cancel();
      timer.current = setTimeout(() => {
        fnRef.current(...args);
      }, _wait);
    },
    [_wait, cancel]
  );

  /**
   * call the target function while the deps changed
   */
  useOnlyOnUpdate(() => {
    run();
  }, [..._deps, run]);

  /**
   * cancel the target function on unmount
   */
  useOnUnmount(cancel);

  return {
    run,
    cancel
  };
}

/**
 * to show something debounced
 * @param value
 * @param wait interval(ms)
 */
export function useDebounce<T>(value: T, wait: number) {
  const [state, setState] = useState(value);

  useDebounceFn(
    () => {
      setState(value);
    },
    [value],
    wait
  );

  return state;
}

/**
 * to throttle a function
 * @param fn target function
 * @param wait interval(ms)
 */
export function useThrottleFn<T extends any[]>(
  fn: (...args: T) => any,
  wait: number
): ReturnValue<T>;
/**
 * to throttle a function
 * @param fn target function
 * @param deps dependencies, the `fn` will be called while `deps` changed
 * @param wait interval(ms)
 */
export function useThrottleFn<T extends any[]>(
  fn: (...args: T) => any,
  deps: DependencyList,
  wait: number
): ReturnValue<T>;
export function useThrottleFn<T extends any[]>(
  fn: (...args: T) => any,
  deps: DependencyList | number,
  wait?: number
): ReturnValue<T> {
  // tslint:disable-next-line: variable-name
  const _wait = (typeof deps === "number" ? deps : wait) as number;
  // tslint:disable-next-line: variable-name
  const _deps = (Array.isArray(deps) ? deps : []) as DependencyList;

  const timer = useRef<any>();
  const fnRef = useRef<FnType>(fn);
  fnRef.current = fn;

  const currentArgs = useRef<any>([]);

  const cancel = useRefCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = undefined;
  }, []);

  /**
   * throttle. each interval we call the function once.
   * so we won't do anything if the timer existed except recording the args.
   */
  const run = useRefCallback(
    (...args: any) => {
      currentArgs.current = args;
      if (!timer.current) {
        timer.current = setTimeout(() => {
          fnRef.current(...currentArgs.current);
          timer.current = undefined;
        }, _wait);
      }
    },
    [_wait, cancel]
  );

  /**
   * call the target function while the deps changed
   */
  useOnlyOnUpdate(() => {
    run();
  }, [..._deps, run]);

  /**
   * cancel the target function on unmount
   */
  useOnUnmount(cancel);

  return {
    run,
    cancel
  };
}

/**
 * to show something throttled
 * @param value
 * @param wait interval(ms)
 */
export function useThrottle<T>(value: T, wait: number) {
  const [state, setState] = useState(value);

  useThrottleFn(
    () => {
      setState(value);
    },
    [value],
    wait
  );

  return state;
}
