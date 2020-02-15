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
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
