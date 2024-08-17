'use client';

import { useState } from 'react';
import getStripe from '@/utils/stripeClient';

// @ts-ignore
export default function TicketPurchaseClient ( { ticket, eventSlug } )
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( {
          ticket,
          eventSlug,
          buyer: { firstName, lastName, email }
        } ),
      } );

      const data = await response.json();

      if ( !response.ok )
      {
        // Handle the error from the server
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
    <div className="space-y-4">
      { errorMessage && (
        <div className="mb-4 text-red-600">
          { errorMessage }
        </div>
      ) }
      <input
        type="text"
        placeholder="First Name"
        value={ firstName }
        onChange={ ( e ) => setFirstName( e.target.value ) }
        className="w-full px-4 py-2 border rounded-md"
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={ lastName }
        onChange={ ( e ) => setLastName( e.target.value ) }
        className="w-full px-4 py-2 border rounded-md"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={ email }
        onChange={ ( e ) => setEmail( e.target.value ) }
        className="w-full px-4 py-2 border rounded-md"
        required
      />
      <button
        onClick={ handleBuyTicket }
        disabled={ loading }
        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
      >
        { loading ? 'Processing...' : 'Buy Ticket' }
      </button>
    </div>
  );
}
