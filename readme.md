# aqua-hooks

## 简介

提供了一些常用的 `React Hooks`, 免得每次起项目都要复制一遍这些`hooks`(摔)

### 基础 hooks

- `useOnMount = (onMount: () => void) => void`
- `useOnUnmount = (onUnmount: () => void) => void`
- `useOnMountAndUnmount = (callback: () => () => void) => void`
- `useOnUpdate = (onUpdate: () => void, deps?: DependencyList) => void`
- `useOnlyOnUpdate = (onUpdate: () => void, deps?: DependencyList) => void`
- `useRefCallback = <T extends (...args: any[]) => any> (fn: T, deps?: DependencyList) => () => void`
- `useLogger = (componentName: string, ...rest: any[]) => void`

### 节流防抖

```typescript
interface ReturnValue<T extends any[]> {
  run: (...args: T) => void;
  cancel: () => void;
}
```

- `useDebounce = <T> (value: T, wait: number) => T`

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

- `useThrottle = <T> (value: T, wait: number) => T`
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
