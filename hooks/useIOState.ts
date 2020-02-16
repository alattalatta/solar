import { io } from 'fp-ts'
import { useState } from 'react'

export const useIOState = <T>(
  initialValue: T,
): [T, (value: T) => io.IO<void>] => {
  const state = useState(initialValue)
  const setState = (value: T): io.IO<void> => () => state[1](value)

  return [state[0], setState]
}
