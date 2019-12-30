# aqua-hooks

## 简介

提供了一些常用的 `React Hooks`, 免得每次起项目都要复制一遍这些`hooks`(摔)

- `useOnMount(onMount: () => void) => void`
- `useOnUnmount = (onUnmount: () => void) => void`
- `useOnMountAndUnmount = (callback: () => () => void) => void`
- `useOnUpdate = (onUpdate: () => void, deps?: DependencyList) => void`
- `useOnlyOnUpdate = (onUpdate: () => void, deps?: DependencyList) => void`
- `useRefCallback = (fn: () => void, deps?: DependencyList) => () => void`
- `useLogger = (componentName: string, ...rest: any[]) => void`
