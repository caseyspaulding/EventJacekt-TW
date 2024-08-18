'use client';

import React, { useState, useEffect } from 'react';
import { useStripeConnect } from '@/hooks/useStripeConnect';
import { ConnectAccountOnboarding, ConnectComponentsProvider } from '@stripe/react-connect-js';
import { updateOrganizationStripeData } from '@/app/actions/updateOrg';

interface BankingPageProps {
    isStripeConnected: boolean;
    initialAccountId: string | null;
    params: { org: string };
}

interface StripeAccountDetails {
    stripeConnectAccountId: string;
    stripeConnectLinked: boolean;
    stripeAccountCreated: Date;
}

export default function BankingPageClient({
    params,
    isStripeConnected,
    initialAccountId
}: BankingPageProps) {
    const [accountCreatePending, setAccountCreatePending] = useState(false);
    const [onboardingExited, setOnboardingExited] = useState(false);
    const [error, setError] = useState(false);
    const [connectedAccountId, setConnectedAccountId] = useState<string | undefined>(
        initialAccountId || undefined
    );
    const stripeConnectInstance = useStripeConnect(connectedAccountId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [stripeAccountDetails, setStripeAccountDetails] = useState<StripeAccountDetails | null>(
        null
    );

    // If the organization is already connected, skip account creation
    useEffect(() => {
        if (isStripeConnected) {
            setConnectedAccountId(initialAccountId || undefined);
        }
    }, [isStripeConnected, initialAccountId]);

    const handleCreateAccount = async () => {
        setAccountCreatePending(true);
        setError(false);

        try {
            const response = await fetch('/api/stripe/account', { method: 'POST' });
            const json = await response.json();

            if (json.account) {
                const decodedOrgName = decodeURIComponent(params.org);
                const accountDetails = {
                    stripeConnectAccountId: json.account,
                    stripeConnectLinked: true,
                    stripeAccountCreated: new Date()
                };

                // Save to the database
                await updateOrganizationStripeData(decodedOrgName, accountDetails);

                // Save the details to the state
                setStripeAccountDetails(accountDetails);

                setConnectedAccountId(json.account);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error('Error creating Stripe account:', err);
            setError(true);
        } finally {
            setAccountCreatePending(false);
        }
    };

    return (
        <div className="container mx-auto mt-32 max-w-3xl p-6">
            <div className="banner text-center">
                <h2 className="text-3xl font-bold text-gray-800">EventJacket Banking Setup</h2>
            </div>
            {(connectedAccountId || accountCreatePending || onboardingExited) && (
                <div className="dev-callout mt-6 rounded-lg bg-gray-100 p-4">
                    {connectedAccountId && (
                        <p>
                            Your connected account ID is:{' '}
                            <code className="font-bold">{connectedAccountId}</code>
                        </p>
                    )}
                    {accountCreatePending && <p>Creating a connected account...</p>}
                    {onboardingExited && <p>The Account Onboarding component has exited</p>}
                </div>
            )}

            {/*{ isStripeConnected && (
        <div className="review-callout mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Review Connected Account Details</h3>
          <p className="text-blue-600">Your Stripe account is successfully connected. You can now start accepting payments through EventJacket!</p>
        </div>
      ) }*/}
            <div className="content mt-8 space-y-6 text-center">
                {!connectedAccountId && (
                    <>
                        <h2 className="text-center text-2xl font-semibold text-gray-700">
                            Get ready for take off
                        </h2>
                        <p className="text-center text-gray-600">
                            EventJacket helps you receive payments securely.
                        </p>
                        <button
                            onClick={handleCreateAccount}
                            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Connect your account!
                        </button>
                    </>
                )}

                {connectedAccountId && !stripeConnectInstance && (
                    <>
                        <h2 className="text-xl font-semibold text-gray-700">
                            Add information to start accepting money
                        </h2>
                    </>
                )}

                {stripeConnectInstance && (
                    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                        <ConnectAccountOnboarding onExit={() => setOnboardingExited(true)} />
                    </ConnectComponentsProvider>
                )}

                {error && <p className="text-red-500">Something went wrong!</p>}
            </div>
        </div>
    );
}
