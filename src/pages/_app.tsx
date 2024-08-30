'use client'
import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { AppProps } from 'next/app'
import 'react-quill/dist/quill.snow.css'

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../store/user';
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router';
//Analytics and Speed Insights
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

function Layout() {
  const router = useRouter();

  return <>
    <SpeedInsights route={router.pathname} />
    <Analytics />
  </>
}
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <title>Chakulabora</title>
      </Head>
      <Provider store={store}>
        <ChakraProvider>
          <Component {...pageProps} />
          <Layout />
        </ChakraProvider>
      </Provider>
    </SessionProvider>
  )
}
