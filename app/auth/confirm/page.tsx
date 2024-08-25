'use client';

import React, { Suspense, useEffect, useState } from 'react';
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
    const tokenHash = searchParams.get( 'token_hash' );
    const type = searchParams.get( 'type' );
    const email = searchParams.get( 'email' ); // Extract the email from searchParams

    if ( !tokenHash || type !== 'signup' || !email )
    {
      setErrorMessage( 'Invalid or missing confirmation link.' );
      setLoading( false );
      return;
    }

    const confirmUser = async () =>
    {
      try
      {
        // Step 1: Confirm the user's email using the tokenHash
        const { error: confirmError } = await supabase.auth.exchangeCodeForSession( tokenHash );

        if ( confirmError )
        {
          throw confirmError;
        }

        // Step 2: Sign in the user to create a session
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword( {
          email: email, // Use the extracted email
          password: 'your_password_here', // Use the user's password; if not available, you may need to handle it differently
        } );

        if ( signInError )
        {
          throw signInError;
        }

        // If sign-in and session creation is successful, redirect to the account type selection page
        router.push( '/choose-account-type' );
      } catch ( error )
      {
        setErrorMessage( 'Error confirming email: ' + error.message );
        setLoading( false );
      }
    };

    // Call confirmUser when the component mounts
    confirmUser();
  }, [ router, searchParams, supabase ] );

  if ( loading )
  {
    return <div>Loading...</div>;
  }

  if ( errorMessage )
  {
    return <div>Error: { errorMessage }</div>;
  }

  return null; // or some other success message or component
};

const ConfirmPageWrapper = () => (
  <Suspense fallback={ <div>Loading...</div> }>
    <ConfirmPage />
  </Suspense>
);

export default ConfirmPageWrapper;
