'use client';

import React from 'react';
import { Flowbite } from 'flowbite-react';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { customTheme } from './theme';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { UserProvider } from '@/contexts/UserContext'; // SWR version of UserProvider
import { APIProvider } from '@vis.gl/react-google-maps';

export default function ClientProviders ( { children }: { children: React.ReactNode } )
{
  return (
    <NextUIProvider>
      <Flowbite theme={ { theme: customTheme } }>
        <Toaster />
        <APIProvider apiKey={ process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '' }>
        {/* Initialize UserProvider without needing to pass user state manually */ }
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
  );
}
