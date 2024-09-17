'use client';

import React, { Suspense } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import Script from 'next/script';

// Lazy load non-essential components
const UserProvider = React.lazy( () => import( '@/contexts/UserContext' ) );
const APIProvider = React.lazy( () => import( '@vis.gl/react-google-maps' ).then( module => ( { default: module.APIProvider } ) ) );


export default function ClientProviders ( { children }: { children: React.ReactNode } )
{
  return (
    <>
      {/* Include Google Analytics Script */ }
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-M6F4XVZM25" strategy="lazyOnload" />
     
      {/* Include additional scripts */ }
      <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" defer />
      <Script src="https://connect.stripe.com/connect-js" strategy="lazyOnload" defer />

      <NextUIProvider>
       
          <Toaster />
          <Suspense fallback={ <div>Loading...</div> }>
            <APIProvider apiKey={ process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '' }>
              <UserProvider initialUser={ null }>
                { children }
              </UserProvider>
            </APIProvider>
          </Suspense>
          <ProgressBar
            height="3px"
            color="#0053df"
            options={ { showSpinner: false } }
            shallowRouting
          />
     
      </NextUIProvider>
    </>
  );
}
