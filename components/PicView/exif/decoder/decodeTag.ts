import { dataFormatByteMap } from '../common/maps'
import { EXIFTagData, DataFormats } from '../common/types'
import { TIFF_HEADER_START } from './constants'
import {
  readStringData,
  readDataSet,
  readRationalDataSet,
  readUnknownSignQuadBytes,
} from './readData'

export function decodeTag(
  view: DataView,
  start: number,
  little: boolean,
  tagMap: Record<string, string>,
): EXIFTagData {
  let offset = start
  let value: string | number | number[]

  const type = view.getUint16(offset, little)
  const label = tagMap[type]
  offset += 2

  const format = view.getUint16(offset, little) as DataFormats
  offset += 2

  const byteLength = view.getUint32(offset, little)
  offset += 4

  const byteUnit = dataFormatByteMap[format]
  if (byteUnit * byteLength > 4) {
    const dataOffset = view.getUint32(offset, little) + TIFF_HEADER_START

    if (format === 2) {
      // ASCII
      value = readStringData(view, dataOffset, byteLength)
    } else if (format === 5 || format === 10) {
      // URational || Rational
      value = readRationalDataSet(
        view,
        dataOffset,
        byteLength,
        little,
        format === 10, // Rational
      )
    } else {
      value = readDataSet(
        view,
        dataOffset,
        byteUnit as 1 | 2 | 4,
        byteLength,
        little,
        format === 9, // Long
      )
    }
  } else if (byteUnit === 1) {
    value =
      format === 2 // ASCII
        ? readStringData(view, offset, byteLength)
        : byteLength === 1
        ? view.getUint8(offset)
        : readDataSet(view, offset, 1, byteLength, little)
  } else if (byteUnit === 2) {
    value =
      byteLength === 1
        ? view.getUint16(offset, little)
        : readDataSet(view, offset, 2, byteLength, little)
  } else {
    value = readUnknownSignQuadBytes(
      view,
      offset,
      little,
      format === 9, // Long
    )
  }

  return {
    byteLength,
    byteSize: byteUnit * byteLength,
    format,
    label,
    type,
    value,
  }
}
