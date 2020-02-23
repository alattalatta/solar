export function concatArrayBuffer(
  buf1: ArrayBuffer,
  buf2: ArrayBuffer,
): ArrayBuffer {
  const buf = new Uint8Array(new ArrayBuffer(buf1.byteLength + buf2.byteLength))
  buf.set(new Uint8Array(buf1), 0)
  buf.set(new Uint8Array(buf2), buf1.byteLength)

  return buf.buffer
}
