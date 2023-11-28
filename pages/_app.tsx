import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme, Container } from '@chakra-ui/react'
import Head from 'next/head'
import '@fontsource/jetbrains-mono';
import Navbar from '../components/navbar'
import { SessionProvider } from "next-auth/react"
import { Session } from 'next-auth'
import { headingTheme } from 'theme/components/heading'
import { nufiAdapter } from '@nufi/dapp-client-cardano';

const theme = extendTheme({
  fonts: {
    heading: `'JetBrains Mono', monospace`,
    body: `'JetBrains Mono', monospace`,
  },
  components: {
    Heading: headingTheme,
  }
})

// TODO: adjust SDK so that it prevents injecting iframe multiple times
let didInject = false;

// https://stackoverflow.com/questions/73668032/nextauth-type-error-property-session-does-not-exist-on-type
function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  const [hideWidget, setHideWidget] = useState<() => void>()

  useEffect(() => {
    if (didInject === false) {
      // TODO: adjust SDK so that iframe is visible only after user choose NuFi wallet
      // (relies on proper batching of requests).
      const {hideWidget} = nufiAdapter('web3Auth');
      setHideWidget(() => hideWidget)
      didInject = true;
    }
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider theme={theme}>
        <Head>
          <title>adaplays.com</title>
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
          <Navbar hideWidget={hideWidget} />
          <Component {...pageProps} />
          <div style={{position: 'fixed', bottom: 10, right: 10}}>Copyright (c) 2022 Sourabh Aggarwal</div>
        </Container>
      </ChakraProvider>
    </SessionProvider>
  )
}

export default MyApp
