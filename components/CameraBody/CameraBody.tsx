import { MediaAPIsCtx } from '@/contexts/mediaAPIs'
import { useIOState } from '@/hooks/useIOState'

import { taskEither, option, task } from 'fp-ts'
import { constVoid, constNull } from 'fp-ts/es6/function'
import { pipe } from 'fp-ts/es6/pipeable'
import React, { useContext, memo } from 'react'

import PicView from '../PicView'
import ViewFinder from '../ViewFinder'
import ShutterButton from './ShutterButton'
import styles from './styles.module.css'

const CameraBody: React.FC = () => {
  const mediaAPIsO = useContext(MediaAPIsCtx)

  const [blobO, setBlobO] = useIOState<option.Option<Blob>>(option.none)

  const takePicture = (): task.Task<null> =>
    pipe(
      mediaAPIsO,
      taskEither.fromOption(constVoid),
      taskEither.chain(({ capabilities, imageCapture }) =>
        taskEither.rightTask(() =>
          imageCapture.takePhoto({
            imageWidth: capabilities.width,
            imageHeight: capabilities.height,
          }),
        ),
      ),
      taskEither.chain(blob => taskEither.rightIO(setBlobO(option.some(blob)))),
      taskEither.fold(
        () => task.of(null),
        () => task.of(null),
      ),
    )

  return (
    <main
      className={pipe(
        blobO,
        option.fold(
          () => styles.widthContainer,
          () => styles.widthContainerPrinting,
        ),
      )}
    >
      <div className={styles.shadow} />
      <div className={styles.heightContainer}>
        <div className={styles.body}>
          <div className={styles.upperPaint} />
          <div className={styles.wrap}>
            <ViewFinder className={styles.viewFinder} />
            <div className={styles.sep} />
            <ShutterButton className={styles.button} onClick={takePicture()} />
          </div>
        </div>
        {pipe(
          blobO,
          option.fold(constNull, blob => (
            <PicView blob={blob} onClick={setBlobO(option.none)} />
          )),
        )}
      </div>
    </main>
  )
}

export default memo(CameraBody)
