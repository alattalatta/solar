import { DecodedIFDStruct } from '../common/types'
import { TIFF_HEADER_START } from './constants'
import { decodeTag } from './decodeTag'
import { exifMap } from './tags/exif'
import { gpsMap } from './tags/gps'

export function decodeIFDs(
  view: DataView,
  offset: number,
  little: boolean,
  decoded: DecodedIFDStruct = {
    primary: [],
    sub: [],
    interop: [],
    gps: [],
  },
  target: keyof DecodedIFDStruct = 'primary',
  tagMap: Record<string, string> = exifMap,
): DecodedIFDStruct {
  const tagCount = view.getUint16(offset, little)
  if (tagCount === 0) {
    console.log('no tags counted')
    return decoded
  }

  const tags = decoded[target]

  console.log(`${tagCount} tags counted`)
  offset += 2

  for (let i = 0; i < tagCount; i++) {
    const tagData = decodeTag(view, offset, little, tagMap)

    if (tagData.type === 0x8825) {
      console.group('reading GPS...')
      decodeIFDs(
        view,
        (tagData.value as number) + TIFF_HEADER_START,
        little,
        decoded,
        'gps',
        gpsMap,
      ),
        console.groupEnd()
    } else if (tagData.type === 0x8769) {
      console.group('reading sub-IFD...')
      decodeIFDs(
        view,
        (tagData.value as number) + TIFF_HEADER_START,
        little,
        decoded,
        'sub',
      )
      console.groupEnd()
    } else if (tagData.type === 0xa005) {
      console.group('reading interop data...')
      decodeIFDs(
        view,
        (tagData.value as number) + TIFF_HEADER_START,
        little,
        decoded,
        'interop',
      )
      console.groupEnd()
    }

    tags.push(tagData)
    offset += 12
  }

  return decoded
}
