'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';

const ConfirmPageContent = () =>
{
  const [ loading, setLoading ] = useState( true );
  const [ errorMessage, setErrorMessage ] = useState( '' );
  const [ infoMessage, setInfoMessage ] = useState( '' );
  const router = useRouter();
  const supabase = createClient();

  useEffect( () =>
  {
    const confirmUser = async () =>
    {
      try
      {
        const searchParams = new URLSearchParams( window.location.search );
        const tokenHash = searchParams.get( 'token_hash' );
        const type = searchParams.get( 'type' );

        // Debugging output
        console.log( 'Token Hash:', tokenHash );
        console.log( 'Type:', type );

        if ( !tokenHash || type !== 'signup' )
        {
          console.error( 'Invalid or missing confirmation link parameters:', { tokenHash, type } );
          throw new Error( 'Invalid or missing confirmation link.' );
        }

        // Call Supabase to verify OTP
        const { data, error } = await supabase.auth.verifyOtp( {
          token: tokenHash, // corrected parameter name to 'token'
          type: 'signup',
        } );

        if ( error )
        {
          console.error( 'Supabase verification error:', error.message );
          if ( error.message.includes( 'Token has already been used' ) )
          {
            setInfoMessage( 'Your email is already confirmed. Click here to continue creating your account.' );
          } else
          {
            throw error;
          }
        } else if ( data?.session )
        {
          router.push( '/choose-account-type' );
        } else
        {
          throw new Error( 'Failed to create session after email confirmation.' );
        }
      } catch ( error )
      {
        console.error( 'Error confirming email:', error.message );
        setErrorMessage( 'An error occurred during email confirmation.' );
      } finally
      {
        setLoading( false );
      }
    };

    confirmUser();
  }, [ router, supabase ] );

  if ( loading )
  {
    return <div>Confirming your email...</div>;
  }

  if ( infoMessage )
  {
    return (
      <div>
        { infoMessage } <button onClick={ () => router.push( '/continue-registration' ) }>Continue</button>
      </div>
    );
  }

  if ( errorMessage )
  {
    return <div>Error: { errorMessage }</div>;
  }

  return null;
};

const ConfirmPage = () =>
{
  return (
    <Suspense fallback={ <div>Loading...</div> }>
      <ConfirmPageContent />
    </Suspense>
  );
};

export default ConfirmPage;
