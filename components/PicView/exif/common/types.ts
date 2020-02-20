export type DataFormats =
  | 1 // UByte
  | 2 // ASCII
  | 3 // UShort
  | 4 // ULong
  | 5 // URational
  | 7 // Undefined
  | 9 // Long
  | 10 // Rational

export type EXIFTagData = {
  format: DataFormats
  label: string
  byteLength: number
  byteSize: number
  type: number
  value: string | number | number[]
}

export type DecodedIFDStruct = {
  primary: EXIFTagData[]
  sub?: EXIFTagData[]
  interop?: EXIFTagData[]
  gps?: EXIFTagData[]
}
