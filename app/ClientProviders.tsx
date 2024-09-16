'use client';

import React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import Script from 'next/script';

// Dynamically import components for better performance
const DynamicToaster = dynamic( () => import( 'react-hot-toast' ).then( ( mod ) => mod.Toaster ), { ssr: false } );
const DynamicProgressBar = dynamic( () => import( 'next-nprogress-bar' ).then( ( mod ) => mod.AppProgressBar ), { ssr: false } );

import { UserProvider } from '@/contexts/UserContext';

export default function ClientProviders ( { children }: { children: React.ReactNode } )
{
  return (
    <NextUIProvider>
      {/* Google Analytics Script - Optimized */ }
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-M6F4XVZM25"
        strategy="lazyOnload"
        async
      />
      <Script id="google-analytics-inline" strategy="lazyOnload" async>
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
      <UserProvider initialUser={ null }>
        { children }
      </UserProvider>
      <DynamicProgressBar
        height="3px"
        color="#0053df"
        options={ { showSpinner: false } }
        shallowRouting
      />
    </NextUIProvider>
  );
}
