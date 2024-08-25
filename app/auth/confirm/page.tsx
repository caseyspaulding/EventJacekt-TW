'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';

const ConfirmPage = () =>
{
  const [ loading, setLoading ] = useState( true );
  const [ errorMessage, setErrorMessage ] = useState( '' );
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect( () =>
  {
    const confirmUser = async () =>
    {
      try
      {
        const tokenHash = searchParams.get( 'token_hash' );
        const type = searchParams.get( 'type' );

        if ( !tokenHash || type !== 'signup' )
        {
          throw new Error( 'Invalid or missing confirmation link.' );
        }

        // Exchange the token hash for a session
        const { data, error } = await supabase.auth.verifyOtp( {
          token_hash: tokenHash,
          type: 'signup',
        } );

        if ( error )
        {
          throw error;
        }

        // Check if the session was created successfully
        if ( data?.session )
        {
          // If confirmation is successful, redirect to the account type selection page
          router.push( '/choose-account-type' );
        } else
        {
          throw new Error( 'Failed to create session after email confirmation.' );
        }
      } catch ( error )
      {
        console.error( 'Error confirming email:', error );
        setErrorMessage( error.message || 'An error occurred during email confirmation.' );
        setLoading( false );
      }
    };

    confirmUser();
  }, [ router, searchParams, supabase ] );

  if ( loading )
  {
    return <div>Confirming your email...</div>;
  }

  if ( errorMessage )
  {
    return <div>Error: { errorMessage }</div>;
  }

  return null;
};

export default ConfirmPage;