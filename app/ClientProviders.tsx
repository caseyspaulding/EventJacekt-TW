// app/ClientProviders.tsx
'use client';

import { Flowbite } from 'flowbite-react';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { customTheme } from './theme';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { UserProvider } from '@/contexts/UserContext'; // Import UserProvider

export default function ClientProviders ( { children }: { children: React.ReactNode } )
{
  return (
    <NextUIProvider>
      <Flowbite theme={ { theme: customTheme } }>
        <Toaster />
        <UserProvider user={ null }> {/* Wrap the children with UserProvider here */ }
          { children }
        </UserProvider>
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
