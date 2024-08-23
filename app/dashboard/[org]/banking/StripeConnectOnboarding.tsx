// app/dashboard/[org]/banking/StripeConnectOnboarding.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useStripeConnect } from '@/hooks/useStripeConnect';
import { ConnectAccountOnboarding, ConnectComponentsProvider } from '@stripe/react-connect-js';

export default function StripeConnectOnboarding({ orgId }: { orgId: string }) {
    const [accountCreatePending, setAccountCreatePending] = useState(false);
    const [onboardingExited, setOnboardingExited] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [connectedAccountId, setConnectedAccountId] = useState<string | null>(null);
    const stripeConnectInstance = useStripeConnect(connectedAccountId || undefined);

    useEffect(() => {
        // Check if the org already has a connected account
        const fetchConnectedAccount = async () => {
            try {
                const response = await fetch(`/api/stripe/get-connected-account?orgId=${orgId}`);
                const data = await response.json();
                if (data.accountId) {
                    setConnectedAccountId(data.accountId);
                }
            } catch (err) {
                console.error('Error fetching connected account:', err);
            }
        };
        fetchConnectedAccount();
    }, [orgId]);

    const handleCreateAccount = async () => {
        setAccountCreatePending(true);
        setError(null);
        try {
            const response = await fetch('/api/stripe/create-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orgId })
            });
            const { accountId, error } = await response.json();
            if (accountId) {
                setConnectedAccountId(accountId);
            }
            if (error) {
                setError(error);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        }
        setAccountCreatePending(false);
    };

    return (
        <div className="">
            {!connectedAccountId && (
                <h2 className="text-2xl font-bold">Connect your Stripe account</h2>
            )}
            {connectedAccountId && !stripeConnectInstance && (
                <p>Setting up your Stripe account...</p>
            )}

            {!accountCreatePending && !connectedAccountId && (
                <button
                    onClick={handleCreateAccount}
                    className="rounded bg-orange-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                    Connect Stripe Account
                </button>
            )}

            {stripeConnectInstance && (
                <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                    <ConnectAccountOnboarding onExit={() => setOnboardingExited(true)} />
                </ConnectComponentsProvider>
            )}

            {error && <p className="text-red-500">Error: {error}</p>}

            {(connectedAccountId || accountCreatePending || onboardingExited) && (
                <div>
                    {connectedAccountId && (
                        <p>Your Stripe account is connected and ready to use.</p>
                    )}
                    {accountCreatePending && <p>Creating your Stripe account...</p>}
                    {onboardingExited && (
                        <p>
                            Stripe Connect onboarding completed. You can now start selling tickets!
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
