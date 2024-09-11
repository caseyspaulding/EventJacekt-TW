'use client';

import { useEffect, useState } from 'react';
import { loadConnectAndInitialize } from '@stripe/connect-js';
import { createPaymentSession } from '@/app/actions/createPaymentSession'; // Server action

export default function PaymentsPage ( { params }: { params: { org: string } } )
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
        const secret = await createPaymentSession( params.org ); // Fetch session from server action
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
      console.log( 'Client Secret:', clientSecret ); // Log to verify it's passed correctly

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

  if ( loading )
  {
    return <div>Loading payments management...</div>;
  }

  if ( !stripeConnectInstance )
  {
    return <div>Failed to load payments management. Please try again later.</div>;
  }

  return (
    <div>
      <h1 className='text-3xl font-semibold mb-4'>Payments</h1>
      <div id="payments-container"></div>
      <div id="error" hidden>
        Something went wrong!
      </div>
    </div>
  );
}
