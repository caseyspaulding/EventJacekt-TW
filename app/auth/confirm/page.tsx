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

    if ( !tokenHash || type !== 'signup' )
    {
      setErrorMessage( 'Invalid or missing confirmation link.' );
      setLoading( false );
      return;
    }
    const confirmUser = async () =>
    {
      try
      {
        // Assuming PKCE flow, directly use the tokenHash string
        const {  error } = await supabase.auth.exchangeCodeForSession( tokenHash );

        if ( error )
        {
          
          console.error( 'Error confirming email:', error );
          throw error;
        }

        // If confirmation is successful, redirect to the account type selection page
        router.push( '/choose-account-type' );
      } catch ( error )
      {
        console.error( 'Error confirming email:', error );
        setErrorMessage( 'Error confirming email: ' + error  );
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
