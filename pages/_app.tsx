import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme, Container } from '@chakra-ui/react'
import Head from 'next/head'
import '@fontsource/jetbrains-mono';
import Navbar from '../components/navbar'
import { SessionProvider } from "next-auth/react"
import { Session } from 'next-auth'
import {  Lucid } from 'lucid-cardano'
import { useState } from 'react';
import { LucidContext } from '../context/LucidContext'
import { ILucidContext } from '../types/types';

const theme = extendTheme({
  fonts: {
    heading: `'JetBrains Mono', monospace`,
    body: `'JetBrains Mono', monospace`,
  },
})

// https://stackoverflow.com/questions/73668032/nextauth-type-error-property-session-does-not-exist-on-type
function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  const [lucid, setLucid] = useState<Lucid | null>(null)
  const startingContext: ILucidContext = {
    lucid,
    setLucid
  }
  return (
    <SessionProvider session={pageProps.session}>
      <LucidContext.Provider value={startingContext}>
        <ChakraProvider theme={theme}>
          <Head>
            <title>adaplays.xyz</title>
            <meta name="description" content="Place to play simple games with ada" />
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
            <link rel="manifest" href="/favicon/site.webmanifest"/>
            <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#000000"/>
            <link rel="shortcut icon" href="/favicon/favicon.ico"/>
            <meta name="msapplication-TileColor" content="#ffc40d"/>
            <meta name="msapplication-config" content="/favicon/browserconfig.xml"/>
            <meta name="theme-color" content="#ffffff"/>
          </Head>
          <Container maxWidth='container.md'>
            <Navbar/>
            <Component {...pageProps} />
          </Container>
        </ChakraProvider>
      </LucidContext.Provider>
    </SessionProvider>
  )
}

export default MyApp
