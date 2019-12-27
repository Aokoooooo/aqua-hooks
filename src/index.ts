import { DependencyList, useEffect, useRef } from "react";

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
 * @param onUpdate
 * @param onlyOnUpdate `ture`: `onUpdate` will only be called while `deps` changed. `false`: `onUpdate` will be called while `onMount` and `deps` changed
 * @param deps
 */
export const useOnUpdate = (
  onUpdate: () => void,
  onlyOnUpdate: boolean = false,
  deps?: DependencyList
) => {
  const isFirst = useRef(true);

  useEffect(
    () => {
      if (onlyOnUpdate && isFirst.current) {
        isFirst.current = false;
      } else {
        onUpdate();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    Array.isArray(deps) ? [...deps] : deps
  );
};

export const useLogger = (componentName: string, ...rest: any[]) => {
  useOnMount(() => {
    console.log(`${componentName} mounted`, ...rest);
  });

  useOnUpdate(() => {
    console.log(`${componentName} updated`, ...rest);
  }, true);

  useOnUnmount(() => {
    console.log(`${componentName} unmounted`, ...rest);
  });
};
