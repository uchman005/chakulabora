'use client'
import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { AppProps } from 'next/app'
import 'react-quill/dist/quill.snow.css'
// 1. import `ChakraProvider` component
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../store/user';

import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </Provider>
    </SessionProvider>
  )
}
