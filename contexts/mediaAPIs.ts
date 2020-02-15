import { option } from 'fp-ts'
import { createContext } from 'react'

export type MediaAPIsObject = {
  imageCapture: ImageCapture
  mediaStream: MediaStream
}

export const MediaAPIsCtx = createContext<option.Option<MediaAPIsObject>>(
  option.none,
)
