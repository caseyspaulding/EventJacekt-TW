'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

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

    // When the component mounts, we handle the confirmation via the URL
    const handleConfirmation = async () =>
    {
      const { error } = await supabase.auth.updateUser( {
          // This is handled by the redirect URL after confirmation
      } );

      if ( error )
      {
        setErrorMessage( 'Error confirming email: ' + error.message );
        setLoading( false );
        return;
      }

      // If confirmation is successful, redirect to the account type selection page
      router.push( '/choose-account-type' );
    };

    // Call handleConfirmation when the component mounts
    handleConfirmation();
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

export default ConfirmPage;
