'use client'; 

import { useEffect, useState } from 'react';
import { loadConnectAndInitialize } from '@stripe/connect-js';
import { useUser } from '@/contexts/UserContext'; // Use your user context

export default function RefundDisputePage ()
{
  const [ stripeConnectInstance, setStripeConnectInstance ] = useState<any>( null );
  const { user } = useUser(); // Assuming user has an organization field

  const fetchSession = async () =>
  {
    try
    {
      const res = await fetch( '/api/stripe/refundDisputeSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( { orgId: user?.organizationId } ),
      } );

      if ( !res.ok )
      {
        throw new Error( `Error fetching session: ${ res.statusText }` );
      }

      const { client_secret: clientSecret } = await res.json();
      return clientSecret;
    } catch ( error )
    {
      console.error( 'Error fetching session:', error );
      return null;
    }
  };

  useEffect( () =>
  {
    const initializeStripe = async () =>
    {
      if ( user?.organizationId )
      {
        const clientSecret = await fetchSession();
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
      // Create and mount the refund and dispute management components
      const refundComponent = stripeConnectInstance.create( 'refunds' );
      const disputeComponent = stripeConnectInstance.create( 'disputes' );

      const refundContainer = document.getElementById( 'refunds-container' );
      const disputeContainer = document.getElementById( 'disputes-container' );

      if ( refundContainer )
      {
        refundContainer.appendChild( refundComponent );
      }

      if ( disputeContainer )
      {
        disputeContainer.appendChild( disputeComponent );
      }
    }
  }, [ stripeConnectInstance ] );

  return (
    <div>
      <h1>Refunds & Disputes</h1>
      <div id="refunds-container"></div>
      <div id="disputes-container"></div>
      <div id="error" hidden>
        Something went wrong!
      </div>
    </div>
  );
}
