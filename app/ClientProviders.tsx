'use client';

import React, { Suspense } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import Script from 'next/script';

// Lazy load non-essential components
const UserProvider = React.lazy( () => import( '@/contexts/UserContext' ) );


export default function ClientProviders ( { children }: { children: React.ReactNode } )
{
  return (
    <>
      {/* Include Google Analytics Script */ }
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-M6F4XVZM25" strategy="lazyOnload" />
     
      {/* Include additional scripts */ }
      
      <Script src="https://connect.stripe.com/connect-js" strategy="lazyOnload" defer />

      <NextUIProvider>
       
          <Toaster />
          <Suspense fallback={ <div>Loading...</div> }>
           
              <UserProvider initialUser={ null }>
                { children }
              </UserProvider>
            
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
