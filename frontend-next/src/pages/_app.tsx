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

// Tailwind のブレイクポイントを Mantine 用に加工
const tailwindScreensForMantine: {[key: string]: number} = {}
const tailwindScreens = resolvedTailwindConfig.theme?.screens
if (tailwindScreens) {
  for (const [key, value] of Object.entries(tailwindScreens)) {
    // 末尾の px を削除してから数値に変換
    tailwindScreensForMantine[key] = Number(value.slice(0, -2))
  }
}

// Tailwind の色を Mantine 用に変換
let tailwindColorsForMantine: Record<string, Tuple<string, 10>> = {}
const tailwindColors = resolvedTailwindConfig.theme?.colors
if (tailwindColors) {
  for (const [name, colorsObj] of Object.entries(tailwindColors)) {
    const colors = Object.values(colorsObj)
    if (colors.length <= 9) continue
    tailwindColorsForMantine[name] = colors as Tuple<string, 10>
  }
}

const theme: MantineThemeOverride = {
  breakpoints: tailwindScreensForMantine,
  colors: tailwindColorsForMantine
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
