import { dataFormatByteMap } from '../common/maps'
import { DecodedIFDStruct, EXIFTagData } from '../common/types'

export function encodeEXIF(decoded: DecodedIFDStruct): void {
  const primary = encodeIFDs(decoded.primary)
  const sub = encodeIFDs(decoded.sub)
  const interop = encodeIFDs(decoded.interop)
  const gps = encodeIFDs(decoded.gps)

  console.log(primary + sub + interop + gps + 20)
}

function encodeIFDs(tagData: EXIFTagData[]): number {
  console.log(`${tagData.length} tags counted`)

  if (!tagData.length) {
    return 0
  }

  const sum = tagData.reduce((acc, cur) => {
    const length = cur.length
    const byteUnit = dataFormatByteMap[cur.format]
    if (length * byteUnit <= 4) {
      return acc + 12
    }

    const val = acc + 12 + length * byteUnit
    return cur.format === 2 ? val + 1 : val // ASCII null termination
  }, 2) // length unit per block

  return sum
}
