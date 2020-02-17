import { encodeEXIF } from '../encoder'
import { decodeIFDs } from './decodeIFDs'

export async function decodeEXIF(blob: Blob): Promise<void> {
  const buffer = (await (blob as any).arrayBuffer()) as ArrayBuffer
  const view = new DataView(buffer)
  if (view.getUint16(0) !== 0xffd8) {
    window.alert('Not a JPEG')
    return
  }

  let offset = 2

  // ensure APP1 marker
  const marker = view.getUint16(offset)
  if (marker !== 0xffe1) {
    console.log('The first marker is not of APP1, 0xffe1. Aborting...')
    return
  }

  // length of the APP1
  offset += 2
  const app1Length = view.getUint16(offset)
  console.log(
    `APP1 area: 0x${offset.toString(16)} ~ 0x${(offset + app1Length).toString(
      16,
    )}`,
  )
  ;((blob.slice(0, offset + app1Length) as any).arrayBuffer() as Promise<
    ArrayBuffer
  >)
    .then(buf => new Uint8Array(buf))
    .then(arr =>
      arr
        .reduce<string[]>((acc, cur) => {
          acc.push(cur.toString(16).padStart(2, '0'))
          return acc
        }, [])
        .join(' '),
    )
    .then(dmp => {
      console.groupCollapsed('APP1 dump')
      console.log(dmp)
      console.groupEnd()
    })

  // EXIF header
  offset += 2
  if (view.getUint32(offset) !== 0x45786966) {
    window.alert(`Couldn't find EXIF header`)
    return
  }

  offset += 6
  // https://www.media.mit.edu/pia/Research/deepview/exif.html
  // > First 8bytes of TIFF format are TIFF header. First 2bytes defines byte align of TIFF data.
  // > If it is 0x4949="I I", it means "Intel" type byte align. If it is 0x4d4d="MM", it means "Motorola" type byte align.
  // > For example, value '305,419,896' is noted as 0x12345678 by sixteenth system.
  // > At the Motrola align, it is stored as 0x12,0x34,0x56,0x78. If it's Intel align, it is stored as 0x78,0x56,0x34,0x12.
  const little = view.getUint16(offset) === 0x4949

  // offset to the first IFD
  offset += view.getUint32(offset + 4, little)
  console.log('offset', offset, 'total length', app1Length)

  const parsedIFDs = decodeIFDs(view, offset, little)
  console.log(parsedIFDs)
  encodeEXIF(parsedIFDs)
}
