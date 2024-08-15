'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext'; // Assuming you have a UserContext to get user info
import { createStripeAccountLink } from '@/app/actions/stripeActions';  
import { Unkempt } from 'next/font/google';
export default function Banking ()
{
  const router = useRouter();
  const { orgSlug } = useParams(); // Assuming you have orgSlug as a dynamic route parameter
  const { user } = useUser();
  const [ accountCreatePending, setAccountCreatePending ] = useState( false );
  const [ accountLinkCreatePending, setAccountLinkCreatePending ] = useState( false );
  const [ error, setError ] = useState( false );
  const [ connectedAccountId, setConnectedAccountId ] = useState<string | undefined>( undefined );

  useEffect( () =>
  {
    // Fetch necessary data based on orgSlug or other conditions
    if ( !orgSlug )
    {
      setError( error );
    }
  }, [ orgSlug ] );

  const handleCreateAccount = async () =>
  {
    setAccountCreatePending( true );
    setError( false );
    try
    {
      const response = await fetch( '/api/stripe/createAccount', { method: 'POST' } );
      const json = await response.json();
      if ( json.account )
      {
        setConnectedAccountId( json.account );
      } else
      {
        setError( true );
      }
    } catch ( err )
    {
      setError( true );
    } finally
    {
      setAccountCreatePending( false );
    }
  };

  const handleCreateAccountLink = async () =>
  {
    setAccountLinkCreatePending( true );
    setError( false );
    try
    {
      const response = await fetch( '/api/stripe/createAccountLink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( {
          account: connectedAccountId,
          org: orgSlug,
          userId: user?.id
        } ),
      } );


      const data = await response.json();

      if ( data.error )
      {
        console.error( 'Error:', data.error );
      } else
      {
        window.location.href = data.url;
      }
    } catch ( err )
    {
      setError( true );
    } finally
    {
      setAccountLinkCreatePending( false );
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
            <p className="text-gray-600">
              EventJacket helps you receive payments securely.
            </p>
          </>
        ) }
        { connectedAccountId && (
          <>
            <h2 className="text-xl font-semibold text-gray-700">Add information to start accepting money</h2>
            <p className="text-gray-600">
              EventJacket partners with Stripe for secure payments.
            </p>
          </>
        ) }
        { !accountCreatePending && !connectedAccountId && (
          <button
            onClick={ handleCreateAccount }
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Create an account!
          </button>
        ) }
        { connectedAccountId && !accountLinkCreatePending && (
          <button
            onClick={ handleCreateAccountLink }
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Add information
          </button>
        ) }
        { ( connectedAccountId || accountCreatePending || accountLinkCreatePending ) && (
          <div className="dev-callout mt-6 bg-gray-100 p-4 rounded-lg">
            { connectedAccountId && (
              <p>Your connected account ID is: <code className="font-bold">{ connectedAccountId }</code></p>
            ) }
            { accountCreatePending && <p>Creating a connected account...</p> }
            { accountLinkCreatePending && <p>Creating a new Account Link...</p> }
          </div>
        ) }
        <div className="info-callout mt-8 bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-700">
            This is a sample app for Stripe-hosted Connect onboarding.{ ' ' }
            <a href="https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=hosted"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline">
              View docs
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
