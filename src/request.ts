import { useState } from "react";
import { useRefCallback } from "./baseHooks";

interface IUseAsyncConfig<T extends any[], R extends any, E extends any> {
  onSuccess?: (arg: R) => void;
  onFailed?: (arg: E) => void;
  onComplete?: () => void;
}

/**
 * add `loading` to async fn, call `run` to invoke the original fn
 * @param config
 */
export function useAsync<T extends any[], R extends any, E extends any = {}>(
  asyncFn: (...args: T) => Promise<R>,
  config?: IUseAsyncConfig<T, R, E>
) {
  const [loading, setLoading] = useState(false);

  const run = useRefCallback((...args: T) => {
    if (loading) {
      return;
    }
    setLoading(true);

    const onSuccess = config ? config.onSuccess : undefined;
    const onFailed = config ? config.onFailed : undefined;

    asyncFn(...args)
      .then(onSuccess)
      .catch(onFailed)
      .finally(() => {
        setLoading(false);
        if (config && typeof config.onComplete === "function") {
          config.onComplete();
        }
      });
  }, []);

  return { run, loading };
}
