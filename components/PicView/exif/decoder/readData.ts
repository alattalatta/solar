export function readStringData(
  view: DataView,
  dataOffset: number,
  length: number,
): string {
  const buffer = []

  for (let i = 0; i < length - 1; i++) {
    buffer.push(String.fromCharCode(view.getUint8(dataOffset + i)))
  }
  if (view.getUint8(dataOffset + length - 1) !== 0) {
    console.warn('String data is not terminated')
  }

  return buffer.join('')
}

const readSingleByte = (view: DataView, offset: number): number =>
  view.getUint8(offset)

const readDoubleBytes = (
  view: DataView,
  offset: number,
  little?: boolean,
): number => view.getUint16(offset, little)

export const readQuadBytes = (
  view: DataView,
  offset: number,
  little?: boolean,
  signed?: boolean,
): number => {
  return signed ? view.getInt32(offset, little) : view.getUint32(offset, little)
}

function readRationalData(
  view: DataView,
  dataOffset: number,
  little: boolean,
  signed?: boolean,
): [number, number] {
  const left = readQuadBytes(view, dataOffset, little, signed)
  const right = readQuadBytes(view, dataOffset + 4, little, signed)
  return [left, right]
}

export function readDataSet(
  view: DataView,
  dataOffset: number,
  byteUnit: 1 | 2 | 4,
  length: number,
  little: boolean,
  signed?: boolean,
): number | number[] {
  const reader =
    byteUnit === 4
      ? readQuadBytes
      : byteUnit === 1
      ? readSingleByte
      : readDoubleBytes

  if (length === 1) {
    return reader(view, dataOffset, little, signed)
  }

  const buffer = []
  for (let i = 0; i < length; i++) {
    buffer.push(reader(view, dataOffset + i * byteUnit, little, signed))
  }

  return buffer
}

export function readRationalDataSet(
  view: DataView,
  dataOffset: number,
  length: number,
  little: boolean,
  signed?: boolean,
): [number, number] | [number, number][] {
  if (length === 1) {
    return readRationalData(view, dataOffset, little, signed)
  }

  const buffer = []
  for (let i = 0; i < length; i++) {
    buffer.push(readRationalData(view, dataOffset + i * 8, little, signed))
  }

  return buffer
}
