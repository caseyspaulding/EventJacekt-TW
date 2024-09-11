'use client';

import { useEffect, useState } from 'react';
import { ConnectComponentsProvider, ConnectPayouts } from '@stripe/react-connect-js';
import { loadConnectAndInitialize } from '@stripe/connect-js';
import { createPayoutSession } from '@/app/actions/createPayoutSession'; // The server action

export default function PayoutsPage ( { params }: { params: { org: string } } )
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
        const secret = await createPayoutSession( params.org );
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
      console.log( 'Client Secret:', clientSecret ); // Log to ensure we have the client secret
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
    return <div>Loading payout management...</div>;
  }

  if ( !stripeConnectInstance )
  {
    return <div>Failed to load payout management. Please try again later.</div>;
  }

  return (
    <ConnectComponentsProvider connectInstance={ stripeConnectInstance }>
      <div className='bg-white p-6 rounded-2xl shadow-md'>
        <h1 className="text-3xl font-semibold mb-4 ">Manage Your Payouts</h1>
        <ConnectPayouts />
      </div>
    </ConnectComponentsProvider>
  );
}
