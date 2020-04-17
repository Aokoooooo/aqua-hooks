import {
  act,
  renderHook,
  RenderHookResult,
} from "@testing-library/react-hooks";
import { useTimer } from "../src";
import { advanceBy } from "jest-date-mock";

let hook: RenderHookResult<null, ReturnType<typeof useTimer>>;

describe("test timer", () => {
  const advanceTimer = (ms: number) => {
    jest.advanceTimersByTime(ms);
    advanceBy(ms);
  };

  test("useTimer should be defined", () => {
    expect(useTimer).toBeDefined();
  });

  describe("use as interval work well", () => {
    let count = 0;

    act(() => {
      hook = renderHook(() =>
        useTimer(
          (x?: number) => (count = typeof x === "undefined" ? count + 1 : x),
          1000,
          { isInterval: true }
        )
      );
    });

    act(() => {
      // mount with no actions
      expect(count).toBe(0);
      hook.rerender();
      expect(count).toBe(0);

      // run with no arg
      hook.result.current.run();
      expect(count).toBe(0);
      hook.rerender();
      expect(count).toBe(0);
      advanceTimer(1000);
      expect(count).toBe(1);
      advanceTimer(1000);
      expect(count).toBe(2);

      // run with arg
      hook.result.current.run(5);
      advanceTimer(1000);
      expect(count).toBe(5);

      // run will restart the timer
      hook.result.current.run();
      advanceTimer(600);
      hook.result.current.run();
      advanceTimer(400);
      expect(count).toBe(5);
      advanceTimer(600);
      expect(count).toBe(6);
      advanceTimer(1000);
      expect(count).toBe(7);

      // pause
      hook.result.current.pause();
      advanceTimer(1000);
      hook.result.current.pause();
      advanceTimer(1000);
      expect(count).toBe(7);

      // resume
      hook.result.current.resume();
      hook.result.current.resume();
      expect(count).toBe(7);
      advanceTimer(1000);
      expect(count).toBe(8);
      advanceTimer(1000);
      expect(count).toBe(9);

      // resume will restart timer after the remaining time
      hook.result.current.pause();
      advanceTimer(5000);
      expect(count).toBe(9);
      hook.result.current.resume();
      expect(count).toBe(9);
      advanceTimer(400);
      expect(count).toBe(9);
      hook.result.current.pause();
      advanceTimer(5000);
      expect(count).toBe(9);
      hook.result.current.resume();
      advanceTimer(600);
      expect(count).toBe(10);

      // timer will be clare on unmount
      hook.unmount();
      advanceTimer(1000);
      expect(count).toBe(10);
    });
  });

  describe("use as timeout work well", () => {
    let count = 0;

    act(() => {
      hook = renderHook(() =>
        useTimer(
          (x?: number) => (count = typeof x === "undefined" ? count + 1 : x),
          1000
        )
      );
    });

    act(() => {
      // mount with no actions
      expect(count).toBe(0);
      hook.rerender();
      expect(count).toBe(0);

      // run with no arg
      hook.result.current.run();
      expect(count).toBe(0);
      hook.rerender();
      expect(count).toBe(0);
      advanceTimer(1000);
      expect(count).toBe(1);
      advanceTimer(1000);
      expect(count).toBe(1);

      // run with arg
      hook.result.current.run(5);
      advanceTimer(1000);
      expect(count).toBe(5);

      // run will restart the timer
      hook.result.current.run();
      advanceTimer(500);
      hook.result.current.run();
      advanceTimer(500);
      expect(count).toBe(5);
      advanceTimer(500);
      expect(count).toBe(6);
      advanceTimer(1000);
      expect(count).toBe(6);

      // pause
      hook.result.current.run();
      hook.result.current.pause();
      advanceTimer(1000);
      hook.result.current.pause();
      advanceTimer(1000);
      expect(count).toBe(6);

      // resume
      hook.result.current.resume();
      hook.result.current.resume();
      advanceTimer(1000);
      expect(count).toBe(7);
      advanceTimer(1000);
      expect(count).toBe(7);

      // resume will restart timer after the remaining time
      hook.result.current.run();
      advanceTimer(500);
      hook.result.current.pause();
      advanceTimer(5000);
      expect(count).toBe(7);
      hook.result.current.resume();
      expect(count).toBe(7);
      advanceTimer(500);
      expect(count).toBe(8);

      // timer will be clare on unmount
      hook.unmount();
      advanceTimer(1000);
      expect(count).toBe(8);
    });
  });

  describe("stop resume work well", () => {
    let count = 0;

    act(() => {
      hook = renderHook(() =>
        useTimer(
          (x?: number) => (count = typeof x === "undefined" ? count + 1 : x),
          1000,
          { isInterval: true }
        )
      );
    });

    act(() => {
      // mount with no actions
      expect(count).toBe(0);
      hook.rerender();
      expect(count).toBe(0);
      expect(hook.result.current.isRunning).toBeFalsy();
      expect(hook.result.current.isPaused).toBeFalsy();

      // cant pause while is not running
      hook.result.current.pause();
      expect(hook.result.current.isRunning).toBeFalsy();
      expect(hook.result.current.isPaused).toBeFalsy();

      // cant resume while is not paused
      hook.result.current.resume();
      expect(hook.result.current.isRunning).toBeFalsy();
      expect(hook.result.current.isPaused).toBeFalsy();

      hook.result.current.run();

      // cant resume while is not paused
      hook.result.current.resume();
      expect(hook.result.current.isRunning).toBeFalsy();
      expect(hook.result.current.isPaused).toBeFalsy();
    });
  });

  describe("runImmediately work well", () => {
    test("as setInterval", () => {
      let count = 0;

      act(() => {
        hook = renderHook(() =>
          useTimer(
            (x?: number) => (count = typeof x === "undefined" ? count + 1 : x),
            1000,
            { isInterval: true, runImmediately: true }
          )
        );
      });

      act(() => {
        expect(count).toBe(0);
        hook.rerender();
        expect(count).toBe(0);
        hook.result.current.run();
        expect(count).toBe(1);
      });
    });

    test("as setTimeout", () => {
      let count = 0;

      act(() => {
        hook = renderHook(() =>
          useTimer(
            (x?: number) => (count = typeof x === "undefined" ? count + 1 : x),
            1000,
            { isInterval: false, runImmediately: true }
          )
        );
      });

      act(() => {
        expect(count).toBe(0);
        hook.rerender();
        expect(count).toBe(0);
        hook.result.current.run();
        expect(count).toBe(0);
      });
    });
  });
});
