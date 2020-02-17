import '../styles/master.css'

import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>S O L A R</title>
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="viewport"
          content="initial-scale=1, maximum-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
