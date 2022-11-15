import 'styles/globals.css'
import type { ReactElement, ReactNode } from 'react'
import { useEffect } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { MantineProvider, MantineThemeOverride } from '@mantine/core'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'
import { getCookie } from 'cookies-next'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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

export default function App({ Component, pageProps, router }: AppPropsWithLayout) {
  // TODO: 認証有無の判定条件を修正
  // 未認証の場合は /login へリダイレクト
  // 暫定処理として Cookie の loggedIn を元に判定している
  useEffect(() => {
    if (['/login', '/signup'].includes(router.pathname)) return
    if (!getCookie('loggedIn')) {
      router.push('/login')
    }
  }, [router.pathname])

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

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}
