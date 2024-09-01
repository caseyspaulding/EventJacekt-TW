'use client';

import React, { useEffect, useState } from 'react';
import { Flowbite } from 'flowbite-react';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { customTheme } from './theme';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import type { UserType } from '@/contexts/UserContext';
import { UserProvider } from '@/contexts/UserContext';
import { createClient } from '@/utils/supabase/client';

export default function ClientProviders ( { children }: { children: React.ReactNode } )
{
  const [ user, setUser ] = useState<UserType | null>( null );
  const [ , setLoading ] = useState( true ); // Initial loading state set to true
  const supabase = createClient();

  // Fetch user data on component mount
  useEffect( () =>
  {
    const fetchUser = async () =>
    {
      try
      {
        setLoading( true );  // Start loading

        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();

        if ( error )
        {
          console.error( 'Error fetching user:', error );
          setUser( null );
        } else if ( supabaseUser )
        {
          // Fetch user profile from Supabase or your database
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
              isActive: userProfile.isActive,
              createdAt: new Date( userProfile.createdAt ),
              updatedAt: new Date( userProfile.updatedAt ),
            } );
          }
        }
      } catch ( error )
      {
        console.error( 'Unexpected error fetching user:', error );
        setUser( null );
      } finally
      {
        setLoading( false );  // Stop loading
      }
    };

    fetchUser();
  }, [ supabase ] );  // Remove `user` dependency to prevent infinite loop

  return (
    <NextUIProvider>
      <Flowbite theme={ { theme: customTheme } }>
        <Toaster />
        {/* Initialize UserProvider with the fetched user data */ }
        <UserProvider user={ user }  >
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