
'use client';


import { Flowbite } from 'flowbite-react';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { customTheme } from './theme';


// Assume you have this defined somewhere

export default function ClientProviders ( { children }: { children: React.ReactNode } )
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
