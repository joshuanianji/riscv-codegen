import type { AppProps } from 'next/app'
import { ThemeProvider } from '@lib/ThemeProvider'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider>
    <Component {...pageProps} />
  </ThemeProvider>
)

export default MyApp
