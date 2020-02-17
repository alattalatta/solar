import { DataFormats } from './types'

export const dataFormatByteMap: Record<
  DataFormats,
  1 | 2 | 4 | 8
> = Object.freeze({
  1: 1,
  2: 1,
  3: 2,
  4: 4,
  5: 8,
  7: 1,
  9: 4,
  10: 8,
})
