import { Html, Head, Main, NextScript } from 'next/document'
import * as React from 'react';

export default function Document() {
  return (
    <Html>
      <Head>
        <title>secret app</title>
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
