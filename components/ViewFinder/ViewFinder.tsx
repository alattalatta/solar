import clsx from 'clsx'
import React, { useRef, useEffect } from 'react'

import styles from './styles.module.css'

type ViewFinderProps = {
  className?: string
  srcObject: MediaStream
}

const ViewFinder: React.FC<ViewFinderProps> = ({ className, srcObject }) => {
  const $video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!$video.current) {
      return
    }

    $video.current.srcObject = srcObject
  }, [srcObject])

  return (
    <div className={clsx(styles.container, className)}>
      <video ref={$video} className={styles.lens} autoPlay />
    </div>
  )
}

export default ViewFinder
