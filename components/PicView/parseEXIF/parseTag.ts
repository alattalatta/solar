export type EXIFTagData = {
  format: DateFormats
  label: string
  length: number
  type: number
  value: string | number
}

type DateFormats =
  | 'UByte'
  | 'ASCII'
  | 'UShort'
  | 'ULong'
  | 'URational'
  | 'Byte'
  | 'Undefined'
  | 'Short'
  | 'Long'
  | 'Rational'
  | 'SFloat'
  | 'DFloat'

const dateFormatMap: Record<string, DateFormats> = Object.freeze({
  1: 'UByte',
  2: 'ASCII',
  3: 'UShort',
  4: 'ULong',
  5: 'URational',
  6: 'Byte',
  7: 'Undefined',
  8: 'Short',
  9: 'Long',
  10: 'Rational',
  11: 'SFloat',
  12: 'DFloat',
})
const dateFormatBytes: Record<DateFormats, 1 | 2 | 4 | 8> = Object.freeze({
  UByte: 1,
  ASCII: 1,
  UShort: 2,
  ULong: 4,
  URational: 8,
  Byte: 1,
  Undefined: 1,
  Short: 2,
  Long: 4,
  Rational: 8,
  SFloat: 4,
  DFloat: 8,
})

const TIFF_HEADER_START = 12

export function parseTag(
  view: DataView,
  start: number,
  little: boolean,
  metadataSet: Record<string, string>,
): EXIFTagData {
  let offset = start
  let value: string | number

  const type = view.getUint16(offset, little)
  const label = metadataSet[type]
  offset += 2

  const format = dateFormatMap[view.getUint16(offset, little)] || 'Undefined'
  offset += 2

  const length = view.getUint32(offset, little)
  offset += 4

  const byteUnit = dateFormatBytes[format]
  if (byteUnit * length > 4) {
    const dataOffset = view.getUint32(offset, little) + TIFF_HEADER_START

    if (format === 'ASCII') {
      const buffer = []
      for (let i = 0; i < length - 1; i++) {
        buffer.push(view.getUint8(dataOffset + i))
      }
      if (view.getUint8(dataOffset + length - 1) !== 0) {
        console.warn('String is not terminated')
      }

      value = buffer.map(code => String.fromCharCode(code)).join('')
    } else {
      const left = view.getUint32(dataOffset, little)
      const right = view.getUint32(dataOffset + 4, little)
      value = left / right
    }
  } else if (byteUnit === 1) {
    value = view.getUint8(offset)
  } else if (byteUnit === 2) {
    value = view.getUint16(offset, little)
  } else {
    value = view.getUint32(offset, little)
  }

  return {
    format,
    label,
    length,
    type,
    value,
  }
}
