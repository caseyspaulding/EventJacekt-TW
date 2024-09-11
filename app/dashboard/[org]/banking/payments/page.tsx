'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { loadConnectAndInitialize } from '@stripe/connect-js';

export default function PaymentsPage ()
{
  const [ stripeConnectInstance, setStripeConnectInstance ] = useState<any>( null );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState<string | null>( null );
  const { user } = useUser(); // Assuming user has an organization field

  // Separate function for fetching the client secret
  const fetchClientSecret = async (): Promise<string | null> =>
  {
    try
    {
      console.log( 'Fetching client secret for org:', user?.organizationId );

      const res = await fetch( '/api/stripe/accountsession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { orgId: user?.organizationId } ),
      } );

      if ( !res.ok )
      {
        const errorMessage = `Error fetching client secret: ${ res.statusText }`;
        console.error( errorMessage );
        throw new Error( errorMessage );
      }

      const data = await res.json();
      console.log( 'Received client secret data:', data );
      return data.client_secret;
    } catch ( error: any )
    {
      console.error( 'Error during client secret fetch:', error );
      setError( 'Failed to fetch the client secret' );
      return null;
    }
  };

  useEffect( () =>
  {
    const initializeStripe = async () =>
    {
      if ( user?.organizationId )
      {
        setLoading( true );
        try
        {
          const clientSecret = await fetchClientSecret();

          if ( clientSecret )
          {
            console.log( 'Initializing Stripe with client secret...' );
            const instance = loadConnectAndInitialize( {
              publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
              fetchClientSecret: () => Promise.resolve( clientSecret ),
            } );

            console.log( 'Stripe instance initialized' );
            setStripeConnectInstance( instance );
          }
        } catch ( err )
        {
          console.error( 'Error initializing Stripe:', err );
        } finally
        {
          setLoading( false );
        }
      } else
      {
        console.warn( 'No organizationId available for the current user.' );
      }
    };

    initializeStripe();
  }, [ user?.organizationId ] );

  useEffect( () =>
  {
    if ( stripeConnectInstance )
    {
      try
      {
        const paymentsComponent = stripeConnectInstance.create( 'payments' );
        const container = document.getElementById( 'payments-container' );

        if ( container )
        {
          container.appendChild( paymentsComponent );
          console.log( 'Payments component added to the DOM.' );
        } else
        {
          console.error( 'Payments container not found' );
        }
      } catch ( err )
      {
        console.error( 'Error creating payments component:', err );
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
