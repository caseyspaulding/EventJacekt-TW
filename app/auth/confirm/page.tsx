'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const ConfirmPage = () =>
{
  const [ loading, setLoading ] = useState( true );
  const router = useRouter();
  const supabase = createClient();

  useEffect( () =>
  {
    const confirmUser = async () =>
    {
      const { data, error } = await supabase.auth.getSession();

      if ( error )
      {
        console.error( 'Error fetching session:', error );
      } else if ( data?.session )
      {
        // User is confirmed and has a session, redirect to continue registration
        router.push( '/choose-account-type' );
      } else
      {
        // Handle case where user is not confirmed or there was an issue
        console.error( 'User confirmation failed.' );
      }

      setLoading( false );
    };

    // Listen for changes in auth state (useful when confirming via email link)
    const { data: authListener } = supabase.auth.onAuthStateChange( async ( event, session ) =>
    {
      if ( session )
      {
        router.push( '/choose-account-type' );
      } else if ( event === 'SIGNED_OUT' )
      {
        console.error( 'User signed out.' );
      } else if ( event === 'SIGNED_IN' )
      {
        await confirmUser();
      }
    } );

    // Call confirmUser when the component mounts
    confirmUser();

    return () =>
    {
      authListener.subscription.unsubscribe();
    };
  }, [ router, supabase ] );

  if ( loading )
  {
    return <div> Loading...</div>;
  }

  return null;
};

export default ConfirmPage;
