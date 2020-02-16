import { io } from 'fp-ts'
import React, { useEffect, useState } from 'react'

import { parseEXIF } from './parseEXIF'
import styles from './styles.module.css'

type PicViewProps = {
  blob: Blob
  onClick: io.IO<void>
}

const PicView: React.FC<PicViewProps> = ({ blob, onClick }) => {
  const [mounted, setMounted] = useState(false)

  const src = URL.createObjectURL(blob)

  useEffect(() => {
    parseEXIF(blob)
    setTimeout(() => {
      setMounted(true)
    })

    return () => URL.revokeObjectURL(src)
  }, [blob])

  return (
    <img
      className={mounted ? styles.containerPrinting : styles.container}
      src={src}
      alt="Preview of the last photo"
      onClick={onClick}
    />
  )
}

export default PicView
