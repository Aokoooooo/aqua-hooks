import {
  act,
  renderHook,
  RenderHookResult
} from "@testing-library/react-hooks";
import { useDebounce, useDebounceFn, useThrottle, useThrottleFn } from "../src";

let hook: RenderHookResult<(...args: any[]) => any, any>;

describe("test debounce and throttle hooks", () => {
  describe("useDebounce", () => {
    test("useDebounce should be defined", () => {
      expect(useDebounce).toBeDefined();
    });

    test("useDebounce work well", () => {
      let count = 0;

      act(() => {
        hook = renderHook(() => useDebounce(count, 2000));
      });

      act(() => {
        expect(hook.result.current).toBe(0);
        count = 1;
        hook.rerender();
        count = 2;
        hook.rerender();
        count = 3;
        hook.rerender();
        expect(hook.result.current).toBe(0);
        jest.runAllTimers();
        hook.rerender();
        expect(hook.result.current).toBe(3);
      });
    });
  });

  describe("useDebounceFn", () => {
    test("useDebounceFn should be defined", () => {
      expect(useDebounceFn).toBeDefined();
    });
  });

  describe("useThrottle", () => {
    test("useThrottle should be defined", () => {
      expect(useThrottle).toBeDefined();
    });

    test("useThrottle work well", () => {
      let count = 0;

      act(() => {
        hook = renderHook(() => useThrottle(count, 2000));
      });

      act(() => {
        expect(hook.result.current).toBe(0);
        count = 1;
        hook.rerender();
        count = 2;
        hook.rerender();
        count = 3;
        hook.rerender();
        expect(hook.result.current).toBe(0);
        jest.advanceTimersByTime(1000);
        expect(hook.result.current).toBe(0);
        jest.advanceTimersByTime(1000);
        expect(hook.result.current).toBe(3);
        hook.rerender();
        expect(hook.result.current).toBe(3);
        count++;
        hook.rerender();
        hook.unmount();
        jest.runAllTimers();
        expect(hook.result.current).toBe(3);
      });
    });

    test("cancel work well", () => {
      let count = 0;

      act(() => {
        hook = renderHook(() => useThrottle(count, 2000));
      });

      act(() => {
        expect(hook.result.current).toBe(0);
        count = 1;
        hook.rerender();
        count = 2;
        hook.rerender();
        count = 3;
        hook.rerender();
        expect(hook.result.current).toBe(0);
        jest.advanceTimersByTime(1000);
        expect(hook.result.current).toBe(0);
        hook.unmount();
        expect(hook.result.current).toBe(0);
      });
    });
  });

  describe("useThrottleFn", () => {
    test("useThrottleFn should be defined", () => {
      expect(useThrottleFn).toBeDefined();
    });
  });
});
