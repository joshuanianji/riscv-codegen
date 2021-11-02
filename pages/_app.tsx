import type { AppProps } from 'next/app'
import { GeistProvider, CssBaseline } from '@geist-ui/react'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <GeistProvider>
    <CssBaseline /> {/* Normalize CSS */}
    <Component {...pageProps} />
  </GeistProvider>
)

export default MyApp
