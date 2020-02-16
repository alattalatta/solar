import { metadata, gpsMetadata } from './metadataSets'
import { EXIFTagData, parseTag } from './parseTag'

export function parseIFDs(
  view: DataView,
  offset: number,
  little: boolean,
  metadataSet: Record<string, string> = metadata,
): EXIFTagData[] {
  const tagCount = view.getUint16(offset, little)
  if (tagCount === 0) {
    return []
  }

  const tags = []

  console.log(tagCount.toString(16), 'tags counted')
  offset += 2

  for (let i = 0; i < tagCount; i++) {
    const tagData = parseTag(view, offset, little, metadataSet)

    if (tagData.type === 0x8825) {
      tags.push(
        ...parseIFDs(view, (tagData.value as number) + 12, little, gpsMetadata),
      )
    } else if (tagData.type === 0x8769) {
      tags.push(...parseIFDs(view, (tagData.value as number) + 12, little))
    }

    tags.push(tagData)
    offset += 12
  }

  return tags
}
