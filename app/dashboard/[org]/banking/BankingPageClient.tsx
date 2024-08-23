'use client';

import React, { useState, useEffect } from 'react';
import { useStripeConnect } from '@/hooks/useStripeConnect';
import { ConnectAccountOnboarding, ConnectComponentsProvider } from '@stripe/react-connect-js';
import { updateOrganizationStripeData } from '@/app/actions/updateOrg';

interface BankingPageProps
{
    isStripeConnected: boolean;
    initialAccountId: string | null;
    params: { org: string };
}

interface StripeAccountDetails
{
    stripeConnectAccountId: string;
    stripeConnectLinked: boolean;
    stripeAccountCreated: Date;
}

export default function BankingPageClient ( {
    params,
    isStripeConnected,
    initialAccountId
}: BankingPageProps )
{
    const [ accountCreatePending, setAccountCreatePending ] = useState( false );
    const [ onboardingExited, setOnboardingExited ] = useState( false );
    const [ error, setError ] = useState( false );
    const [ connectedAccountId, setConnectedAccountId ] = useState<string | undefined>(
        initialAccountId || undefined
    );
    const stripeConnectInstance = useStripeConnect( connectedAccountId );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ stripeAccountDetails, setStripeAccountDetails ] = useState<StripeAccountDetails | null>(
        null
    );

    useEffect( () =>
    {
        if ( isStripeConnected )
        {
            setConnectedAccountId( initialAccountId || undefined );
        }
    }, [ isStripeConnected, initialAccountId ] );

    const handleCreateAccount = async () =>
    {
        setAccountCreatePending( true );
        setError( false );

        try
        {
            const response = await fetch( '/api/stripe/account', { method: 'POST' } );
            const json = await response.json();

            if ( json.account )
            {
                const decodedOrgName = decodeURIComponent( params.org );
                const accountDetails = {
                    stripeConnectAccountId: json.account,
                    stripeConnectLinked: true,
                    stripeAccountCreated: new Date()
                };

                await updateOrganizationStripeData( decodedOrgName, accountDetails );
                setStripeAccountDetails( accountDetails );
                setConnectedAccountId( json.account );
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
        <div className="container bg-white ">
            <div className="text-center bg-white">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">EventJacket Banking Setup</h2>
            </div>

            { ( connectedAccountId || accountCreatePending || onboardingExited ) && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    { connectedAccountId && (
                        <p className="text-gray-700">
                            Your connected account ID is: <code className="font-bold">{ connectedAccountId }</code>
                        </p>
                    ) }
                    { accountCreatePending && <p className="text-gray-700">Creating a connected account...</p> }
                    { onboardingExited && <p className="text-gray-700">The Account Onboarding component has exited</p> }
                </div>
            ) }

            <div className="mt-8 space-y-6 text-center">
                { !connectedAccountId && (
                    <>
                        <h2 className="text-2xl font-semibold text-gray-700">Get ready for take off</h2>
                        <p className="text-gray-600">EventJacket helps you receive payments securely.</p>
                        <button
                            onClick={ handleCreateAccount }
                            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Connect your account!
                        </button>
                    </>
                ) }

                { connectedAccountId && !stripeConnectInstance && (
                    <h2 className="text-xl font-semibold text-gray-700">Add information to start accepting money</h2>
                ) }

                { stripeConnectInstance && (
                    <ConnectComponentsProvider connectInstance={ stripeConnectInstance }>
                        <ConnectAccountOnboarding onExit={ () => setOnboardingExited( true ) } />
                    </ConnectComponentsProvider>
                ) }

                { error && <p className="text-red-500">Something went wrong!</p> }
            </div>
        </div>
    );
}
