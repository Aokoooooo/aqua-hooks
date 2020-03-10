import {
  act,
  renderHook,
  RenderHookResult
} from "@testing-library/react-hooks";
import { useImmediate, useInterval, useTimeout } from "../src";

let hook: RenderHookResult<(...args: any[]) => any, any>;

describe("test timer", () => {
  describe("test useInterval", () => {
    test("useInterval should be defined", () => {
      expect(useInterval).toBeDefined();
    });

    test("useInterval work well", () => {
      let count = 0;

      act(() => {
        hook = renderHook(() => useInterval(() => count++, 1000));
      });

      act(() => {
        expect(count).toBe(0);
        hook.rerender();
        expect(count).toBe(0);
        jest.advanceTimersByTime(1000);
        expect(count).toBe(1);
        jest.advanceTimersByTime(1000);
        expect(count).toBe(2);
        hook.unmount();
        jest.advanceTimersByTime(1000);
        expect(count).toBe(2);
      });
    });

    test("callback work well", () => {
      let count = 0;

      act(() => {
        hook = renderHook(() => useInterval(() => count++, 1000));
      });

      act(() => {
        expect(count).toBe(0);
        hook.rerender();
        expect(count).toBe(0);
        jest.advanceTimersByTime(1000);
        expect(count).toBe(1);
        jest.advanceTimersByTime(1000);
        expect(count).toBe(2);
        hook.result.current();
        jest.advanceTimersByTime(1000);
        expect(count).toBe(2);
        hook.unmount();
        jest.advanceTimersByTime(1000);
        expect(count).toBe(2);
      });
    });
  });

  describe("test useTimeout", () => {
    test("useTimeout should be defined", () => {
      expect(useTimeout).toBeDefined();
    });

    test("useTimeout work well", () => {
      let count = 0;

      act(() => {
        hook = renderHook(() => useTimeout(() => count++, 1000));
      });

      act(() => {
        expect(count).toBe(0);
        hook.rerender();
        expect(count).toBe(0);
        jest.advanceTimersByTime(1000);
        expect(count).toBe(1);
        jest.advanceTimersByTime(1000);
        expect(count).toBe(1);
        hook.unmount();
        jest.advanceTimersByTime(1000);
        expect(count).toBe(1);
      });
    });

    test("callback work well", () => {
      let count = 0;

      act(() => {
        hook = renderHook(() => useTimeout(() => count++, 1000));
      });

      act(() => {
        expect(count).toBe(0);
        hook.rerender();
        expect(count).toBe(0);
        hook.result.current();
        expect(count).toBe(0);
        jest.advanceTimersByTime(1000);
        expect(count).toBe(0);
        jest.advanceTimersByTime(1000);
        expect(count).toBe(0);
        jest.advanceTimersByTime(1000);
        expect(count).toBe(0);
        hook.unmount();
        jest.advanceTimersByTime(1000);
        expect(count).toBe(0);
      });
    });
  });

  describe("test useImmediate", () => {
    test("useImmediate should be defined", () => {
      expect(useImmediate).toBeDefined();
    });

    test("useImmediate work well", () => {
      let count = 0;

      act(() => {
        hook = renderHook(() => useImmediate(() => count++));
      });

      act(() => {
        expect(count).toBe(0);
        hook.rerender();
        expect(count).toBe(0);
        jest.runAllImmediates();
        expect(count).toBe(1);
        jest.advanceTimersByTime(1000);
        expect(count).toBe(1);
        hook.unmount();
        jest.advanceTimersByTime(1000);
        expect(count).toBe(1);
      });
    });

    test("callback work well", () => {
      let count = 0;

      act(() => {
        hook = renderHook(() => useImmediate(() => count++, 1000));
      });

      act(() => {
        expect(count).toBe(0);
        hook.rerender();
        expect(count).toBe(0);
        hook.result.current();
        expect(count).toBe(0);
        jest.runAllImmediates();
        expect(count).toBe(0);
        jest.advanceTimersByTime(1000);
        expect(count).toBe(0);
        jest.advanceTimersByTime(1000);
        expect(count).toBe(0);
        hook.unmount();
        jest.advanceTimersByTime(1000);
        expect(count).toBe(0);
      });
    });
  });
});
