'use client';

import React, { useEffect, useState } from 'react';

type RefreshStripeProps = {
    params: Promise<{ id: string }>;
};

export default async function RefreshStripe(props: RefreshStripeProps) {
    const params = await props.params;
    const [ accountLinkCreatePending, setAccountLinkCreatePending ] = useState( false );
    const [ error, setError ] = useState( false );

    useEffect( () =>
    {
        const fetchAccountLink = async () =>
        {
            try
            {
                const { id: connectedAccountId } = await params;
                if ( connectedAccountId )
                {
                    setAccountLinkCreatePending( true );
                    const response = await fetch( '/api/stripe/create-account-link', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify( { account: connectedAccountId } )
                    } );
                    const json = await response.json();
                    setAccountLinkCreatePending( false );

                    const { url, error } = json;
                    if ( url )
                    {
                        window.location.href = url;
                    }
                    if ( error )
                    {
                        setError( true );
                    }
                }
            } catch ( err )
            {
                console.error( "Error creating account link:", err );
                setError( true );
            }
        };

        fetchAccountLink();
    }, [ params ] );

    return (
        <div className="container">
            <div className="banner">
                <h2>EventJacket</h2>
            </div>
            <div className="content">
                <h2>Add information to start accepting money</h2>
                <p>EventJacket partners with Stripe to help you receive payments securely.</p>
                { error && <p className="error">Something went wrong!</p> }
            </div>
            <div className="dev-callout">
                { accountLinkCreatePending ? (
                    <p>Creating a new Account Link...</p>
                ) : (
                    <p>Your connected account ID is: <code className="bold">{ ( await params ).id }</code></p>
                ) }
            </div>
        </div>
    );
}
