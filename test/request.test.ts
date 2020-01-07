import {
  act,
  renderHook,
  RenderHookResult
} from "@testing-library/react-hooks";
import { useAsync } from "../src";

describe("test request", () => {
  const request = jest.fn((value: any, throwError: boolean) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (throwError) {
          reject(value);
        } else {
          resolve(new Error(value));
        }
      }, 1000);
    });
  });

  const onSuc = jest.fn((value: any) => value);

  const onErr = jest.fn((value: any) => value);

  const onCom = jest.fn(() => "onComplete");

  let hook: RenderHookResult<(...args: any[]) => any, any>;

  afterEach(() => {
    request.mockClear();
    onSuc.mockClear();
    onErr.mockClear();
    onCom.mockClear();
  });

  test("useAsync should be defined", () => {
    expect(useAsync).toBeDefined();
  });

  test("asyncFn should not be called while loading", () => {
    act(() => {
      hook = renderHook(() => useAsync(request));
    });

    act(() => {
      expect(hook.result.current.loading).toEqual(false);
      hook.result.current.run(1, false);
    });

    act(() => {
      expect(request).toBeCalledTimes(1);
      expect(hook.result.current.loading).toEqual(true);
      hook.result.current.run(1, false);
    });

    act(() => {
      expect(request).toBeCalledTimes(1);
      expect(hook.result.current.loading).toEqual(true);
      hook.result.current.run(1, false);
    });

    act(() => {
      expect(request).toBeCalledTimes(1);
      expect(hook.result.current.loading).toEqual(true);
      hook.result.current.run(1, false);
    });

    jest.clearAllTimers();
  });

  test("onSuccess work well", async () => {
    act(() => {
      hook = renderHook(() =>
        useAsync(request, {
          onSuccess: onSuc
        })
      );
    });

    await act(async () => {
      expect(hook.result.current.loading).toEqual(false);
      hook.result.current.run(1, false);
      jest.runAllTimers();
      await hook.waitForNextUpdate();
    });

    expect(request).toBeCalledTimes(1);
    expect(onSuc).toBeCalledTimes(1);
    expect(onErr).toBeCalledTimes(0);
    expect(onCom).toBeCalledTimes(0);
    expect(hook.result.current.loading).toEqual(false);
  });

  test("onFailed work well", async () => {
    act(() => {
      hook = renderHook(() =>
        useAsync(request, {
          onFailed: onErr
        })
      );
    });

    await act(async () => {
      expect(hook.result.current.loading).toEqual(false);
      hook.result.current.run(1, true);
      jest.runAllTimers();
      await hook.waitForNextUpdate();
    });

    expect(request).toBeCalledTimes(1);
    expect(onSuc).toBeCalledTimes(0);
    expect(onErr).toBeCalledTimes(1);
    expect(onCom).toBeCalledTimes(0);
    expect(hook.result.current.loading).toEqual(false);
  });

  test("onComplete work well", async () => {
    act(() => {
      hook = renderHook(() =>
        useAsync(request, {
          onComplete: onCom
        })
      );
    });

    await act(async () => {
      expect(hook.result.current.loading).toEqual(false);
      hook.result.current.run(1, false);
      jest.runAllTimers();
      await hook.waitForNextUpdate();
    });

    expect(request).toBeCalledTimes(1);
    expect(onSuc).toBeCalledTimes(0);
    expect(onErr).toBeCalledTimes(0);
    expect(onCom).toBeCalledTimes(1);
    expect(hook.result.current.loading).toEqual(false);
  });

  test("useAsync work well", async () => {
    act(() => {
      hook = renderHook(() =>
        useAsync(request, {
          onSuccess: onSuc,
          onFailed: onErr,
          onComplete: onCom
        })
      );
    });

    await act(async () => {
      expect(hook.result.current.loading).toEqual(false);
      hook.result.current.run(1, false);
      jest.runAllTimers();
      await hook.waitForNextUpdate();
    });

    expect(request).toBeCalledTimes(1);
    expect(onSuc).toBeCalledTimes(1);
    expect(onErr).toBeCalledTimes(0);
    expect(onCom).toBeCalledTimes(1);
    expect(hook.result.current.loading).toEqual(false);

    await act(async () => {
      expect(hook.result.current.loading).toEqual(false);
      hook.result.current.run(1, true);
      jest.runAllTimers();
      await hook.waitForNextUpdate();
    });

    expect(request).toBeCalledTimes(2);
    expect(onSuc).toBeCalledTimes(1);
    expect(onErr).toBeCalledTimes(1);
    expect(onCom).toBeCalledTimes(2);
    expect(hook.result.current.loading).toEqual(false);
  });
});
