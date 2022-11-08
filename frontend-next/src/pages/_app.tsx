import 'styles/globals.css'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { MantineProvider, MantineThemeOverride, Tuple } from '@mantine/core'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const resolvedTailwindConfig = resolveConfig(tailwindConfig)

// Tailwind のブレイクポイントを Mantine 用に変換
const tailwindScreensForMantine: {[key: string]: number} = {}
const tailwindScreens = resolvedTailwindConfig.theme?.screens
if (tailwindScreens) {
  for (const [key, value] of Object.entries(tailwindScreens)) {
    // 末尾の px を削除してから数値に変換
    tailwindScreensForMantine[key] = Number(value.slice(0, -2))
  }
}

const theme: MantineThemeOverride = {
  breakpoints: tailwindScreensForMantine,
  primaryShade: 5
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <>
      <Head>
        <title>BookApp</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={theme}
      >
        {getLayout(<Component {...pageProps} />)}
      </MantineProvider>
    </>
  )
}
