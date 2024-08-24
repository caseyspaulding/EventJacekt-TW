// app/auth/error/page.tsx

'use client';

import React from 'react';
import { Button } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';

const AuthCodeError = () =>
{
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get( 'message' ) || 'An unknown error occurred during authentication.';

  const handleRetry = () =>
  {
    router.push( '/auth/sign-in' ); // Redirect back to sign-in page
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md max-w-sm text-center">
        <h1 className="text-2xl font-semibold mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-6">{ decodeURIComponent( message ) }</p>
        <Button color="primary" onPress={ handleRetry }>
          Retry
        </Button>
      </div>
    </div>
  );
};

export default AuthCodeError;
