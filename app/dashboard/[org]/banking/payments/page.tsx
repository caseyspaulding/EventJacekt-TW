'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { loadConnectAndInitialize } from '@stripe/connect-js';
import DisputesComponent from '@/components/Disputes';

export default function PaymentsPage ()
{
  const [ stripeConnectInstance, setStripeConnectInstance ] = useState<any>( null );
  const { user } = useUser(); // Assuming user has an organization field

  const fetchClientSecret = async () =>
  {
    try 
    {
      const res = await fetch( '/api/stripe/accountsession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { orgId: user?.organizationId } ),
      } );

      if ( !res.ok )
      {
        throw new Error( `Error fetching client secret: ${ res.statusText }` );
      }

      const { client_secret: clientSecret } = await res.json();
      return clientSecret;
    } catch ( error )
    {
      console.error( 'Error fetching client secret:', error );
      return null;
    }
  };

  useEffect( () =>
  {
    const initializeStripe = async () =>
    {
      if ( user?.organizationId )
      {
        const clientSecret = await fetchClientSecret();
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
      const paymentsComponent = stripeConnectInstance.create( 'payments' );
      const container = document.getElementById( 'payments-container' );
      if ( container )
      {
        container.appendChild( paymentsComponent );
      }
    }
  }, [ stripeConnectInstance ] );

  return (<>
    <div>
      <h1 className="text-3xl font-semibold mb-1">Payments</h1>
      <div id="payments-container"></div>
      <div id="error" hidden>Something went wrong!</div>
    </div>
    <DisputesComponent />
  </>
  );
}
