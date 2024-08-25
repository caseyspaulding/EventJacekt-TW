'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const ConfirmPage = () =>
{
  const [ loading, setLoading ] = useState( true );
  const [ message, setMessage ] = useState( '' );
  const router = useRouter();
  const supabase = createClient();

  useEffect( () =>
  {
    const confirmUser = async () =>
    {
      const params = new URLSearchParams( window.location.search );
      const token = params.get( 'token_hash' );
      const type = params.get( 'type' );

      if ( !token || type !== 'signup' )
      {
        setMessage( 'Invalid or missing token.' );
        setLoading( false );
        return;
      }

      // Exchange token for a session
      const { error } = await supabase.auth.exchangeCodeForSession( token );

      if ( error )
      {
        console.error( 'Error confirming email:', error.message );
        setMessage( 'Error confirming email: ' + error.message );
        setLoading( false );
        return;
      }

      setMessage( 'Email confirmed successfully! Redirecting...' );
      // Redirect to a specific page after successful confirmation
      setTimeout( () => router.push( '/choose-account-type' ), 2000 );
    };

    confirmUser();

    const { data: authListener } = supabase.auth.onAuthStateChange( ( event, session ) =>
    {
      if ( session )
      {
        router.push( '/choose-account-type' );
      }
    } );

    return () =>
    {
      authListener?.subscription?.unsubscribe();
    };
  }, [ router, supabase ] );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-md bg-white rounded-lg shadow-md text-center">
        { loading ? <p>Loading...</p> : <p>{ message }</p> }
      </div>
    </div>
  );
};

export default ConfirmPage;
