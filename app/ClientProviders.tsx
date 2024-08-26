
'use client';


import { Flowbite } from 'flowbite-react';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { customTheme } from './theme';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

// Assume you have this defined somewhere

export default function ClientProviders ( { children }: { children: React.ReactNode } )
{




  return (
    <NextUIProvider>
      <Flowbite theme={ { theme: customTheme } }>
        <Toaster />

        { children }
        <ProgressBar
          height="4px"
          color="#0053df"
          options={ { showSpinner: false } }
          shallowRouting
        />
      </Flowbite>
    </NextUIProvider>
  );
}
