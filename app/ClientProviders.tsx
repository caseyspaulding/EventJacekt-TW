
'use client';

import { useEffect, useState } from 'react';
import { Flowbite } from 'flowbite-react';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { customTheme } from './theme';
import { UserProvider } from '@/contexts/UserContext';
import type { UserType } from '@/types/UserType';
// Assume you have this defined somewhere

export default function ClientProviders ( { children }: { children: React.ReactNode } )
{
  const [ user, setUser ] = useState<UserType | null>( null );

  useEffect( () =>
  {
    async function fetchUser ()
    {
      try
      {
        const response = await fetch( '/api/user-profile' );
        const userData = await response.json();
        setUser( userData );
      } catch ( error )
      {
        console.error( 'Failed to fetch user profile:', error );
        setUser( null );
      }
    }

    fetchUser();
  }, [] );

  return (
    <NextUIProvider>
      <Flowbite theme={ { theme: customTheme } }>
        <Toaster />
        <UserProvider user={ user }>
          { children }
        </UserProvider>
      </Flowbite>
    </NextUIProvider>
  );
}
