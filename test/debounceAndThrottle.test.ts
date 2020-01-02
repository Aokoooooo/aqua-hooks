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

    test("run and cancel work well", () => {
      let count = 0;
      const fn = () => count++;

      act(() => {
        hook = renderHook(() => useDebounceFn(fn, 2000));
      });

      act(() => {
        hook.result.current.run();
        expect(count).toBe(0);
        hook.result.current.run();
        hook.result.current.run();
        hook.result.current.run();
        hook.result.current.run();
        jest.runAllTimers();
        expect(count).toBe(1);

        hook.result.current.run();
        hook.result.current.cancel();
        jest.runAllTimers();
        expect(count).toBe(1);

        hook.result.current.run();
        hook.unmount();
        jest.runAllTimers();
        expect(count).toBe(1);
      });
    });

    test("deps changed work well", () => {
      let count = 0;
      let size = 0;
      const fn = () => count++;

      act(() => {
        hook = renderHook(() => useDebounceFn(fn, [size], 2000));
      });

      act(() => {
        expect(count).toBe(0);
        size++;
        hook.rerender();
        jest.runAllTimers();
        expect(count).toBe(1);

        size++;
        hook.rerender();
        hook.unmount();
        jest.runAllTimers();
        expect(count).toBe(1);
      });
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

    test("run and cancel work well", () => {
      let count = 0;
      const fn = () => count++;

      act(() => {
        hook = renderHook(() => useThrottleFn(fn, 2000));
      });

      act(() => {
        hook.result.current.run();
        expect(count).toBe(0);
        hook.result.current.run();
        hook.result.current.run();
        hook.result.current.run();
        hook.result.current.run();
        jest.runAllTimers();
        expect(count).toBe(1);

        hook.result.current.run();
        hook.result.current.cancel();
        jest.runAllTimers();
        expect(count).toBe(1);

        hook.result.current.run();
        hook.unmount();
        jest.runAllTimers();
        expect(count).toBe(1);
      });
    });

    test("deps changed work well", () => {
      let count = 0;
      let size = 0;
      const fn = () => count++;

      act(() => {
        hook = renderHook(() => useThrottleFn(fn, [size], 2000));
      });

      act(() => {
        expect(count).toBe(0);
        size++;
        hook.rerender();
        jest.runAllTimers();
        expect(count).toBe(1);

        size++;
        hook.rerender();
        hook.unmount();
        jest.runAllTimers();
        expect(count).toBe(1);
      });
    });
  });
});
