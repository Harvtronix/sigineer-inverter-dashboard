import '@carbon/styles/css/styles.css'
// Why is this not available as part of the charts package directly? It's a transient dependency
import '@carbon/charts/styles.css'
import '../styles/globals.css'

import { Theme } from '@carbon/react'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Theme theme="g90">
      <Component {...pageProps} />
    </Theme>
  )
}

export default MyApp
