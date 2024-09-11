'use client';

import { useEffect, useState } from 'react';
import { ConnectAccountManagement, ConnectComponentsProvider } from '@stripe/react-connect-js';
import { loadConnectAndInitialize } from '@stripe/connect-js';  // Ensure you import this
import { createAccountSession } from '@/app/actions/createAccountSession'; // Your server action to create account session

export default function AccountManagementPage ( { params }: { params: { org: string } } )
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
        const secret = await createAccountSession( params.org );
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
  }, [ params.org ] );

  useEffect( () =>
  {
    if ( clientSecret )
    {
      console.log( 'Client Secret:', clientSecret );  // Log the client_secret to verify it's passed correctly

      const initializeStripe = async () =>
      {
        const instance = await loadConnectAndInitialize( {
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          fetchClientSecret: () => Promise.resolve( clientSecret ),
        } );
        setStripeConnectInstance( instance );
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
    return <div>Failed to load account management.</div>;
  }

  return (
    <ConnectComponentsProvider connectInstance={ stripeConnectInstance }>
      <div className='bg-white p-6 rounded-2xl shadow-md'>
        <h1 className="text-3xl font-semibold mb-4">Manage Your Stripe Account</h1>
        <ConnectAccountManagement />
      </div>
    </ConnectComponentsProvider>
  );
}
