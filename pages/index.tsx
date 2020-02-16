import CameraBody from '@/components/CameraBody'
import { MediaAPIsCtx, MediaAPIsObject } from '@/contexts/mediaAPIs'
import { useTaskEffect } from '@/hooks/useTaskEffect'

import { array, io, option, taskEither, task } from 'fp-ts'
import { pipe } from 'fp-ts/es6/pipeable'
import { NextPage } from 'next'
import React, { useState } from 'react'

function alert(message: string): io.IO<void> {
  return () => window.alert(message)
}

// request (any) backside camera
function getUserMedia(): taskEither.TaskEither<string, MediaStream> {
  return taskEither.tryCatch(
    () =>
      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: 'environment', // [todo] exact: 'environment'
          },
        },
      }),
    () => 'Camera access is not available on your device',
  )
}

// get the first track and make media api object
function makeMediaAPIsObject(
  mediaStream: MediaStream,
): taskEither.TaskEither<string, MediaAPIsObject> {
  return pipe(
    array.head(mediaStream.getVideoTracks()),
    option.fold(
      () => taskEither.left('No back-facing camera found on your device'),
      track => {
        const imageCapture = new ImageCapture(track)
        return pipe(
          taskEither.rightTask(() => imageCapture.getPhotoCapabilities()),
          taskEither.map(capabilities => ({
            capabilities: {
              width: capabilities.imageWidth.max,
              height: capabilities.imageHeight.max,
            },
            imageCapture,
            mediaStream,
          })),
        )
      },
    ),
  )
}

const Index: NextPage = () => {
  const [mediaAPIsO, setMediaAPIsO] = useState<option.Option<MediaAPIsObject>>(
    option.none,
  )

  useTaskEffect(
    pipe(
      getUserMedia(),
      taskEither.chain(makeMediaAPIsObject),
      // and finally set the ref
      taskEither.fold(
        error => task.fromIO(alert(error)),
        mediaAPIs => task.fromIO(() => setMediaAPIsO(option.some(mediaAPIs))),
      ),
    ),
  )

  return (
    <MediaAPIsCtx.Provider value={mediaAPIsO}>
      <CameraBody />
    </MediaAPIsCtx.Provider>
  )
}

export default Index
