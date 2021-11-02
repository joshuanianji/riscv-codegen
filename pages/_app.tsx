import type { AppProps } from 'next/app'
import { ThemeProvider } from '@lib/ThemeProvider'
import { NavigatorPermissionsProvider } from '@lib/NavigatorPermissionsProvider'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <NavigatorPermissionsProvider>
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  </NavigatorPermissionsProvider>
)

export default MyApp
