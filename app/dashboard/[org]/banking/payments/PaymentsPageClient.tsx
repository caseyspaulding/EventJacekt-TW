// app/payments/PaymentsPageClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { loadConnectAndInitialize } from '@stripe/connect-js';

interface PaymentsPageClientProps
{
  clientSecret: string;
}

export default function PaymentsPageClient ( { clientSecret }: PaymentsPageClientProps )
{
  const [ stripeConnectInstance, setStripeConnectInstance ] = useState<any>( null );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState<string | null>( null );

  useEffect( () =>
  {
    const initializeStripe = async () =>
    {
      if ( clientSecret )
      {
        try
        {
          console.log( 'Client Component: Initializing Stripe with client secret...' );
          const instance = loadConnectAndInitialize( {
            publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
            fetchClientSecret: () => Promise.resolve( clientSecret ),
          } );
          console.log( 'Client Component: Stripe instance initialized' );
          setStripeConnectInstance( instance );
        } catch ( err: any )
        {
          console.error( 'Client Component: Error initializing Stripe:', err.message );
          setError( 'Failed to initialize Stripe' );
        } finally
        {
          setLoading( false );
        }
      } else
      {
        console.warn( 'Client Component: Missing client secret.' );
        setError( 'Missing client secret' );
        setLoading( false );
      }
    };

    initializeStripe();
  }, [ clientSecret ] );

  useEffect( () =>
  {
    if ( stripeConnectInstance )
    {
      try
      {
        console.log( 'Client Component: Creating payments component...' );
        const paymentsComponent = stripeConnectInstance.create( 'payments' );
        const container = document.getElementById( 'payments-container' );
        if ( container )
        {
          container.appendChild( paymentsComponent );
          console.log( 'Client Component: Payments component added to the DOM.' );
        } else
        {
          console.error( 'Client Component: Payments container not found' );
          setError( 'Payments container not found' );
        }
      } catch ( err: any )
      {
        console.error( 'Client Component: Error creating payments component:', err.message );
        setError( 'Failed to initialize payments component' );
      }
    }
  }, [ stripeConnectInstance ] );

  if ( loading )
  {
    return <p>Loading Stripe integration...</p>;
  }

  if ( error )
  {
    return <p>Error: { error }</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-1">Payments</h1>
      <div id="payments-container"></div>
      <div id="error" hidden>Something went wrong!</div>
    </div>
  );
}
