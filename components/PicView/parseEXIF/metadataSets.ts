export const metadata: Record<string, string> = Object.freeze({
  0x100: 'Image width',
  0x0101: 'Image height',
  0x010e: 'Image description',
  0x010f: 'Make',
  0x0110: 'Model',
  0x0112: 'Orientation',
  0x011a: 'X resolution',
  0x011b: 'Y resolution',
  0x0128: 'Resolution unit',
  0x0131: 'Software',
  0x0132: 'Datetime',

  0x8298: 'Copyright',
  0x8769: 'Sub-EXIF offset',
  0x829a: 'Exposure',
  0x829d: 'f',
  0x8825: 'GPS',
  0x8827: 'ISO',

  0x9003: 'Original datetime',
  0x9004: 'Digitized datetime',
  0x9201: 'Shutter speed',
  0x9209: 'Flash',
  0x920a: 'Focal length',

  0xa001: 'Color space',
})

export const gpsMetadata: Record<string, string> = Object.freeze({
  0x0000: 'GPS version',
  0x0001: 'GPS latitude ref',
  0x0002: 'GPS latitude',
  0x0003: 'GPS longitude ref',
  0x0004: 'GPS longitude',
  0x0005: 'GPS altitude ref',
  0x0006: 'GPS altitude',
})
