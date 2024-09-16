'use client';

import React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import dynamic from 'next/dynamic';

const DynamicToaster = dynamic( () => import( 'react-hot-toast' ).then( mod => mod.Toaster ), { ssr: false } );

const DynamicProgressBar = dynamic(
  () => import( 'next-nprogress-bar' ).then( mod => mod.AppProgressBar ),
  { ssr: false }
);

import { UserProvider } from '@/contexts/UserContext';

export default function ClientProviders ( { children }: { children: React.ReactNode } )
{
  return (
    <NextUIProvider>
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
