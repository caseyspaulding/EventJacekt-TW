'use client'; 

import { useEffect, useState } from 'react';
import { loadConnectAndInitialize } from '@stripe/connect-js';
import { useUser } from '@/contexts/UserContext'; // Fetch your user context

export default function PayoutsPage ()
{
  const [ stripeConnectInstance, setStripeConnectInstance ] = useState<any>( null );
  const { user } = useUser(); // Assuming user has an organization field

  const fetchPayoutSession = async () =>
  {
    try
    {
      const res = await fetch( '/api/stripe/payoutsession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( { orgId: user?.organizationId } ),
      } );

      if ( !res.ok )
      {
        throw new Error( `Error fetching payout session: ${ res.statusText }` );
      }

      const { client_secret: clientSecret } = await res.json();
      return clientSecret;
    } catch ( error )
    {
      console.error( 'Error fetching payout session:', error );
      return null;
    }
  };

  useEffect( () =>
  {
    const initializeStripe = async () =>
    {
      if ( user?.organizationId )
      {
        const clientSecret = await fetchPayoutSession();
        if ( clientSecret )
        {
          const instance = loadConnectAndInitialize( {
            publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
            fetchClientSecret: () => Promise.resolve( clientSecret ),
          } );
          setStripeConnectInstance( instance );
        }
      }
    };

    initializeStripe();
  }, [ user?.organizationId ] );

  useEffect( () =>
  {
    if ( stripeConnectInstance )
    {
      // Create and mount the payouts component
      const payoutsComponent = stripeConnectInstance.create( 'payouts' );
      const container = document.getElementById( 'payouts-container' );
      if ( container )
      {
        container.appendChild( payoutsComponent );
      }
    }
  }, [ stripeConnectInstance ] );

  return (
    <div>
      <h1>Payouts</h1>
      <div id="payouts-container"></div>
      <div id="error" hidden>Something went wrong!</div>
    </div>
  );
}
