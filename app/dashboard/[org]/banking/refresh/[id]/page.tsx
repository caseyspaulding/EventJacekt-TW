'use client';

import React, { useEffect, useState } from 'react';

export default function RefreshStripe({ params }: { params: { id: string } }) {
    const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const connectedAccountId = params.id;
        if (connectedAccountId) {
            setAccountLinkCreatePending(true);
            fetch('/api/stripe/create-account-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ account: connectedAccountId })
            })
                .then((response) => response.json())
                .then((json) => {
                    setAccountLinkCreatePending(false);

                    const { url, error } = json;

                    if (url) {
                        window.location.href = url;
                    }

                    if (error) {
                        setError(true);
                    }
                });
        }
    }, [params.id]);

    return (
        <div className="container">
            <div className="banner">
                <h2>EventJacket</h2>
            </div>
            <div className="content">
                <h2>Add information to start accepting money</h2>
                <p>EventJacket partners with Stripe to help you receive payments securely.</p>
                {error && <p className="error">Something went wrong!</p>}
            </div>
            <div className="dev-callout">
                {params.id && (
                    <p>
                        Your connected account ID is: <code className="bold">{params.id}</code>
                    </p>
                )}
                {accountLinkCreatePending && <p>Creating a new Account Link...</p>}
            </div>
        </div>
    );
}
