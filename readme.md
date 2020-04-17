# aqua-hooks

## 简介

提供了一些常用的 `React Hooks`, 免得每次起项目都要复制一遍这些`hooks`(摔)

### 基础 hooks

- `useOnMount = (onMount: () => void) : void`
- `useOnUnmount = (onUnmount: () => void) : void`
- `useOnMountAndUnmount = (callback: () => () => void) : void`
- `useOnUpdate = (onUpdate: () => void, deps?: DependencyList) : void`
- `useOnlyOnUpdate = (onUpdate: () => void, deps?: DependencyList) : void`
- `useRefCallback = <T extends (...args: any[]) => any> (fn: T, deps?: DependencyList) : () => void`
- `useLogger = (componentName: string, ...rest: any[]) : void`
- `useConstant = <T>(fn: () => T) : T`

  保证组件只创建一个值一次(useMemo 无法保证这一点).

  详见[how-to-create-expensive-objects-lazily](https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily)

### 节流防抖

```typescript
interface ReturnValue<T extends any[]> {
  run: (...args: T) => void;
  cancel: () => void;
}
```

- `useDebounce = <T> (value: T, wait: number) : T`

- `useDebounceFn`

  ```typescript
  function useDebounceFn<T extends any[]>(
    fn: (...args: T) => any,
    wait: number
  ): ReturnValue<T>;

  function useDebounceFn<T extends any[]>(
    fn: (...args: T) => any,
    deps: DependencyList,
    wait: number
  ): ReturnValue<T>;
  ```

- `useThrottle = <T> (value: T, wait: number) : T`
- `useThrottleFn`

  ```typescript
  function useThrottleFn<T extends any[]>(
    fn: (...args: T) => any,
    wait: number
  ): ReturnValue<T>;

  function useThrottleFn<T extends any[]>(
    fn: (...args: T) => any,
    deps: DependencyList,
    wait: number
  ): ReturnValue<T>;
  ```

### async

- `useAsync`:封装异步方法,额外返回`loading`字段代表异步流程是否结束

  ```typescript
  interface IUseAsyncConfig<T extends any[], R extends any, E extends any> {
    onSuccess?: (arg: R) => void;
    onFailed?: (arg: E) => void;
    onComplete?: () => void;
  }

  function useAsync<T extends any[], R extends any, E extends any = {}>(
    asyncFn: (...args: T) => Promise<R>,
    config?: IUseAsyncConfig<T, R, E>
  ): { run: (...args: T) => void; loading: boolean };
  ```

### 定时器

获取一个可以暂停,重开功能的定时器,通过`config`字段可以配置是否为`interval`(默认为`timeout`)以及是否立即触发(仅限`interval`)

- `useTimer`
  ```typescript
  /**
   *
   * @param fn callback
   * @param delay delay or interval
   * @param config intervalConfig
   * @param args the third params of the timer's
   */
  function useTimer(
    fn: (...props: any) => void,
    delay: number,
    config?: { isInterval?: boolean; runImmediately?: boolean },
    ...args: any[]
  ): {
    run: (...props: any[]) => void;
    stop: () => void;
    pause: () => void;
    resume: () => void;
    isRunning: boolean;
    isPaused: boolean;
  };
  ```
