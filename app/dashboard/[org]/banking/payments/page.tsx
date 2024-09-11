'use client';

import { useEffect, useState } from 'react';
import { loadConnectAndInitialize } from '@stripe/connect-js';
import { useUser } from '@/contexts/UserContext'; // Fetch your user context

export default function PaymentsPage() {
  const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null);
  const { user } = useUser(); // Assuming user has an organization field

  const fetchPaymentSession = async () => {
    try {
      const res = await fetch('/api/stripe/paymentsession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orgId: user?.organizationId }),
      });

      if (!res.ok) {
        throw new Error(`Error fetching payment session: ${res.statusText}`);
      }

      const { client_secret: clientSecret } = await res.json();
      return clientSecret;
    } catch (error) {
      console.error('Error fetching payment session:', error);
      return null;
    }
  };

  useEffect( () =>
  {
    const initializeStripe = async () =>
    {
      if ( user?.organizationId && !stripeConnectInstance )
      { // Only run if not initialized
        const clientSecret = await fetchPaymentSession();
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
  }, [ user?.organizationId, stripeConnectInstance ] );

  useEffect( () =>
  {
    if ( stripeConnectInstance )
    {
      const container = document.getElementById( 'payments-container' );

      // Clear the container before appending the new component to avoid duplicates
      if ( container )
      {
        container.innerHTML = ''; // Clear previous component

        // Create and mount the payments component
        const paymentsComponent = stripeConnectInstance.create( 'payments' );
        container.appendChild( paymentsComponent );
      }
    }
  }, [ stripeConnectInstance ] );

  return (
    <div>
      <h1>Payments</h1>
      <div id="payments-container"></div>
      <div id="error" hidden>
        Something went wrong!
      </div>
    </div>
  );
}
