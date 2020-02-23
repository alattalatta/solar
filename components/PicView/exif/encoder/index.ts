import { dataFormatByteMap } from '../common/maps'
import { DecodedIFDStruct, EXIFTagData } from '../common/types'
import { setStringData, setRationalData } from './writeData'

export function encodeEXIF(
  header: ArrayBuffer,
  decoded: DecodedIFDStruct,
): void {
  const primary = measureIFDBufferLength(decoded.primary)
  const sub = measureIFDBufferLength(decoded.sub)
  const interop = measureIFDBufferLength(decoded.interop)
  const gps = measureIFDBufferLength(decoded.gps)
  const totalLength = primary + sub + interop + gps + 20

  const resultBuffer = new Uint8Array(new ArrayBuffer(totalLength))
  resultBuffer.set(new Uint8Array(header), 0)

  encodeIFD(resultBuffer.buffer, 20, decoded.primary, false)
}

/**
 * The `measureIFDBufferLength()` function measures an IFD's size of both data and value area, and returns the sum of them.
 */
function measureIFDBufferLength(tagData: EXIFTagData[] | undefined): number {
  if (!tagData) {
    return 0
  }

  console.log(`${tagData.length} tags counted`)
  if (!tagData.length) {
    return 2
  }

  let hasDataPadding = false

  const sum = tagData.reduce((acc, cur) => {
    const length = cur.byteLength
    const byteUnit = dataFormatByteMap[cur.format]
    if (length * byteUnit <= 4) {
      return acc + 12
    }

    hasDataPadding = true
    const val = acc + 12 + length * byteUnit
    return cur.format === 2 ? val + 1 : val // ASCII null termination
  }, 2) // length unit per block

  return sum + (hasDataPadding ? 4 : 0)
}

function encodeIFD(
  resultBuffer: ArrayBuffer,
  start: number,
  tagData: EXIFTagData[],
  little: boolean,
): number {
  const view = new DataView(resultBuffer)

  view.setUint16(start, tagData.length)
  let offset = start + 2
  let dataOffset = offset + tagData.length * 12 + 4 // + data padding

  for (const tag of tagData) {
    view.setUint16(offset, tag.type)
    offset += 2

    view.setUint16(offset, tag.format)
    offset += 2

    view.setUint32(offset, tag.byteLength)
    offset += 4

    if (tag.format === 2) {
      dataOffset = setStringData(
        view,
        offset,
        dataOffset,
        tag.value as string,
        little,
      )
    } else if (tag.format === 5 || tag.format === 10) {
      if (
        Array.isArray((tag.value as [number, number] | [number, number][])[0])
      ) {
        for (const data of tag.value as [number, number][]) {
          dataOffset = setRationalData(
            view,
            offset,
            dataOffset,
            data,
            little,
            tag.format === 10,
          )
        }
      } else {
        dataOffset = setRationalData(
          view,
          offset,
          dataOffset,
          tag.value as [number, number],
          little,
          tag.format === 10,
        )
      }
    } else if (Array.isArray(tag.value)) {
      if (tag.byteSize > 4) {
        view.setUint32(offset, dataOffset - 12, little)
        for (const data of tag.value as number[]) {
          switch (tag.format) {
            case 1:
            case 7:
              view.setUint8(dataOffset, data)
              dataOffset += 1
              break
            case 3:
              view.setUint16(dataOffset, data)
              dataOffset += 2
              break
            case 4:
              view.setUint32(dataOffset, data, little)
              dataOffset += 4
              break
            case 9:
              view.setInt32(dataOffset, data, little)
              dataOffset += 4
          }
        }
      } else {
        const value = tag.value as number[]
        for (let i = 0; i < tag.value.length; i++) {
          switch (tag.format) {
            case 1:
            case 7:
              view.setUint8(offset + i, value[i])
              break
            case 3:
              view.setUint16(offset + i, value[i])
              break
            case 4:
              view.setUint32(offset + i, value[i], little)
              break
            case 9:
              view.setInt32(offset + i, value[i], little)
          }
        }
      }
    } else {
      const value = tag.value as number
      switch (tag.format) {
        case 1:
        case 7:
          view.setUint8(offset, value)
          break
        case 3:
          view.setUint16(offset, value)
          break
        case 4:
          view.setUint32(offset, value, little)
          break
        case 9:
          view.setInt32(offset, value, little)
      }
    }

    offset += 4
  }

  return offset
}
