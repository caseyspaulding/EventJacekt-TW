'use client';

import type { Ref } from 'react';
import { useState, forwardRef } from 'react';
import getStripe from '@/utils/stripeClient';
import { Button } from '@nextui-org/react';
import InputFieldEJ from '@/components/Input/InputEJ';

interface TicketPurchaseClientProps
{
    ticket: unknown; // Define your Ticket type here if you have it
    eventSlug: string;
    onPurchaseComplete?: ( buyer: { email: string; firstName: string } ) => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const TicketPurchaseClient = ( { ticket, eventSlug, onPurchaseComplete }: TicketPurchaseClientProps, ref: Ref<HTMLInputElement> ) =>
{
    const [ loading, setLoading ] = useState( false );
    const [ errorMessage, setErrorMessage ] = useState<string | null>( null );
    const [ firstName, setFirstName ] = useState( '' );
    const [ lastName, setLastName ] = useState( '' );
    const [ email, setEmail ] = useState( '' );

    const handleBuyTicket = async () =>
    {
        setLoading( true );
        setErrorMessage( null ); // Reset error message

        if ( !firstName || !lastName || !email )
        {
            setErrorMessage( 'Please fill in all the required fields.' );
            setLoading( false );
            return;
        }

        try
        {
            const response = await fetch( '/api/stripe/createCheckoutSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( {
                    ticket,
                    eventSlug,
                    buyer: { firstName, lastName, email }
                } )
            } );

            const data = await response.json();

            if ( !response.ok )
            {
                setErrorMessage( data.error || 'An error occurred while processing your request.' );
                return;
            }

            const stripe = await getStripe();

            if ( stripe )
            {
                const { error } = await stripe.redirectToCheckout( { sessionId: data.id } );

                if ( error )
                {
                    console.error( 'Stripe Checkout error:', error );
                    setErrorMessage( 'An error occurred during checkout. Please try again.' );
                } else
                {
                    // Call the onPurchaseComplete callback after successful checkout
                    if ( onPurchaseComplete )
                    {
                        await onPurchaseComplete( { email, firstName } );
                    }
                }
            }
        } catch ( error )
        {
            console.error( 'Failed to create checkout session:', error );
            setErrorMessage( 'Failed to create checkout session. Please try again.' );
        } finally
        {
            setLoading( false );
        }
    };

    return (
        <div className="space-y-4 w-full">
            { errorMessage && <div className="mb-4 text-red-600 font-bold">{ errorMessage }</div> }
            <InputFieldEJ
                type="text"
                placeholder="First Name"
                value={ firstName }
                onChange={ ( e ) => setFirstName( e.target.value ) }
                className="w-full"
                ref={ ref } // Assign the ref to the first input
                required label={ 'First Name' }            />
            <InputFieldEJ
                type="text"
                placeholder="Last Name"
                value={ lastName }
                onChange={ ( e ) => setLastName( e.target.value ) }
                className="w-full"
                required label={ 'Last Name' }            />
            <InputFieldEJ
                type="email"
                placeholder="Email"
                value={ email }
                onChange={ ( e ) => setEmail( e.target.value ) }
                className="w-full"
                required label={ 'Email' }            />
            <Button
                onClick={ handleBuyTicket }
                disabled={ loading }
                className="w-full mt-2 rounded-3xl bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-green-500"
            >
                { loading ? 'Processing...' : 'Buy Ticket' }
            </Button>
        </div>
    );
}

export default forwardRef( TicketPurchaseClient );  // Wrap component with forwardRef to accept the ref
