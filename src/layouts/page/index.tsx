import Head from 'next/head';
import React from 'react';
import { FooterPrimary } from '~/components/footer';
import { NavigationPrimary } from '~/components/navigation';

type LayoutPageProps = {
  children: React.ReactNode;
};
export default function LayoutPage({ children }: LayoutPageProps) {
  return (
    <>
      <Head>
        <title>CraftCab</title>
        <meta name="description" content="CraftCab" />
        {/*<link rel='icon' href='/favicon.ico' />*/}
      </Head>
      <NavigationPrimary />
      <main>
        {children}
      </main>
      <FooterPrimary />
    </>
  );
}
