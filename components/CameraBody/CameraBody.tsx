import { MediaAPIsCtx } from '@/contexts/mediaAPIs'

import { option } from 'fp-ts'
import { pipe } from 'fp-ts/es6/pipeable'
import React, { useContext } from 'react'

import ViewFinder from '../ViewFinder'
import styles from './styles.module.css'

const CameraBody: React.FC = () => {
  const mediaAPIO = useContext(MediaAPIsCtx)

  return (
    <main className={styles.widthContainer}>
      <div className={styles.shadow} />
      <div className={styles.heightContainer}>
        <div className={styles.wrap}>
          {pipe(
            mediaAPIO,
            option.fold(
              () => <p>Loading</p>,
              ({ mediaStream }) => (
                <ViewFinder
                  className={styles.viewFinder}
                  srcObject={mediaStream}
                />
              ),
            ),
          )}
          <div className={styles.sep} />
        </div>
      </div>
    </main>
  )
}

export default CameraBody
