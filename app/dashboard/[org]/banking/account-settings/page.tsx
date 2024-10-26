'use client';

import { useEffect, useState } from 'react';
import { ConnectAccountManagement, ConnectComponentsProvider } from '@stripe/react-connect-js';
import { loadConnectAndInitialize } from '@stripe/connect-js';
import { createAccountSession } from '@/app/actions/createAccountSession';

type AccountManagementPageProps = {
  params: Promise<{ org: string }>; // Adjust to meet the constraint of PageProps
};

export default function AccountManagementPage ( { params }: AccountManagementPageProps )
{
  const [ stripeConnectInstance, setStripeConnectInstance ] = useState<any>( null );
  const [ loading, setLoading ] = useState( true );
  const [ clientSecret, setClientSecret ] = useState<string | null>( null );

  useEffect( () =>
  {
    const fetchClientSecret = async () =>
    {
      try
      {
        const resolvedParams = await params;
        const secret = await createAccountSession( resolvedParams.org );
        setClientSecret( secret );
      } catch ( error )
      {
        console.error( 'Error fetching client secret:', error );
      } finally
      {
        setLoading( false );
      }
    };

    fetchClientSecret();
  }, [ params ] );

  useEffect( () =>
  {
    if ( clientSecret )
    {
      const initializeStripe = async () =>
      {
        try
        {
          const instance = await loadConnectAndInitialize( {
            publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
            fetchClientSecret: () => Promise.resolve( clientSecret ),
          } );
          setStripeConnectInstance( instance );
        } catch ( error )
        {
          console.error( 'Error initializing Stripe Connect:', error );
        }
      };

      initializeStripe();
    }
  }, [ clientSecret ] );

  if ( loading )
  {
    return <div>Loading account management...</div>;
  }

  if ( !stripeConnectInstance )
  {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center p-6 bg-yellow-100 border border-yellow-300 rounded-lg shadow-md">
          <p className="text-lg text-yellow-800 font-semibold">Stripe Account not connected.</p>
          <p className="text-yellow-700 mt-2">
            Please connect your Stripe Account to view your Stripe Account Settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ConnectComponentsProvider connectInstance={ stripeConnectInstance }>
      <div className="bg-white">
        <h1 className="text-3xl font-semibold mb-4">Manage Your Stripe Account</h1>
        <ConnectAccountManagement />
      </div>
    </ConnectComponentsProvider>
  );
}
