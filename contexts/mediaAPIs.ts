import { option } from 'fp-ts'
import { createContext } from 'react'

export type MediaAPIsObject = {
  capabilities: {
    width: number
    height: number
  }
  imageCapture: ImageCapture
  mediaStream: MediaStream
}

export const MediaAPIsCtx = createContext<option.Option<MediaAPIsObject>>(
  option.none,
)
