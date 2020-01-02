import { renderHook, RenderHookResult } from "@testing-library/react-hooks";
import {
  useLogger,
  useOnlyOnUpdate,
  useOnMount,
  useOnMountAndUnmount,
  useOnUnmount,
  useOnUpdate,
  useRefCallback
} from "../src";

let hook: RenderHookResult<() => void, void>;

describe("test base hooks", () => {
  describe("useOnMount", () => {
    test("useOnMount should be defined", () => {
      expect(useOnMount).toBeDefined();
    });

    test("fn should be called only on mount", () => {
      const mockFn = jest.fn();
      hook = renderHook(() => useOnMount(mockFn));
      expect(mockFn).toBeCalledTimes(1);
      hook.rerender();
      expect(mockFn).toBeCalledTimes(1);
      hook.unmount();
      expect(mockFn).toBeCalledTimes(1);
    });
  });

  describe("useOnUnmount", () => {
    test("useOnUnmount should be defined", () => {
      expect(useOnUnmount).toBeDefined();
    });

    test("fn should be called only on unmount", () => {
      const mockFn = jest.fn();
      hook = renderHook(() => useOnUnmount(mockFn));
      expect(mockFn).toBeCalledTimes(0);
      hook.rerender();
      expect(mockFn).toBeCalledTimes(0);
      hook.unmount();
      expect(mockFn).toBeCalledTimes(1);
    });
  });

  describe("useOnMountAndUnmount", () => {
    test("useOnMount should be defined", () => {
      expect(useOnMountAndUnmount).toBeDefined();
    });

    test("the fn passed in should be called only on mount and the result fn return by the fn will be called only on unmount", () => {
      const onUnmount = jest.fn();
      const mockFn = jest.fn(() => {
        return onUnmount;
      });

      hook = renderHook(() => {
        useOnMountAndUnmount(mockFn);
      });
      expect(mockFn).toBeCalledTimes(1);
      expect(onUnmount).toBeCalledTimes(0);
      hook.rerender();
      expect(mockFn).toBeCalledTimes(1);
      expect(onUnmount).toBeCalledTimes(0);
      hook.unmount();
      expect(mockFn).toBeCalledTimes(1);
      expect(onUnmount).toBeCalledTimes(1);
    });
  });

  describe("useOnUpdate", () => {
    test("useOnUpdate should be defined", () => {
      expect(useOnUpdate).toBeDefined();
    });

    test("useOnUpdate should only be called on mount and deps changed", () => {
      const mockFn = jest.fn();
      let count = 0;
      hook = renderHook(() => useOnUpdate(mockFn, [count]));

      expect(mockFn).toBeCalledTimes(1);
      count++;
      hook.rerender();
      expect(mockFn).toBeCalledTimes(2);
      count++;
      hook.rerender();
      expect(mockFn).toBeCalledTimes(3);
      hook.rerender();
      expect(mockFn).toBeCalledTimes(3);
      hook.unmount();
      expect(mockFn).toBeCalledTimes(3);
    });

    test("useOnUpdate should only be called on mount and component rerendered", () => {
      const mockFn = jest.fn();
      let count = 0;
      hook = renderHook(() => useOnUpdate(mockFn));

      expect(mockFn).toBeCalledTimes(1);
      count++;
      hook.rerender();
      expect(mockFn).toBeCalledTimes(2);
      count++;
      hook.rerender();
      expect(mockFn).toBeCalledTimes(3);
      hook.rerender();
      expect(mockFn).toBeCalledTimes(4);
      hook.unmount();
      expect(mockFn).toBeCalledTimes(4);
    });
  });

  describe("useOnlyOnUpdate", () => {
    test("useOnlyOnUpdate should be defined", () => {
      expect(useOnlyOnUpdate).toBeDefined();
    });

    test("useOnlyOnUpdate should only be called when deps changed", () => {
      const mockFn = jest.fn();
      let count = 0;
      hook = renderHook(() => useOnlyOnUpdate(mockFn, [count]));

      expect(mockFn).toBeCalledTimes(0);
      count++;
      hook.rerender();
      expect(mockFn).toBeCalledTimes(1);
      count++;
      hook.rerender();
      expect(mockFn).toBeCalledTimes(2);
      hook.rerender();
      expect(mockFn).toBeCalledTimes(2);
      hook.unmount();
      expect(mockFn).toBeCalledTimes(2);
    });
  });

  describe("useRefCallback", () => {
    test("useRefCallback should be defined", () => {
      expect(useRefCallback).toBeDefined();
    });

    test("fn will be updated when deps changed", () => {
      let count = 0;
      const mockFn = () => count;

      let hook = renderHook(() => useRefCallback(mockFn, [mockFn]));

      expect(hook.result.current()).toBe(0);
      count++;
      hook.rerender();
      expect(hook.result.current()).toBe(1);
      hook.rerender();
      expect(hook.result.current()).toBe(1);

      count = 0;
      hook = renderHook(() => useRefCallback(mockFn));

      expect(hook.result.current()).toBe(0);
      count++;
      hook.rerender();
      expect(hook.result.current()).toBe(1);
      hook.rerender();
      expect(hook.result.current()).toBe(1);
    });
  });

  describe("useLogger", () => {
    const spy = jest.spyOn(console, "log");
    test("useLogger should be defined", () => {
      expect(useLogger).toBeDefined();
    });

    test("fn should be called", () => {
      const name = "TEST";
      const count = [0];
      hook = renderHook(() => useLogger(name, count));
      expect(spy).toBeCalledWith(`${name} mounted`, [0]);
      count[0]++;
      hook.rerender();
      expect(spy).toBeCalledWith(`${name} updated`, [1]);
      hook.rerender();
      expect(spy).toBeCalledWith(`${name} updated`, [1]);
      hook.unmount();
      expect(spy).toBeCalledWith(`${name} unmounted`, [1]);
    });
  });
});
