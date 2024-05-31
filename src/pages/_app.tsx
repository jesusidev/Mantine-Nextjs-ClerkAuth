import { type AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ClerkProvider } from '@clerk/nextjs';
import '@fontsource/work-sans';
import '@fontsource/roboto';
import { useState } from 'react';
import { dark } from '@clerk/themes';
import { setCookie } from 'cookies-next';
import { useHotkeys } from '@mantine/hooks';
import { theme } from '~/styles/theme';
import { api } from '~/utils/api';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MicrosoftClarity } from '~/components/analytics/clarity/MicrosoftClarity';
import { GoogleAnalytics } from '~/components/analytics/google/GoogleAnalytics';

const App = (props: AppProps) => {
  const { Component, pageProps } = props;
  const [colorSchemeState, setColorSchemeState] = useState(
    pageProps.colorScheme === 'dark' ? 'dark' : 'light'
  );

  const toggleColorScheme = () => {
    setColorSchemeState(colorSchemeState === 'dark' ? 'light' : 'dark');
    setCookie('color-scheme', colorSchemeState === 'dark' ? 'light' : 'dark', {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  //Ctrl/⌘ + J
  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  return (
    <>
      <Head>
        <title>T3 Mantine ClerkAuth | Inventory App</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        {/*<link rel='shortcut icon' href='/favicon.svg' />*/}
      </Head>

      <MantineProvider theme={theme}>
        <ClerkProvider
          {...pageProps}
          appearance={{
            baseTheme: colorSchemeState === 'dark' ? dark : colorSchemeState,
          }}
        >
          <MicrosoftClarity />
          <GoogleAnalytics />
          <Notifications position="top-center" zIndex={1077} limit={5} />
          <Component {...pageProps} />
        </ClerkProvider>
      </MantineProvider>
    </>
  );
};

export default api.withTRPC(App);
