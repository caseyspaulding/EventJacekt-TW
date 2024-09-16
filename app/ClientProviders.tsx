'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Script from 'next/script';

// Dynamically import components for better performance
const DynamicToaster = dynamic( () => import( 'react-hot-toast' ).then( ( mod ) => mod.Toaster ), { ssr: false } );
const DynamicProgressBar = dynamic( () => import( 'next-nprogress-bar' ).then( ( mod ) => mod.AppProgressBar ), { ssr: false } );
const DynamicNextUIProvider = dynamic( () => import( '@nextui-org/react' ).then( ( mod ) => mod.NextUIProvider ), { ssr: false } );
const DynamicUserProvider = dynamic( () => import( '@/contexts/UserContext' ).then( ( mod ) => mod.UserProvider ), { ssr: false } );

export default function ClientProviders ( { children }: { children: React.ReactNode } )
{
  return (
    <DynamicNextUIProvider>
      {/* Google Analytics Script - Optimized */ }
      <Script
        async src="https://www.googletagmanager.com/gtag/js?id=G-M6F4XVZM25"
        strategy="lazyOnload"
      />
      <Script id="google-analytics-inline" strategy="lazyOnload">
        { `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-M6F4XVZM25', {
            'anonymize_ip': true,
            'send_page_view': false
          });
        `}
      </Script>

      {/* Load third-party components after page is interactive */ }
      <DynamicToaster />
      <DynamicUserProvider initialUser={ null }>
        { children }
      </DynamicUserProvider>
      <DynamicProgressBar
        height="3px"
        color="#0053df"
        options={ { showSpinner: false } }
        shallowRouting
      />
    </DynamicNextUIProvider>
  );
}
