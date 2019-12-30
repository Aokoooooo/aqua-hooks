import { DependencyList, useCallback, useEffect, useRef } from "react";

export const useOnMount = (onMount: () => void) => {
  useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useOnUnmount = (onUnmount: () => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onUnmount, []);
};

export const useOnMountAndUnmount = (callback: () => () => void) => {
  useEffect(() => {
    const onUnmount = callback();
    return onUnmount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

/**
 *
 * `onUpdate` will be called when the component mounted and deps changed
 *
 * @param onUpdate
 * @param deps
 */
export const useOnUpdate = (onUpdate: () => void, deps?: DependencyList) => {
  useEffect(
    () => {
      onUpdate();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    Array.isArray(deps) ? [...deps] : deps
  );
};

/**
 * `onUpdate` will be called when the deps changed
 * @param onUpdate
 * @param deps
 */
export const useOnlyOnUpdate = (
  onUpdate: () => void,
  deps?: DependencyList
) => {
  const isFirst = useRef(true);

  useEffect(
    () => {
      if (isFirst.current) {
        isFirst.current = false;
      } else {
        onUpdate();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    Array.isArray(deps) ? [...deps] : deps
  );
};

/**
 * put the variables into the closure of callback
 * @param fn
 * @param deps
 */
export const useRefCallback = (fn: () => void, deps: DependencyList = []) => {
  const ref = useRef(fn);

  useOnUpdate(() => {
    ref.current = fn;
  }, [fn, ...deps]);

  return useCallback(() => {
    return ref.current();
  }, [ref]);
};

export const useLogger = (componentName: string, ...rest: any[]) => {
  useOnMount(() => {
    console.log(`${componentName} mounted`, ...rest);
  });

  useOnlyOnUpdate(() => {
    console.log(`${componentName} updated`, ...rest);
  });

  useOnUnmount(() => {
    console.log(`${componentName} unmounted`, ...rest);
  });
};
