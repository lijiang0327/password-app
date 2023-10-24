import type { AppProps } from 'next/app'
import * as React from 'react'

import './global.css'
 
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}