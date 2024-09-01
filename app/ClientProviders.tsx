// app/ClientProviders.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Flowbite } from 'flowbite-react';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { customTheme } from './theme';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { UserProvider } from '@/contexts/UserContext'; // Import UserProvider
import { createClient } from '@/utils/supabase/client'; // Supabase client

// Define the UserType based on your application's needs
type UserType = {
  id: string;
  email: string;
  orgName: string;
  organizationId: string;
  role: string;
  avatar: string;
};

export default function ClientProviders ( { children }: { children: React.ReactNode } )
{
  const [ user, setUser ] = useState<UserType | null>( null );
  
  const supabase = createClient();

  // Fetch user data on component mount
  useEffect( () =>
  {
    const fetchUser = async () =>
    {
     
      try
      {
        const {
          data: { user: supabaseUser },
          error,
        } = await supabase.auth.getUser();

        if ( error )
        {
          console.error( 'Error fetching user:', error );
          setUser( null );
        } else if ( supabaseUser )
        {
          // Assuming you have a function to fetch user profile from Supabase or your database
          const { data: userProfile, error: profileError } = await supabase
            .from( 'user_profiles' )
            .select( '*' )
            .eq( 'user_id', supabaseUser.id )
            .single();

          if ( profileError )
          {
            console.error( 'Error fetching user profile:', profileError );
            setUser( null );
          } else
          {
            // Set user state with fetched profile data
            setUser( {
              id: supabaseUser.id,
              email: supabaseUser.email || '',
              orgName: userProfile.organizationName || '',
              organizationId: userProfile.orgId || '',
              role: userProfile.role || 'user',
              avatar: userProfile.profileImageUrl || '/images/avatars/user_avatar_default.png',
            } );
          }
        }
      } catch ( error )
      {
        console.error( 'Unexpected error fetching user:', error );
        setUser( null );
      } finally
      {
       console.log('User:', user);
      }
    };

    fetchUser();
  }, [ supabase, user ] );

  return (
    <NextUIProvider>
      <Flowbite theme={ { theme: customTheme } }>
        <Toaster />
        {/* Initialize UserProvider with the fetched user data */ }
        <UserProvider user={ user }>
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
