import { MediaAPIsCtx, MediaAPIsObject } from '@/contexts/mediaAPIs'
import { useIOState } from '@/hooks/useIOState'

import clsx from 'clsx'
import { option } from 'fp-ts'
import { constNull } from 'fp-ts/es6/function'
import { pipe } from 'fp-ts/es6/pipeable'
import React, { useRef, useEffect, useContext } from 'react'

import styles from './styles.module.css'

type ViewFinderProps = {
  className?: string
}

const ViewFinder: React.FC<ViewFinderProps> = ({ className }) => {
  const mediaAPIsO = useContext(MediaAPIsCtx)

  const [zoomed, setZoomed] = useIOState(false)

  const $video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!$video.current) {
      return
    }

    const mediaAPIs = pipe(
      mediaAPIsO,
      option.getOrElse<MediaAPIsObject | null>(constNull),
    )
    if (!mediaAPIs) {
      return
    }

    $video.current.srcObject = mediaAPIs.mediaStream
  }, [mediaAPIsO])

  return (
    <div
      className={clsx(
        zoomed ? styles.containerZoomed : styles.container,
        className,
      )}
      onClick={setZoomed(!zoomed)}
    >
      {pipe(
        mediaAPIsO,
        option.fold(constNull, () => (
          <video
            ref={$video}
            className={styles.lens}
            autoPlay
            muted
            playsInline
          />
        )),
      )}
    </div>
  )
}

export default ViewFinder
