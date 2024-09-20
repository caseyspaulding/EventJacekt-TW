'use client';

import React, { Suspense } from 'react';
// Direct import of the Button component
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

    
     

  
      <Toaster />
      <Suspense fallback={ <div>Loading...</div> }>
        <UserProvider initialUser={ null }>
          { children }
        </UserProvider>
      </Suspense>
      <ProgressBar
        height="3px"
        color="#ffe145"
        options={ { showSpinner: false } }
        shallowRouting
      />
    </>
  );
}
