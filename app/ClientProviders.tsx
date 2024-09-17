'use client';

import React from 'react';
import { Flowbite } from 'flowbite-react';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { customTheme } from './theme';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { UserProvider } from '@/contexts/UserContext'; // SWR version of UserProvider
import { APIProvider } from '@vis.gl/react-google-maps';
import Script from 'next/script';

export default function ClientProviders ( { children }: { children: React.ReactNode } )
{
  return (
    <>
      {/* Include Google Analytics Script */ }
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-M6F4XVZM25" strategy="afterInteractive" />
      <Script id="google-analytics">
        { `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-M6F4XVZM25');
        `}
      </Script>

      {/* Include additional scripts */ }
      <Script src="https://accounts.google.com/gsi/client" defer></Script>
      <Script src="https://connect.stripe.com/connect-js" defer></Script>

      <NextUIProvider>
        <Flowbite theme={ { theme: customTheme } }>
          <Toaster />
          <APIProvider apiKey={ process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '' }>
            <UserProvider initialUser={ null }>
              { children }
            </UserProvider>
          </APIProvider>
          <ProgressBar
            height="3px"
            color="#0053df"
            options={ { showSpinner: false } }
            shallowRouting
          />
        </Flowbite>
      </NextUIProvider>
    </>
  );
}
