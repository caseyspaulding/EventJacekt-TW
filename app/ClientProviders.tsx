"use client";

import { Flowbite } from 'flowbite-react';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { customTheme } from './theme';
import type { PropsWithChildren } from 'react';

export default function ClientProviders ( { children }: PropsWithChildren )
{
  return (
    <NextUIProvider>
      <Flowbite theme={ { theme: customTheme } }>
        <Toaster />
        { children }
      </Flowbite>
    </NextUIProvider>
  );
}
