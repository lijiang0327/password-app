import type { AppProps } from 'next/app'
import * as React from 'react'
import { QueryClientProvider, QueryClient } from 'react-query';

import './global.css'
 
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider
      client={queryClient}
    >
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
