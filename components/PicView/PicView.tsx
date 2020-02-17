import { io } from 'fp-ts'
import React, { useEffect, useState, useCallback, memo } from 'react'

import { parseEXIF } from './parseEXIF'
import styles from './styles.module.css'

type PicViewProps = {
  blob: Blob
  onClick: io.IO<void>
}

type Point = {
  x: number
  y: number
}

const PicView: React.FC<PicViewProps> = ({ blob, onClick }) => {
  const [src, setSrc] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const [initialCoords, setInitialCoords] = useState<Point | null>(null)
  const [currentCoords, setCurrentCoords] = useState<Point | null>(null)

  const setupCoords = useCallback((event: React.TouchEvent) => {
    setInitialCoords({
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    })
  }, [])

  const calcCoords = useCallback((event: React.TouchEvent) => {
    setCurrentCoords({
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    })
  }, [])

  const resetCoords = useCallback(() => {
    setInitialCoords(null)
    setCurrentCoords(null)
  }, [])

  const vector =
    currentCoords && initialCoords
      ? {
          x: currentCoords.x - initialCoords.x,
          y: currentCoords.y - initialCoords.y,
        }
      : null

  const transform = vector
    ? `translate3d(${vector.x}px, ${vector.y}px, 0)`
    : 'translate3d(0, 0, 0)'

  useEffect(() => {
    parseEXIF(blob)
    setSrc(URL.createObjectURL(blob))
    setTimeout(() => {
      setMounted(true)
    })

    return () => void (src && URL.revokeObjectURL(src))
  }, [blob])

  if (!src) {
    return null
  }

  return (
    <div className={mounted ? styles.containerPrinting : styles.container}>
      <div className={styles.mover} style={{ transform }}>
        <img
          className={styles.image}
          src={src}
          alt="Preview of the last photo"
          onClick={onClick}
          onTouchStart={setupCoords}
          onTouchMove={calcCoords}
          onTouchCancel={resetCoords}
          onTouchEnd={resetCoords}
        />
        <span>0303</span>
      </div>
    </div>
  )
}

export default memo(PicView)
