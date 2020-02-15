import { task } from 'fp-ts'
import { useEffect } from 'react'

/**
 * The `useTaskEffect` function is same as the `React.useEffect()`, but consumes a `Task` object instead of a function.
 *
 * @param t The `Task` object to consume.
 * @param cleanUp A clean up function to call before the next `useEffect()` cycle.
 * @param deps An array of dependencies to pass to `useEffect()`.
 */
export const useTaskEffect = (
  t: task.Task<unknown>,
  cleanUp?: () => void,
  deps: unknown[] = [],
): void =>
  useEffect(() => {
    t()
    return cleanUp
  }, deps)
