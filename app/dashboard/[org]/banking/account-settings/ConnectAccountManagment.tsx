import { useEffect, useState } from 'react';
import { ConnectAccountManagement, ConnectComponentsProvider } from '@stripe/react-connect-js';
import { createAccountSession } from '@/app/actions/createAccountSession'; // Server action to create account session

export default function AccountManagementPage ( { params }: { params: { org: string } } )
{  // Accept `org` param
  const [ stripeConnectInstance, setStripeConnectInstance ] = useState<any>( null );
  const [ clientSecret, setClientSecret ] = useState<string | null>( null );
  const [ loading, setLoading ] = useState<boolean>( true );

  useEffect( () =>
  {
    const fetchClientSecret = async () =>
    {
      try
      {
        const secret = await createAccountSession( params.org );  // Pass `org` param to the server action
        setClientSecret( secret );
      } catch ( error )
      {
        console.error( 'Error fetching Stripe client secret:', error );
      } finally
      {
        setLoading( false );
      }
    };

    fetchClientSecret();
  }, [ params.org ] );  // Make sure the effect runs when `org` changes

  useEffect( () =>
  {
    if ( clientSecret && typeof window !== 'undefined' && window.Stripe )
    {
      // Initialize the Stripe Connect.js instance when clientSecret is available
      const stripeConnectInstance = window.Stripe( process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY! );
      setStripeConnectInstance( stripeConnectInstance );
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
      <div>
        <h1 className="text-3xl font-semibold mb-4">Manage Your Stripe Account</h1>
        <ConnectAccountManagement
        // Optional: Customizing the fields and future requirements
        // collectionOptions={{
        //   fields: 'eventually_due',
        //   futureRequirements: 'include',
        // }}
        />
      </div>
    </ConnectComponentsProvider>
  );
}
