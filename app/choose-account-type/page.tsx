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

        if ( !tokenHash || type !== 'signup' )
        {
          throw new Error( 'Invalid or missing confirmation link.' );
        }

        const { data, error } = await supabase.auth.verifyOtp( {
          token_hash: tokenHash,
          type: 'signup',
        } );

        if ( error )
        {
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
        console.error( 'Error confirming email:', error );
        setErrorMessage( 'An error occurred during email confirmation.' );
      } finally
      {
        setLoading( false );
      }
    };

    confirmUser();
  }, [ router, supabase ] );

  return (
    <div
      className="flex h-screen flex-col items-center justify-center px-4 bg-cover bg-center"
      style={ { backgroundImage: 'url(/images/illustrations/background-3.jpg)' } }
    >
      <div className="flex h-screen flex-col items-center justify-center px-4">
        <div className="mt-2 flex w-full max-w-sm flex-col bg-white gap-4 rounded-3xl px-8 py-6 shadow-2xl text-center">
          <img src="/images/logo.svg" alt="Logo" className="w-12 h-12 mx-auto" />

          { loading ? (
            <p className="text-lg font-medium text-gray-800">Confirming your email...</p>
          ) : errorMessage ? (
            <p className="text-lg font-medium text-red-600">Error: { errorMessage }</p>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-blue-700">Email Confirmed</h1>
              <p className="text-lg text-gray-800">{ infoMessage }</p>
              <div className="mt-6">
                <button
                  onClick={ () => router.push( '/continue-registration' ) }
                  className="mt-4 w-full py-2 px-4 bg-orange-600 hover:bg-green-600 text-white rounded-full shadow-2xl"
                >
                  Continue
                </button>
              </div>
            </div>
          ) }
        </div>
      </div>
    </div>
  );
};

const ConfirmPage = () =>
{
  return (
    <Suspense fallback={ <div className="flex items-center justify-center min-h-screen">Loading...</div> }>
      <ConfirmPageContent />
    </Suspense>
  );
};

export default ConfirmPage;
