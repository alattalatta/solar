import { task, io } from 'fp-ts'
import { useEffect } from 'react'

/**
 * The `useMonad1Effect` function is same as the `React.useEffect()`, but consumes an `IO` or a `Task` object instead of a function.
 *
 * @param t The `IO` or `Task` object to consume.
 * @param cleanUp A clean up function to call before the next `useEffect()` cycle.
 * @param deps An array of dependencies to pass to `useEffect()`.
 */
export const useMonad1Effect = (
  t: io.IO<unknown> | task.Task<unknown>,
  cleanUp?: () => void,
  deps: unknown[] = [],
): void =>
  useEffect(() => {
    t()
    return cleanUp
  }, deps)
