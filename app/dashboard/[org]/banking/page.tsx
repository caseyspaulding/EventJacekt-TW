'use client';

import React, { useState } from "react";
import { useStripeConnect } from "@/hooks/useStripeConnect";
import { ConnectAccountOnboarding, ConnectComponentsProvider } from "@stripe/react-connect-js";

export default function BankingPage ( { params }: { params: { org: string } } )
{
  const [ accountCreatePending, setAccountCreatePending ] = useState( false );
  const [ onboardingExited, setOnboardingExited ] = useState( false );
  const [ error, setError ] = useState( false );
  const [ connectedAccountId, setConnectedAccountId ] = useState<string | undefined>();
  const stripeConnectInstance = useStripeConnect( connectedAccountId );


  const handleCreateAccount = async () =>
  {
    setAccountCreatePending( true );
    setError( false );

    try
    {
      const response = await fetch( "/api/stripe/account", { method: "POST" } );
      const json = await response.json();

      if ( json.account )
      {

        const accountDetails = {
          stripeConnectAccountId: json.account,
          stripeConnectLinked: true,
          stripeAccountCreated: new Date(),
        };
        console.log( accountDetails );

        // Save the details to the state


        setConnectedAccountId( json.account );

        try
        {
          // Create the account session
          const sessionResponse = await fetch( "/api/stripe/createAccountSession", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify( { account: json.account } )
          } );

          const sessionJson = await sessionResponse.json();
          console.log( "Stripe Account Session Created:", sessionJson );

        } catch ( sessionError )
        {
          console.error( 'Error creating Stripe account session:', sessionError );
          setError( true );
        }

      } else
      {
        setError( true );
      }
    } catch ( err )
    {
      console.error( 'Error creating Stripe account:', err );
      setError( true );
    } finally
    {
      setAccountCreatePending( false );
    }
  };

  return (
    <div className="container mx-auto mt-32 max-w-3xl p-6">
      <div className="banner text-center">
        <h2 className="text-3xl font-bold text-gray-800">EventJacket Banking Setup</h2>
      </div>

      <div className="content mt-8 space-y-6">
        { !connectedAccountId && (
          <>
            <h2 className="text-xl font-semibold text-gray-700">Get ready for take off</h2>
            <p className="text-gray-600">EventJacket helps you receive payments securely.</p>
            <button
              onClick={ handleCreateAccount }
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Create an account!
            </button>
          </>
        ) }

        { connectedAccountId && !stripeConnectInstance && (
          <>
            <h2 className="text-xl font-semibold text-gray-700">Add information to start accepting money</h2>
          </>
        ) }

        { stripeConnectInstance && (
          <ConnectComponentsProvider connectInstance={ stripeConnectInstance }>
            <ConnectAccountOnboarding onExit={ () => setOnboardingExited( true ) } />
          </ConnectComponentsProvider>
        ) }

        { error && <p className="text-red-500">Something went wrong!</p> }

        { ( connectedAccountId || accountCreatePending || onboardingExited ) && (
          <div className="dev-callout mt-6 bg-gray-100 p-4 rounded-lg">
            { connectedAccountId && (
              <p>Your connected account ID is: <code className="font-bold">{ connectedAccountId }</code></p>
            ) }
            { accountCreatePending && <p>Creating a connected account...</p> }
            { onboardingExited && <p>The Account Onboarding component has exited</p> }
          </div>
        ) }

        <div className="info-callout mt-8 bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-700">
            This is a sample app for Stripe-hosted Connect onboarding.{ " " }
            <a
              href="https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=hosted"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View docs
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
