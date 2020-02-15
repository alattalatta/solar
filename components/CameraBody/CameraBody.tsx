import { MediaAPIsCtx } from '@/contexts/mediaAPIs'

import { taskEither, option, io, task } from 'fp-ts'
import { constVoid, constNull } from 'fp-ts/es6/function'
import { pipe } from 'fp-ts/es6/pipeable'
import React, { useContext, useState } from 'react'

import PicView from '../PicView'
import ViewFinder from '../ViewFinder'
import styles from './styles.module.css'

const CameraBody: React.FC = () => {
  const mediaAPIsO = useContext(MediaAPIsCtx)

  const [blobO, setBlobO] = useState<option.Option<Blob>>(option.none)

  const setBlob = (val: option.Option<Blob>): io.IO<void> => () => setBlobO(val)

  const takePicture = (): task.Task<null> =>
    pipe(
      mediaAPIsO,
      option.map(mediaAPIs => mediaAPIs.imageCapture),
      taskEither.fromOption(constVoid),
      taskEither.chain(imageCapture =>
        taskEither.rightTask(() => imageCapture.takePhoto()),
      ),
      taskEither.chain(blob => taskEither.rightIO(setBlob(option.some(blob)))),
      taskEither.fold(
        () => task.of(null),
        () => task.of(null),
      ),
    )

  return (
    <main className={styles.widthContainer}>
      <div className={styles.shadow} />
      <div className={styles.heightContainer}>
        <div className={styles.wrap}>
          <ViewFinder className={styles.viewFinder} />
          <div className={styles.sep} />
          <button className={styles.button} onClick={takePicture()}>
            <div className={styles.buttonIn} />
          </button>
        </div>
      </div>
      {pipe(
        blobO,
        option.fold(constNull, blob => (
          <PicView blob={blob} onClick={setBlob(option.none)} />
        )),
      )}
    </main>
  )
}

export default CameraBody
