import { EXIFTagData, parseTag } from './parseTag'
import { exifMap } from './tags/exif'
import { gpsMap } from './tags/gps'

export function parseIFDs(
  view: DataView,
  offset: number,
  little: boolean,
  tagMap: Record<string, string> = exifMap,
): EXIFTagData[] {
  const tagCount = view.getUint16(offset, little)
  if (tagCount === 0) {
    console.log('no tags counted')
    return []
  }

  const tags = []

  console.log(`${tagCount} tags counted`)
  offset += 2

  for (let i = 0; i < tagCount; i++) {
    const tagData = parseTag(view, offset, little, tagMap)

    if (tagData.type === 0x8825) {
      console.group('reading GPS...')
      tags.push(
        ...parseIFDs(view, (tagData.value as number) + 12, little, gpsMap),
      )
      console.groupEnd()
    } else if (tagData.type === 0x8769) {
      console.group('reading sub-IFD...')
      tags.push(...parseIFDs(view, (tagData.value as number) + 12, little))
      console.groupEnd()
    } else if (tagData.type === 0xa005) {
      console.group('reading interop data...')
      tags.push(...parseIFDs(view, (tagData.value as number) + 12, little))
      console.groupEnd()
    }

    tags.push(tagData)
    offset += 12
  }

  return tags
}
