export function setStringData(
  view: DataView,
  offset: number,
  dataOffset: number,
  value: string,
  little?: boolean,
): number {
  if (value.length <= 4) {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset + i, value.charCodeAt(i))
    }
    return dataOffset
  }

  view.setUint32(offset, dataOffset - 12, little)

  for (let i = 0; i < value.length; i++) {
    console.log('printing at', (dataOffset + i).toString(16), value.charAt(i))
    view.setUint8(dataOffset + i, value.charCodeAt(i))
  }

  return dataOffset + value.length + 1
}

export const setQuadBytes = (
  view: DataView,
  offset: number,
  value: number,
  little?: boolean,
  signed?: boolean,
): void => {
  return signed
    ? view.setInt32(offset, value, little)
    : view.setUint32(offset, value, little)
}

export function setRationalData(
  view: DataView,
  offset: number,
  dataOffset: number,
  value: [number, number],
  little: boolean,
  signed?: boolean,
): number {
  view.setUint32(offset, dataOffset - 12)

  setQuadBytes(view, dataOffset, value[0], little, signed)
  setQuadBytes(view, dataOffset + 4, value[1], little, signed)

  return dataOffset + 8
}
