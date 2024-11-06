'use client';

import { useEffect, useState, use } from 'react';
import { ConnectComponentsProvider, ConnectPayouts } from '@stripe/react-connect-js';
import { loadConnectAndInitialize } from '@stripe/connect-js';
import { createPayoutSession } from '@/app/actions/createPayoutSession'; // The server action

type PayoutsPageProps = {
  params: Promise<{ org: string }>;
};

export default function PayoutsPage(props: PayoutsPageProps) {
  const params = use(props.params);
  const [ stripeConnectInstance, setStripeConnectInstance ] = useState<any>( null );
  const [ loading, setLoading ] = useState( true );
  const [ clientSecret, setClientSecret ] = useState<string | null>( null );

  useEffect( () =>
  {
    const fetchClientSecret = async () =>
    {
      try
      {
        const { org } = await params;
        const secret = await createPayoutSession( org );
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
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center p-6 bg-yellow-100 border border-yellow-300 rounded-lg shadow-md">
          <p className="text-lg text-yellow-800 font-semibold">Stripe Account not connected.</p>
          <p className="text-yellow-700 mt-2">
            Please connect your Stripe Account to view your payouts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ConnectComponentsProvider connectInstance={ stripeConnectInstance }>
      <div className='bg-white '>
        <h1 className="text-3xl font-semibold mb-4 ">Manage Your Payouts</h1>
        <ConnectPayouts />
        <h2 className="text-2xl mt-6 font-semibold mb-4">What are Payouts?</h2>
        <p className="text-gray-700 mb-4">
          Payouts refer to the money that is transferred to your bank account. This includes your ticket sales, donations, and other earnings made through your events. Stripe Connect manages these payouts, ensuring that the funds from your events are securely deposited to your designated bank account.
        </p>
        <h3 className="text-lg font-semibold mb-2">How do Payouts Work?</h3>
        <ul className="list-disc list-inside mb-4">
          <li>When you make sales through EventJacket, the revenue is collected and held by Stripe.</li>
          <li>Once your balance reaches a certain threshold or a scheduled payout day arrives, Stripe initiates a payout to your linked bank account.</li>
          <li>You can view the status of your payouts here, including upcoming payouts, completed payouts, and any amounts still in transit to your bank.</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">Payout Status:</h3>
        <p className="text-gray-700 mb-4">
          You’ll notice different statuses for your payouts:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Paid:</strong> The payout has successfully been transferred to your bank account.</li>
          <li><strong>In Transit:</strong> The payout is currently being processed and will arrive in your bank account soon.</li>
          <li><strong>Future Payouts:</strong> These are scheduled payouts that will be sent on the next available date.</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">How to View and Export Payouts:</h3>
        <ul className="list-disc list-inside mb-4">
          <li>To view more details about a specific payout, click on the <strong>See Details</strong> button above.</li>
          <li>You can export your payout history by clicking the <strong>Export</strong> button on the right-hand side.</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
        <p className="text-gray-700">
          If you have any questions about your payouts or encounter any issues, feel free to reach out to our support team for assistance.
        </p>
      </div>
    </ConnectComponentsProvider>
  );
}
