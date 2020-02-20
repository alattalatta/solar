import { dataFormatByteMap } from '../common/maps'
import { DecodedIFDStruct, EXIFTagData } from '../common/types'

export function encodeEXIF(decoded: DecodedIFDStruct): void {
  encodeIFD(decoded.primary)
  const primary = measureIFDBufferLength(decoded.primary)
  const sub = measureIFDBufferLength(decoded.sub)
  const interop = measureIFDBufferLength(decoded.interop)
  const gps = measureIFDBufferLength(decoded.gps)
  console.log(primary + sub + interop + gps + 20)
}

/**
 * The `measureIFDBufferLength()` function measures a IFD's size of both data and value area, and returns the sum of them.
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

function encodeIFD(tagData: EXIFTagData[]): void {
  const length = measureIFDBufferLength(tagData)
  const view = new DataView(new ArrayBuffer(length))

  view.setUint16(0, tagData.length)
  let offset = 2

  for (const tag of tagData) {
    view.setUint16(offset, tag.type)
    offset += 2

    view.setUint16(offset, tag.format)
    offset += 2

    view.setUint32(offset, tag.byteLength)
    offset += 4

    if (tag.byteSize > 4) {
      view.setUint32(offset, 0xffffffff)
    } else if (typeof tag.value === 'string') {
      for (let i = 0; i < tag.value.length; i++) {
        view.setUint8(offset + i, tag.value.charCodeAt(0))
      }
    } else if (Array.isArray(tag.value)) {
      for (let i = 0; i < tag.value.length; i++) {
        view.setUint8(offset + i, tag.value[i])
      }
    } else if (tag.byteSize <= 1) {
      view.setUint8(offset, tag.value)
    } else if (tag.byteSize <= 2) {
      view.setUint16(offset, tag.value)
    } else {
      view.setUint32(offset, tag.value)
    }
    offset += 4
  }

  const dump = new Uint8Array(view.buffer)

  console.groupCollapsed('IFD Dump')
  console.log(
    dump
      .reduce<string[]>((acc, cur) => {
        acc.push(cur.toString(16).padStart(2, '0'))
        return acc
      }, [])
      .join(' '),
  )
  console.groupEnd()
}
