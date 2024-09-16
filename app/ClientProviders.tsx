'use client';

import React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import Script from 'next/script';

const DynamicToaster = dynamic( () => import( 'react-hot-toast' ).then( ( mod ) => mod.Toaster ), { ssr: false } );
const DynamicProgressBar = dynamic( () => import( 'next-nprogress-bar' ).then( ( mod ) => mod.AppProgressBar ), { ssr: false } );

import { UserProvider } from '@/contexts/UserContext';

export default function ClientProviders ( { children }: { children: React.ReactNode } )
{
  return (
    <NextUIProvider>
      {/* Google Analytics Script */ }
      <Script id="google-analytics" strategy="afterInteractive">
        { `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtag/js?id=G-M6F4XVZM25';f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','G-M6F4XVZM25');
                    
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-M6F4XVZM25');
                `}
      </Script>

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
